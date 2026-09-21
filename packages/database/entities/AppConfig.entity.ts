import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity()
export class AppConfig {
  @PrimaryColumn()
  key: string;

  @Column('text', { nullable: true })
  value: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
