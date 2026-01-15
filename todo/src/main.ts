import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

   app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 5300)
  {
       console.log('server started on port http://localhost:5300'); 
       console.log('DB connected successfully'); 
  }; 
}
bootstrap();
