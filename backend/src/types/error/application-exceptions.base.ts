import { HttpStatus } from '@nestjs/common';
import { CodeToStatus, ExceptionCode } from 'src/constant/exception';

export class ApplicationException extends Error {
  code: ExceptionCode;

  constructor(code?: ExceptionCode, err?: string | Error) {
    super();
    this.code = code || ExceptionCode.InternalServerError;

    if (typeof err === 'string') {
      this.message = err;
    }

    if (typeof err === 'object') {
      this.name = err.name;
      this.message = err.message;
      this.stack = err.stack;
    }
  }

  getStatus(): HttpStatus {
    return CodeToStatus[this.code];
  }
}
