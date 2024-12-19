import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from 'src/tasks/dtos/create-task.dto';
import { TaskDto } from 'src/tasks/dtos/task.dto';
import { Task } from 'src/tasks/models/task.model';

@Injectable()
export class TasksService {
  tasks: Task[] = [
    {
      id: 'abc-1',
      title: 'Limpiar arena gato',
      isCompleted: true,
      priority: 'HIGH',
      category: 'FAMILY',
    },
    {
      id: 'abc-2',
      title: 'Sacar pasear al perro',
      isCompleted: false,
      priority: 'HIGH',
      category: 'FAMILY',
    },
  ];

  fetchAllTasks(): TaskDto[] {
    return this.tasks;
  }

  fetchCompletedTasks(): TaskDto[] {
    return this.tasks.filter((task) => task.isCompleted);
  }

  fetchPendingTasks(): TaskDto[] {
    return this.tasks.filter((task) => !task.isCompleted);
  }

  createTask(createTaskDto: CreateTaskDto): TaskDto {
    const task = new Task(
      '123',
      createTaskDto.title,
      false,
      createTaskDto.category,
      createTaskDto.priority,
    );

    this.tasks.push(task);

    return task;
  }
}
