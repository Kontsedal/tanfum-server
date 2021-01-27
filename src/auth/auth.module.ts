import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer/dist/mailer.module';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RegistartionToken } from './entity/registrationToken.entity';
import { User } from '../repository/user.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'secret',
      signOptions: {
        expiresIn: 3600,
      },
    }),
    MailerModule.forRootAsync({
      useFactory: () => {
        return {
          transport: {
            host: process.env.MAILER_HOST,
            port: process.env.MAILER_PORT,
            defaults: {
              from: '"nest-modules" <modules@nestjs.com>',
            },
            template: {
              dir: __dirname + '/templates',
              adapter: new PugAdapter(),
              options: {
                strict: true,
              },
            },
          },
        };
      },
    }),
    TypeOrmModule.forFeature([RegistartionToken, User]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
