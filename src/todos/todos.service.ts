import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Todo } from './schemas/todo.schema';
import { Model } from 'mongoose';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';

@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}

  async getAll() {
    const todos = await this.todoModel.find({}, 'title description completed');

    if (!todos) throw new NotFoundException('No todos found');

    return {
      status: HttpStatus.OK,
      result: todos,
    };
  }

  async createTodo(createTodoInput: CreateTodoInput): Promise<Todo> {
    const createdTodo = await this.todoModel.create(createTodoInput);
    return createdTodo;
  }

  async getOne(id: string): Promise<Todo> {
    const todo = this.todoModel.findById(id);
    if (!todo) throw new NotFoundException(`ToDo with ID ${id} not found`);
    return todo;
  }

  async updateTodo(
    id: string,
    updateTodoInput: UpdateTodoInput,
  ): Promise<Todo> {
    const updatedTodo = await this.todoModel.findByIdAndUpdate(
      id,
      updateTodoInput,
      { new: true },
    );
    if (!updatedTodo)
      throw new NotFoundException(`Todo with ID ${id} not found`);
    return updatedTodo;
  }

  async deleteTodo(id: string) {
    const deletedTodo = await this.todoModel.findByIdAndDelete(id);
    if (!deletedTodo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return 'Todo Deleted Successfully';
  }
}
