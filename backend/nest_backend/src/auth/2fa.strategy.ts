import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import * as process from 'process';
import * as dotenv from 'dotenv';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/services/user/user.service';
dotenv.config();

@Injectable()
export class TwoFaJwtStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_CODE,
    });
  }
  async validate(payload) {
    const user = await this.userService.findUserByLogin(payload.login);
    if (user == null) {
      return payload.login;
    }
    if (!user.twoFactorAuthIsEnabled) {
      return user;
    }
    if (payload.is2FaAuthenticated) {
      return user;
    }
  }
}
