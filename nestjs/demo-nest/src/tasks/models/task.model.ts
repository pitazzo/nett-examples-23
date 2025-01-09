export class Task {
  constructor(
    readonly id: string,
    public title: string,
    public summary: string,
    public translation: string,
    public isCompleted: boolean,
    public category: 'HOME' | 'WORK' | 'FAMILY',
    public priority: 'LOW' | 'MEDIUM' | 'HIGH',
  ) {}
}
