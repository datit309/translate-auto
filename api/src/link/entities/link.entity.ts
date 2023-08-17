import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Type } from 'class-transformer';
import * as paginate from 'mongoose-paginate-v2';
import {UserEntity} from "../../user/entities/user.entity";

@Schema({ versionKey: false, collection: 'links', timestamps: true })
export class LinkEntity {
    @Prop({
        required: false,
        type: SchemaTypes.ObjectId,
        ref: UserEntity.name,
    })
    @Type(() => UserEntity)
    user_id: UserEntity;

    @Prop({ required: false, default: null })
    domain: string;

    @Prop({ required: true, default: null })
    origin_link: string;

    @Prop({ required: false, default: null })
    short_link: string;

    @Prop({ required: false, default: null })
    date_expires: string;

    @Prop({ required: false, default: null })
    password: string;

    @Prop({ required: false, default: false })
    is_password: boolean;

    @Prop({ required: false, default: null })
    counter: number;
}

export type LinkEntityDocument = LinkEntity & Document;
export const LinkEntitySchema = SchemaFactory.createForClass(LinkEntity);
LinkEntitySchema.plugin(paginate);
