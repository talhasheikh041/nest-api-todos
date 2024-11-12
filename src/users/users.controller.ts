import { Body, Controller, Delete, Get, Param, Patch, Post, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UpdateUserTasksDTO } from './dto/update-user-tasks.dto';

@Controller('users')
export class UsersController {
   constructor(private readonly usersService: UsersService) {}

   @Get()
   getAll() {
      return this.usersService.getAllUsers();
   }

   @Post()
   create(@Body(new ValidationPipe()) createUserDTO: CreateUserDTO) {
      return this.usersService.createUser(createUserDTO);
   }

   @Get(':id/tasks')
   getTasks(@Param('id', ParseObjectIdPipe) id: string) {
      return this.usersService.getUserTasks(id);
   }

   @Get(':id/subtasks')
   getUserSubtasks(@Param('id', ParseObjectIdPipe) id: string) {
      return this.usersService.getUserWithSubtasks(id);
   }

   @Patch(':id/update-tasks')
   async updateUserTasks(
      @Param('id') id: string,
      @Body(new ValidationPipe()) updateUserTasksDto: UpdateUserTasksDTO,
   ) {
      return await this.usersService.updateUserTasks(id, updateUserTasksDto.tasks);
   }

   @Patch(':userId/assign-task/:taskId')
   async assignTask(
      @Param('userId', ParseObjectIdPipe) userId: string,
      @Param('taskId', ParseObjectIdPipe) taskId: string,
   ) {
      return await this.usersService.assignTaskToUser(userId, taskId);
   }

   @Get(':id')
   getOne(@Param('id', ParseObjectIdPipe) id: string) {
      return this.usersService.getSingleUser(id);
   }

   @Patch(':id')
   updateOne(
      @Param('id', ParseObjectIdPipe) id: string,
      @Body(new ValidationPipe()) updateUserDTO: UpdateUserDTO,
   ) {
      return this.usersService.updateUser(id, updateUserDTO);
   }

   @Delete(':id')
   deleteOne(@Param('id', ParseObjectIdPipe) id: string) {
      return this.usersService.deleteUser(id);
   }
}
