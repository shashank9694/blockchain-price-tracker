// src/prices/entities/price.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Price {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chain: string;

  @Column('decimal', { precision: 18, scale: 8 })
  price: number;

  @CreateDateColumn()
  timestamp: Date;
}
