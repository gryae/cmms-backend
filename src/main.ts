import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(
      AppModule,
    );

  // app.enableCors({
  //   origin: process.env.CORS_ORIGIN
  //     ? process.env.CORS_ORIGIN.split(',')
  //     : ['http://localhost:3000'],
  //   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  //   allowedHeaders: ['Content-Type', 'Authorization'],
  //   credentials: true,
  // });

    app.enableCors({
    origin: (origin,callback) => {
      const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'+ origin));
    }
  },
credentials: true,
methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  // const port = process.env.PORT || 3001;
  // await app.listen(port);

  const port = Number(process.env.PORT);
  await app.listen(port,'0.0.0.0' );  

  console.log(`Backend running on port ${port}`);
}
bootstrap();
