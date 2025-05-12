import {
    Table, Column, Model, DataType, PrimaryKey, Default, HasMany
} from 'sequelize-typescript';
import { CreationOptional } from 'sequelize';
import { MessageTemplate } from '../message_tamplates/message_templates.model';
import { MessageLog } from '../message_log/message-log.model';

interface UserCreationAttrs {
    email: string;
    password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id: CreationOptional<string>;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    email: string;

    @Column({ type: DataType.STRING, allowNull: false })
    password: string;

    @Default(DataType.NOW)
    @Column(DataType.DATE)
    created_at: CreationOptional<Date>;

    @HasMany(() => MessageTemplate)
    messageTemplates: MessageTemplate[]; // Связь с шаблонами

    @HasMany(() => MessageLog)
    messageLogs: MessageLog[]; // Связь с логами сообщений
}
