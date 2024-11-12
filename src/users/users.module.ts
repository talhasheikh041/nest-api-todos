import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Task, TaskSchema } from 'src/tasks/schemas/task.schema';

@Module({
   controllers: [UsersController],
   providers: [UsersService],
   imports: [
      MongooseModule.forFeature([
         { name: User.name, schema: UserSchema },
         { name: Task.name, schema: TaskSchema },
      ]),
   ],
})
export class UsersModule {}
