import { beforeAll, describe, expect, it } from "bun:test";

import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { AppModule } from "@src/app.module";
import { MemberRepository } from "@src/main/application/required/member.repository";
import { Member } from "@src/main/domain/member";
import { createMemberRegisterRequest, createPasswordEncoder } from "@src/test/domain/member.fixture";

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

  it("createMember", async() => {
    const member: Member = Member.register(createMemberRegisterRequest(), createPasswordEncoder());

    expect(member.getId())
      .toBeUndefined();

    await memberRepository.save(member);

    expect(member.getId())
      .toBeDefined();
  });

  // it("findMemberById", async() => {
  //   const member1: Member = Member.register(createMemberRegisterRequest(), createPasswordEncoder());
  //
  //   await memberRepository.save(member1);
  //
  //   const member2 = await memberRepository.find();
  //
  //   console.log(member2);
  // });
});