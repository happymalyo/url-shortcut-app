import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  originalUrl: string;

  @Column({ type: 'varchar', length: 10, unique: true, name: 'short_code' })
  shortCode: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'int', default: 0 })
  visitCount: number;
}
