import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());
  app.enableCors({
    origin: [
      process.env.PUBLIC_WEB_URL || 'http://localhost:3000',
      process.env.ADMIN_WEB_URL || 'http://localhost:3002',
      // Production Vercel deployments (fallback if env vars not set in Railway)
      'https://fd-wedding-site.vercel.app',
      'https://wedding-site-admin-web.vercel.app',
    ],
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger Documentation
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Wedding Site API')
      .setDescription('API for wedding website with public RSVP and admin backend')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('public', 'Public endpoints (no auth required)')
      .addTag('admin', 'Admin endpoints (JWT required)')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT || process.env.API_PORT || 3001;
  // Listen on 0.0.0.0 so Railway (and other cloud hosts) can route traffic in
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 API server running on port ${port}`);
  console.log(`📚 API docs available at http://localhost:${port}/api/docs`);
  console.log(`🗄️ Database initialized with Prisma migrations`);
}

bootstrap();
