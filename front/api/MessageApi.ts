import api from './index';

// MessageApi.ts
export class MessageApi {
    static async send(templateId: string, location?: { latitude: number; longitude: number }): Promise<{ success: boolean }> {
        const res = await api.post<{ success: boolean }>(`/messages/send/${templateId}`, location ?? {});
        return res.data;
    }
}

