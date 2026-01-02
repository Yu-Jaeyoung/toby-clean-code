import { Member } from "@src/main/domain/member";
import { MemberStatus } from "@src/main/domain/member-status";
import { describe, expect, it } from "bun:test";

describe("MemberTest", () => {
  it("createMember", () => {
    const member = new Member("jaeyoung@splearn.app", "jaeyoung", "hashedPassword");

    expect(member.getStatus())
      .toEqual(MemberStatus.PENDING);
  });
});