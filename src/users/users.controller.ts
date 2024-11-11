import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
   constructor(private readonly usersService: UsersService) {}

   @Get()
   getAll() {
      return this.usersService.getAllUsers();
   }

   @Post()
   create(@Body(new ValidationPipe()) createUserDTO: CreateUserDTO) {
      return this.usersService.createUser(createUserDTO);
   }
}
