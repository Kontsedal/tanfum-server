import { MailerService } from '@nestjs-modules/mailer';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './auth-dto/authCredentialsDto.dto';
import { RegistartionToken } from './entity/registrationToken.entity';
import { JwtPayload } from './auth-dto/jwt-payload.interface';
import { User } from 'src/repository/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private mailSenderService: MailerService,
    private jwtService: JwtService,
    @InjectRepository(RegistartionToken)
    private readonly registrationTokenRepository: Repository<RegistartionToken>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { name, password, email } = authCredentialsDto;
    const payload: JwtPayload = { username: name };
    const token = this.jwtService.sign(payload);
    const salt = await bcrypt.genSalt();
    const registrationTokenEntity = this.registrationTokenRepository.create({
      password: await this.hashPassword(password, salt),
      token,
      email,
      salt,
      name,
    });
    try {
      await this.registrationTokenRepository.save(registrationTokenEntity);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email or name already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }

    await this.mailSenderService.sendMail({
      to: email, // list of receivers
      from: 'noreply@nestjs.com', // sender address
      subject: 'Confirm-link', // Subject line
      text: this.generateConfirmLink(token), // plaintext body
      html: '<b>welcome</b>', // HTML body content
    });
  }

  public async confirmAccountCreation(authToken: string) {
    const userRegistrationToken = await this.registrationTokenRepository.findOne(
      { token: authToken },
    );
    const user = this.userRepository.create({
      name: userRegistrationToken.name,
      email: userRegistrationToken.email,
      password: userRegistrationToken.password,
      salt: userRegistrationToken.salt,
    });
    await this.userRepository.save(user);
  }

  private generateConfirmLink(token: string): string {
    return `localhost:3000/auth/sign-up/confirm?token=${token}`;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
