import { Member } from "@src/main/domain/member";

/**
 * 회원을 조회한다
 */
export interface MemberFinder {
  find(memberId: number): Promise<Member>;
}