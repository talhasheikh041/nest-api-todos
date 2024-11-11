import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string> {
   transform(value: string) {
      if (!isValidObjectId(value)) {
         throw new BadRequestException(`Invalid ID format`);
      }
      return value;
   }
}
