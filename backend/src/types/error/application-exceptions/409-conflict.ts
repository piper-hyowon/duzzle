import { ExceptionCode } from 'src/constant/exception';
import { ApplicationException } from '../application-exceptions.base';

export class LimitExceededError extends ApplicationException {
  constructor(resource: string = '$resource', limit: number = 0) {
    const message = `Exceeded the limit of ${resource} (${limit})`;
    super(ExceptionCode.LimitExceeded, message);
  }
}

export class DuplicateValueError extends ApplicationException {
  constructor(
    resource: string = '$resource',
    property: string = '$property',
    value: string | number = '$value',
  ) {
    const message = `Duplicate *${property}* for *${resource}*: *${value}*`;
    super(ExceptionCode.DuplicateValues, message);
  }
}

export class AlreadyExistsError extends ApplicationException {
  constructor(
    resource: string = '$resource',
    value: string | number = '$value',
  ) {
    const message =
      !!resource && !!value
        ? `${resource}-${value} already exists`
        : 'Same value already exists';
    super(ExceptionCode.AlreadyExists, message);
  }
}

export class ActionNotPermittedError extends ApplicationException {
  constructor(
    operation: string = '$operation',
    resource: string = '$resource',
    status: string = '$status',
  ) {
    const message = `${operation} is not permitted for ${resource} in status: ${status}.`;
    super(ExceptionCode.ActionNotPermitted, message);
  }
}
