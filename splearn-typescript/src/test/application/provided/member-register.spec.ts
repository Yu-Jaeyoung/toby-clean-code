import { beforeAll, beforeEach, describe, expect, it } from "bun:test";

import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { EMAIL_SENDER, PASSWORD_ENCODER } from "@src/app.token";

import { AppModule } from "@src/app.module";
import { MemberStatus } from "@src/main/domain/member-status";
import { MemberService } from "@src/main/application/member.service";
import { DuplicateEmailException } from "@src/common/exception/exceptions";
import { SplearnTestConfiguration } from "@src/test/splearn-test-configuration";
import { createMemberRegisterRequest } from "@src/test/domain/member.fixture";
import { DataSource } from "typeorm";

describe("Member Service Test", () => {
  let app: INestApplication;
  const config = new SplearnTestConfiguration();
  let memberRegister: MemberService;
  let dataSource: DataSource;

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

    app = moduleFixture
      .createNestApplication();

    memberRegister = moduleFixture
      .get<MemberService>(MemberService);
    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  beforeEach(async() => {
    await dataSource.synchronize(true);
  });

  it("should register a new member successfully", async() => {
    const member = await memberRegister
      .register(createMemberRegisterRequest());

    expect(member.getId())
      .toBe(1);
    expect(member.getStatus())
      .toBe(MemberStatus.PENDING);
  });

  it("email shouldn't be duplicated", async() => {
    await memberRegister
      .register(createMemberRegisterRequest());

    expect(async() => await memberRegister
      .register(createMemberRegisterRequest()))
      .toThrow(DuplicateEmailException);
  });
});