import { Column } from "typeorm";
import { IllegalArgumentException } from "@src/common/exception/exceptions";

export class Profile {
  private static profileRegex: RegExp = /[a-z0-9]+/;

  @Column({ name: "profile", unique: true, nullable: true })
  private readonly address: string | undefined;

  constructor(address: string) {
    if (address && !Profile.profileRegex.test(address)) {
      throw new IllegalArgumentException("Invalid profile format");
    }

    if (address && address.length > 15) {
      throw new IllegalArgumentException("Profile length exceeds limit");
    }

    if (address === "") {
      throw new IllegalArgumentException("Invalid profile format");
    }

    this.address = address;
  }

  getAddress(): string | undefined {
    return this.address;
  }

  url(): string | undefined {
    if (!this.address) {
      return undefined;
    }

    return "@" + this.address;
  }
}