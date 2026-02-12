import { Entity } from "typeorm";

@Entity()
export class MemberDetail {
  profile: string;
  introduction: string;
  registeredAt: Date;
  activatedAt: Date;
  deactivatedAt: Date;
}