import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Type } from 'class-transformer';
import * as paginate from 'mongoose-paginate-v2';
import {UserEntity} from "./user.entity";

@Schema({ versionKey: false, collection: 'assets', timestamps: true })
export class AssetEntity {
  // check login
  @Prop({ required: false, default: null })
  symbol: string;

  @Prop({ required: false, default: 0 })
  balance: number;

  @Prop({ required: false, default: 'ACTIVE', uppercase: true })
  status: string;

  @Prop({ required: false, default: 'L', uppercase: true })
  type: string;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: UserEntity.name,
  })
  @Type(() => UserEntity)
  user_id: UserEntity;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: UserEntity.name,
  })
  @Type(() => UserEntity)
  username: UserEntity;
}

export type AssetEntityDocument = AssetEntity & Document;
export const AssetEntitySchema = SchemaFactory.createForClass(AssetEntity);
AssetEntitySchema.plugin(paginate);
