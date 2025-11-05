import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';

import { RegisterDto } from './dto/register.dto';
import { plainToInstance } from 'class-transformer';
import { AuthUserResponseDto } from './dto/auth-user-response.dto';
import { User } from '../users/entities/user.entity';
import { Console } from 'console';

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
  ) { }

  async register(data: RegisterDto): Promise<{ user: AuthUserResponseDto; token: string }> {
    const exists = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (exists) throw new ConflictException('Email ya registrado');
    const hashed: string = await bcrypt.hash(data.password, 10);
    const user = this.userRepository.create({
      email: data.email,
      username: data.username,
      name: data.name,
      password: hashed,
    });
    await this.userRepository.save(user);
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    const userResponse = plainToInstance(AuthUserResponseDto, user, { excludeExtraneousValues: true });
    return { user: userResponse, token };
  }

  async login(data: LoginDto): Promise<{ user: AuthUserResponseDto; token: string }> {
    if (!data || !data.email || !data.password)
      throw new UnauthorizedException('Usuario y/o contraseña incorrectos');

    const user = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid)
      throw new UnauthorizedException('Usuario y/o contraseña incorrectos');

    // Actualizar el campo lastLogin
    user.lastLogin = new Date();
    await this.userRepository.save(user);

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    const userResponse = plainToInstance(AuthUserResponseDto, user, { excludeExtraneousValues: true });
    return { user: userResponse, token };
  }

  async validateOrCreateSocialUser(socialUser: {
    email: string;
    name: string;
    provider: 'google' | 'facebook';
    googleId?: string;
    facebookId?: string;
  }): Promise<{ user: AuthUserResponseDto; token: string }> {
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
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    const userResponse = plainToInstance(AuthUserResponseDto, user, { excludeExtraneousValues: true });
    return { user: userResponse, token };
  }

  async validateGoogleToken(idToken: string): Promise<{ email: string; name: string; googleId: string }> {
    // 1. Validar el idToken con Google
    let data: any;
    try {
      const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
      data = response.data;
    } catch (err) {
      throw new UnauthorizedException('Token de Google inválido (no se pudo verificar con Google)');
    }
    if (!data || !data.email) {
      throw new UnauthorizedException('Token de Google inválido (sin email)');
    }
    // Validar el aud con el clientId de Google
    const expectedAud = process.env.GOOGLE_CLIENT_ID;
    if (!expectedAud || data.aud !== expectedAud) {
      throw new UnauthorizedException('El token de Google no es para este proyecto (aud no coincide)');
    }
    return {
      email: data.email,
      name: data.name || '',
      googleId: data.sub,
    };
  }

  async loginGoogleUser(idToken: string): Promise<{ user: AuthUserResponseDto; token: string }> {
    // 1. Validar el idToken con Google
    const data = await this.validateGoogleToken(idToken);

    // 2. Buscar el usuario
    const user = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (!user) {
      throw new UnauthorizedException('Usuario no registrado');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    const userResponse = plainToInstance(AuthUserResponseDto, user, { excludeExtraneousValues: true });
    return { user: userResponse, token };
  }

  async signUpGoogleUser(idToken: string): Promise<{ user: AuthUserResponseDto; token: string }> {
    // 1. Validar el idToken con Google
    const data = await this.validateGoogleToken(idToken);

    // 2. Buscar o crear usuario
    const socialUser = {
      email: data.email,
      name: data.name || '',
      provider: 'google' as const,
      googleId: data.googleId,
    };

    return this.validateOrCreateSocialUser(socialUser);
  }


}
