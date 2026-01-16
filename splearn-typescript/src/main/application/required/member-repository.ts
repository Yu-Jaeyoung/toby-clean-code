import { Member } from "@src/main/domain/member";

/**
 * 회원 정보를 저장하거나 조회한다
 */
// TODO: Repository Interface extends 필요
export interface MemberRepository {
  save(member: Member): Member;
}