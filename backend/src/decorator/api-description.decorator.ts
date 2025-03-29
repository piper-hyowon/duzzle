import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ApplicationException } from '../types/error/application-exceptions.base';

import { ResponseData } from './response-data.decorator';
import { ResponseList } from './response-list.decorators';
import {
  InvalidAccessTokenError,
  MissingAuthTokenError,
} from 'src/types/error/application-exceptions/401-unautorized';
import { AuthorizationToken } from 'src/constant/authorization-token';

interface ApiDescriptionDto<TModel, TException> {
  tags?: string | string[];
  summary: string;
  description?: string;
  auth?: { type: string; required: boolean };
  dataResponse?: {
    status: HttpStatus;
    schema: TModel | boolean;
  };
  listResponse?: {
    status: HttpStatus;
    schema: TModel;
  };
  exceptions?: (new () => TException)[];
}

export function ApiDescription<
  TModel extends Type<unknown>,
  TException extends ApplicationException,
>(dto: ApiDescriptionDto<TModel, TException>) {
  // Swagger description 필드: API description + 예외 응답 코드 테이블
  let description: string = dto.description ?? '';

  dto.exceptions = dto.exceptions ?? [];

  // Add table header
  if (dto.auth || (!dto.auth && dto.exceptions.length)) {
    description +=
      '\n|http status|error code|error message|\n\
    |---|---|---------|\n';
  }

  if (dto.exceptions?.length) {
    dto.exceptions.forEach((exception) => {
      const e = new exception();
      description += `|**${e.getStatus()}**|**${e.code}**|${e.message}|\n`;
    });
  }

  // AuthGuard 에서 throw 하는 예외 > MissingAuthTokenError, InvalidAccessTokenError
  // PublicOrAuthGuard 에서 throw 하는 예회 > MissingAuthTokenError
  if (dto?.auth?.type === AuthorizationToken.BearerUserToken) {
    const authenticationExceptions = [InvalidAccessTokenError];
    if (dto.auth.required) {
      authenticationExceptions.push(MissingAuthTokenError);
    }

    authenticationExceptions.forEach((exception) => {
      const e = new exception();
      description += `|**${e.getStatus()}**|**${e.code}**|${e.message}|\n`;
    });
  }

  const decorators: MethodDecorator[] = [
    ApiOperation({ summary: dto.summary, description }),
  ];

  if (typeof dto.tags === 'string' && dto.tags) {
    decorators.push(ApiTags(dto.tags));
  }

  if (Array.isArray(dto.tags) && dto.tags.length) {
    decorators.push(ApiTags(...dto.tags));
  }

  if (dto.dataResponse) {
    if (typeof dto.dataResponse.schema === 'boolean') {
      decorators.push(
        ApiResponse({
          status: dto.dataResponse.status,
          schema: {
            properties: {
              result: {
                type: 'boolean',
                example: true,
              },
              data: {
                type: 'boolean',
                example: true,
              },
            },
          },
        }),
      );
    } else {
      decorators.push(
        ApiExtraModels(<TModel>dto.dataResponse.schema),
        ResponseData(<TModel>dto.dataResponse.schema, dto.dataResponse.status),
      );
    }
  }

  if (dto.listResponse) {
    decorators.push(
      ApiExtraModels(dto.listResponse.schema),
      ResponseList(dto.listResponse.schema, dto.listResponse.status),
    );
  }

  if (dto.auth) {
    decorators.push(ApiBearerAuth(dto.auth.type));
  }

  return applyDecorators(...decorators);
}
