import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserEntity) private repo: Repository<UserEntity>) {}

  findByPhone(phone: string) {
    return this.repo.findOne({ where: { phone } });
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async upsertByPhone(phone: string, name: string, role: UserEntity['role']) {
    const existing = await this.findByPhone(phone);
    if (existing) return existing;
    const user = this.repo.create({ phone, name: name || 'User', role: role || 'CONSUMER' });
    return this.repo.save(user);
  }

  async upsertByEmail(email: string, name: string, role: UserEntity['role']) {
    const existing = await this.findByEmail(email);
    if (existing) return existing;

    const user = this.repo.create({
      email,
      phone: `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      name: name || 'User',
      role: role || 'CONSUMER'
    });

    // Ensure the user is properly saved
    const savedUser = await this.repo.save(user);
    return savedUser;
  }

  async updatePassword(id: string, password: string) {
    await this.repo.update(id, { password });
    return this.repo.findOne({ where: { id } });
  }

  async updateProfile(id: string, data: { name?: string; email?: string }) {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } });
  }
}
