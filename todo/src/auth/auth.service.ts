import { Injectable, BadRequestException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";

// private generateToken(userId: string, email: string) {
//   return this.jwtService.sign({
//     userId,
//     email,
//   });
// }

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
     private jwtService: JwtService)
      {}

      
  async signup
  (name: string, 
    email: string,
     password: string) 
     {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return {
      message: "Signup successful",

      user: {
        id: user.id,
        name: user.name, 
        email: user.email,
      },
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

     //console.log('USER FROM DB:', user);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

   
  const token = this.jwtService.sign({
    userId: user.id,
    email: user.email,
  });
   // console.log("Generated Token:", token)
    return {
      message: "Login successful",
      access_token: token,
     
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      
    };
    
  }

 async generateToken(userId: string, email: string)
  {
    // The payload should contain non-sensitive user data (claims)
    const payload = { sub: userId, email: email };
    
    // Use signAsync method provided by @nestjs/jwt
    const token = await this.jwtService.signAsync(payload); //

    return { token };
  }
}
