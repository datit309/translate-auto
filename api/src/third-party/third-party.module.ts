import { Module } from '@nestjs/common';
import { ThirdPartyService } from './third-party.service';
import { ThirdPartyController } from './third-party.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEntity, UserEntitySchema } from '../user/entities/user.entity';
import {
  AuthGroupEntity,
  AuthGroupEntitySchema,
} from '../auth/entities/group.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AuthGroupEntity.name, schema: AuthGroupEntitySchema },
      { name: UserEntity.name, schema: UserEntitySchema },
    ]),
  ],
  controllers: [ThirdPartyController],
  providers: [ThirdPartyService],
})
export class ThirdPartyModule {}
