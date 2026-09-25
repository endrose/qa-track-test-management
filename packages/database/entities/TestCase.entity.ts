import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Project } from './Project.entity.js';

@Entity('test_cases')
export class TestCase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'Draft' })
  status: string;

  @Column({ default: 'Medium' })
  priority: string;

  @ManyToOne(() => Project, { nullable: true })
  project: Project;

  @Column({ default: 'Functional' })
  testType: string; // 'Functional', 'Smoke Test', 'Regression Test'

  @Column({ default: 'none' })
  automationType: string; // 'none' | 'script' | 'data-driven'

  @Column({ nullable: true })
  automationTool: string; // 'playwright' | 'cypress'

  @Column({ nullable: true })
  automationScript: string; // e.g., '01-login.spec.ts'

  @Column({ type: 'json', nullable: true })
  automationConfig: any; // JSON payload for data-driven tests

  // --- API Testing Fields ---
  @Column({ nullable: true })
  endpointUrl: string;

  @Column({ nullable: true })
  httpMethod: string;

  @Column({ type: 'json', nullable: true })
  headers: any;

  @Column({ type: 'text', nullable: true })
  requestBody: string;

  @Column({ type: 'int', nullable: true })
  expectedStatus: number;

  @Column({ type: 'json', nullable: true })
  expectedSchema: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
