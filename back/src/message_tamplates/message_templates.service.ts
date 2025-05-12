import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MessageTemplate } from './message_templates.model';
import { CreateMessageTemplateDto } from './dto/create-message-template.dto';
import { UpdateMessageTemplateDto } from './dto/update-message-template.dto';

@Injectable()
export class MessageTemplateService {
    constructor(
        @InjectModel(MessageTemplate) private templateModel: typeof MessageTemplate,
    ) {}

    async create(userId: string, dto: CreateMessageTemplateDto): Promise<MessageTemplate> {
        return this.templateModel.create({ ...dto, user_id: userId });
    }

    async findAllByUser(userId: string): Promise<MessageTemplate[]> {
        return this.templateModel.findAll({ where: { user_id: userId } });
    }

    async findOneById(id: string, userId: string): Promise<MessageTemplate> {
        const template = await this.templateModel.findOne({ where: { id, user_id: userId } });
        if (!template) throw new NotFoundException('Template not found');
        return template;
    }

    async update(id: string, userId: string, dto: UpdateMessageTemplateDto): Promise<MessageTemplate> {
        const template = await this.findOneById(id, userId);
        return template.update(dto);
    }

    async delete(id: string, userId: string): Promise<void> {
        const template = await this.findOneById(id, userId);
        await template.destroy();
    }
}
