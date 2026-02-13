import { AppModule } from "@src/app.module";
import { NestFactory } from "@nestjs/core";

import { ValidationPipe } from "@nestjs/common";
import { ApiControllerAdviceFilter } from "@src/main/adapter/webapi/api-controller-advice";

import type { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe(
      {
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      },
    ),
  );

  app.useGlobalFilters(new ApiControllerAdviceFilter());

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
