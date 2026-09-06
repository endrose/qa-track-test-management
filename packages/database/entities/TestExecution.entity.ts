import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { TestCase } from './TestCase.entity.js';
import { User } from './User.entity.js';

@Entity('test_executions')
export class TestExecution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'Not Run' })
  status: string;

  @Column({ nullable: true })
  comments: string;

  @ManyToOne(() => TestCase, { nullable: true })
  testCase: TestCase;

  @ManyToOne(() => User, { nullable: true })
  executedBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
