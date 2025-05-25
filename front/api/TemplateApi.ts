import api from './index';
import {
    CreateMessageTemplateDto,
    UpdateMessageTemplateDto,
    MessageTemplate,
} from '@/shared/types/api';

export class TemplateApi {
    static async create(dto: CreateMessageTemplateDto): Promise<MessageTemplate> {
        const res = await api.post<MessageTemplate>('/templates', dto);
        return res.data;
    }

    static async getAll(): Promise<MessageTemplate[]> {
        const res = await api.get<MessageTemplate[]>('/templates/my');
        return res.data;
    }

    static async getById(id: string): Promise<MessageTemplate> {
        const res = await api.get<MessageTemplate>(`/templates/${id}`);
        return res.data;
    }

    static async update(id: string, dto: UpdateMessageTemplateDto): Promise<MessageTemplate> {
        const res = await api.patch<MessageTemplate>(`/templates/${id}`, dto);
        return res.data;
    }

    static async delete(id: string): Promise<{ success: boolean }> {
        const res = await api.delete<{ success: boolean }>(`/templates/${id}`);
        return res.data;
    }
}
