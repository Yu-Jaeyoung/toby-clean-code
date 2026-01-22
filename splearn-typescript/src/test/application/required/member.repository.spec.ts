import { beforeAll, describe, expect, it } from "bun:test";

import { QueryFailedError } from "typeorm";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { AppModule } from "@src/app.module";
import { Member } from "@src/main/domain/member";

import { createMemberRegisterRequest, createPasswordEncoder } from "@src/test/domain/member.fixture";

import type { MemberRepository } from "@src/main/application/required/member.repository";

describe("MemberRepositoryTest", () => {

  let app: INestApplication;
  let memberRepository: MemberRepository;

  beforeAll(async() => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
                                                     imports: [ AppModule ],
                                                   })
                                                   .compile();

    app = moduleFixture.createNestApplication();
    memberRepository = moduleFixture.get<MemberRepository>(getRepositoryToken(Member));
    await app.init();
  });

  it("should create member", async() => {
    const member: Member = Member.register(createMemberRegisterRequest("aaa@splearn.app"), createPasswordEncoder());

    expect(member.getId())
      .toBeUndefined();

    await memberRepository.save(member);

    expect(member.getId())
      .toBeDefined();
  });

  it("should not create with duplicated email", async() => {
    const member1: Member = Member.register(createMemberRegisterRequest(), createPasswordEncoder());
    await memberRepository.save(member1);

    const member2: Member = Member.register(createMemberRegisterRequest(), createPasswordEncoder());
    expect(async() => await memberRepository.save(member2))
      .toThrow(QueryFailedError);
  });
});