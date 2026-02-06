import { Inject, Injectable } from "@nestjs/common";

import { Member } from "@src/main/domain/member";
import { IllegalArgumentException } from "@src/common/exception/exceptions";

import { MEMBER_REPOSITORY } from "@src/app.token";

import type { MemberFinder } from "@src/main/application/provided/member-finder";
import type { MemberRepository } from "@src/main/application/required/member.repository";

@Injectable()
export class MemberQueryService implements MemberFinder {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: MemberRepository,
  ) {}


  async find(memberId: number): Promise<Member> {
    const member = await this.memberRepository.findById(memberId);

    if (!member) {
      throw new IllegalArgumentException(`회원을 찾을 수 없습니다. id: ${ memberId }`);
    }

    return member;
  }
}