import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false, collection: 'roles' })
export class SetupRoleEntity {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  key: string;
}

export type SetupRoleEntityDocument = SetupRoleEntity & Document;
export const SetupRoleEntitySchema =
  SchemaFactory.createForClass(SetupRoleEntity);
