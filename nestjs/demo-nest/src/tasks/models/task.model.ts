import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  readonly id: string;

  @Column()
  title: string;

  @Column()
  summary: string;

  @Column()
  translation: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column()
  category: 'HOME' | 'WORK' | 'FAMILY';

  @Column()
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}
