import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { createResponse } from 'src/common/utils/create-response.util';
import { Task } from 'src/tasks/schemas/task.schema';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
   constructor(
      @InjectModel(User.name) private userModel: Model<User>,
      @InjectModel(Task.name) private taskModel: Model<Task>,
   ) {}

   async getAllUsers() {
      return this.userModel.find().select('name email tasks');
   }

   async createUser(createUserDTO: CreateUserDTO) {
      try {
         const createdUser = await this.userModel.create(createUserDTO);
         const result = { name: createdUser.name, email: createdUser.email };
         return createResponse(200, 'User Created Successfully', result);
      } catch {
         throw new BadRequestException('User cannot be created');
      }
   }

   async getSingleUser(id: string) {
      try {
         const user = await this.userModel.findById(id).select('name email').lean();
         return createResponse(200, undefined, user);
      } catch {
         throw new BadRequestException('User not found');
      }
   }

   async updateUser(id: string, updateUserDTO: UpdateUserDTO) {
      try {
         await this.userModel.findByIdAndUpdate(id, updateUserDTO, {
            new: true,
         });
         return createResponse(200, 'User updated successfully');
      } catch {
         throw new BadRequestException('User not found');
      }
   }

   async deleteUser(id: string) {
      try {
         await this.userModel.findByIdAndDelete(id);
         return createResponse(200, 'User deleted successfully');
      } catch {
         throw new BadRequestException('User not found');
      }
   }

   async updateUserTasks(userId: string, taskIds: string[]) {
      try {
         const result = await this.userModel
            .findByIdAndUpdate(userId, { tasks: taskIds }, { new: true })
            .exec();

         return createResponse(200, 'Updated tasks successfuly', result);
      } catch {
         throw new BadRequestException('User not found');
      }
   }

   async assignTaskToUser(userId: string, taskId: string) {
      try {
         const user = await this.userModel
            .findByIdAndUpdate(
               userId,
               { $addToSet: { tasks: new Types.ObjectId(taskId) } },
               { new: true },
            )
            .select('-createdAt -updatedAt -__v')
            .exec();

         if (!user) {
            throw new NotFoundException('User not found');
         }

         const task = await this.taskModel
            .findByIdAndUpdate(
               taskId,
               { $addToSet: { assignedUsers: new Types.ObjectId(userId) } },
               { new: true },
            )
            .exec();

         if (!task) {
            throw new NotFoundException('Task not found');
         }

         return createResponse(200, 'Task assigned successfully', user);
      } catch {
         throw new BadRequestException('Cannot assign task to user');
      }
   }

   async getUserTasks(userId: string) {
      try {
         const result = await this.userModel.aggregate([
            {
               $match: {
                  _id: new Types.ObjectId(userId),
               },
            },
            {
               $lookup: {
                  from: 'tasks',
                  localField: 'tasks',
                  foreignField: '_id',
                  as: 'allTasks',
               },
            },
            { $project: { allTasks: 1, name: 1 } },
         ]);

         return createResponse(200, undefined, result);
      } catch {
         throw new BadRequestException('No tasks assigned to the user');
      }
   }

   async getUserWithSubtasks(id: string) {
      try {
         const result = await this.userModel.aggregate([
            {
               $match: {
                  _id: new Types.ObjectId(id),
               },
            },
            {
               $lookup: {
                  from: 'tasks',
                  localField: 'tasks',
                  foreignField: '_id',
                  as: 'taskDetails',
               },
            },
            { $unwind: { path: '$taskDetails' } },
            {
               $lookup: {
                  from: 'subtasks',
                  localField: 'taskDetails.subtasks',
                  foreignField: '_id',
                  as: 'subtaskDetails',
               },
            },
            { $unwind: { path: '$subtaskDetails' } },
            {
               $group: {
                  _id: '$_id',
                  name: { $first: '$name' },
                  email: { $first: '$email' },
                  taskDetails: { $push: '$taskDetails' },
                  subtaskDetails: {
                     $push: '$subtaskDetails',
                  },
               },
            },
         ]);

         return createResponse(200, undefined, result);
      } catch {
         throw new BadRequestException('Cannot find the user');
      }
   }
}
