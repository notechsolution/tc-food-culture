import { Prop } from '@nestjs/mongoose';

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
