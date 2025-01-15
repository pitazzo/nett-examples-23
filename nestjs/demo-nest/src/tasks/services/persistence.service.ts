import { Injectable } from '@nestjs/common';
import { Database } from 'sqlite3';
import { Task } from 'src/tasks/models/task.model';

@Injectable()
export class PersistenceService {
  private db: Database;

  constructor() {
    this.db = new Database('tasks.db');
    this.init();
  }

  private async init() {
    this.db.run(
      `CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        summary TEXT NOT NULL,
        translation TEXT NOT NULL,
        isCompleted INTEGER NOT NULL,
        category TEXT NOT NULL,
        priority TEXT NOT NULL
      )`,
    );
  }

  async fetchAllTasks(): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      this.db.all(`SELECT * FROM tasks`, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        const tasks = rows.map(
          (row) =>
            new Task(
              row['id'],
              row['title'],
              row['summary'],
              row['translation'],
              row['isCompleted'] === 1,
              row['category'],
              row['priority'],
            ),
        );

        resolve(tasks);
      });
    });
  }

  async filterTasksByCompletness(isCompleted: boolean): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM tasks WHERE isCompleted = ?`,
        [isCompleted],
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }

          const tasks = rows.map(
            (row) =>
              new Task(
                row['id'],
                row['title'],
                row['summary'],
                row['translation'],
                row['isCompleted'] === 1,
                row['category'],
                row['priority'],
              ),
          );

          resolve(tasks);
        },
      );
    });
  }

  async save(task: Task): Promise<Task> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO tasks (id, title, summary, translation, isCompleted, category, priority)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           title = excluded.title,
           summary = excluded.summary,
           translation = excluded.translation,
           isCompleted = excluded.isCompleted,
           category = excluded.category,
           priority = excluded.priority`,
        [
          task.id,
          task.title,
          task.summary,
          task.translation,
          task.isCompleted,
          task.category,
          task.priority,
        ],
        (err) => {
          if (err) {
            reject(err);
            return;
          }

          this.findTaskById(task.id).then((task) => resolve(task));
        },
      );
    });
  }

  async findTaskById(id: string): Promise<Task | null> {
    return new Promise((resolve, reject) => {
      this.db.get(`SELECT * FROM tasks WHERE id = ?`, [id], (err, row) => {
        if (err) return reject(err);

        if (!row) {
          resolve(null);
          return;
        }

        const savedTask = new Task(
          row['id'],
          row['title'],
          row['summary'],
          row['translation'],
          !!row['isCompleted'],
          row['category'],
          row['priority'],
        );
        resolve(savedTask);
      });
    });
  }
}
