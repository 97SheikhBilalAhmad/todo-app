import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt/dist/jwt.service";
import { PrismaService } from "prisma/prisma.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService,private prisma: PrismaService,
  private jwtService: JwtService,) {}

  @Post("signup")
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto.name, dto.email, dto.password);
  }

  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
