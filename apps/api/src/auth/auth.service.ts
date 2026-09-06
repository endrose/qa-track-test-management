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

  async getUsers() {
    return this.usersRepository.find({ order: { createdAt: 'DESC' } });
  }

  async inviteUser(email: string, role: string) {
    const existing = await this.usersRepository.findOne({ where: { email } });
    if (existing) {
      throw new Error('User already exists');
    }
    
    // Create new user with default password
    const user = this.usersRepository.create({
      email,
      name: email.split('@')[0],
      role,
      passwordHash: 'password123', // Default password as per Option A
      status: 'Pending',
    });
    
    return this.usersRepository.save(user);
  }

  async removeUser(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (user) {
      return this.usersRepository.remove(user);
    }
    return null;
  }
}
