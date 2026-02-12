export class MemberInfoUpdateRequest {
  private readonly nickname: string;
  private readonly profileAddress: string;
  private readonly introduction: string;

  constructor(
    nickname: string,
    profileAddress: string,
    introduction: string,
  ) {
    this.nickname = nickname;
    this.profileAddress = profileAddress;
    this.introduction = introduction;
  }

  getNickname(): string {
    return this.nickname;
  }

  getProfileAddress(): string {
    return this.profileAddress;
  }

  getIntroduction(): string {
    return this.introduction;
  }
}