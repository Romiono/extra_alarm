import {
  Controller,
  Get,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.sevice';
import { User } from './user.model';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<{ success: boolean }> {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException('User not found');
    await user.destroy();
    return { success: true };
  }
}
