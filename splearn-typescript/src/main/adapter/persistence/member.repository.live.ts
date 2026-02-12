import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Email } from "@src/main/domain/shared/email";
import { Member } from "@src/main/domain/member/member";

import type { MemberRepository } from "@src/main/application/member/required/member.repository";


@Injectable()
export class MemberRepositoryLive implements MemberRepository {
  constructor(
    @InjectRepository(Member)
    private readonly repository: Repository<Member>,
  ) {}

  async save(member: Member): Promise<Member> {
    return await this.repository.save(member);
  }

  async findByEmail(email: Email): Promise<Member | null> {
    return await this.repository.findOne({ where: { email: { address: email.address } } });
  }

  async findById(memberId: number): Promise<Member | null> {
    return await this.repository.findOne({ where: { id: memberId } as any });
  }
}