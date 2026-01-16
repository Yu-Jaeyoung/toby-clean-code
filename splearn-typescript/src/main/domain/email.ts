import { IllegalArgumentException } from "@src/common/exception/exceptions";

export class Email {
  readonly address: string;

  private static emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,7}$/;

  constructor(address: string) {
    if (!Email.emailRegex.test(address)) {
      throw new IllegalArgumentException("Invalid email format");
    }

    this.address = address;
  }
}