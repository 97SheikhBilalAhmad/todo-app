import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';



async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
   
   app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
   console.log('JWT_SECRET =>', process.env.JWT_SECRET);
  await app.listen(process.env.PORT ?? 5300)
  {
       console.log('server started on port http://localhost:5300');
  }; 
}
bootstrap();
