/**
 * 회원의 등록과 관련된 기능을 제공한다
 */
import { Member } from "@src/main/domain/member/member";

import { MemberRegisterRequest } from "@src/main/domain/member/member-register-request";
import { MemberInfoUpdateRequest } from "@src/main/domain/member/member-info-update-request";

export interface MemberRegister {
  register(registerRequest: MemberRegisterRequest): Promise<Member>;

  activate(memberId: number): Promise<Member>;

  deactivate(memberId: number): Promise<Member>;

  updateInfo(
    memberId: number,
    memberInfoUpdateRequest: MemberInfoUpdateRequest,
  ): Promise<Member>;
}