import { Controller, Post, Param, UseGuards, Request } from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MessageService } from './message.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post('send/:templateId')
  send(@Param('templateId') templateId: string, @Request() req) {
    return this.messageService.sendMessage(templateId, req.user.id);
  }
}
