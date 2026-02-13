import { Email } from "@src/main/domain/shared/email";
import { Member } from "@src/main/domain/member/member";
import { Profile } from "@src/main/domain/member/profile";

/**
 * 회원 정보를 저장하거나 조회한다
 */
export interface MemberRepository {
  save(member: Member): Promise<Member>;

  findByEmail(email: Email): Promise<Member | null>;

  findById(memberId: number): Promise<Member | null>;

  findByProfile(profile: Profile): Promise<Member | null>;
}