import { IllegalArgumentException } from "@src/common/exception/exceptions";

export class MemberInfoUpdateRequest {
  private readonly nickname: string;
  private readonly profileAddress: string;
  private readonly introduction: string;

  constructor(
    nickname: string,
    profileAddress: string,
    introduction: string,
  ) {
    if (nickname.length < 5 || nickname.length > 20) {
      throw new IllegalArgumentException("Invalid nickname length");
    }

    if (profileAddress.length > 15) {
      throw new IllegalArgumentException("Invalid profile address length");
    }

    if (introduction === undefined) {
      throw new IllegalArgumentException("Introduction cannot be undefined");
    }

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