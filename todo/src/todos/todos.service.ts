import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { DatabaseService } from "src/modules/database/database.service";
import { todos } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";

@Injectable()
export class TodosService { 
   constructor(private db: DatabaseService) {}
  // ✅ CREATE TODO
  async create(dto: CreateTodoDto, userId: string) {
    console.log('USER ID IN SERVICE =>', userId); 
    const [todo] = await this.db.db
      .insert(todos)
      .values({
        title: dto.title,
        description: dto.description,
        userId : userId,
      }) 
      .returning();

    return {
      message: "Todo created successfully",
      data: todo,
    };
  }

  // ✅ GET ALL TODOS (logged-in user only)
  async findAll(userId: string) {
    const data = await this.db.db
      .select()
      .from(todos)
      .where(eq(todos.userId, userId))
      .orderBy(todos.createdAt);

    return {
      message: "All todos of logged-in user",
      data,
    };
  }

  // ✅ GET SINGLE TODO
  async findOne(id: string, userId: string) {
    const [todo] = await this.db.db
      .select()
      .from(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, userId)));

    if (!todo) {
      throw new NotFoundException("Todo not found");
    }

    return {
      message: "Todo fetched successfully",
      data: todo,
    };
  }

  // ✅ UPDATE TODO (OWNER CHECK)
  async updateTodo(id: string, dto: UpdateTodoDto, userId: string) {
    const [todo] = await this.db.db
      .select()
      .from(todos)
      .where(eq(todos.id, id));

    if (!todo) {
      throw new NotFoundException("Todo not found"); 
    }

    if (todo.userId !== userId) {
      throw new ForbiddenException("Access denied");
    }

    const [updatedTodo] = await this.db.db
      .update(todos)
      .set(dto)
      .where(eq(todos.id, id))
      .returning();

    return {
      message: "Todo updated successfully",
      data: updatedTodo,
    };
  }

  // ✅ DELETE TODO (OWNER CHECK)
  async remove(id: string, userId: string) {
    const [todo] = await this.db.db
      .select()
      .from(todos)
      .where(eq(todos.id, id));

    if (!todo) {
      throw new ForbiddenException("You cannot delete this todo");
    }

    await this.db.db.delete(todos).where(eq(todos.id, id));

    return {
      message: "Todo deleted successfully",
    };
  }
}
