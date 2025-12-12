import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as express from 'express';
import { ValidationPipe } from "./pipes/validation.pipe";

async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  app.use(express.json({ limit: '200mb' }));
  app.use(express.urlencoded({ limit: '200mb', extended: true }));
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}

start();
