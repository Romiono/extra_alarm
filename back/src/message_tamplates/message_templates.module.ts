import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MessageTemplate } from './message_templates.model';
import { MessageTemplateService } from './message_templates.service';
import { MessageTemplateController } from './message_templates.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/jwt.strategy';
import { User } from '../users/user.model';

@Module({
  imports: [SequelizeModule.forFeature([MessageTemplate, User]), JwtModule],
  controllers: [MessageTemplateController],
  providers: [MessageTemplateService, JwtStrategy],
})
export class MessageTemplateModule {}
