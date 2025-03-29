import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LoginJwtPayload } from './dto/auth.dto';
import { UserRepositoryService } from '../repository/service/user.repository.service';
import {
  InvalidAccessTokenError,
  MissingAuthTokenError,
} from 'src/types/error/application-exceptions/401-unautorized';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export abstract class BaseGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(UserRepositoryService)
    private readonly userRepositoryService: UserRepositoryService,
  ) {}

  protected async validateToken(token: string): Promise<LoginJwtPayload> {
    // Verify auth token
    try {
      this.jwtService.verify(token);
    } catch (e) {
      throw new InvalidAccessTokenError();
    }

    // Get payload by auth token
    const payload: LoginJwtPayload = plainToInstance(
      LoginJwtPayload,
      this.jwtService.decode(token),
      {
        excludeExtraneousValues: true,
      },
    );

    const errors = validateSync(payload, { skipMissingProperties: false });
    if (errors.length) {
      throw new InvalidAccessTokenError();
    }

    // Get User by id
    const user = await this.userRepositoryService.findUserById(payload.id);

    if (!user) {
      throw new InvalidAccessTokenError();
    }

    return user;
  }

  abstract canActivate(context: ExecutionContext): Promise<boolean>;
}

export class AuthGuard extends BaseGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    // Check jwt exists
    const token: string =
      req.headers.authorization?.split(' ')[1] || req.headers.authorization!;
    if (!token) {
      throw new MissingAuthTokenError();
    }

    req.user = await this.validateToken(token);
    return true;
  }
}

@Injectable()
export class PublicOrAuthGuard extends BaseGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    // Check jwt exists
    const token: string =
      req.headers.authorization?.split(' ')[1] || req.headers.authorization!;
    if (token) {
      req.user = await this.validateToken(token);
    }

    return true;
  }
}
