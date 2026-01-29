import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateTodoDto {

  @ApiPropertyOptional({
    example: 'Learn Swagger deeply',
    description: 'Updated title of the todo',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    example: 'Swagger + NestJS complete documentation',
    description: 'Updated description of the todo',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Updated completion status',
  })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
