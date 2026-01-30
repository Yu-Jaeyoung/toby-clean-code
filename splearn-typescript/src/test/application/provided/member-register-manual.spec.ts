import { describe, expect, it, mock } from "bun:test";

import { Email } from "@src/main/domain/email";
import { Member } from "@src/main/domain/member";
import { MemberStatus } from "@src/main/domain/member-status";
import { MemberService } from "@src/main/application/member.service";
import { createMemberRegisterRequest, createPasswordEncoder } from "@src/test/domain/member.fixture";

import type { EmailSender } from "@src/main/application/required/email-sender";
import type { MemberRegister } from "@src/main/application/provided/member-register";
import type { MemberRepository } from "@src/main/application/required/member.repository";

class MemberRepositoryStub implements MemberRepository {
  save(member: Member): Promise<Member> {
    member.setId(1);
    return Promise.resolve(member);
  }

  findByEmail(email: Email): Promise<Member | null> {
    return Promise.resolve(null);
  }
}

class EmailSenderStub implements EmailSender {
  send(
    email: Email,
    subject: string,
    body: string,
  ): void {
  }
}

class EmailSenderMock implements EmailSender {
  tos: Email[] = [];

  send(
    email: Email,
    subject: string,
    body: string,
  ): void {
    this.tos.push(email);
  }

  getTos(): Email[] {
    return this.tos;
  }
}

describe("Member Register Test", () => {
  it("should registered by Stub", async() => {
    const register: MemberRegister = new MemberService(new MemberRepositoryStub(), new EmailSenderStub(), createPasswordEncoder());

    const member = await register.register(createMemberRegisterRequest());

    expect(member.getId())
      .toBe(1);
    expect(member.getStatus())
      .toBe(MemberStatus.PENDING);
  });

  it("should registered by Mock", async() => {
    const emailSenderMock = new EmailSenderMock();
    const register: MemberRegister = new MemberService(new MemberRepositoryStub(), emailSenderMock, createPasswordEncoder());

    const member = await register.register(createMemberRegisterRequest());

    expect(member.getId())
      .toBe(1);
    expect(member.getStatus())
      .toBe(MemberStatus.PENDING);

    expect(emailSenderMock.getTos().length)
      .toBe(1);
    expect(emailSenderMock.getTos()[0].address)
      .toBe(member.getEmail().address);
  });

  it("should registered by Mock using in bun:test", async() => {
    const emailSenderMock = {
      tos: [] as Email[],

      send: mock((
        email: Email,
        subject: string,
        body: string,
      ) => {
        emailSenderMock.tos.push(email);
      }),
    };

    const register: MemberRegister = new MemberService(new MemberRepositoryStub(), emailSenderMock, createPasswordEncoder());

    const member = await register.register(createMemberRegisterRequest());

    expect(member.getId())
      .toBe(1);
    expect(member.getStatus())
      .toBe(MemberStatus.PENDING);

    expect(emailSenderMock.tos.length)
      .toBe(1);
    expect(emailSenderMock.tos[0].address)
      .toBe(member.getEmail().address);
  });
});

