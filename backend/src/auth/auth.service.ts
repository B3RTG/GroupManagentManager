import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';

interface LoginDto {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(data: RegisterDto): Promise<{ user: User; token: string }> {
    const exists = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (exists) throw new Error('Email ya registrado');
    const hashed: string = await bcrypt.hash(data.password, 10);
    const user = this.userRepository.create({
      email: data.email,
      username: data.username,
      password: hashed,
    });
    await this.userRepository.save(user);
    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { user, token };
  }

  async login(data: LoginDto): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (!user) throw new Error('Usuario no encontrado');
    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) throw new UnauthorizedException('Usuario y/o contraseña incorrectos');
    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { user, token };
  }

  async validateOrCreateSocialUser(socialUser: {
    email: string;
    name: string;
    provider: 'google' | 'facebook';
    googleId?: string;
    facebookId?: string;
  }): Promise<{ user: User; token: string }> {
    let user = await this.userRepository.findOne({
      where: { email: socialUser.email },
    });
    if (!user) {
      user = this.userRepository.create({
        email: socialUser.email,
        name: socialUser.name,
        username: socialUser.email,
        password: '', // Usuario social, sin contraseña
        googleId: socialUser.googleId,
        facebookId: socialUser.facebookId,
        provider: socialUser.provider,
      });
      await this.userRepository.save(user);
    } else {
      // Actualiza campos sociales si el usuario ya existe
      user.googleId = socialUser.googleId ?? user.googleId;
      user.facebookId = socialUser.facebookId ?? user.facebookId;
      user.provider = socialUser.provider ?? user.provider;
      await this.userRepository.save(user);
    }
    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { user, token };
  }
}
