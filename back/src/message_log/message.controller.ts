import {
  Controller,
  Post,
  Param,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post('send/:templateId')
  send(
    @Param('templateId') templateId: string,
    @Request() req,
    @Body() body: { latitude?: number; longitude?: number },
  ) {
    return this.messageService.sendMessage(templateId, req.user.id, body);
  }
}
