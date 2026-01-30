import process from "node:process";

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Member } from "@src/main/domain/member";
import { Email } from "@src/main/domain/email";
import { MemberService } from "@src/main/application/member.service";
import { MemberRepositoryLive } from "@src/main/adapter/persistence/member.repository.live";
import { EMAIL_SENDER, MEMBER_REPOSITORY, PASSWORD_ENCODER } from "@src/app.token";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL,
      entities: [ Member, Email ],
      synchronize: true,
      dropSchema: true,
    }),
    TypeOrmModule.forFeature([ Member, Email ]),
  ],
  exports: [ MemberService ],
  providers: [
    MemberService,
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
  ],

})

export class AppModule {
}
