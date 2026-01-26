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
import { AuthGuard } from '@nestjs/passport';



@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  // ✅ CREATE TODO
  @Post()
  createTodo(@Body() Dto: CreateTodoDto, @Req() req: any) {
    console.log('REQ.USER =>', req.user);
    return this.todosService.create(Dto, req.user.id);
    
  }

  // ✅ GET ALL TODOS (user specific)
  @Get()
  findAll(@Req() req) {
    return this.todosService.findAll(req.user.id);
  }

  // ✅ GET SINGLE TODO
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.todosService.findOne(id, req.user.id);
  }

  // ✅ UPDATE TODO
  
  @Put(":id")
  updateTodo(
    @Param("id") id: string,
    @Body() dto: UpdateTodoDto,
    @Req() req
  ) {
    return this.todosService.updateTodo(id, dto, req.user.id);
  }

  // ✅ DELETE TODO
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.todosService.remove(id, req.user.userId);
  }
}
