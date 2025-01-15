import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  Request,
} from '@nestjs/common';
import { CreateTaskDto } from 'src/tasks/dtos/create-task.dto';
import { TaskDto } from 'src/tasks/dtos/task.dto';
import { UpdateTaskDto } from 'src/tasks/dtos/update-task.dto';
import { TasksService } from 'src/tasks/services/tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksServices: TasksService) {}

  @Get()
  async getAllTasks(@Req() req: Request): Promise<TaskDto[]> {
    if (req.headers['authorization'] !== process.env.API_KEY) {
      throw new ForbiddenException(
        'Please provide a valid API KEY in header authorization',
      );
    }

    return this.tasksServices.fetchAllTasks();
  }

  @Get('pending')
  getPendingTasks(@Req() req: Request): Promise<TaskDto[]> {
    if (req.headers['authorization'] !== process.env.API_KEY) {
      throw new ForbiddenException(
        'Please provide a valid API KEY in header authorization',
      );
    }
    return this.tasksServices.fetchPendingTasks();
  }

  @Get('completed')
  getCompletedTasks(@Req() req: Request): Promise<TaskDto[]> {
    if (req.headers['authorization'] !== process.env.API_KEY) {
      throw new ForbiddenException(
        'Please provide a valid API KEY in header authorization',
      );
    }
    return this.tasksServices.fetchCompletedTasks();
  }

  @Post()
  createTask(@Req() req: Request, @Body() createTaskDto: CreateTaskDto) {
    if (req.headers['authorization'] !== process.env.API_KEY) {
      throw new ForbiddenException(
        'Please provide a valid API KEY in header authorization',
      );
    }
    return this.tasksServices.createTask(createTaskDto);
  }

  @Delete(':id')
  deleteTask(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    if (req.headers['authorization'] !== process.env.API_KEY) {
      throw new ForbiddenException(
        'Please provide a valid API KEY in header authorization',
      );
    }
    return this.tasksServices.deleteTask(id);
  }

  @Patch(':id')
  updateTask(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<TaskDto> {
    if (req.headers['authorization'] !== process.env.API_KEY) {
      throw new ForbiddenException(
        'Please provide a valid API KEY in header authorization',
      );
    }
    return this.tasksServices.updateTask(uuid, dto);
  }

  @Patch(':id/complete')
  complete(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) uuid: string,
  ): Promise<TaskDto> {
    if (req.headers['authorization'] !== process.env.API_KEY) {
      throw new ForbiddenException(
        'Please provide a valid API KEY in header authorization',
      );
    }
    return this.tasksServices.complete(uuid);
  }
}
