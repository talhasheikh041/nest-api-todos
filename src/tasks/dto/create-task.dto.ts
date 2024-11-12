import { Type } from 'class-transformer';
import {
   IsString,
   IsNotEmpty,
   IsOptional,
   IsBoolean,
   IsArray,
   IsMongoId,
   ValidateNested,
   IsUrl,
} from 'class-validator';

class AttachmentDTO {
   @IsString()
   @IsNotEmpty()
   key: string;

   @IsUrl()
   url: string;
}

export class CreateTaskDTO {
   @IsString()
   @IsNotEmpty()
   title: string;

   @IsString()
   @IsOptional()
   description?: string;

   @IsArray()
   @IsMongoId({ each: true })
   @IsOptional()
   assignedUsers?: string[];

   @IsArray()
   @ValidateNested({ each: true })
   @Type(() => AttachmentDTO)
   @IsOptional()
   attachments?: AttachmentDTO[];

   @IsBoolean()
   @IsOptional()
   completed?: boolean;
}
