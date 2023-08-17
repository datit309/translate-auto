import { SetupGroupEntity } from './group.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Type } from 'class-transformer';

@Schema({ versionKey: false, collection: 'admins' })
export class SetupAdminEntity {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false, default: true })
  is_active: boolean;

  @Prop({ type: SchemaTypes.ObjectId, ref: SetupGroupEntity.name })
  @Type(() => SetupGroupEntity)
  group_id: SetupGroupEntity;
}

export type SetupAdminEntityDocument = SetupAdminEntity & Document;
export const SetupAdminEntitySchema =
  SchemaFactory.createForClass(SetupAdminEntity);
