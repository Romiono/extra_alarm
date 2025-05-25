import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { RefreshStrategy } from './refresh.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.register({}), // will use dynamic registration in service
    ConfigModule,
  ],
  providers: [AuthService, JwtStrategy, RefreshStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
