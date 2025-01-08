import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTaskDto } from 'src/tasks/dtos/create-task.dto';
import { TaskDto } from 'src/tasks/dtos/task.dto';
import { UpdateTaskDto } from 'src/tasks/dtos/update-task.dto';
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

  @Delete(':id')
  deleteTask(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksServices.deleteTask(id);
  }

  @Patch(':id')
  updateTask(
    @Param('id', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateTaskDto,
  ): TaskDto {
    return this.tasksServices.updateTask(uuid, dto);
  }

  @Patch(':id/complete')
  complete(@Param('id', ParseUUIDPipe) uuid: string): TaskDto {
    return this.tasksServices.complete(uuid);
  }
}
