import { CreateTodoInput } from './create-todo.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateTodoInput extends PartialType(CreateTodoInput) {}
