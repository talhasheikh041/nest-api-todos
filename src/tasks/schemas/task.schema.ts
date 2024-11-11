import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {
   @Prop()
   title: string;

   @Prop()
   description: string;

   @Prop({ default: false })
   completed: boolean;

   @Prop({ default: Date.now })
   createdAt: Date;

   @Prop()
   updatedAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
