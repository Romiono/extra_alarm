import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.sevice';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwt: JwtService,
        private config: ConfigService,
    ) {}

    async register(email: string, password: string) {
        const user = await this.usersService.createUser(email, password);
        return this.generateTokens(user.id, user.email);
    }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new UnauthorizedException('User not found');
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new UnauthorizedException('Invalid password');
        return user;
    }

    async login(email: string, password: string) {
        const user = await this.validateUser(email, password);
        return this.generateTokens(user.id, user.email);
    }

    async generateTokens(userId: string, email: string) {
        const payload = { sub: userId, email };

        const accessToken = await this.jwt.signAsync(payload, {
            secret: this.config.get('JWT_SECRET'),
            expiresIn: this.config.get('JWT_EXPIRES_IN'),
        });

        const refreshToken = await this.jwt.signAsync(payload, {
            secret: this.config.get('REFRESH_SECRET'),
            expiresIn: this.config.get('REFRESH_EXPIRES_IN'),
        });

        return {
            accessToken,
            refreshToken,
        };
    }
}
