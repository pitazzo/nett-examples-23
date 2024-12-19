export interface TaskDto {
  id: string;
  title: string;
  category: 'HOME' | 'WORK' | 'FAMILY';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  isCompleted: boolean;
}
