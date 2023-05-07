import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'uploads'));
  // app.enableCors({
  //   origin: 'http://localhost:3001',
  //   credentials: true,
  // });
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
