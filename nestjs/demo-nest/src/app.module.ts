import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/tasks/models/task.model';

@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'tasks.db',
      entities: [Task],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
