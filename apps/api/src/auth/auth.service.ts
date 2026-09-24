import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'database';
import * as bcrypt from 'bcrypt';
import { Resend } from 'resend';

const SALT_ROUNDS = 12;

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

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

    if (isValid) {
      let needsSave = false;

      // Update status if Pending
      if (user.status === 'Pending') {
        user.status = 'Active';
        needsSave = true;
      }

      if (needsSave) {
        await this.usersRepository.save(user);
      }
      return user;
    }

    return null;
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

    const savedUser = await this.usersRepository.save(user);

    // Send email via Resend if configured
    if (process.env.MAIL_RESEND_KEY) {
      try {
        const resend = new Resend(process.env.MAIL_RESEND_KEY);
        await resend.emails.send({
          from: 'QATrack <onboarding@resend.dev>', // resend.dev is allowed for testing
          to: email,
          subject: 'You have been invited to QATrack',
          html: `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 40px 20px;">
              <div style="background-color: #ffffff; border: 4px solid #000000; border-radius: 0; padding: 30px; box-shadow: 8px 8px 0px #000000;">
                <h1 style="color: #000000; margin-top: 0; font-size: 28px; text-transform: uppercase; font-weight: 900; letter-spacing: -0.05em; border-bottom: 4px solid #000000; padding-bottom: 15px; margin-bottom: 25px;">
                  WELCOME TO QATRACK
                </h1>
                
                <p style="color: #000000; font-size: 16px; font-weight: 600; line-height: 1.5; margin-bottom: 25px;">
                  You have been invited to join QATrack as a <span style="background-color: #fde047; padding: 2px 6px; border: 2px solid #000000;">${role}</span>.
                </p>

                <div style="background-color: #f0edef; border: 3px solid #000000; padding: 20px; margin-bottom: 30px;">
                  <p style="margin: 0 0 15px 0; color: #000000; font-weight: 800; text-transform: uppercase; font-size: 14px;">Your Login Credentials:</p>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 10px; border: 2px solid #000000; background-color: #ffffff; font-weight: bold; width: 100px;">Email</td>
                      <td style="padding: 10px; border: 2px solid #000000; background-color: #ffffff;">${email}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px; border: 2px solid #000000; background-color: #ffffff; font-weight: bold;">Password</td>
                      <td style="padding: 10px; border: 2px solid #000000; background-color: #ffffff; font-family: monospace; font-size: 16px;">${defaultPassword}</td>
                    </tr>
                  </table>
                </div>

                <a href="http://localhost:5173/login" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 15px 25px; font-weight: bold; text-transform: uppercase; font-size: 16px; border: 2px solid #000000; box-shadow: 4px 4px 0px #000000; transition: all 0.2s; margin-bottom: 20px;">
                  LOGIN TO QATRACK
                </a>

                <p style="color: #000000; font-size: 14px; font-weight: 600; margin-top: 10px;">Please login and change your password immediately.</p>
              </div>
              
              <div style="margin-top: 30px; text-align: center;">
                <p style="color: #000000; font-size: 12px; font-weight: 700; text-transform: uppercase;">© QATrack Test Management Platform</p>
              </div>
            </div>
          `
        });
        console.log(`Invite email sent to ${email} via Resend`);
      } catch (err) {
        console.error('Failed to send invite email:', err);
      }
    }

    return savedUser;
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
