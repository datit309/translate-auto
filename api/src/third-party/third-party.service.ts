import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel, Types } from 'mongoose';
import { UserEntity, UserEntityDocument } from '../user/entities/user.entity';
import {
  AuthGroupEntity,
  AuthGroupEntityDocument,
} from '../auth/entities/group.entity';
import * as bcrypt from 'bcrypt';
import { RegisterClientDto } from './dto/register-client.dto';

@Injectable()
export class ThirdPartyService {
  constructor(
    @InjectModel(UserEntity.name)
    private modelUser: Model<UserEntityDocument>,
    @InjectModel(AuthGroupEntity.name)
    private modelGroup: Model<AuthGroupEntityDocument>,
  ) {}

  registerUser(dto: RegisterClientDto) {
    return new Promise(async (resolve, reject) => {
      const exist = await this.modelUser.countDocuments({
        username: dto.username,
      });
      if (exist > 0) {
        reject('account already exists');
        return false;
      }
      const group = await this.modelGroup.findOne({ name: 'User' });
      if (!group) {
        reject('not found group');
        return false;
      }
      resolve(
        await this.modelUser.create({
          username: dto.username,
          password: bcrypt.hashSync(dto.password, 8),
          group_id: group,
        }),
      );
      return true;
    });
  }

}
