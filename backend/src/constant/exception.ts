import { HttpStatus } from '@nestjs/common';

// 내부 에러 코드, HTTP 응답 코드 겸용
export enum ExceptionCode {
  // 400 (Bad Request)
  InvalidParameter = 'INVALID_PARAMETER',
  NoOngoingQuest = 'NO_ONGOING_QUEST',
  InvalidFileNameExtension = 'FILE_NAME_EXTENSION',
  InvalidFilenameCharacters = 'FILE_NAME_CHARACTERS',
  InsufficientNFT = 'INSUFFICIENT_NFT',

  // 401 (Unauthorized)
  MissingWeb3IdToken = 'MISSING_WEB3_ID_TOKEN',
  MissingAuthToken = 'MISSING_AUTHENTICATION_TOKEN',
  InvalidAccessToken = 'INVLID_ACCESS_TOKEN',
  InvalidRefreshToken = 'INVALID_REFRESH_TOKEN',
  InvalidAddress = 'INVALID_ADDRESS',
  InvalidLoginInfo = 'INVALID_LOGIN_INFO',
  LoginRequired = 'LOGIN_REQUIRED',

  // 403 (Forbidden)
  AccessDenied = 'ACCESS_DENIED',
  SelfAcceptForbidden = 'SELF_ACCEPT_FORBIDDEN',

  // 404 (Not Found)
  ContentNotFound = 'CONTENT_NOT_FOUND',
  PageNotFound = 'PAGE_NOT_FOUND',

  // 409 (Confict)
  AlreadyExists = 'ALREADY_EXISTS',
  DuplicateValues = 'DUPLICATE_VALUE',
  LimitExceeded = 'LIMIT_EXCEEDED',
  ActionNotPermitted = 'ACTION_NOT_PERMITTED',
  NFTBalanceChanged = 'NFT_BALANCE_CHANGED',

  // 500
  InternalServerError = 'INTERNAL_SERVER_ERROR',
}

// 에러코드, HTTP Status 매핑
export const CodeToStatus: {
  [key in ExceptionCode]: HttpStatus;
} = {
  [ExceptionCode.InvalidParameter]: HttpStatus.BAD_REQUEST,
  [ExceptionCode.InsufficientNFT]: HttpStatus.BAD_REQUEST,
  [ExceptionCode.LimitExceeded]: HttpStatus.CONFLICT,
  [ExceptionCode.MissingAuthToken]: HttpStatus.UNAUTHORIZED,
  [ExceptionCode.MissingWeb3IdToken]: HttpStatus.UNAUTHORIZED,
  [ExceptionCode.InvalidAccessToken]: HttpStatus.UNAUTHORIZED,
  [ExceptionCode.ContentNotFound]: HttpStatus.NOT_FOUND,
  [ExceptionCode.AlreadyExists]: HttpStatus.CONFLICT,
  [ExceptionCode.DuplicateValues]: HttpStatus.CONFLICT,
  [ExceptionCode.NFTBalanceChanged]: HttpStatus.CONFLICT,
  [ExceptionCode.InternalServerError]: HttpStatus.INTERNAL_SERVER_ERROR,
  [ExceptionCode.InvalidAddress]: HttpStatus.UNAUTHORIZED,
  [ExceptionCode.InvalidLoginInfo]: HttpStatus.UNAUTHORIZED,
  [ExceptionCode.NoOngoingQuest]: HttpStatus.BAD_REQUEST,
  [ExceptionCode.InvalidFileNameExtension]: HttpStatus.BAD_REQUEST,
  [ExceptionCode.InvalidFilenameCharacters]: HttpStatus.BAD_REQUEST,
  [ExceptionCode.InvalidRefreshToken]: HttpStatus.UNAUTHORIZED,
  [ExceptionCode.PageNotFound]: HttpStatus.NOT_FOUND,
  [ExceptionCode.LoginRequired]: HttpStatus.UNAUTHORIZED,
  [ExceptionCode.AccessDenied]: HttpStatus.FORBIDDEN,
  [ExceptionCode.ActionNotPermitted]: HttpStatus.CONFLICT,
  [ExceptionCode.SelfAcceptForbidden]: HttpStatus.FORBIDDEN,
};
