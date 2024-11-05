import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Module({
  imports: [
    TodosModule,
    MongooseModule.forRoot('mongodb://localhost:27017', {
      dbName: 'todos',
      onConnectionCreate: (connection: Connection) => {
        connection.on('connected', () =>
          console.log(`DB connected on ${connection.host}`),
        );
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
