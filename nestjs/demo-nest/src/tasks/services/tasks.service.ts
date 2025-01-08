import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from 'src/tasks/dtos/create-task.dto';
import { TaskDto } from 'src/tasks/dtos/task.dto';
import { Task } from 'src/tasks/models/task.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TasksService {
  tasks: Task[] = [
    {
      id: 'dfac6638-0551-420f-90c1-cda4eb9c01b1',
      title: 'Limpiar arena gato',
      isCompleted: true,
      priority: 'HIGH',
      category: 'FAMILY',
    },
    {
      id: '32598e7f-9f32-4c91-8f88-057906e9b854',
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
      uuidv4(),
      createTaskDto.title,
      false,
      createTaskDto.category,
      createTaskDto.priority,
    );

    this.tasks.push(task);

    return task;
  }

  deleteTask(id: string): void {
    const index = this.tasks.findIndex((task) => task.id === id);

    if (index === -1) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    this.tasks = this.tasks.filter((task) => task.id !== id);
  }
}
