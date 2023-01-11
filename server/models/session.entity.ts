import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import BaseEntity from './BaseDefinition';

@Schema({ collection: 'session',timestamps: true })
export class SessionEntity extends BaseEntity{
  _id?: string;
  @Prop()
  sid: string;
  @Prop()
  expires: Date;
  @Prop({ type:Object })
  session: any;
}

const SessionSchema = SchemaFactory.createForClass(SessionEntity);

export const name = SessionEntity.name;
export const schema = SessionSchema;
