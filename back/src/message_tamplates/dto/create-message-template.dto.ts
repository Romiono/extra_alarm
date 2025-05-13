import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  message_body: string;

  @IsBoolean()
  include_location: boolean;
}
