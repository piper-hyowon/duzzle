import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_USER_KEY } from '../constants/authentication';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from 'src/module/repository/entity/user.entity';

export const AuthenticatedUser = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserEntity | undefined = request[REQUEST_USER_KEY];

    return plainToInstance(UserEntity, user);
  },
);
