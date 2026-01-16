import process from "node:process";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Member } from "@src/main/domain/member";
import { Email } from "@src/main/domain/email";

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
})
export class AppModule {
}
