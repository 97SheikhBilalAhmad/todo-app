import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  
const config = new DocumentBuilder()
  .setTitle('Todo App API')
  .setDescription('Todo App APIs')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
    'access-token', // 👈 NAME IMPORTANT
  )
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api-docs', app, document);
   
   app.enableCors({
    origin: [
    "http://localhost:3000",
    "http://localhost:5173",
  ],
    credentials: true,
  });
   console.log('JWT_SECRET =>', process.env.JWT_SECRET);
  await app.listen(process.env.PORT ?? 5300)
  {
       console.log('server started on port http://localhost:5300');
  }; 
}
bootstrap();
