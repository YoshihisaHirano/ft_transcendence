import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { authenticator } from 'otplib';
import { UserService } from 'src/user/services/user/user.service';
import { toDataURL, toFileStream } from 'qrcode';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async login(login: string) {
    const payload = { login: login };
    return this.jwtService.sign(payload);
  }
  async loginWith2fa(login: string, code: string, is2FaAuthenticated: boolean) {
    const payload = {
      login: login,
      code: code,
      is2FaAuthenticated: is2FaAuthenticated,
    };
    return this.jwtService.sign(payload);
  }
  async generateTwoFactorAuthenticationSecret(login: string) {
    const secret = authenticator.generateSecret();
    await this.userService.setTwoFactorAuthSecret(secret, login);
    return authenticator.keyuri(login, 'transcendence', secret);
  }
  async generateQrCodeDataURL(otpAuthUrl: string) {
    return toDataURL(otpAuthUrl);
  }
  public async pipeQrCodeStream(stream: Response, otpAuthUrl: string) {
    return toFileStream(stream, otpAuthUrl);
  }
  isTwoFactorAuthCodeValid(twoFactorAuthCode: string, userCode: string) {
    return authenticator.verify({
      token: twoFactorAuthCode,
      secret: userCode,
    });
  }
}
