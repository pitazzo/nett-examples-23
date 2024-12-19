import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTaskDto } from 'src/tasks/dtos/create-task.dto';
import { TaskDto } from 'src/tasks/dtos/task.dto';
import { TasksService } from 'src/tasks/services/tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksServices: TasksService) {}

  @Get()
  getAllTasks(): TaskDto[] {
    return this.tasksServices.fetchAllTasks();
  }

  @Get('pending')
  getPendingTasks(): TaskDto[] {
    return this.tasksServices.fetchPendingTasks();
  }

  @Get('completed')
  getCompletedTasks(): TaskDto[] {
    return this.tasksServices.fetchCompletedTasks();
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksServices.createTask(createTaskDto);
  }
}
