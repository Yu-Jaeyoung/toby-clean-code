import { Assert } from "@src/common/util/assert";
import { MemberStatus } from "@src/main/domain/member-status";
import { IllegalArgumentException } from "@src/common/exception/exceptions";

import type { PasswordEncoder } from "@src/main/domain/password-encoder";

export class Member {
  private readonly email: string;
  private nickname: string;
  private passwordHash: string;
  private status: MemberStatus;

  private constructor(
    email: string,
    nickname: string,
    passwordHash: string,
  ) {
    if (!email) {
      throw new IllegalArgumentException("Invalid member properties");
    }

    this.email = email;
    this.nickname = nickname;
    this.passwordHash = passwordHash;
    this.status = MemberStatus.PENDING;
  }

  getEmail(): string {
    return this.email;
  }

  getNickname(): string {
    return this.nickname;
  }

  getPasswordHash(): string {
    return this.passwordHash;
  }

  getStatus(): MemberStatus {
    return this.status;
  }

  static create(
    email: string,
    nickname: string,
    password: string,
    passwordEncoder: PasswordEncoder,
  ): Member {
    return new Member(email, nickname, passwordEncoder.encode(password));
  }

  activate() {
    Assert.state(this.status === MemberStatus.PENDING, "Member is already active");

    this.status = MemberStatus.ACTIVE;
  }

  deactivate() {
    Assert.state(this.status === MemberStatus.ACTIVE, "Member is not active");

    this.status = MemberStatus.DEACTIVATED;
  }

  verifyPassword(
    password: string,
    passwordEncoder: PasswordEncoder,
  ) {
    return passwordEncoder.matches(password, this.passwordHash);
  }

  changeNickname(nickname: string) {
    this.nickname = nickname;
  }

  changePassword(
    password: string,
    passwordEncoder: PasswordEncoder,
  ) {
    this.passwordHash = passwordEncoder.encode(password);
  }
}