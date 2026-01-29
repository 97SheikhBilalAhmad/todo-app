import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {

  @ApiProperty({
    example: 'sheikh@gmail.com',
    description: 'Registered email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongPass123',
    description: 'User password',
  })
  @IsString()
  password: string;
}
