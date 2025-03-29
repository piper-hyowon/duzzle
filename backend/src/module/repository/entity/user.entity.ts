import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { LoginType, ProfileType } from '../enum/user.enum';
import { BaseEntity } from './base.entity';
import { USER_PROFILE_DEFAULT_IMG } from 'src/constant/image';

export enum UserStatus {
  NORMAL = 'normal',
  BLOCK = 'block',
  DELETE = 'delete',
}

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('enum', { enum: LoginType })
  loginType: LoginType;

  @Column('varchar', { length: 44, unique: true })
  walletAddress: string;

  @Column('varchar', { length: 100, nullable: true })
  email: string;

  @Column('varchar', { length: 40, nullable: true, unique: true })
  name: string;

  @Column('varchar', { nullable: true, default: USER_PROFILE_DEFAULT_IMG })
  image: string;

  @Column('enum', { enum: ProfileType, default: ProfileType.Private })
  profileType: ProfileType;

  @Column('enum', {
    enum: UserStatus,
    enumName: 'type_user_status',
    default: UserStatus.NORMAL,
  })
  status: UserStatus;
}
