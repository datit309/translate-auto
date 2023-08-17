import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import {
  SetupRoleEntity,
  SetupRoleEntityDocument,
} from './entities/role.entity';
import {
  SetupAdminEntity,
  SetupAdminEntityDocument,
} from './entities/admin.entity';
import {
  SetupGroupEntity,
  SetupGroupEntityDocument,
} from './entities/group.entity';
import { UserEntity, UserEntityDocument } from '../user/entities/user.entity';
import { Model, PaginateModel } from 'mongoose';

@Injectable()
export class SetupService {
  constructor(
    @InjectModel(SetupRoleEntity.name)
    private modelSetupRole: Model<SetupRoleEntityDocument>,
    @InjectModel(SetupAdminEntity.name)
    private modelSetupAdmin: Model<SetupAdminEntityDocument>,
    @InjectModel(SetupGroupEntity.name)
    private modelSetupGroupEntity: Model<SetupGroupEntityDocument>,
    @InjectModel(UserEntity.name)
    private modelUserEntity: Model<UserEntityDocument>,
  ) {
    if (process.env.AUTO_SETUP == '1') {
      this.runSetup();
    }
  }

  async runSetup() {
    await this.setupRole();
    await this.setupGroup();
    await this.setupAdmin();
    await this.setupDemoUser();
  }

  async setupRole() {
    const data = [
      { name: 'Admin', key: 'manager' },
      { name: 'User', key: 'client' },
    ];
    for (let i = 0; i < data.length; i++) {
      const check = await this.modelSetupRole.count({
        key: data[i].key,
      });
      if (check == 0) {
        await this.modelSetupRole.create(data[i]);
      }
    }
  }

  async setupGroup() {
    const data = [
      { name: 'Admin', key: ['manager'] },
      { name: 'User', key: ['client'] },
    ];
    for (let i = 0; i < data.length; i++) {
      const check = await this.modelSetupGroupEntity.count({
        name: data[i].name,
      });
      if (check == 0) {
        const roles = await this.modelSetupRole.find({
          key: {
            $in: data[i]['key'],
          },
        });
        const group = await this.modelSetupGroupEntity.create(data[i]);
        // @ts-ignore
        group.roles = group.roles.concat(roles);
        await group.save();
      }
    }
  }

  async setupAdmin() {
    const data = [
      {
        username: 'admin',
        password: bcrypt.hashSync('admin@123', 8),
        group_id: (
          await this.modelSetupGroupEntity.findOne({
            name: 'Admin',
          })
        ).id,
      },
    ];
    for (let i = 0; i < data.length; i++) {
      const check = await this.modelSetupAdmin.count({
        username: data[i].username,
      });
      if (check == 0) {
        await this.modelSetupAdmin.create(data[i]);
      }
    }
  }

  async setupDemoUser() {
    const exist = await this.modelUserEntity.countDocuments({
      username: 'kanni',
    });
    if (exist == 0) {
      await this.modelUserEntity.create({
        username: 'kanni',
        password: bcrypt.hashSync('123123', 8),
        group_id: await this.modelSetupGroupEntity.findOne({
          name: 'User',
        }),
      });
    }
  }
}
