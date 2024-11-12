import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SubtaskDocument = HydratedDocument<Subtask>;

@Schema({ timestamps: true })
export class Subtask {
   @Prop({ required: true })
   title: string;

   @Prop()
   description: string;

   @Prop({ default: false })
   completed: boolean;

   @Prop({ type: Types.ObjectId, ref: 'Task', required: true })
   taskID: Types.ObjectId;

   @Prop({ type: Date, default: Date.now })
   createdAt: Date;

   @Prop()
   updatedAt: Date;
}

export const SubtaskSchema = SchemaFactory.createForClass(Subtask);
