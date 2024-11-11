import { Body, Controller, Delete, Get, Param, Patch, Post, ValidationPipe } from '@nestjs/common';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
   constructor(private readonly tasksService: TasksService) {}

   @Get()
   getAll() {
      return this.tasksService.getAll();
   }

   @Post()
   create(@Body(new ValidationPipe()) createTaskDTO: CreateTaskDTO) {
      return this.tasksService.createTodo(createTaskDTO);
   }

   @Get(':id')
   getOne(@Param('id', ParseObjectIdPipe) id: string) {
      return this.tasksService.getOne(id);
   }

   @Patch(':id')
   update(
      @Param('id', ParseObjectIdPipe) id: string,
      @Body(new ValidationPipe()) updateTaskDTO: UpdateTaskDTO,
   ) {
      return this.tasksService.updateTodo(id, updateTaskDTO);
   }

   @Delete(':id')
   remove(@Param('id', ParseObjectIdPipe) id: string) {
      return this.tasksService.deleteTodo(id);
   }
}
