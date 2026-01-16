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

    member = Member.create({
      email: "jaeyoung@splearn.app",
      nickname: "jaeyoung",
      password: "secret",
    }, passwordEncoder);
  });

  it("createMember", () => {
    expect(member.getStatus())
      .toEqual(MemberStatus.PENDING);
  });

  it("constructorNullCheck", () => {
    expect(() => Member.create({
      email: null as any,
      nickname: "jaeyoung",
      password: "secret",
    }, passwordEncoder))
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
    expect(() => Member.create({
      email: "invalid Email",
      nickname: "jaeyoung",
      password: "secret",
    }, passwordEncoder))
      .toThrow(IllegalArgumentException);
  });
});