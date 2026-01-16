import { Column } from "typeorm";

import { IllegalArgumentException } from "@src/common/exception/exceptions";

export class Email {
  @Column({ name: "email" })
  readonly address: string | undefined;

  private static emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,7}$/;

  constructor(address: string) {
    if (address && !Email.emailRegex.test(address)) {
      throw new IllegalArgumentException("Invalid email format");
    }

    this.address = address;
  }
}