import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'database';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Create a default admin user on startup
  async onModuleInit() {
    const admin = await this.usersRepository.findOne({ where: { email: 'admin@qatrack.com' } });
    if (!admin) {
      await this.usersRepository.save({
        email: 'admin@qatrack.com',
        passwordHash: 'password', // In real app, this should be hashed
        name: 'Admin User',
        role: 'Admin'
      });
    }
  }

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && user.passwordHash === pass) {
      return user;
    }
    return null;
  }
}
