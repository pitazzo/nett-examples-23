import { IsIn, MinLength } from 'class-validator';

export class CreateTaskDto {
  @MinLength(3)
  title: string;

  @IsIn(['HOME', 'WORK', 'FAMILY'])
  category: 'HOME' | 'WORK' | 'FAMILY';

  @IsIn(['LOW', 'MEDIUM', 'HIGH'])
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}
