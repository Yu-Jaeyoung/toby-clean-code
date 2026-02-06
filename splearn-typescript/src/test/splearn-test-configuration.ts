import { Email } from "@src/main/domain/email";
import { createPasswordEncoder } from "@src/test/domain/member.fixture";

import type { PasswordEncoder } from "@src/main/domain/password-encoder";

export class SplearnTestConfiguration {
  emailSender() {
    return {
      send: (
        email: Email,
        subject: string,
        body: string,
      ): void => {
        console.info(`To: ${ email.address }, Subject: ${ subject }, Body: ${ body }`);
      },
    };
  }

  passwordEncoder(): PasswordEncoder {
    return createPasswordEncoder();
  }
}