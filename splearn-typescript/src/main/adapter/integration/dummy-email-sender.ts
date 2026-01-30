import { Email } from "@src/main/domain/email";

import type { EmailSender } from "@src/main/application/required/email-sender";

export class DummyEmailSender implements EmailSender {
  send(
    email: Email,
    subject: string,
    body: string,
  ): void {
    console.log(`DummyEmailSender send email: ${ email }`);
  }
}