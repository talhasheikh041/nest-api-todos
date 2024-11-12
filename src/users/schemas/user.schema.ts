import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
   @Prop({ required: true })
   name: string;

   @Prop({ required: true, unique: true })
   email: string;

   @Prop({ type: [{ type: Types.ObjectId, ref: 'Task' }] }) // Referencing Task IDs
   tasks: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
