import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';

// Модули
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MessageTemplateModule } from './message_tamplates/message_templates.module';
import { ContactModule } from './contacts/contact.module';
import { MessageModule } from './message_log/message.module';
import { NotificationModule } from './notification/notification.module';

// Модели
import { User } from './users/user.model';
import { MessageTemplate } from './message_tamplates/message_templates.model';
import { Contact } from './contacts/contact.model';
import { MessageLog } from './message_log/message-log.model';

const port = process.env.DB_PORT || '5432';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Поддержка .env

    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(port),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'sos_app',
      models: [User, MessageTemplate, Contact, MessageLog],
      autoLoadModels: true,
      synchronize: true, // ← создаёт таблицы автоматически
      logging: false,
    }),

    // Функциональные модули
    AuthModule,
    UsersModule,
    MessageTemplateModule,
    ContactModule,
    MessageModule,
    NotificationModule,
  ],
})
export class AppModule {}
