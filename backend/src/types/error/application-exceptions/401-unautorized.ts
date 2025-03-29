import { ExceptionCode } from 'src/constant/exception';
import { ApplicationException } from '../application-exceptions.base';

export class MissingWeb3IdTokenError extends ApplicationException {
  constructor() {
    super(
      ExceptionCode.MissingAuthToken,
      'Web3 ID Token is missing in the request header.',
    );
  }
}

export class MissingAuthTokenError extends ApplicationException {
  constructor() {
    super(
      ExceptionCode.MissingAuthToken,
      'Access token is missing in the request header.',
    );
  }
}

export class InvalidIdTokenError extends ApplicationException {
  constructor() {
    super(ExceptionCode.InvalidAccessToken, 'Invalid Id Token');
  }
}

export class InvalidAccessTokenError extends ApplicationException {
  constructor() {
    super(ExceptionCode.InvalidAccessToken, 'Invalid Access Token');
  }
}

export class InvalidatedRefreshTokenError extends ApplicationException {
  constructor() {
    super(
      ExceptionCode.InvalidRefreshToken,
      'Access denied. Your refresh token might have been stolen',
    );
  }
}

export class IncorrectLoginInfo extends ApplicationException {
  constructor() {
    super(
      ExceptionCode.InvalidLoginInfo,
      'The email address or password is invalid',
    );
  }
}

export class InvalidWalletAddress extends ApplicationException {
  constructor() {
    super(ExceptionCode.InvalidAddress, 'Wallet Address Different');
  }
}

export class LoginRequired extends ApplicationException {
  constructor(resource: string = '$resource') {
    const message = `Access to ${resource} requires login`;
    super(ExceptionCode.LoginRequired, message);
  }
}
