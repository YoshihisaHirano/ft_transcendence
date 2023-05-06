import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
  Response
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/services/user/user.service';
import { request } from 'express';
import JwtTwoFactorGuard from './jwt-2fa-guard';

@Controller('2fa')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/login')
  async userLogin(@Body('login') login: string) {
    const user = await this.userService.findUserByLogin(login);
    if (user != null) {
      if (user.twoFactorAuthIsEnabled) {
        return {
          auth: '2fa',
          id: user.id,
          token: null,
        };
      }
    }
    let userId;
    if (user == null) {
      userId = null;
    }
    else {
      userId = user.id;
    }
    const token = await this.authService.login(login);
    return {
      auth: 'jwt',
      id: userId,
      token: token,
    };
  }
  //@UseGuards(JwtTwoFactorGuard)
  @Post('generate')
  async register(@Body('login') login: string, @Res() response: Response) {
    const otpAuthUrl =
      await this.authService.generateTwoFactorAuthenticationSecret(login);
    return this.authService.pipeQrCodeStream(response, otpAuthUrl);
  }
  @UseGuards(JwtTwoFactorGuard)
  @Post('switch')
  async switchTwoFactorAuthentication(
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
    await this.userService.switchTwoFactorAuth(login, !user.twoFactorAuthIsEnabled);
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
