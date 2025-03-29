import { ExceptionCode } from 'src/constant/exception';
import { ApplicationException } from '../application-exceptions.base';

export class AccessDenied extends ApplicationException {
  constructor(resource: string = '$resource', id: string | number = '$id') {
    const message = `${resource} #${id} access permission is denied`;
    super(ExceptionCode.AccessDenied, message);
  }
}
export class SelfAcceptForbidden extends ApplicationException {
  constructor() {
    super(
      ExceptionCode.SelfAcceptForbidden,
      '자신이 등록한 교환 거래는 승인 불가',
    );
  }
}
