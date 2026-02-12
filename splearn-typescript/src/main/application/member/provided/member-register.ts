/**
 * 회원의 등록과 관련된 기능을 제공한다
 */
import { Member } from "@src/main/domain/member/member";

import type { MemberRegisterRequest } from "@src/main/domain/member/member-register-request";

export interface MemberRegister {
  register(registerRequest: MemberRegisterRequest): Promise<Member>;

  activate(memberId: number): Promise<Member>;
}