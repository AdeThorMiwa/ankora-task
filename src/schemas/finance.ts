import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSchema } from 'mongoose';
import { User } from './user';

export type FinanceDocument = Finance & Document;

@Schema()
export class Finance {
  @Prop({ required: true, type: MSchema.Types.ObjectId, ref: 'User' })
  owner: User | string;

  @Prop({ required: true, type: Number })
  id: number;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  url: string;

  @Prop({ required: true, type: Boolean })
  isPaid: boolean;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ required: true, type: Number })
  numSubscribers: number;

  @Prop({ required: true, type: Number })
  numReviews: number;

  @Prop({ required: true, type: Number })
  numPublishedLectures: number;

  @Prop({ required: true, type: String })
  instructionalLevel: string;

  @Prop({ required: true, type: String })
  contentInfo: string;

  @Prop({ required: true, type: String })
  publishedTime: string;

  @Prop({ required: false, type: String })
  IsPaid: string;

  @Prop({ required: false, type: Number })
  Total: number;

  @Prop({ required: false, type: String })
  Column1: string;
}

export const FinanceSchema = SchemaFactory.createForClass(Finance);
