import { PasswordEncoder } from "@src/main/domain/password-encoder";

export function createPasswordEncoder() {
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
  if (email) {
    return {
      email,
      nickname: "jaeyoung",
      password: "secret",
    };
  }

  return {
    email: "jaeyoung@splearn.app",
    nickname: "jaeyoung",
    password: "secret",
  };
}