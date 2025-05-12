import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MessageTemplate } from '../message_tamplates/message_templates.model';
import { Contact } from '../contacts/contact.model';
import { MessageLog } from './message-log.model';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class MessageService {
    constructor(
        @InjectModel(MessageTemplate) private templateModel: typeof MessageTemplate,
        @InjectModel(Contact) private contactModel: typeof Contact,
        @InjectModel(MessageLog) private logModel: typeof MessageLog,
        private notificationService: NotificationService,
    ) {}

    async sendMessage(templateId: string, userId: string): Promise<{ success: boolean }> {
        const template = await this.templateModel.findOne({
            where: { id: templateId, user_id: userId },
        });
        if (!template) throw new NotFoundException('Template not found');

        const contacts = await this.contactModel.findAll({ where: { template_id: templateId } });

        let message = template.message_body;
        if (template.include_location) {
            // Заглушка геолокации (можно получать с фронта)
            const fakeLocation = 'https://maps.google.com/?q=55.751244,37.618423';
            message += `\n[Геолокация: ${fakeLocation}]`;
        }

        for (const contact of contacts) {
            if (contact.type === 'email') {
                await this.notificationService.sendEmail(
                    contact.value,
                    'SOS Сигнал',
                    message,
                );
            } else if (contact.type === 'sms') {
                await this.notificationService.sendSMS(contact.value, message);
            }
        }

        await this.logModel.create({
            user_id: userId,
            template_id: template.id,
            full_message: message,
            recipients: contacts.map(c => ({ type: c.type, value: c.value })),
            sent_at: new Date(),
        });

        return { success: true };
    }
}
