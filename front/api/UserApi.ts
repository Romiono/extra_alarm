import api from './index';
import { User } from '@/shared/types/api';

export class UserApi {
    static async getAll(): Promise<User[]> {
        const res = await api.get<User[]>('/users');
        return res.data;
    }

    static async getById(id: string): Promise<User> {
        const res = await api.get<User>(`/users/${id}`);
        return res.data;
    }

    static async getByEmail(email: string): Promise<User> {
        const res = await api.get<User>(`/users/email/${email}`);
        return res.data;
    }

    static async delete(id: string): Promise<{ success: boolean }> {
        const res = await api.delete<{ success: boolean }>(`/users/${id}`);
        return res.data;
    }
}
