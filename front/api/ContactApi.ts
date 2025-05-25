import api from './index';
import {
    CreateContactDto,
    UpdateContactDto,
    Contact,
} from '@/shared/types/api';

export class ContactApi {
    static async create(dto: CreateContactDto): Promise<Contact> {
        const res = await api.post<Contact>('/contacts', dto);
        return res.data;
    }

    static async getByTemplate(templateId: string): Promise<Contact[]> {
        const res = await api.get<Contact[]>(`/contacts/template/${templateId}`);
        return res.data;
    }

    static async update(id: string, dto: UpdateContactDto): Promise<Contact> {
        const res = await api.patch<Contact>(`/contacts/${id}`, dto);
        return res.data;
    }

    static async delete(id: string): Promise<{ success: boolean }> {
        const res = await api.delete<{ success: boolean }>(`/contacts/${id}`);
        return res.data;
    }
}
