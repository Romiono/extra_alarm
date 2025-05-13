import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ContactService } from './contact.sevice';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('contacts')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post()
  create(@Body() dto: CreateContactDto, @Request() req) {
    return this.contactService.create(req.user.id, dto);
  }

  @Get('template/:templateId')
  getByTemplate(@Param('templateId') templateId: string, @Request() req) {
    return this.contactService.findByTemplate(templateId, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateContactDto,
    @Request() req,
  ) {
    return this.contactService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    return this.contactService.delete(id, req.user.id);
  }
}
