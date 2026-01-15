import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../../prisma/prisma.module';
import { JwtStrategy } from './jwt.strategy';
import {PassportModule} from '@nestjs/passport';

@Module({
   imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET as string,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN as any,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], 
  exports: [JwtModule,AuthService],
})
export class AuthModule {}
