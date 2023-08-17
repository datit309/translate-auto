import { Module } from '@nestjs/common';
import { SetupService } from './setup.service';
import { SetupRoleEntity, SetupRoleEntitySchema } from './entities/role.entity';
import {
  SetupAdminEntity,
  SetupAdminEntitySchema,
} from './entities/admin.entity';
import {
  SetupGroupEntity,
  SetupGroupEntitySchema,
} from './entities/group.entity';
import { MongooseModule } from '@nestjs/mongoose';

import { UserEntity, UserEntitySchema } from '../user/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserEntity.name, schema: UserEntitySchema },
      { name: SetupRoleEntity.name, schema: SetupRoleEntitySchema },
      { name: SetupAdminEntity.name, schema: SetupAdminEntitySchema },
      { name: SetupGroupEntity.name, schema: SetupGroupEntitySchema },
    ]),
  ],
  providers: [SetupService],
  controllers: [],
})
export class SetupModule {}
