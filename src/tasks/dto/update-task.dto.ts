import { CreateTaskDTO } from './create-task.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateTaskDTO extends PartialType(CreateTaskDTO) {}
