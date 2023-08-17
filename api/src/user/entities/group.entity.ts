import { AuthRoleEntity } from './role.entity';
import { Document, SchemaTypes } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';

@Schema({ versionKey: false, collection: 'groups' })
export class AuthGroupEntity {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: () => AuthRoleEntity }],
  })
  @Type(() => AuthRoleEntity)
  roles: AuthRoleEntity;
}

export type AuthGroupEntityDocument = AuthGroupEntity & Document;
export const AuthGroupEntitySchema =
  SchemaFactory.createForClass(AuthGroupEntity);
