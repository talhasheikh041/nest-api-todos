import { HttpStatus } from '@nestjs/common';

export const createResponse = (statusCode: HttpStatus, message?: string, result: any = {}) => {
   return {
      status: statusCode >= 200 && statusCode <= 299 ? 'success' : 'error',
      statusCode,
      message,
      result,
   };
};
