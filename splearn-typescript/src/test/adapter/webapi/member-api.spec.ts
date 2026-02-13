import { afterAll, beforeAll, beforeEach, describe, expect, it } from "bun:test";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { DataSource } from "typeorm";

import { AppModule } from "@src/app.module";
import { EMAIL_SENDER, MEMBER_REGISTER, MEMBER_REPOSITORY, PASSWORD_ENCODER } from "@src/app.token";
import { MemberStatus } from "@src/main/domain/member/member-status";
import { MemberRegisterRequest } from "@src/main/domain/member/member-register-request";
import { SplearnTestConfiguration } from "@src/test/splearn-test-configuration";

import type { MemberRegister } from "@src/main/application/member/provided/member-register";
import type { MemberRepository } from "@src/main/application/member/required/member.repository";

describe("MemberApiTest", () => {
  let app: INestApplication;
  let baseUrl: string;
  let dataSource: DataSource;
  let memberRepository: MemberRepository;
  let memberRegister: MemberRegister;

  const config = new SplearnTestConfiguration();

  beforeAll(async() => {
    const moduleFixture: TestingModule
      = await Test.createTestingModule({
                    imports: [ AppModule ],
                  })
                  .overrideProvider(EMAIL_SENDER)
                  .useValue(config.emailSender())
                  .overrideProvider(PASSWORD_ENCODER)
                  .useValue(config.passwordEncoder())
                  .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    memberRepository = moduleFixture.get<MemberRepository>(MEMBER_REPOSITORY);
    memberRegister = moduleFixture.get<MemberRegister>(MEMBER_REGISTER);
    dataSource = moduleFixture.get<DataSource>(DataSource);

    await app.init();
    await app.listen(0);
    baseUrl = await app.getUrl();
  });

  beforeEach(async() => {
    await dataSource.synchronize(true);
  });

  afterAll(async() => {
    if (app) {
      await app.close();
    }
  });

  it("register", async() => {
    const request = {
      email: "jaeyoung@splearn.app",
      nickname: "jaeyoung",
      password: "secret1234",
    };

    const result = await postRegister(baseUrl, request);

    expect(result.status)
      .toBe(200);

    const response = await result.json() as { memberId: number; emailAddress: string };

    expect(response.memberId)
      .toBeDefined();

    expect(response.emailAddress)
      .toBe(request.email);

    const member = await memberRepository.findById(response.memberId);

    expect(member)
      .toBeDefined();

    expect(member?.getEmail()
      .address)
      .toBe(request.email);

    expect(member?.getNickname())
      .toBe(request.nickname);

    expect(member?.getStatus())
      .toBe(MemberStatus.PENDING);
  });

  it("duplicateEmail", async() => {
    const request = new MemberRegisterRequest(
      "jaeyoung@splearn.app",
      "jaeyoung",
      "secret1234",
    );

    await memberRegister.register(request);

    const result = await postRegister(baseUrl, {
      email: request.email,
      nickname: request.nickname,
      password: request.password,
    });

    expect(result.status)
      .toBe(500);
  });
});

function postRegister(
  baseUrl: string,
  body: { email: string; nickname: string; password: string },
) {
  return fetch(`${ baseUrl }/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
