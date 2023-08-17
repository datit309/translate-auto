import { Model, Table } from 'sequelize-typescript';
import { SetupRoleEntity } from './role.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Type } from 'class-transformer';

@Schema({ versionKey: false, collection: 'groups' })
export class SetupGroupEntity extends Model {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: () => SetupRoleEntity }],
  })
  @Type(() => SetupRoleEntity)
  roles: SetupRoleEntity;
}

export type SetupGroupEntityDocument = SetupGroupEntity & Document;
export const SetupGroupEntitySchema =
  SchemaFactory.createForClass(SetupGroupEntity);
