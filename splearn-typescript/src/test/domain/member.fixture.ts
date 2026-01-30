import { MemberRegisterRequest } from "@src/main/domain/member-register-request";
import type { PasswordEncoder } from "@src/main/domain/password-encoder";

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