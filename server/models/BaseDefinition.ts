import { Prop } from '@nestjs/mongoose';
import { now } from 'mongoose';

export default class BaseEntity {
    @Prop()
    createdBy: string;
    @Prop()
    updatedBy: string;
    @Prop()
    createdAt: Date;
    @Prop()
    updatedAt: Date;
}
