import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  // ✅ CREATE TODO
  @Post()
  create(@Body() createTodoDto: CreateTodoDto, @Req() req) {
    return this.todosService.create(createTodoDto, req.user.userId);
  }

  // ✅ GET ALL TODOS (user specific)
  @Get()
  findAll(@Req() req) {
    return this.todosService.findAll(req.user.userId);
  }

  // ✅ GET SINGLE TODO
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.todosService.findOne(id, req.user.userId);
  }

  // ✅ UPDATE TODO
  
  @Put(":id")
  updateTodo(
    @Param("id") id: string,
    @Body() dto: UpdateTodoDto,
    @Req() req
  ) {
    return this.todosService.updateTodo(+id, dto, req.user.id);
  }

  // ✅ DELETE TODO
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.todosService.remove(id, req.user.userId);
  }
}
