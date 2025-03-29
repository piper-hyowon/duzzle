import { UserEntity } from 'src/module/repository/entity/user.entity';

declare global {
  namespace Express {
    interface Request {
      user: UserEntity;
    }
  }
}
