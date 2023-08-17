import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserEntity, UserEntityDocument } from './entities/user.entity';
import { Model, PaginateModel } from 'mongoose';
import { Cache } from 'cache-manager';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import {
  AuthGroupEntity,
  AuthGroupEntityDocument,
} from '../auth/entities/group.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(UserEntity.name)
    private modelUser: PaginateModel<UserEntityDocument>,
    @InjectModel(AuthGroupEntity.name)
    private modelGroup: Model<AuthGroupEntityDocument>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<UserEntity> {
    return await this.modelUser.create(dto);
  }

  async updateUser(_id: string, update: any): Promise<UserEntity> {
    return this.modelUser.findOneAndUpdate({_id}, update, {new: true, upsert: false});
  }

  async deleteUser(_id: string): Promise<any> {
    return this.modelUser.deleteOne({_id});
  }

  async findAllUser(page: number, username: string, limit = 10) {
    return this.modelUser.paginate(
      username && username.length > 0
        ? { username: { $regex: '.*' + username + '.*' } }
        : {},
      {
        page,
        limit,
      },
    );
  }

  async findUsername(username: string) {
    return this.modelUser.findOne({ username }).select('-password');
  }

  async updatePassword(id: string, password: string) {
    return this.modelUser.findByIdAndUpdate(id, {
      password: bcrypt.hashSync(password.trim(), 8),
    });
  }

  async changeStatusUser(_id: string, status: string) {
    const user = await this.modelUser.findOneAndUpdate(
      {
        _id,
      },
      {
        status,
      },
      { new: true },
    );
    await this.cacheManager.del(process.env.JWT_KEY + '_' + user.username);
    return user;
  }
}
