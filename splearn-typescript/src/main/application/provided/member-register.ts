/**
 * 회원의 등록과 관련된 기능을 제공한다
 */
import { Member } from "@src/main/domain/member";

import type { MemberRegisterRequest } from "@src/main/domain/member-register-request";

export interface MemberRegister {
  register(registerRequest: MemberRegisterRequest): Member;
}