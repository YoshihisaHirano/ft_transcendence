import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities';
import { authenticator } from 'otplib';
import { UserService } from 'src/user/services/user/user.service';
import { toDataURL } from 'qrcode';

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
  async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(
      user.username,
      'transcendence',
      secret,
    );
    await this.userService.setTwoFactorAuthSecret(secret, user.id);
    return {
      secret,
      otpAuthUrl,
    };
  }
  async generateQrCodeDataURL(otpAuthUrl: string) {
    return toDataURL(otpAuthUrl);
  }
  isTwoFactorAuthCodeValid(twoFactorAuthCode: string, user: User) {
    return authenticator.verify({
      token: twoFactorAuthCode,
      secret: user.twoFactorAuthSecret,
    });
  }
}
