import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateContactDto {
  @IsEnum(['email', 'sms'])
  @IsOptional()
  type?: 'email' | 'sms';

  @IsString()
  @IsOptional()
  value?: string;
}
