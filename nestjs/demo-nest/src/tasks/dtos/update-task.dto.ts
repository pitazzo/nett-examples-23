import { IsIn, IsOptional, MinLength } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @MinLength(3)
  title: string | undefined;

  @IsOptional()
  @IsIn(['HOME', 'WORK', 'FAMILY'])
  category: 'HOME' | 'WORK' | 'FAMILY' | undefined;

  @IsOptional()
  @IsIn(['LOW', 'MEDIUM', 'HIGH'])
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | undefined;
}
