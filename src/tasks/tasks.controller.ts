import { Body, Controller, Delete, Get, Param, Patch, Post, ValidationPipe } from '@nestjs/common';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { TasksService } from './tasks.service';
import { CreateSubtaskDto } from './dto/create-subtask-dto';

@Controller('tasks')
export class TasksController {
   constructor(private readonly tasksService: TasksService) {}

   @Get()
   getAll() {
      return this.tasksService.getAll();
   }

   @Post()
   create(@Body(new ValidationPipe()) createTaskDTO: CreateTaskDTO) {
      return this.tasksService.createTask(createTaskDTO);
   }

   @Get(':id')
   getOne(@Param('id', ParseObjectIdPipe) id: string) {
      return this.tasksService.getSingleTask(id);
   }

   @Patch(':id')
   update(
      @Param('id', ParseObjectIdPipe) id: string,
      @Body(new ValidationPipe()) updateTaskDTO: UpdateTaskDTO,
   ) {
      return this.tasksService.updateTask(id, updateTaskDTO);
   }

   @Delete(':id')
   remove(@Param('id', ParseObjectIdPipe) id: string) {
      return this.tasksService.deleteTask(id);
   }

   @Patch(':id/subtasks')
   addSubtask(
      @Param('id', ParseObjectIdPipe) id: string,
      @Body(new ValidationPipe()) createSubtaskDTO: CreateSubtaskDto,
   ) {
      return this.tasksService.createSubtask(id, createSubtaskDTO);
   }

   @Get(':id/users')
   getTaskUsers(@Param('id', ParseObjectIdPipe) id: string) {
      return this.tasksService.getTaskUsers(id);
   }

   @Get(':id/attachments')
   getTaskAttachments(@Param('id', ParseObjectIdPipe) id: string) {
      return this.tasksService.getTaskAttachments(id);
   }

   @Get(':id/attachments-with-users')
   getAttachmentsWithUsers(@Param('id', ParseObjectIdPipe) id: string) {
      return this.tasksService.getAttachmentsWithUsers(id);
   }
}
