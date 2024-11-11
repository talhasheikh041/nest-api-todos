import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TodoDocument = HydratedDocument<Todo>;

@Schema({ timestamps: true })
export class Todo {
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

export const TodoSchema = SchemaFactory.createForClass(Todo);
