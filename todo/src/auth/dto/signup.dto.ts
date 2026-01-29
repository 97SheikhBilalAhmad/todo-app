import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignupDto {

  @ApiProperty({
    example: 'Sheikh Bilal',
    description: 'User full name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'sheikh@gmail.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongPass123',
    description: 'User password (min 6 characters)',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
