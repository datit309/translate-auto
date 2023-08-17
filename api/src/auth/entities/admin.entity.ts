import { Document, SchemaTypes } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { AuthGroupEntity } from './group.entity';

@Schema({ versionKey: false, collection: 'admins' })
export class AuthAdminEntity {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false, default: true })
  is_active: boolean;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: AuthGroupEntity.name,
  })
  @Type(() => AuthGroupEntity)
  group_id: AuthGroupEntity;
}

export type AuthAdminEntityDocument = AuthAdminEntity & Document;
export const AuthAdminEntitySchema =
  SchemaFactory.createForClass(AuthAdminEntity);
