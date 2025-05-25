import api from './index';

export class MessageApi {
    static async send(templateId: string): Promise<{ success: boolean }> {
        const res = await api.post<{ success: boolean }>(`/messages/send/${templateId}`);
        return res.data;
    }
}
