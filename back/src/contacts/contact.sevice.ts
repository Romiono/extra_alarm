import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Contact } from './contact.model';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { MessageTemplate } from '../message_tamplates/message_templates.model';

@Injectable()
export class ContactService {
    constructor(
        @InjectModel(Contact) private contactModel: typeof Contact,
        @InjectModel(MessageTemplate) private templateModel: typeof MessageTemplate,
    ) {}

    private async checkOwnership(template_id: string, user_id: string) {
        const template = await this.templateModel.findOne({ where: { id: template_id, user_id } });
        if (!template) throw new ForbiddenException('Access denied to this template');
    }

    async create(userId: string, dto: CreateContactDto) {
        await this.checkOwnership(dto.template_id, userId);
        return this.contactModel.create(dto);
    }

    async findByTemplate(templateId: string, userId: string): Promise<Contact[]> {
        await this.checkOwnership(templateId, userId);
        return this.contactModel.findAll({ where: { template_id: templateId } });
    }

    async update(id: string, userId: string, dto: UpdateContactDto) {
        const contact = await this.contactModel.findByPk(id);
        if (!contact) throw new NotFoundException('Contact not found');

        await this.checkOwnership(contact.template_id, userId);
        return contact.update(dto);
    }

    async delete(id: string, userId: string) {
        const contact = await this.contactModel.findByPk(id);
        if (!contact) throw new NotFoundException('Contact not found');

        await this.checkOwnership(contact.template_id, userId);
        await contact.destroy();
    }
}
