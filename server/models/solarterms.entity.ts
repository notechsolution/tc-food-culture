import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import BaseEntity from './BaseDefinition';

@Schema({ collection: 'solarterms',timestamps: true })
export class SolarTermsEntity extends BaseEntity{
  _id?: string;
  @Prop()
  seq: number;
  @Prop()
  name: string;
  @Prop()
  englishName: string;
  @Prop()
  description: string;
  @Prop()
  season: string;
  @Prop()
  image: Buffer;

}

const SessionSchema = SchemaFactory.createForClass(SolarTermsEntity);

export const name = SolarTermsEntity.name;
export const schema = SessionSchema;
