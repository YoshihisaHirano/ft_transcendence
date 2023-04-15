import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/services/user/user.service';
import { request } from 'express';

@Controller('2fa')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/login')
  async userLogin(@Body('login') login: string) {
    const user = await this.userService.findUserByLogin(login);
    if (user.twoFactorAuthIsEnabled) {
      return {
        auth: '2fa',
        id: user.id,
        token: null,
      };
    }
    const token = await this.authService.login(login);
    return {
      auth: 'jwt',
      id: user.id,
      token: token,
    };
  }
  @Post('generate')
  async register(@Body('login') login: string, @Res() response: Response) {
    const otpAuthUrl =
      await this.authService.generateTwoFactorAuthenticationSecret(login);
    return this.authService.pipeQrCodeStream(response, otpAuthUrl);
  }
  @Post('turn-on')
  async turnOnTwoFactorAuthentication(
    @Body('code') code: string,
    @Body('login') login: string,
  ) {
    const user = await this.userService.findUserByLogin(login);
    const isCodeValid = this.authService.isTwoFactorAuthCodeValid(
      code,
      user.twoFactorAuthSecret,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.userService.turnOnTwoFactorAuth(login);
  }
  @Post('authenticate')
  async authenticate(@Body('code') code: string, @Body('login') login: string) {
    const user = await this.userService.findUserByLogin(login);
    const isCodeValid = this.authService.isTwoFactorAuthCodeValid(
      code,
      user.twoFactorAuthSecret,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    return {
      id: user.id,
      token: await this.authService.loginWith2fa(login, code, true),
    };
  }
}
