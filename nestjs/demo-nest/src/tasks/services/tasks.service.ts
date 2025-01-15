import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from 'src/tasks/dtos/create-task.dto';
import { TaskDto } from 'src/tasks/dtos/task.dto';
import { UpdateTaskDto } from 'src/tasks/dtos/update-task.dto';
import { Task } from 'src/tasks/models/task.model';
import { PersistenceService } from 'src/tasks/services/persistence.service';
import { SummaryService } from 'src/tasks/services/summary.service';
import { TranslationService } from 'src/tasks/services/translation.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TasksService {
  constructor(
    private readonly summaryService: SummaryService,
    private readonly translationService: TranslationService,
    private readonly persistenceService: PersistenceService,
  ) {}

  async fetchAllTasks(): Promise<TaskDto[]> {
    return this.persistenceService.fetchAllTasks();
  }

  fetchCompletedTasks(): Promise<TaskDto[]> {
    return this.persistenceService.filterTasksByCompletness(true);
  }

  fetchPendingTasks(): Promise<TaskDto[]> {
    return this.persistenceService.filterTasksByCompletness(false);
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskDto> {
    const summary = await this.summaryService.summarize(createTaskDto.title);
    const translation = await this.translationService.translate(summary);

    const task = new Task(
      uuidv4(),
      createTaskDto.title,
      summary,
      translation,
      false,
      createTaskDto.category,
      createTaskDto.priority,
    );

    return this.persistenceService.save(task);
  }

  deleteTask(id: string): void {
    console.log(`haciendo como que borro la tarea ${id}...`);
  }

  async updateTask(uuid: string, dto: UpdateTaskDto): Promise<TaskDto> {
    const task = await this.persistenceService.findTaskById(uuid);

    if (!task) {
      throw new NotFoundException(`Task with id ${uuid} was not found`);
    }

    if (dto.category) {
      task.category = dto.category;
    }

    if (dto.priority) {
      task.priority = dto.priority;
    }

    if (dto.title) {
      task.title = dto.title;
    }

    return this.persistenceService.save(task);
  }

  async complete(uuid: string): Promise<TaskDto> {
    const task = await this.persistenceService.findTaskById(uuid);

    if (!task) {
      throw new NotFoundException(`Task with id ${uuid} was not found`);
    }

    if (task.isCompleted) {
      throw new BadRequestException(
        `Task with id ${uuid} is already completed`,
      );
    }

    task.isCompleted = true;

    return this.persistenceService.save(task);
  }
}
