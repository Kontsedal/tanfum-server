import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/repository/user.repository';
import { MailerModule } from '@nestjs-modules/mailer/dist/mailer.module';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

@Module({
  imports: [
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
    TypeOrmModule.forFeature([UserRepository]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
