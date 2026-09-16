import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'database';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Create a default admin user on startup (with bcrypt-hashed password)
  async onModuleInit() {
    const admin = await this.usersRepository.findOne({ where: { email: 'admin@qatrack.com' } });
    if (!admin) {
      const passwordHash = await bcrypt.hash('password', SALT_ROUNDS);
      await this.usersRepository.save({
        email: 'admin@qatrack.com',
        passwordHash,
        name: 'Admin User',
        role: 'Admin',
        status: 'Active',
      });
    } else if (!admin.passwordHash.startsWith('$2')) {
      // Migrate plaintext password to bcrypt hash on next startup
      admin.passwordHash = await bcrypt.hash(admin.passwordHash, SALT_ROUNDS);
      await this.usersRepository.save(admin);
    }
  }

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) return null;

    // Support both bcrypt hashed and legacy plaintext (migration period)
    let isValid = false;
    if (user.passwordHash.startsWith('$2')) {
      isValid = await bcrypt.compare(pass, user.passwordHash);
    } else {
      // Legacy plaintext comparison — then migrate to hash
      isValid = user.passwordHash === pass;
      if (isValid) {
        user.passwordHash = await bcrypt.hash(pass, SALT_ROUNDS);
        await this.usersRepository.save(user);
      }
    }

    return isValid ? user : null;
  }

  async getUsers() {
    const users = await this.usersRepository.find({ order: { createdAt: 'DESC' } });
    // Never expose passwordHash to the client
    return users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      status: u.status,
      createdAt: u.createdAt,
    }));
  }

  async inviteUser(email: string, role: string) {
    const existing = await this.usersRepository.findOne({ where: { email } });
    if (existing) {
      throw new Error('User already exists');
    }

    const defaultPassword = 'password123';
    const passwordHash = await bcrypt.hash(defaultPassword, SALT_ROUNDS);

    const user = this.usersRepository.create({
      email,
      name: email.split('@')[0],
      role,
      passwordHash,
      status: 'Pending',
    });

    return this.usersRepository.save(user);
  }

  async changePassword(id: string, currentPassword: string, newPassword: string) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new Error('User not found');

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) throw new Error('Current password is incorrect');

    user.passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await this.usersRepository.save(user);
    return { success: true };
  }

  async removeUser(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (user) {
      return this.usersRepository.remove(user);
    }
    return null;
  }
}
