import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { AuthGroupEntity } from './group.entity';
import { Type } from 'class-transformer';
import * as paginate from 'mongoose-paginate-v2';

@Schema({ versionKey: false, collection: 'users', timestamps: true })
export class UserEntity {
  @Prop({ required: true, unique: true, lowercase: true})
  username: string;

  @Prop({ required: false, default: null })
  password: string;

  @Prop({ required: false, default: null, lowercase: true })
  email: string;

  @Prop({ required: false, default: null })
  first_name: string;

  @Prop({ required: false, default: null })
  last_name: string;

  @Prop({ required: false, default: null })
  wallet_address: string;

  @Prop({ required: false, default: null })
  phone_number: string;

  @Prop({ required: false, default: null })
  address: string;

  @Prop({ required: false, default: null, unique: true })
  token: string;

  @Prop({ required: false, default: null })
  is_online: boolean;

  @Prop({ required: false, default: 'L', uppercase: true })
  user_type: string;

  // check login
  @Prop({ required: false, default: null })
  login_after: string;

  @Prop({ required: false, default: null })
  last_login: string;

  // 2FA
  @Prop({ required: false, default: null })
  two_factor: string;

  @Prop({ required: false, default: null })
  two_factor_ts: number;

  @Prop({ required: false, default: false })
  two_factor_enabled: boolean;

  @Prop({ required: false, default: 'ACTIVE', uppercase: true })
  status: string;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: AuthGroupEntity.name,
  })
  @Type(() => AuthGroupEntity)
  group_id: AuthGroupEntity;

  // @Prop({ type: SchemaTypes.ObjectId, ref: BotEntity.name })
  // @Type(() => BotEntity)
  // bot_id: BotEntity;
}

export type UserEntityDocument = UserEntity & Document;
export const UserEntitySchema = SchemaFactory.createForClass(UserEntity);
UserEntitySchema.plugin(paginate);
