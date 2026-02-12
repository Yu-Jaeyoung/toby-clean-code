import process from "node:process";

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Email } from "@src/main/domain/shared/email";
import { Member } from "@src/main/domain/member/member";
import { Profile } from "@src/main/domain/member/profile";
import { MemberDetail } from "@src/main/domain/member/member-detail";
import { MemberQueryService } from "@src/main/application/member/member-query.service";
import { MemberModifyService } from "@src/main/application/member/member-modify.service";
import { MemberRepositoryLive } from "@src/main/adapter/persistence/member.repository.live";

import { EMAIL_SENDER, MEMBER_FINDER, MEMBER_REPOSITORY, PASSWORD_ENCODER } from "@src/app.token";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL,
      entities: [ Member, MemberDetail, Email, Profile ],
      synchronize: true,
      dropSchema: true,
    }),
    TypeOrmModule.forFeature([ Member, MemberDetail, Email, Profile ]),
  ],
  exports: [ MemberModifyService, MemberQueryService ],
  providers: [
    MemberModifyService,
    MemberQueryService,
    {
      provide: MEMBER_REPOSITORY,
      useClass: MemberRepositoryLive,
    },
    {
      provide: EMAIL_SENDER,
      useValue: null,
    },
    {
      provide: PASSWORD_ENCODER,
      useValue: null,
    },
    {
      provide: MEMBER_FINDER,
      useClass: MemberQueryService,
    },
  ],

})

export class AppModule {
}
