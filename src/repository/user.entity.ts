import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

enum UserRole {
  admin = 'admin',
  user = 'user',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar', length: 20 })
  name: string;

  @Column({ unique: true, type: 'varchar', length: 50 })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ unique: true, type: 'text' })
  salt: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.user,
  })
  role: UserRole;

  @Column({ type: 'text' })
  avatar: string;
}
