import api from './index';
import { LoginDto, RegisterDto, TokenResponse } from '@/shared/types/api';

export class AuthApi {
    private static accessToken: TokenResponse;
    static async register(dto: RegisterDto): Promise<TokenResponse> {
        const res = await api.post<TokenResponse>('/auth/register', dto);
        return res.data;
    }

    static async login(dto: LoginDto): Promise<any> {
        const res = await api.post<TokenResponse>('/auth/login', dto);
        return res.data;
    }
}
