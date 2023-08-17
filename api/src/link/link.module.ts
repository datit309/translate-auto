import {CacheModule, Module} from '@nestjs/common';
import { LinkService } from './link.service';
import { LinkController } from './link.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {UserEntity, UserEntitySchema} from "../user/entities/user.entity";
import {LinkEntity, LinkEntitySchema} from "./entities/link.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserEntity.name, schema: UserEntitySchema },
      { name: LinkEntity.name, schema: LinkEntitySchema },
    ]),
    CacheModule.register(),
  ],
  controllers: [LinkController],
  providers: [LinkService]
})
export class LinkModule {}
