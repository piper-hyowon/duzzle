import { ExceptionCode } from 'src/constant/exception';
import { ApplicationException } from '../application-exceptions.base';

export class ContentNotFoundError extends ApplicationException {
  constructor(resource: string = '$resource', id: string | number = '$id') {
    const message = `${resource} #${id} not found`;
    super(ExceptionCode.ContentNotFound, message);
  }
}
