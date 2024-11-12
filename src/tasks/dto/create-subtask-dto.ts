import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateSubtaskDto {
   @IsString()
   title: string;

   @IsOptional()
   @IsString()
   description?: string;

   @IsOptional()
   @IsBoolean()
   completed?: boolean;
}
