import { Module } from '@nestjs/common';
import { TasksController } from 'src/tasks/controllers/tasks.controller';
import { TasksService } from 'src/tasks/services/tasks.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
