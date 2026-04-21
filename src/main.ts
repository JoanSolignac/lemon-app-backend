import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { config } from 'process';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './common/filters/exception/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionFilter())

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  )

  const configService = app.get(ConfigService);

  const port = configService.getOrThrow('app.port');

  console.log(`Starting server on port ${port}...`);

  await app.listen(port);
}
bootstrap();
