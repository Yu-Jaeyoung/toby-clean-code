import { beforeAll, beforeEach, describe, expect, it } from "bun:test";

import { DataSource } from "typeorm";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { EMAIL_SENDER, PASSWORD_ENCODER } from "@src/app.token";

import { AppModule } from "@src/app.module";
import { MemberModifyService } from "@src/main/application/member/member-modify.service";
import { SplearnTestConfiguration } from "@src/test/splearn-test-configuration";
import { createMemberRegisterRequest } from "@src/test/domain/member/member.fixture";
import { MemberQueryService } from "@src/main/application/member/member-query.service";

import type { MemberFinder } from "@src/main/application/member/provided/member-finder";
import type { MemberRegister } from "@src/main/application/member/provided/member-register";

describe("Member Finder Test", () => {
  let app: INestApplication;
  const config = new SplearnTestConfiguration();
  let memberRegister: MemberRegister;
  let memberFinder: MemberFinder;
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

    app = moduleFixture.createNestApplication();

    memberRegister = moduleFixture.get<MemberModifyService>(MemberModifyService);
    memberFinder = moduleFixture.get<MemberQueryService>(MemberQueryService);
    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  beforeEach(async() => {
    await dataSource.synchronize(true);
  });

  it("should find member", async() => {
    const member = await memberRegister.register(createMemberRegisterRequest());

    const foundMember = await memberFinder.find(member.getId());

    expect(foundMember.getId())
      .toEqual(member.getId());
  });
});