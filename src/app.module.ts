import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { UsersModule } from './users/users.module';

@Module({
   imports: [
      MongooseModule.forRoot('mongodb://localhost:27017', {
         dbName: 'tasks-db',
         onConnectionCreate: (connection: Connection) => {
            connection.on('connected', () => console.log(`DB connected on ${connection.host}`));
         },
      }),
      TasksModule,
      UsersModule,
   ],
   controllers: [AppController],
   providers: [AppService],
})
export class AppModule {}
