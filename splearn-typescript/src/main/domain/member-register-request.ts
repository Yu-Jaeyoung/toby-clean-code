import { IllegalArgumentException } from "@src/common/exception/exceptions";

export class MemberRegisterRequest {
  private static emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,7}$/;

  readonly email: string;
  readonly nickname: string;
  readonly password: string;

  constructor(
    email: string,
    nickname: string,
    password: string,
  ) {
    if (!MemberRegisterRequest.emailRegex.test(email)) {
      throw new IllegalArgumentException("Invalid email format");
    }

    if (nickname.length < 5 || nickname.length > 10) {
      throw new IllegalArgumentException("Nickname must be between 5 and 10 characters");
    }

    if (password.length < 5 || password.length > 20) {
      throw new IllegalArgumentException("Password must be between 5 and 20 characters");
    }

    this.email = email;
    this.nickname = nickname;
    this.password = password;
  }
}
