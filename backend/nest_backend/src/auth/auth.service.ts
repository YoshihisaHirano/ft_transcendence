import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(login: string) {
    const payload = { login: login };
    return this.jwtService.sign(payload);
  }
}
