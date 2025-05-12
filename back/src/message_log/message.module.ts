import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MessageTemplate } from '../message_tamplates/message_templates.model';
import { Contact } from '../contacts/contact.model';
import { MessageLog } from './message-log.model';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { NotificationModule } from '../notification/notification.module';

@Module({
    imports: [SequelizeModule.forFeature([MessageTemplate, Contact, MessageLog]), NotificationModule],
    providers: [MessageService],
    controllers: [MessageController],
})
export class MessageModule {}
