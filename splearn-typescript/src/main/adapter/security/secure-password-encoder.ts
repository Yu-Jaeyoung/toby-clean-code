import { PasswordEncoder } from "@src/main/domain/password-encoder";
import bcrypt from "bcrypt";

export class SecurePasswordEncoder implements PasswordEncoder {

  encode(password: string): string {
    return bcrypt.hashSync(password, 10);
    // return Bun.password.hash(password, { algorithm: "bcrypt" });
  }

  matches(
    password: string,
    passwordHash: string,
  ): boolean {
    return bcrypt.compareSync(password, passwordHash);
    // return Bun.password.verify(password, passwordHash);
  }
}