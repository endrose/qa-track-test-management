import { Controller, Post, Body, Get, Delete, Param } from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      return { error: 'Invalid credentials' };
    }
    return {
      token: 'mock-jwt-token-' + user.id,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  }

  @Get('users')
  async getUsers() {
    return this.authService.getUsers();
  }

  @Post('users/invite')
  async inviteUser(@Body() body: { email: string; role: string }) {
    try {
      return await this.authService.inviteUser(body.email, body.role);
    } catch (e: any) {
      return { error: e.message };
    }
  }

  @Delete('users/:id')
  async removeUser(@Param('id') id: string) {
    return this.authService.removeUser(id);
  }
}
