import { IsArray, IsMongoId } from 'class-validator';

export class UpdateUserTasksDTO {
   @IsArray()
   @IsMongoId({ each: true })
   tasks: string[];
}
