import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: (() => {
        const secret = process.env.JWT_SECRET || 'default_secret';
        return secret;
      })(),
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
    role: string;
  }): Promise<(User & { role: string }) | null> {
    const user = await this.userRepository.findOne({
      where: {
        id: payload.sub,
      },
    });
    if (!user) {
      return null;
    }
    // Retornar el usuario con el campo role del payload
    return { ...user, role: payload.role as 'user' | 'admin' };
  }
}
