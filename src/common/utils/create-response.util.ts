import { HttpStatus } from '@nestjs/common';

export const createResponse = (status: HttpStatus, result: any) => {
   return {
      status,
      result,
   };
};
