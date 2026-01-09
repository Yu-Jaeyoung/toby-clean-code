import { Assert } from "@src/common/util/assert";
import { MemberStatus } from "@src/main/domain/member-status";
import { IllegalArgumentException } from "@src/common/exception/exceptions";

export class Member {
  private readonly email: string;
  private readonly nickname: string;
  private readonly passwordHash: string;
  private status: MemberStatus;

  constructor(
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

  activate() {
    Assert.state(this.status === MemberStatus.PENDING, "Member is already active");

    this.status = MemberStatus.ACTIVE;
  }

  deactivate() {
    Assert.state(this.status === MemberStatus.ACTIVE, "Member is not active");

    this.status = MemberStatus.DEACTIVATED;
  }
}