import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppConfig } from 'database';

@Injectable()
export class AppConfigService {
  constructor(
    @InjectRepository(AppConfig)
    private configRepo: Repository<AppConfig>,
  ) {}

  async get(key: string): Promise<string | null> {
    const record = await this.configRepo.findOne({ where: { key } });
    return record?.value ?? null;
  }

  async set(key: string, value: string): Promise<void> {
    await this.configRepo.save({ key, value });
  }

  async getAll(): Promise<Record<string, string>> {
    const records = await this.configRepo.find();
    return records.reduce((acc, r) => ({ ...acc, [r.key]: r.value }), {});
  }
}
