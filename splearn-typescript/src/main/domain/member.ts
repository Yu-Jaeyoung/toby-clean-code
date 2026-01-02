import { MemberStatus } from "@src/main/domain/member-status";

export class Member {
  private readonly email: string;
  private readonly nickname: string;
  private readonly passwordHash: string;
  private readonly status: MemberStatus;

  constructor(
    email: string,
    nickname: string,
    passwordHash: string,
  ) {
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
}