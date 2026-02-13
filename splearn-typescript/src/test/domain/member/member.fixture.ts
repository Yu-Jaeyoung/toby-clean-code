import { MemberRegisterRequest } from "@src/main/domain/member/member-register-request";
import type { PasswordEncoder } from "@src/main/domain/member/password-encoder";
import { Member } from "@src/main/domain/member/member";

export function createPasswordEncoder(): PasswordEncoder {
  return {
    encode(password: string) {
      return password.toUpperCase();
    },

    matches(
      password: string,
      passwordHash: string,
    ) {
      return this.encode(password) === passwordHash;
    },
  } as PasswordEncoder;
}

export function createMemberRegisterRequest(email?: string) {
  return new MemberRegisterRequest(
    email ?? "jaeyoung@splearn.app",
    "jaeyoung",
    "secret",
  );
}

export function createMember(id?: number): Member {
  if (id) {
    const member = Member.register(createMemberRegisterRequest(), createPasswordEncoder());

    member.setId(id);

    return member;
  }

  return Member.register(createMemberRegisterRequest(), createPasswordEncoder());
}