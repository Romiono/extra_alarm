import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../users/user.model';
import { MessageTemplate } from '../message_tamplates/message_templates.model';

@Table
export class MessageLog extends Model {
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  user_id: string;

  @ForeignKey(() => MessageTemplate)
  @Column(DataType.UUID)
  template_id: string;

  @Column(DataType.TEXT)
  full_message: string;

  @Column(DataType.JSONB)
  recipients: { type: 'email' | 'sms'; value: string }[];

  @Column(DataType.DATE)
  sent_at: Date;

  @BelongsTo(() => User)
  user: User; // Связь с пользователем

  @BelongsTo(() => MessageTemplate)
  messageTemplate: MessageTemplate; // Связь с шаблоном
}
