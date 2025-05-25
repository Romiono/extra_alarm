
export type TokenResponse = {
    accessToken: string;
    refreshToken: string
};

export type User = {
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
};

export type RegisterDto = {
    email: string;
    password: string;
};

export type LoginDto = {
    email: string;
    password: string;
};

export type CreateContactDto = {
    type: 'email' | 'sms';
    value: string;
    template_id: string;
};

export type UpdateContactDto = Partial<Pick<CreateContactDto, 'type' | 'value'>>;

export type Contact = {
    id: string;
    type: 'email' | 'sms';
    value: string;
    template_id: string;
    user_id: string;
    createdAt: string;
    updatedAt: string;
};

export type CreateMessageTemplateDto = {
    name: string;
    message_body: string;
    include_location: boolean;
};

export type UpdateMessageTemplateDto = Partial<CreateMessageTemplateDto>;

export type MessageTemplate = {
    id: string;
    name: string;
    message_body: string;
    include_location: boolean;
    user_id: string;
    createdAt: string;
    updatedAt: string;
};
