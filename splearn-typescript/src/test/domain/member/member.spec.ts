import { beforeEach, describe, expect, it } from "bun:test";

import { IllegalArgumentException, IllegalStateException } from "@src/common/exception/exceptions";
import { Member } from "@src/main/domain/member/member";
import { MemberRegisterRequest } from "@src/main/domain/member/member-register-request";
import { MemberStatus } from "@src/main/domain/member/member-status";
import { createMemberRegisterRequest, createPasswordEncoder } from "@src/test/domain/member/member.fixture";

import type { PasswordEncoder } from "@src/main/domain/member/password-encoder";
import { MemberInfoUpdateRequest } from "@src/main/domain/member/member-info-update-request";

describe("MemberTest", () => {
  let member: Member;
  let passwordEncoder: PasswordEncoder;

  beforeEach(() => {
    passwordEncoder = createPasswordEncoder();
    member = Member.register(createMemberRegisterRequest(), passwordEncoder);
  });

  it("registerMember", () => {
    expect(member.getStatus())
      .toEqual(MemberStatus.PENDING);

    expect(member.getDetail()
                 .getRegisteredAt())
      .toBeDefined();
  });

  it("activate", () => {
    expect(member.getDetail()
                 .getActivatedAt())
      .not
      .toBeDefined();

    member.activate();

    expect(member.getStatus())
      .toEqual(MemberStatus.ACTIVE);
    expect(member.getDetail()
                 .getActivatedAt())
      .toBeDefined();
  });

  it("activateFail", () => {
    member.activate();

    expect(() => member.activate())
      .toThrow(IllegalStateException);
  });

  it("deactivate", () => {
    member.activate();

    member.deactivate();

    expect(member.getStatus())
      .toEqual(MemberStatus.DEACTIVATED);
    expect(member.getDetail()
                 .getDeactivatedAt())
      .toBeDefined();
  });

  it("deactivateFail", () => {
    expect(() => member.deactivate())
      .toThrow(IllegalStateException);

    member.activate();
    member.deactivate();

    expect(() => member.deactivate())
      .toThrow(IllegalStateException);
  });

  it("verifyPassword", () => {
    expect(member.verifyPassword("secret", passwordEncoder))
      .toBeTrue();

    expect(member.verifyPassword("hello", passwordEncoder))
      .toBeFalse();
  });

  it("changeNickname", () => {
    expect(member.getNickname())
      .toEqual("jaeyoung");

    member.changeNickname("jack");

    expect(member.getNickname())
      .toEqual("jack");
  });

  it("changePassword", () => {
    member.changePassword("verysecret", passwordEncoder);

    expect(member.verifyPassword("verysecret", passwordEncoder))
      .toBeTrue();
  });

  it("isActive", () => {
    expect(member.isActive())
      .toBeFalse();

    member.activate();

    expect(member.isActive())
      .toBeTrue();

    member.deactivate();

    expect(member.isActive())
      .toBeFalse();
  });

  it("invalidEmail", () => {
    expect(() => {
      Member.register(new MemberRegisterRequest("invalid email", "jaeyoung", "secret"), passwordEncoder);
    })
      .toThrow(IllegalArgumentException);
  });

  it("should update Info", () => {
    member.activate();

    const request = new MemberInfoUpdateRequest("jacky", "jacky", "hi");
    member.updateInfo(request);

    expect(member.getNickname())
      .toEqual(request.getNickname());

    expect(member.getDetail()
                 .getProfile()
                 .getAddress())
      .toEqual(request.getProfileAddress());

    expect(member.getDetail()
                 .getIntroduction())
      .toEqual(request.getIntroduction());

  });

  it("should update info fail", () => {
    expect(() => {
        const request = new MemberInfoUpdateRequest("jacky", "jacky", "hi");
        member.updateInfo(request);
      },
    )
      .toThrow(IllegalStateException);
  });
});