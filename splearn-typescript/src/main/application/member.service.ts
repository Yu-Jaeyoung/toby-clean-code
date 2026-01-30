import { Inject, Injectable } from "@nestjs/common";

import { Email } from "@src/main/domain/email";
import { Member } from "@src/main/domain/member";
import { DuplicateEmailException } from "@src/common/exception/exceptions";
import { EMAIL_SENDER, MEMBER_REPOSITORY, PASSWORD_ENCODER } from "@src/app.token";

import type { EmailSender } from "@src/main/application/required/email-sender";
import type { MemberRegister } from "@src/main/application/provided/member-register";
import type { PasswordEncoder } from "@src/main/domain/password-encoder";
import type { MemberRepository } from "@src/main/application/required/member.repository";
import type { MemberRegisterRequest } from "@src/main/domain/member-register-request";

@Injectable()
export class MemberService implements MemberRegister {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: MemberRepository,
    @Inject(EMAIL_SENDER)
    private readonly emailSender: EmailSender,
    @Inject(PASSWORD_ENCODER)
    private readonly passwordEncoder: PasswordEncoder,
  ) {}

  async register(registerRequest: MemberRegisterRequest): Promise<Member> {
    await this.checkDuplicatedEmail(registerRequest);

    const member = Member.register(registerRequest, this.passwordEncoder);

    await this.memberRepository.save(member);

    this.sendWelcomeEmail(member);

    return member;
  }

  private sendWelcomeEmail(member: Member) {
    this.emailSender.send(member.getEmail(), "등록을 완료해주세요.", "아래 링크를 클릭해서 등록을 완료해주세요");
  }

  private async checkDuplicatedEmail(registerRequest: MemberRegisterRequest) {
    if (await this.memberRepository.findByEmail(new Email(registerRequest.email)) != null) {
      throw new DuplicateEmailException(`already in used: ${ registerRequest.email }`);
    }
  }
}