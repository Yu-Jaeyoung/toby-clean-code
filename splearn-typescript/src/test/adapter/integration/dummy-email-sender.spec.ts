import { describe, expect, it, spyOn } from "bun:test";

import { Email } from "@src/main/domain/shared/email";
import { DummyEmailSender } from "@src/main/adapter/integration/dummy-email-sender";

describe("Dummy Email Sender Test", () => {
  it("should send with log", () => {
    const dummyEmailSender = new DummyEmailSender();

    const logSpy = spyOn(console, "log");
    dummyEmailSender.send(new Email("test@test.com"), "subject", "body");

    expect(logSpy)
      .toHaveBeenCalledWith("DummyEmailSender send email: test@test.com");

    logSpy.mockRestore();
  });
});