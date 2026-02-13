import { Body, Controller, HttpCode, Inject, Post } from "@nestjs/common";

import { MemberRegisterRequest } from "@src/main/domain/member/member-register-request";
import { MemberRegisterResponse } from "@src/main/adapter/webapi/dto/member-register-response";

import type { MemberRegister } from "@src/main/application/member/provided/member-register";
import { MEMBER_REGISTER } from "@src/app.token";

@Controller()
export class MemberController {

  constructor(
    @Inject(MEMBER_REGISTER)
    private memberRegister: MemberRegister,
  ) { }

  @Post("/api/register")
  @HttpCode(200)
  async register(
    @Body()
    request: MemberRegisterRequest): Promise<MemberRegisterResponse> {
    const member = await this.memberRegister.register(request);

    return MemberRegisterResponse.of(member);
  }
}