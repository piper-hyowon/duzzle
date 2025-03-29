import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../entity/user.entity';
import { InsertUserDto, UpdateUserDto } from '../dto/user.dto';
import { PostgresqlErrorCodes } from 'src/constant/postgresql-error-codes';
import { ContentNotFoundError } from 'src/types/error/application-exceptions/404-not-found';
import { AlreadyExistsError } from 'src/types/error/application-exceptions/409-conflict';

@Injectable()
export class UserRepositoryService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new ContentNotFoundError('user', id);
    }

    return user;
  }

  async getUserByWalletAddress(walletAddress: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ walletAddress });
    if (!user) {
      throw new ContentNotFoundError('user', walletAddress);
    }

    return user;
  }

  async findUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });

    return user;
  }

  async findUserByWalletAddress(walletAddress: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ walletAddress });

    return user;
  }

  async insertUser(dto: InsertUserDto): Promise<UserEntity> {
    const user = this.userRepository.create(dto);
    await this.userRepository.insert(user);

    return user;
  }

  async updateUser(dto: UpdateUserDto): Promise<void> {
    try {
      await this.userRepository.update(dto.id, dto);
    } catch (error) {
      switch (error.code) {
        case PostgresqlErrorCodes.UniqueViolation:
          throw new AlreadyExistsError('user:name', dto.name);

        default:
          throw error;
      }
    }
  }

  // TODO: 개발용 메서드(관리자 페이지 작업시 삭제 예정)
  async getUsers(): Promise<UserEntity[]> {
    const users = await this.userRepository.find();

    return users;
  }
}
