import { beforeAll, beforeEach, describe, expect, it } from "bun:test";

import { DataSource } from "typeorm";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { EMAIL_SENDER, PASSWORD_ENCODER } from "@src/app.token";

import { AppModule } from "@src/app.module";
import { MemberStatus } from "@src/main/domain/member-status";
import { MemberService } from "@src/main/application/member.service";
import { MemberRegisterRequest } from "@src/main/domain/member-register-request";
import { SplearnTestConfiguration } from "@src/test/splearn-test-configuration";
import { createMemberRegisterRequest } from "@src/test/domain/member.fixture";
import { DuplicateEmailException, IllegalArgumentException } from "@src/common/exception/exceptions";

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

  describe("validation", () => {
    it("should throw when email format is invalid", () => {
      expect(() => new MemberRegisterRequest("invalid-email-format", "jaeyoung", "secret"))
        .toThrow(IllegalArgumentException);
    });

    it("should accept valid email format", () => {
      expect(() => new MemberRegisterRequest("user@example.com", "jaeyoung", "secret"))
        .not
        .toThrow();
    });

    it("should throw when nickname is shorter than 5 characters", () => {
      expect(() => new MemberRegisterRequest("user@example.com", "abcd", "secret"))
        .toThrow(IllegalArgumentException);
    });

    it("should throw when nickname is longer than 10 characters", () => {
      expect(() => new MemberRegisterRequest("user@example.com", "abcdefghijk", "secret"))
        .toThrow(IllegalArgumentException);
    });

    it("should accept nickname with exactly 5 characters", () => {
      expect(() => new MemberRegisterRequest("user@example.com", "abcde", "secret"))
        .not
        .toThrow();
    });

    it("should accept nickname with exactly 10 characters", () => {
      expect(() => new MemberRegisterRequest("user@example.com", "abcdefghij", "secret"))
        .not
        .toThrow();
    });

    it("should throw when password is shorter than 5 characters", () => {
      expect(() => new MemberRegisterRequest("user@example.com", "jaeyoung", "abcd"))
        .toThrow(IllegalArgumentException);
    });

    it("should throw when password is longer than 20 characters", () => {
      expect(() => new MemberRegisterRequest("user@example.com", "jaeyoung", "a".repeat(21)))
        .toThrow(IllegalArgumentException);
    });

    it("should accept password with exactly 5 characters", () => {
      expect(() => new MemberRegisterRequest("user@example.com", "jaeyoung", "abcde"))
        .not
        .toThrow();
    });

    it("should accept password with exactly 20 characters", () => {
      expect(() => new MemberRegisterRequest("user@example.com", "jaeyoung", "a".repeat(20)))
        .not
        .toThrow();
    });
  });
});