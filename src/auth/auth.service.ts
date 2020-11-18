import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { AuthCredentialsDto } from './auth-dto/authCredentialsDto.dto';

@Injectable()
export class AuthService {
  constructor(private mailSenderService: MailerService) {}
  async sendConfirmEmail(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    console.log('Hi');
    const { name, password, email } = authCredentialsDto;
    const result = await this.mailSenderService.sendMail({
      to: email, // list of receivers
      from: 'noreply@nestjs.com', // sender address
      subject: 'Testing Nest MailerModule ✔', // Subject line
      text: 'welcome', // plaintext body
      html: '<b>welcome</b>', // HTML body content
    });
    console.log(result);
    return;
  }
}
