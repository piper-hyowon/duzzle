import { RedisKey } from '../enum/cache.enum';

export class EditUserNameKey {
  static editUserNamePrefix: string = RedisKey.EditUserName;

  static get(userId: number): string {
    return [this.editUserNamePrefix, userId].join(':');
  }
}
