import { beforeAll, beforeEach, describe, expect, it } from "bun:test";

import { DataSource } from "typeorm";
import { validateOrReject } from "class-validator";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { EMAIL_SENDER, PASSWORD_ENCODER } from "@src/app.token";

import { AppModule } from "@src/app.module";
import { MemberStatus } from "@src/main/domain/member/member-status";
import { MemberModifyService } from "@src/main/application/member/member-modify.service";
import { DuplicateEmailException, DuplicateProfileException } from "@src/common/exception/exceptions";
import { SplearnTestConfiguration } from "@src/test/splearn-test-configuration";
import { createMemberRegisterRequest } from "@src/test/domain/member/member.fixture";

import type { MemberRegister } from "@src/main/application/member/provided/member-register";
import { MemberInfoUpdateRequest } from "@src/main/domain/member/member-info-update-request";


describe("Member Service Test", () => {
  let app: INestApplication;
  const config = new SplearnTestConfiguration();
  let memberRegister: MemberRegister;
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
      .get<MemberModifyService>(MemberModifyService);
    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  beforeEach(async() => {
    await dataSource.synchronize(true);
  });

  it("should register a new member successfully", async() => {
    const member = await registerMember(memberRegister);

    expect(member.getId())
      .toBe(1);
    expect(member.getStatus())
      .toBe(MemberStatus.PENDING);
  });

  it("email shouldn't be duplicated", async() => {
    await registerMember(memberRegister);

    expect(async() => await registerMember(memberRegister))
      .toThrow(DuplicateEmailException);
  });

  it("should throw Error", () => {
    expect(async() => await validateOrReject({
      email: "jaeyoung@splearn.app",
    }))
      .toThrow();
  });

  it("should activate a member successfully", async() => {
    const member = await registerMember(memberRegister);

    const activatedMember = await memberRegister.activate(member.getId());

    expect(activatedMember.getStatus())
      .toBe(MemberStatus.ACTIVE);
  });

  it("should deactivate a member successfully", async() => {
    const member = await registerMember(memberRegister);

    await memberRegister.activate(member.getId());

    const deactivatedMember = await memberRegister.deactivate(member.getId());

    expect(deactivatedMember.getStatus())
      .toBe(MemberStatus.DEACTIVATED);

    expect(
      deactivatedMember.getDetail()
                       .getDeactivatedAt(),
    )
      .toBeDefined();
  });

  it("should update info", async() => {
    let member = await registerMember(memberRegister);

    await memberRegister.activate(member.getId());

    member = await memberRegister.updateInfo(member.getId(), new MemberInfoUpdateRequest("newNickname", "new", "introduction"));

    expect(member.getDetail()
                 .getProfile()
                 .getAddress())
      .toBe("new");
  });

  it("should fail to update info", async() => {
    let member = await registerMember(memberRegister);

    await memberRegister.activate(member.getId());

    await memberRegister.updateInfo(member.getId(), new MemberInfoUpdateRequest("newNickname", "new", "introduction"));

    let member2 = await registerMember(memberRegister, "jack2@splearn.app");

    await memberRegister.activate(member2.getId());

    // member2는 기존의 member와 같은 프로필을 사용할 수 없다
    expect(async() => {
      await memberRegister.updateInfo(member2.getId(), new MemberInfoUpdateRequest("newNickname2", "new", "introduction"));
    })
      .toThrow(DuplicateProfileException);

    // 다른 프로필 주소로는 변경 가능
    await memberRegister.updateInfo(member2.getId(), new MemberInfoUpdateRequest("newNickname2", "hello", "introduction"));

    // 기존 프로필 주소를 바꾸는 것도 가능
    await memberRegister.updateInfo(member.getId(), new MemberInfoUpdateRequest("newNickname2", "new-thing", "introduction"));

    // 프로필 주소를 제거하는 것도 가능
    await memberRegister.updateInfo(member.getId(), new MemberInfoUpdateRequest("newNickname2", "", "introduction"));

    // 프로필 주소 중복은 허용하지 않음
    expect(async() => {
      await memberRegister.updateInfo(member.getId(), new MemberInfoUpdateRequest("newNickname2", "hello", "introduction"));
    })
      .toThrow(DuplicateProfileException);
  });
});

async function registerMember(
  memberRegister: MemberRegister,
  email?: string,
) {
  if (email) {
    return await memberRegister.register(createMemberRegisterRequest(email));
  }

  return await memberRegister
    .register(createMemberRegisterRequest());
}
