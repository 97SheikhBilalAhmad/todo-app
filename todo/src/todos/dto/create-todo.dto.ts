import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateTodoDto {

  @ApiProperty({
    example: 'Learn Swagger',
    description: 'Title of the todo',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: 'Swagger complete karna hai',
    description: 'Detailed description of the todo',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Todo completion status',
  })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
