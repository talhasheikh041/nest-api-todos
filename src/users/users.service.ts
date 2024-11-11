import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { createResponse } from 'src/common/utils/create-response.util';

@Injectable()
export class UsersService {
   constructor(@InjectModel(User.name) private userModel: Model<User>) {}

   async getAllUsers() {
      return this.userModel.find().select('name email');
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
}
