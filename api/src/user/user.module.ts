import { CacheModule, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEntity, UserEntitySchema } from './entities/user.entity';
import {
  AuthGroupEntity,
  AuthGroupEntitySchema,
} from '../auth/entities/group.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserEntity.name, schema: UserEntitySchema },
      { name: AuthGroupEntity.name, schema: AuthGroupEntitySchema },
    ]),
    CacheModule.register(),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
