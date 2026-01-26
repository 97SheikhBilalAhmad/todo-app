import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../modules/database/database.service'; 
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly databaseService: DatabaseService) {}

  // ✅ SIGNUP
  async signup(name: string, email: string, password: string) {
    const [existingUser] = await this.databaseService.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await this.databaseService.db
      .insert(users)
      .values({
        name,
        email, 
        password: hashedPassword,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
      });

    return {
      message: 'Signup successful',
      user,
    };
  }

  // ✅ LOGIN
  async login(email: string, password: string) {
    const [user] = await this.databaseService.db
      .select({
        id: users.id,
        email: users.email,
        password: users.password,
        name: users.name,
      })
      .from(users)
      .where(eq(users.email, email));

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
  userId: user.id,     // 👈 VERY IMPORTANT
  email: user.email,
};

    const token = await this.jwtService.sign(payload);

    return {
      
      message: 'Login successful',
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
