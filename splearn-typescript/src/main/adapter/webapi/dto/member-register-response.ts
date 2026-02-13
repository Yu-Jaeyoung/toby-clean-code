import { Member } from "@src/main/domain/member/member";

export class MemberRegisterResponse {


  constructor(
    private memberId: number,
    private emailAddress: string,
  ) {
    this.memberId = memberId;
    this.emailAddress = emailAddress;
  }

  static of(
    member: Member,
  ): MemberRegisterResponse {
    return new MemberRegisterResponse(member.getId(), member.getEmail().address as string);

  }
}