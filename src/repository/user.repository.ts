import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from '../auth/auth-dto/authCredentialsDto.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  // async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
  //   const { name, password } = authCredentialsDto;

  //   const user = new User();
  //   user.name = name;
  //   user.password = password;
  //   try {
  //     await user.save();
  //   } catch (exception) {
  //     if (exception.code === '23505') {
  //       throw new ConflictException('Username already exist');
  //     } else {
  //       throw new InternalServerErrorException();
  //     }
  //   }
  // }
}
