import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { Assert } from "@src/common/util/assert";
import { Profile } from "@src/main/domain/member/profile";
import { MemberInfoUpdateRequest } from "@src/main/domain/member/member-info-update-request";

@Entity()
export class MemberDetail {
  @PrimaryGeneratedColumn()
  private id: number;

  @Column(() => Profile, { prefix: false })
  private profile: Profile;

  @Column({ nullable: true })
  private introduction: string;

  @Column({ nullable: true })
  private registeredAt: Date;

  @Column({ nullable: true })
  private activatedAt: Date;

  @Column({ nullable: true })
  private deactivatedAt: Date;

  static create() {
    const memberDetail = new MemberDetail();
    memberDetail.registeredAt = new Date();

    return memberDetail;
  }

  getProfile() {
    return this.profile;
  }

  getRegisteredAt() {
    return this.registeredAt;
  }

  getActivatedAt() {
    return this.activatedAt;
  }

  getDeactivatedAt() {
    return this.deactivatedAt;
  }

  activate() {
    Assert.isTrue((this.activatedAt === undefined || this.activatedAt === null), "activatedAt는 이미 설정되어 있습니다.");

    this.activatedAt = new Date();
  }

  deactivate() {
    Assert.isTrue((this.deactivatedAt === undefined || this.deactivatedAt === null), "deactivatedAt는 이미 설정되어 있습니다.");

    this.deactivatedAt = new Date();
  }

  updateInfo(updateRequest: MemberInfoUpdateRequest) {
    this.profile = new Profile(updateRequest.getProfileAddress());
    this.introduction = updateRequest.getIntroduction();
  }

  getIntroduction() {
    return this.introduction;
  }
}