import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  HasMany,
  BelongsTo,
} from 'sequelize-typescript';
import { CreationOptional } from 'sequelize';
import { User } from '../users/user.model';
import { Contact } from '../contacts/contact.model';
import { MessageLog } from '../message_log/message-log.model';

interface TemplateCreationAttrs {
  user_id: string;
  name: string;
  message_body: string;
  include_location: boolean;
}

@Table({ tableName: 'message_templates' })
export class MessageTemplate extends Model<
  MessageTemplate,
  TemplateCreationAttrs
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: CreationOptional<string>;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  user_id: string;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.TEXT)
  message_body: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  include_location: boolean;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  created_at: CreationOptional<Date>;

  @BelongsTo(() => User)
  user: User; // Связь с пользователем

  @HasMany(() => Contact)
  contacts: Contact[]; // Связь с контактами

  @HasMany(() => MessageLog)
  messageLogs: MessageLog[]; // Связь с логами сообщений
}
