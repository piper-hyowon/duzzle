import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ExceptionCode } from 'src/constant/exception';

export const ResponseException = (
  status: HttpStatus = HttpStatus.OK,
  codes: ExceptionCode[],
) =>
  applyDecorators(
    HttpCode(status),
    ApiResponse({
      status,
      schema: {
        allOf: [
          {
            properties: {
              result: {
                type: 'boolean',
                example: true,
              },
              code: {
                type: 'string',
                example: codes[0],
              },
            },
          },
        ],
      },
    }),
  );
