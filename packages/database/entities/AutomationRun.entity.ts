import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Project } from './Project.entity.js';

@Entity('automation_runs')
export class AutomationRun {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  suiteName: string;

  @Column({ default: 'Running' })
  status: string;

  @Column({ type: 'int', default: 0 })
  passed: number;

  @Column({ type: 'int', default: 0 })
  failed: number;

  @Column({ default: 'Playwright' })
  framework: string;

  @Column({ type: 'text', nullable: true })
  log: string;

  @ManyToOne(() => Project, { nullable: true })
  project: Project;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
