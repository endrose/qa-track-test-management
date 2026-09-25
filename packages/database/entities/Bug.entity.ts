import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Project } from './Project.entity.js';
import { TestCase } from './TestCase.entity.js';

@Entity('bugs')
export class Bug {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'Open' })
  status: string;

  @Column({ default: 'Major' })
  severity: string;

  @ManyToOne(() => Project, { nullable: true })
  project: Project;

  @ManyToOne(() => TestCase, { nullable: true, onDelete: 'CASCADE' })
  testCase: TestCase;

  @Column({ nullable: true })
  rootCauseCategory: string;

  @Column({ type: 'text', nullable: true })
  rootCauseDescription: string;

  @Column({ type: 'json', nullable: true })
  logAttachments: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
