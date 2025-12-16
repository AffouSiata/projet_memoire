import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global logging interceptor
  app.useGlobalInterceptors(new LoggingInterceptor());

  // API prefix
  app.setGlobalPrefix('api');

  // Serve static files (frontend React build)
  const publicPath = join(__dirname, '..', 'public');
  app.useStaticAssets(publicPath);

  // Serve index.html for all non-API routes (SPA fallback)
  app.use((req, res, next) => {
    if (!req.url.startsWith('/api')) {
      res.sendFile(join(publicPath, 'index.html'));
    } else {
      next();
    }
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application démarrée sur le port ${port}`);
  console.log(`📍 API: http://localhost:${port}/api`);
  console.log(`🌐 Frontend: http://localhost:${port}`);
}
bootstrap();
