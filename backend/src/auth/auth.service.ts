import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

interface RegisterDto {
  email: string;
  password: string;
  username?: string;
}

interface LoginDto {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  private users: Array<{
    id: string;
    email: string;
    username?: string;
    password: string;
    name?: string;
    preferredSports?: string[];
  }> = [];

  constructor(private readonly jwtService: JwtService) {}

  async register(data: RegisterDto): Promise<{ user: any; token: string }> {
    const exists = this.users.find((u) => u.email === data.email);
    if (exists) throw new Error('Email ya registrado');
    // Hashear contraseña
    const hashed: string = await bcrypt.hash(data.password, 10);
    const user = {
      id: (Math.random() * 100000).toFixed(0),
      email: data.email,
      username: data.username,
      password: hashed,
    };
    this.users.push(user);
    // Generar JWT
    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return {
      user: { id: user.id, email: user.email, username: user.username },
      token,
    };
  }

  async login(data: LoginDto): Promise<{ user: any; token: string }> {
    const user = this.users.find((u) => u.email === data.email);
    if (!user) throw new Error('Usuario no encontrado');
    const valid: boolean = await bcrypt.compare(data.password, user.password);
    if (!valid) throw new Error('Contraseña incorrecta');
    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return {
      user: { id: user.id, email: user.email, username: user.username },
      token,
    };
  }

  async validateOrCreateSocialUser(profile: {
    email: string;
    name: string;
    provider: 'google' | 'facebook';
    googleId?: string;
    facebookId?: string;
  }): Promise<{
    user: {
      email: string;
      name: string;
      provider: 'google' | 'facebook';
      googleId?: string;
      facebookId?: string;
    };
    token: string;
  }> {
    const user = {
      email: profile.email,
      name: profile.name,
      provider: profile.provider,
      googleId: profile.googleId,
      facebookId: profile.facebookId,
    };
    const socialId = profile.googleId || profile.facebookId;
    const token = this.jwtService.sign({
      sub: socialId,
      email: user.email,
    });
    return { user, token };
  }
}
