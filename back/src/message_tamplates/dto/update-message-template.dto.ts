import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateMessageTemplateDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  message_body?: string;

  @IsBoolean()
  @IsOptional()
  include_location?: boolean;
}
