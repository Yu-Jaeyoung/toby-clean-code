import { Inject, Injectable } from "@nestjs/common";

import { Email } from "@src/main/domain/shared/email";
import { Member } from "@src/main/domain/member/member";
import { Profile } from "@src/main/domain/member/profile";
import { MemberInfoUpdateRequest } from "@src/main/domain/member/member-info-update-request";
import { DuplicateEmailException, DuplicateProfileException } from "@src/common/exception/exceptions";

import { EMAIL_SENDER, MEMBER_FINDER, MEMBER_REPOSITORY, PASSWORD_ENCODER } from "@src/app.token";

import type { EmailSender } from "@src/main/application/member/required/email-sender";
import type { MemberRegister } from "@src/main/application/member/provided/member-register";
import type { PasswordEncoder } from "@src/main/domain/member/password-encoder";
import type { MemberRepository } from "@src/main/application/member/required/member.repository";
import type { MemberRegisterRequest } from "@src/main/domain/member/member-register-request";
import type { MemberFinder } from "@src/main/application/member/provided/member-finder";

@Injectable()
export class MemberModifyService implements MemberRegister {
  constructor(
    @Inject(MEMBER_FINDER)
    private readonly memberFinder: MemberFinder,
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

  async activate(memberId: number): Promise<Member> {
    const member = await this.memberFinder.find(memberId);

    member.activate();

    return await this.memberRepository.save(member);
  }

  async deactivate(memberId: number): Promise<Member> {
    const member = await this.memberFinder.find(memberId);

    member.deactivate();

    return await this.memberRepository.save(member);
  }

  async updateInfo(
    memberId: number,
    memberInfoUpdateRequest: MemberInfoUpdateRequest,
  ): Promise<Member> {
    const member = await this.memberFinder.find(memberId);

    await this.checkDuplicateProfile(member, memberInfoUpdateRequest.getProfileAddress());

    member.updateInfo(memberInfoUpdateRequest);

    return await this.memberRepository.save(member);
  }

  private async checkDuplicateProfile(
    member: Member,
    profileAddress: string,
  ) {
    if (profileAddress === "") {
      return;
    }

    const currentProfile = member.getDetail()
                                 .getProfile();

    if (currentProfile !== null && currentProfile.getAddress() === profileAddress) {
      return;
    }

    if (await this.memberRepository.findByProfile(new Profile(profileAddress))) {
      throw new DuplicateProfileException(`already in used profile address: ${ profileAddress }`);
    }
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