import {
   BadRequestException,
   HttpStatus,
   Injectable,
   InternalServerErrorException,
   NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { createResponse } from 'src/common/utils/create-response.util';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { Task } from './schemas/task.schema';
import { Subtask } from './schemas/subtask.schema';
import { CreateSubtaskDto } from './dto/create-subtask-dto';

@Injectable()
export class TasksService {
   constructor(
      @InjectModel(Task.name) private taskModel: Model<Task>,
      @InjectModel(Subtask.name) private subtaskModel: Model<Subtask>,
   ) {}

   async getAll() {
      try {
         const tasks = await this.taskModel.find(
            {},
            'title description completed assignedUsers attachments subtasks',
         );
         if (!tasks) throw new NotFoundException('No tasks found');

         return createResponse(HttpStatus.OK, undefined, tasks);
      } catch {
         throw new InternalServerErrorException('Tasks not found');
      }
   }

   async createTask(createTaskDTO: CreateTaskDTO) {
      try {
         const createdTask = await this.taskModel.create(createTaskDTO);
         return createResponse(HttpStatus.CREATED, 'Task created successfully', createdTask);
      } catch {
         throw new BadRequestException('Task cannot be created');
      }
   }

   async getSingleTask(id: string) {
      try {
         const task = await this.taskModel.findById(id).lean();

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

   async createSubtask(id: string, createSubTaskDTO: CreateSubtaskDto) {
      try {
         const subtask = await this.subtaskModel.create({
            ...createSubTaskDTO,
            taskID: new Types.ObjectId(id),
         });

         await this.taskModel
            .findByIdAndUpdate(id, { $push: { subtasks: subtask._id } }, { new: true })
            .exec();

         return createResponse(200, 'Subtask Added', subtask);
      } catch {
         throw new BadRequestException('Task cannot be deleted');
      }
   }

   async getTaskUsers(id: string) {
      try {
         const result = await this.taskModel.aggregate([
            {
               $match: {
                  _id: new Types.ObjectId(id),
               },
            },
            {
               $lookup: {
                  from: 'users',
                  localField: 'assignedUsers',
                  foreignField: '_id',
                  as: 'allUsers',
               },
            },
            {
               $project: {
                  title: 1,
                  description: 1,
                  allUsers: { name: 1, email: 1, _id: 1 },
               },
            },
         ]);

         return createResponse(200, undefined, result);
      } catch {
         throw new BadRequestException('Cannot get Users');
      }
   }

   async getSubtasks(id: string) {
      try {
         const result = await this.taskModel.aggregate([
            {
               $match: {
                  _id: new Types.ObjectId(id),
               },
            },
            {
               $lookup: {
                  from: 'subtasks',
                  localField: 'subtasks',
                  foreignField: '_id',
                  as: 'allSubtasks',
               },
            },
            {
               $project: {
                  title: 1,
                  description: 1,
                  allSubtasks: {
                     _id: 1,
                     title: 1,
                     description: 1,
                  },
               },
            },
         ]);

         return createResponse(200, undefined, result);
      } catch {
         throw new BadRequestException('Cannot get subtasks');
      }
   }

   async getTaskAttachments(id: string) {
      try {
         const result = await this.taskModel.aggregate([
            {
               $match: {
                  _id: new Types.ObjectId(id),
               },
            },
            { $unwind: { path: '$attachments' } },
            {
               $group: {
                  _id: '$_id',
                  title: { $first: '$title' },
                  totalAttachments: { $count: {} },
                  attachments: { $push: '$attachments' },
               },
            },
         ]);

         return createResponse(200, undefined, result);
      } catch {
         throw new BadRequestException('Cannot get attachments');
      }
   }

   async getAttachmentsWithUsers(id: string) {
      try {
         const result = await this.taskModel.aggregate([
            {
               $match: {
                  _id: new Types.ObjectId(id),
               },
            },
            {
               $facet: {
                  attachmentDetails: [
                     { $unwind: '$attachments' },
                     {
                        $project: {
                           _id: 0,
                           'attachments._id': 1,
                           'attachments.key': 1,
                           'attachments.url': 1,
                        },
                     },
                  ],
                  assignedUsersCount: [
                     {
                        $project: {
                           _id: 0,
                           numOfAssignedUsers: {
                              $size: '$assignedUsers',
                           },
                        },
                     },
                  ],
               },
            },
         ]);
         return createResponse(200, undefined, result);
      } catch {
         throw new BadRequestException('Cannot get attachments with users');
      }
   }
}
