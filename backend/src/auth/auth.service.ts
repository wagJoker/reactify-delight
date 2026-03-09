/**
 * @module backend/auth/auth.service
 * @description Бизнес-логика аутентификации (SRP)
 */
import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email уже зарегистрирован');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      ...dto,
      password: hashedPassword,
    });

    const saved = await this.userRepo.save(user);
    const token = this.jwtService.sign({ sub: saved.id, email: saved.email });

    return {
      user: { id: saved.id, email: saved.email, name: saved.name, avatar: saved.avatar },
      token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return {
      user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar },
      token,
    };
  }

  async updateAvatar(userId: string, avatarUrl: string | null) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Пользователь не найден');
    user.avatar = avatarUrl;
    const saved = await this.userRepo.save(user);
    return { id: saved.id, email: saved.email, name: saved.name, avatar: saved.avatar };
  }
}
