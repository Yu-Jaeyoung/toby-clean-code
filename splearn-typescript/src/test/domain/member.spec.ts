import { describe, expect, it } from "bun:test";

import { Member } from "@src/main/domain/member";
import { MemberStatus } from "@src/main/domain/member-status";
import { IllegalArgumentException, IllegalStateException } from "@src/common/exception/exceptions";

describe("MemberTest", () => {
  it("createMember", () => {
    const member = new Member("jaeyoung@splearn.app", "jaeyoung", "hashedPassword");

    expect(member.getStatus())
      .toEqual(MemberStatus.PENDING);
  });

  it("constructorNullCheck", () => {
    expect(() => new Member(null as any, "jaeyouung", "secret"))
      .toThrow(IllegalArgumentException);
  });

  it("activate", () => {
    const member = new Member("jaeyoung@splearn.app", "jaeyoung", "hashedPassword");

    member.activate();

    expect(member.getStatus())
      .toEqual(MemberStatus.ACTIVE);
  });

  it("activateFail", () => {
    const member = new Member("jaeyoung@splearn.app", "jaeyoung", "hashedPassword");

    member.activate();

    expect(() => member.activate())
      .toThrow(IllegalStateException);
  });

  it("deactivate", () => {
    const member = new Member("jaeyoung@splearn.app", "jaeyoung", "hashedPassword");
    member.activate();

    member.deactivate();

    expect(member.getStatus())
      .toEqual(MemberStatus.DEACTIVATED);
  });

  it("deactivateFail", () => {
    const member = new Member("jaeyoung@splearn.app", "jaeyoung", "hashedPassword");

    expect(() => member.deactivate())
      .toThrow(IllegalStateException);

    member.activate();
    member.deactivate();

    expect(() => member.deactivate())
      .toThrow(IllegalStateException);
  });
});