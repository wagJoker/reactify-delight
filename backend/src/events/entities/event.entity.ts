/**
 * @module backend/events/entities/event.entity
 */
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  date: string;

  @Column()
  time: string;

  @Column()
  location: string;

  @Column({ default: 'other' })
  category: string;

  @Column({ default: 'public' })
  visibility: string;

  @Column()
  organizerId: string;

  @Column({ default: 50 })
  maxParticipants: number;

  @Column('simple-array', { default: '' })
  participants: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
