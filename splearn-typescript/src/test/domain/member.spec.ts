import { beforeEach, describe, expect, it } from "bun:test";

import { Member } from "@src/main/domain/member";
import { MemberStatus } from "@src/main/domain/member-status";
import { IllegalArgumentException, IllegalStateException } from "@src/common/exception/exceptions";

import type { PasswordEncoder } from "@src/main/domain/password-encoder";

describe("MemberTest", () => {
  let member: Member;
  let passwordEncoder: PasswordEncoder;

  beforeEach(() => {
    passwordEncoder = {
      encode: (password: string) => password.toUpperCase(),
      matches: (
        password: string,
        passwordHash: string,
      ) => passwordEncoder.encode(password) === passwordHash,
    };

    member = Member.create("jaeyoung@splearn.app", "jaeyoung", "secret", passwordEncoder);
  });

  it("createMember", () => {
    expect(member.getStatus())
      .toEqual(MemberStatus.PENDING);
  });

  it("constructorNullCheck", () => {
    expect(() => Member.create(null as any, "jaeyoung", "secret", passwordEncoder))
      .toThrow(IllegalArgumentException);
  });

  it("activate", () => {
    member.activate();

    expect(member.getStatus())
      .toEqual(MemberStatus.ACTIVE);
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
});