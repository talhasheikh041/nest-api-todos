import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  getAll() {
    return this.todosService.getAll();
  }

  @Post()
  create(@Body(new ValidationPipe()) createTodoInput: CreateTodoInput) {
    return this.todosService.createTodo(createTodoInput);
  }

  @Get(':id')
  getOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.todosService.getOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body(new ValidationPipe()) updateTodoInput: UpdateTodoInput,
  ) {
    return this.todosService.updateTodo(id, updateTodoInput);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.todosService.deleteTodo(id);
  }
}
