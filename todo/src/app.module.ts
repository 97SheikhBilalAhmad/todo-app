import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ ConfigModule.forRoot({ isGlobal: true }),
    TodosModule,AuthModule,JwtModule.register({
      // Use environment variable for secret in a real application
      secret: 'super_secret_key', //
      signOptions: { expiresIn: '1d' },
       
      
    }),
  ],
    
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
