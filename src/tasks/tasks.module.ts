import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schemas/task.schema';
import { Subtask, SubtaskSchema } from './schemas/subtask.schema';

@Module({
   controllers: [TasksController],
   providers: [TasksService],
   imports: [
      MongooseModule.forFeature([
         { name: Task.name, schema: TaskSchema },
         { name: Subtask.name, schema: SubtaskSchema },
      ]),
   ],
})
export class TasksModule {}
