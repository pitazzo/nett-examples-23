import { Module } from '@nestjs/common';
import { TasksController } from 'src/tasks/controllers/tasks.controller';
import { SummaryService } from 'src/tasks/services/summary.service';
import { TasksService } from 'src/tasks/services/tasks.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, SummaryService],
})
export class TasksModule {}
