// src/alerts/entities/alert.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chain: string;

  @Column()
  targetPrice: number;

  @Column()
  email: string;

  @CreateDateColumn()
  createdAt: Date;
}
