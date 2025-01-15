import { Module } from '@nestjs/common';
import { TasksController } from 'src/tasks/controllers/tasks.controller';
import { AIService } from 'src/tasks/services/ai.service';
import { PersistenceService } from 'src/tasks/services/persistence.service';
import { SummaryService } from 'src/tasks/services/summary.service';
import { TasksService } from 'src/tasks/services/tasks.service';
import { TranslationService } from 'src/tasks/services/translation.service';

@Module({
  controllers: [TasksController],
  providers: [
    TasksService,
    SummaryService,
    TranslationService,
    AIService,
    PersistenceService,
  ],
})
export class TasksModule {}
