import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { CreationOptional } from 'sequelize';
import { MessageTemplate } from '../message_tamplates/message_templates.model';

interface ContactCreationAttrs {
  template_id: string;
  type: 'email' | 'sms';
  value: string;
}

@Table({ tableName: 'contacts' })
export class Contact extends Model<Contact, ContactCreationAttrs> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: CreationOptional<string>;

  @ForeignKey(() => MessageTemplate)
  @Column(DataType.UUID)
  template_id: string;

  @Column(DataType.ENUM('email', 'sms'))
  type: 'email' | 'sms';

  @Column(DataType.STRING)
  value: string;

  @BelongsTo(() => MessageTemplate)
  messageTemplate: MessageTemplate; // Связь с шаблоном
}
