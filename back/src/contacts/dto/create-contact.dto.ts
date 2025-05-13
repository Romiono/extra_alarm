import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateContactDto {
  @IsEnum(['email', 'sms'])
  type: 'email' | 'sms';

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsString()
  @IsNotEmpty()
  template_id: string;
}
