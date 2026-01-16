import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { Email } from "@src/main/domain/email";
import { Assert } from "@src/common/util/assert";
import { MemberStatus } from "@src/main/domain/member-status";
import { IllegalArgumentException } from "@src/common/exception/exceptions";

import type { PasswordEncoder } from "@src/main/domain/password-encoder";
import type { MemberRegisterRequest } from "@src/main/domain/member-register-request";

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  private id: number;

  /**
   * @Column({
   *     type: 'varchar',
   *     transformer: {
   *       to: (email: Email) => (email ? email.address : null),
   *
   *       from: (email: string) => (email ? new Email(email) : null),
   *     },
   * })
   */
  @Column(() => Email, { prefix: false })
  email: Email;

  @Column()
  private nickname: string;

  @Column()
  private passwordHash: string;

  @Column({
    type: "enum",
    enum: MemberStatus,
    default: MemberStatus.PENDING,
  })
  private status: MemberStatus;

  protected constructor() {
  }

  public static register(
    registerRequest: MemberRegisterRequest,
    passwordEncoder: PasswordEncoder,
  ): Member {
    const member = new Member();

    if (!registerRequest.email) {
      throw new IllegalArgumentException("Invalid member properties");
    }

    if (!registerRequest.nickname) {
      throw new IllegalArgumentException("Invalid member properties");
    }

    if (!registerRequest.password) {
      throw new IllegalArgumentException("Invalid member properties");
    }

    member.email = new Email(registerRequest.email);
    member.nickname = registerRequest.nickname;
    member.passwordHash = passwordEncoder.encode(registerRequest.password);

    member.status = MemberStatus.PENDING;

    return member;
  }

  getId(): number {
    return this.id;
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