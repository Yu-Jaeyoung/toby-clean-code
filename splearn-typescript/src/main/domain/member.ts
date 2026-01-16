import { Email } from "@src/main/domain/email";
import { Assert } from "@src/common/util/assert";
import { MemberStatus } from "@src/main/domain/member-status";
import { IllegalArgumentException } from "@src/common/exception/exceptions";

import type { PasswordEncoder } from "@src/main/domain/password-encoder";
import type { MemberCreateRequest } from "@src/main/domain/member-create-request";

export class Member {
  private email: Email;
  private nickname: string;
  private passwordHash: string;
  private status: MemberStatus;

  private constructor() {
  }

  public static create(
    createRequest: MemberCreateRequest,
    passwordEncoder: PasswordEncoder,
  ): Member {
    const member = new Member();

    if (!createRequest.email) {
      throw new IllegalArgumentException("Invalid member properties");
    }

    if (!createRequest.nickname) {
      throw new IllegalArgumentException("Invalid member properties");
    }

    if (!createRequest.password) {
      throw new IllegalArgumentException("Invalid member properties");
    }

    member.email = new Email(createRequest.email);
    member.nickname = createRequest.nickname;
    member.passwordHash = passwordEncoder.encode(createRequest.password);

    member.status = MemberStatus.PENDING;

    return member;
  }

  getEmail(): Email {
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
    if (!nickname) {
      throw new IllegalArgumentException("Invalid nickname properties");
    }

    this.nickname = nickname;
  }

  changePassword(
    password: string,
    passwordEncoder: PasswordEncoder,
  ) {
    if (!password) {
      throw new IllegalArgumentException("Invalid passwordHash properties");
    }

    this.passwordHash = passwordEncoder.encode(password);
  }

  isActive() {
    return this.status === MemberStatus.ACTIVE;
  }
}