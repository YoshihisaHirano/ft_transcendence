import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { TwoFaJwtStrategy } from './2fa.strategy';
dotenv.config();

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_CODE,
      signOptions: { expiresIn: '1d' },
    }),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, TwoFaJwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
