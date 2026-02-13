import { afterAll, beforeAll, describe, expect, it, mock } from "bun:test";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { MemberController } from "@src/main/adapter/webapi/member.controller";
import { createMember } from "@src/test/domain/member/member.fixture";
import { MemberRegister } from "@src/main/application/member/provided/member-register";
import { MEMBER_REGISTER } from "@src/app.token";

describe("Member API Test", () => {
  let app: INestApplication;
  let baseUrl: string;

  const registerMock = mock(async() => createMember(1));
  const memberRegisterMock: Pick<MemberRegister, "register"> = {
    register: registerMock,
  };

  beforeAll(async() => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
                                                     controllers: [ MemberController ],
                                                     providers: [
                                                       {
                                                         provide: MEMBER_REGISTER,
                                                         useValue: memberRegisterMock,
                                                       },
                                                     ],
                                                   })
                                                   .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    await app.init();
    await app.listen(0);
    baseUrl = await app.getUrl();
  });

  afterAll(async() => {
    if (app) {
      await app.close();
    }
  });

  it("register", async() => {
    registerMock.mockClear();
    registerMock.mockResolvedValue(createMember(1));

    const request = {
      email: "jaeyoung@splearn.app",
      nickname: "jaeyoung",
      password: "secret1234",
    };

    const response = await postRegister(baseUrl, request);

    expect(response.status)
      .toBe(200);

    const body = await response.json();
    expect(body.memberId)
      .toBe(1);

    expect(registerMock)
      .toHaveBeenCalledTimes(1);
    expect(registerMock)
      .toHaveBeenCalledWith(expect.objectContaining(request));
  });

  it("register fail", async() => {
    registerMock.mockClear();

    const request = {
      email: "invalid email",
      nickname: "jaeyoung",
      password: "secret1234",
    };

    const response = await postRegister(baseUrl, request);

    expect(response.status)
      .toBe(400);
    expect(registerMock)
      .toHaveBeenCalledTimes(0);
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