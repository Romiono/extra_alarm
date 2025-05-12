import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import { MessageTemplateService } from './message_templates.service';
import { CreateMessageTemplateDto } from './dto/create-message-template.dto';
import { UpdateMessageTemplateDto } from './dto/update-message-template.dto';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('templates')
export class MessageTemplateController {
    constructor(private readonly templateService: MessageTemplateService) {}

    @Post()
    create(@Body() dto: CreateMessageTemplateDto, @Request() req) {
        return this.templateService.create(req.user.id, dto);
    }

    @Get('my')
    findAll(@Request() req) {
        return this.templateService.findAllByUser(req.user.id);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.templateService.findOneById(id, req.user.id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateMessageTemplateDto, @Request() req) {
        return this.templateService.update(id, req.user.id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.templateService.delete(id, req.user.id);
    }
}
