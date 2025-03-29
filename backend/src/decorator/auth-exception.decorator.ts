import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ExceptionCode } from 'src/constant/exception';

import { ResponseException } from 'src/decorator/response-exception.decorator';

export function ResponseExceptionAuth() {
  return applyDecorators(
    ResponseException(HttpStatus.UNAUTHORIZED, [
      ExceptionCode.InvalidAccessToken,
    ]),
  );
}
