import {
   HttpStatus,
   Injectable,
   InternalServerErrorException,
   NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Todo } from './schemas/todo.schema';
import { Model } from 'mongoose';
import { CreateTodoInput } from './dto/create-todo.dto';
import { UpdateTodoInput } from './dto/update-todo.dto';
import { createResponse } from 'src/common/utils/create-response.util';

@Injectable()
export class TodosService {
   constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}

   async getAll() {
      try {
         const todos = await this.todoModel.find({}, 'title description completed');
         if (!todos) throw new NotFoundException('No todos found');

         return createResponse(HttpStatus.OK, todos);
      } catch (error) {
         throw new InternalServerErrorException(error.message);
      }
   }

   async createTodo(createTodoInput: CreateTodoInput): Promise<Todo> {
      try {
         const createdTodo = await this.todoModel.create(createTodoInput);
         return createdTodo;
      } catch {
         throw new InternalServerErrorException();
      }
   }

   async getOne(id: string): Promise<Todo> {
      try {
         const todo = this.todoModel.findById(id);
         if (!todo) throw new NotFoundException(`ToDo with ID ${id} not found`);
         return todo;
      } catch {
         throw new InternalServerErrorException();
      }
   }

   async updateTodo(id: string, updateTodoInput: UpdateTodoInput): Promise<Todo> {
      try {
         const updatedTodo = await this.todoModel.findByIdAndUpdate(id, updateTodoInput, {
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
         const deletedTodo = await this.todoModel.findByIdAndDelete(id);
         if (!deletedTodo) {
            throw new NotFoundException(`Todo with ID ${id} not found`);
         }

         return 'Todo Deleted Successfully';
      } catch {
         throw new InternalServerErrorException();
      }
   }
}
