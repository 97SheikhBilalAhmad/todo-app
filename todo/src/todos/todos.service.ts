import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  
  constructor(private readonly prisma: PrismaService) {}

  // ✅ CREATE TODO (DB me save hoga)
  async create(createTodoDto: CreateTodoDto, userId: string) {
    const todo = await this.prisma.todo.create({
      data: {
        title: createTodoDto.title,
        description: createTodoDto.description,
        userId: userId, 
      },
    });

    return { 
      message: 'Todo created successfully',
      data: todo,
    };
  }

  // ✅ GET ALL TODOS (sirf logged-in user ke)
  async findAll(userId: string) {
    const todos = await this.prisma.todo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      message: 'All todos of logged-in user',
      data: todos,
    };
  } 

  // ✅ GET SINGLE TODO (ownership check)
  async findOne(id: string, userId: string) {
    const todo = await this.prisma.todo.findFirst({
      where: { id: Number(id), userId },
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return {
      message: 'Todo fetched successfully',
      data: todo,
    };
  }

  // ✅ UPDATE TODO (only owner can update)
  async updateTodo(
    id: number,
    dto: UpdateTodoDto,
    userId: string
  ) {
    const todo = await this.prisma.todo.findUnique({
      where: { id },
    });

    if (!todo) {
      throw new NotFoundException("Todo not found");
    }

    if (todo.userId !== userId) {
      throw new ForbiddenException("Access denied");
    }

    return this.prisma.todo.update({
      where: { id },
      data: dto,
      
    });
  }

  // ✅ DELETE TODO (only owner can delete)
  async remove(id: string, userId: string) {
    const todo = await this.prisma.todo.findFirst({
      where: { id: Number(id), userId },
    });

    if (!todo) {
      throw new ForbiddenException('You cannot delete this todo');
    }

    await this.prisma.todo.delete({
      where: { id: Number(id) },
    });

    return {
      message: 'Todo deleted successfully',
    };
  }
}
