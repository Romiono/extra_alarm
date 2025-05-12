import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Contact } from './contact.model';
import { MessageTemplate } from '../message_tamplates/message_templates.model';
import { ContactService } from './contact.sevice';
import { ContactController } from './contact.controller';

@Module({
    imports: [SequelizeModule.forFeature([Contact, MessageTemplate])],
    controllers: [ContactController],
    providers: [ContactService],
})
export class ContactModule {}
