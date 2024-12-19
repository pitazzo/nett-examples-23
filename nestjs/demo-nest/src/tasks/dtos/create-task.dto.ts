export interface CreateTaskDto {
  title: string;
  category: 'HOME' | 'WORK' | 'FAMILY';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}
