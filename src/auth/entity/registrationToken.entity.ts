import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../repository/user.entity';

@Entity()
export class RegistartionToken {
  @PrimaryGeneratedColumn()
  @OneToOne(() => User, (user) => user.id)
  userId: number;

  @Column({ unique: true, type: 'varchar', length: 20 })
  name: string;

  @Column({ type: 'text' })
  token: string;

  @Column({ unique: true, type: 'varchar', length: 50 })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ unique: true, type: 'text' })
  salt: string;
}
