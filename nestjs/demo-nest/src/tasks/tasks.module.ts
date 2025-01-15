import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from 'src/tasks/controllers/tasks.controller';
import { Task } from 'src/tasks/models/task.model';
import { AIService } from 'src/tasks/services/ai.service';
import { SummaryService } from 'src/tasks/services/summary.service';
import { TasksService } from 'src/tasks/services/tasks.service';
import { TranslationService } from 'src/tasks/services/translation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TasksController],
  providers: [TasksService, SummaryService, TranslationService, AIService],
})
export class TasksModule {}
