import {
   BadRequestException,
   HttpStatus,
   Injectable,
   InternalServerErrorException,
   NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createResponse } from 'src/common/utils/create-response.util';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { Task } from './schemas/task.schema';

@Injectable()
export class TasksService {
   constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

   async getAll() {
      try {
         const tasks = await this.taskModel.find({}, 'title description completed');
         if (!tasks) throw new NotFoundException('No tasks found');

         return createResponse(HttpStatus.OK, undefined, tasks);
      } catch {
         throw new InternalServerErrorException('Tasks not found');
      }
   }

   async createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
      try {
         const createdTask = await this.taskModel.create(createTaskDTO);
         return createdTask;
      } catch {
         throw new BadRequestException('Task cannot be created');
      }
   }

   async getOne(id: string) {
      try {
         const task = this.taskModel.findById(id);
         if (!task) throw new NotFoundException(`Task with ID ${id} not found`);
         return createResponse(HttpStatus.OK, undefined, task);
      } catch {
         throw new BadRequestException('Task not found');
      }
   }

   async updateTask(id: string, updateTaskDTO: UpdateTaskDTO) {
      try {
         const updatedTask = await this.taskModel.findByIdAndUpdate(id, updateTaskDTO, {
            new: true,
         });

         return createResponse(HttpStatus.OK, 'Task updated successfully', updatedTask);
      } catch {
         throw new BadRequestException('Task cannot be updated');
      }
   }

   async deleteTask(id: string) {
      try {
         await this.taskModel.findByIdAndDelete(id);

         return createResponse(HttpStatus.OK, 'Task Deleted Successfully');
      } catch {
         throw new BadRequestException('Task cannot be deleted');
      }
   }
}
