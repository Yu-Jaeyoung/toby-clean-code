import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { Email } from "@src/main/domain/shared/email";
import { Assert } from "@src/common/util/assert";
import { MemberDetail } from "@src/main/domain/member/member-detail";
import { MemberStatus } from "@src/main/domain/member/member-status";
import { MemberRegisterRequest } from "@src/main/domain/member/member-register-request";
import { IllegalArgumentException } from "@src/common/exception/exceptions";

import type { PasswordEncoder } from "@src/main/domain/member/password-encoder";
import { MemberInfoUpdateRequest } from "@src/main/domain/member/member-info-update-request";

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

  @Column({ length: 100 })
  private nickname: string;

  @Column({ length: 200 })
  private passwordHash: string;

  @Column({
    type: "enum",
    enum: MemberStatus,
    default: MemberStatus.PENDING,
  })
  private status: MemberStatus;

  // OnetoOne, fetchType - lazy, cascade all
  // @Column(() => MemberDetail, { prefix: false })
  @OneToOne(() => MemberDetail, {
    cascade: [ "insert", "update", "remove" ],
    eager: true,
  })
  @JoinColumn()
  detail: MemberDetail;

  protected constructor() {
  }

  public static register(
    registerRequest: MemberRegisterRequest,
    passwordEncoder: PasswordEncoder,
  ): Member {
    const member = new Member();

    member.detail = MemberDetail.create();

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

  setId(id: number) {
    this.id = id;
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

  getDetail() {
    return this.detail;
  }

  activate() {
    Assert.state(this.status === MemberStatus.PENDING, "Member is already active");

    this.status = MemberStatus.ACTIVE;
    this.detail.activate();
  }

  deactivate() {
    Assert.state(this.status === MemberStatus.ACTIVE, "Member is not active");

    this.status = MemberStatus.DEACTIVATED;
    this.detail.deactivate();
  }

  verifyPassword(
    password: string,
    passwordEncoder: PasswordEncoder,
  ) {
    return passwordEncoder.matches(password, this.passwordHash);
  }

  updateInfo(updateRequest: MemberInfoUpdateRequest) {
    Assert.state(this.getStatus() === MemberStatus.ACTIVE, "Only active members can update info");

    this.nickname = updateRequest.getNickname();

    this.detail.updateInfo(updateRequest);
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