import { describe, it, expect } from "bun:test";

import { SecurePasswordEncoder } from "@src/main/adapter/security/secure-password-encoder";

describe("Secure Password Encoder Test", () => {
  it("should secure password encoding", () => {
    const securePasswordEncoder = new SecurePasswordEncoder();

    const passwordHash = securePasswordEncoder.encode("secret");

    expect(securePasswordEncoder.matches("secret", passwordHash))
      .toBeTrue();

    expect(securePasswordEncoder.matches("wrong", passwordHash))
      .toBeFalse();
  });
});