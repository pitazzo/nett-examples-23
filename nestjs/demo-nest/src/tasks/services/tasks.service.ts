import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from 'src/tasks/dtos/create-task.dto';
import { TaskDto } from 'src/tasks/dtos/task.dto';
import { UpdateTaskDto } from 'src/tasks/dtos/update-task.dto';
import { Task } from 'src/tasks/models/task.model';
import { SummaryService } from 'src/tasks/services/summary.service';
import { TranslationService } from 'src/tasks/services/translation.service';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    private readonly summaryService: SummaryService,
    private readonly translationService: TranslationService,
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
  ) {}

  async fetchAllTasks(): Promise<TaskDto[]> {
    return this.taskRepository.find();
  }

  fetchCompletedTasks(): Promise<TaskDto[]> {
    return this.taskRepository.find({ where: { isCompleted: true } });
  }

  fetchPendingTasks(): Promise<TaskDto[]> {
    return this.taskRepository.find({ where: { isCompleted: false } });
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskDto> {
    const summary = await this.summaryService.summarize(createTaskDto.title);
    const translation = await this.translationService.translate(summary);

    return this.taskRepository.save({
      title: createTaskDto.title,
      summary: summary,
      translation: translation,
      category: createTaskDto.category,
      priority: createTaskDto.priority,
    });
  }

  async deleteTask(id: string): Promise<void> {
    await this.taskRepository.delete({ id: id });
  }

  async updateTask(uuid: string, dto: UpdateTaskDto): Promise<TaskDto> {
    const task = await this.taskRepository.findOneBy({ id: uuid });

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

    return this.taskRepository.save(task);
  }

  async complete(uuid: string): Promise<TaskDto> {
    const task = await this.taskRepository.findOneBy({ id: uuid });

    if (!task) {
      throw new NotFoundException(`Task with id ${uuid} was not found`);
    }

    if (task.isCompleted) {
      throw new BadRequestException(
        `Task with id ${uuid} is already completed`,
      );
    }

    task.isCompleted = true;

    return this.taskRepository.save(task);
  }
}
