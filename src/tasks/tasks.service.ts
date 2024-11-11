import {
   HttpStatus,
   Injectable,
   InternalServerErrorException,
   NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schemas/task.schema';
import { Model } from 'mongoose';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { createResponse } from 'src/common/utils/create-response.util';

@Injectable()
export class TasksService {
   constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

   async getAll() {
      try {
         const todos = await this.taskModel.find({}, 'title description completed');
         if (!todos) throw new NotFoundException('No todos found');

         return createResponse(HttpStatus.OK, todos);
      } catch (error) {
         throw new InternalServerErrorException(error.message);
      }
   }

   async createTodo(createTaskDTO: CreateTaskDTO): Promise<Task> {
      try {
         const createdTodo = await this.taskModel.create(createTaskDTO);
         return createdTodo;
      } catch {
         throw new InternalServerErrorException();
      }
   }

   async getOne(id: string): Promise<Task> {
      try {
         const todo = this.taskModel.findById(id);
         if (!todo) throw new NotFoundException(`ToDo with ID ${id} not found`);
         return todo;
      } catch {
         throw new InternalServerErrorException();
      }
   }

   async updateTodo(id: string, updateTaskDTO: UpdateTaskDTO): Promise<Task> {
      try {
         const updatedTodo = await this.taskModel.findByIdAndUpdate(id, updateTaskDTO, {
            new: true,
         });
         if (!updatedTodo) throw new NotFoundException(`Todo with ID ${id} not found`);
         return updatedTodo;
      } catch {
         throw new InternalServerErrorException();
      }
   }

   async deleteTodo(id: string) {
      try {
         const deletedTodo = await this.taskModel.findByIdAndDelete(id);
         if (!deletedTodo) {
            throw new NotFoundException(`Todo with ID ${id} not found`);
         }

         return 'Todo Deleted Successfully';
      } catch {
         throw new InternalServerErrorException();
      }
   }
}
