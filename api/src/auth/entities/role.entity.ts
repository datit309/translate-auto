import { Document, SchemaTypes } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AuthGroupEntity } from './group.entity';
import { Type } from 'class-transformer';

@Schema({ versionKey: false, collection: 'roles' })
export class AuthRoleEntity {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  key: string;

  // @Prop({
  //   type: [{ type: SchemaTypes.ObjectId, ref: () => AuthGroupEntity }],
  // })
  // @Type(() => AuthGroupEntity)
  // groups: AuthGroupEntity;
}

export type AuthRoleEntityDocument = AuthRoleEntity & Document;
export const AuthRoleEntitySchema =
  SchemaFactory.createForClass(AuthRoleEntity);
