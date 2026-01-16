import { describe, expect, it } from "bun:test";

import { Email } from "@src/main/domain/email";

describe("EmailTest", () => {
  it("equality", () => {
    const email1 = new Email("jaeyoung@splearn.app");
    const email2 = new Email("jaeyoung@splearn.app");

    expect(email1)
      .toEqual(email2);
  });
});