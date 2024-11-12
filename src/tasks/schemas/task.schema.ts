import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {
   @Prop()
   title: string;

   @Prop()
   description: string;

   @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
   assignedUsers: Types.ObjectId[];

   @Prop({
      type: [{ key: String, url: String }],
      default: [],
   })
   attachments: { key: string; url: string }[];

   @Prop({ default: false })
   completed: boolean;

   @Prop({ type: [{ type: Types.ObjectId, ref: 'Subtask' }] })
   subtasks: Types.ObjectId[];

   @Prop({ type: Date, default: Date.now })
   createdAt: Date;

   @Prop()
   updatedAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
