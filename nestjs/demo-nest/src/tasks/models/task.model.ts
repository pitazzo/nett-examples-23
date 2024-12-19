export class Task {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly isCompleted: boolean,
    readonly category: 'HOME' | 'WORK' | 'FAMILY',
    readonly priority: 'LOW' | 'MEDIUM' | 'HIGH',
  ) {}
}
