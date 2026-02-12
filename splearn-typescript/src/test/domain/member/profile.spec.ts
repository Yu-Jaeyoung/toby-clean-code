import { describe, expect, it } from "bun:test";
import { Profile } from "@src/main/domain/member/profile";
import { IllegalArgumentException } from "@src/common/exception/exceptions";

describe("ProfileTest", () => {
  it("should make profile", () => {
    new Profile("jaeyoung");
    new Profile("jaeyoung100");
    new Profile("1368");
  });

  it("should throw error with invalid profile", () => {
    expect(() => new Profile(""))
      .toThrow(IllegalArgumentException);
    expect(() => new Profile("toolongtoolongtoolongtoolong"))
      .toThrow(IllegalArgumentException);
    expect(() => new Profile("A"))
      .toThrow(IllegalArgumentException);
    expect(() => new Profile("프로필"))
      .toThrow(IllegalArgumentException);
  });

  it("should return url", () => {
    const profile = new Profile("jaeyoung");
    
    expect(profile.url())
      .toBe("@jaeyoung");
  });
});