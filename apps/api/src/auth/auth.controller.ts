import { Controller, Post, Body, Get, Delete, Param, Put, HttpCode, HttpStatus, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }
    return {
      token: 'mock-jwt-token-' + user.id,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
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
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('users/:id/password')
  async changePassword(
    @Param('id') id: string,
    @Body() body: { currentPassword: string; newPassword: string }
  ) {
    try {
      return await this.authService.changePassword(id, body.currentPassword, body.newPassword);
    } catch (e: any) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('users/:id')
  async removeUser(@Param('id') id: string) {
    return this.authService.removeUser(id);
  }
}
