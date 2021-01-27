import { Body, Controller, Post, Query, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './auth-dto/authCredentialsDto.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/sign-up/confirm')
  confirmAccountCreation(@Query('token') token: string) {
    return this.authService.confirmAccountCreation(token);
  }
}