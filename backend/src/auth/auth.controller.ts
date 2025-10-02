export interface SocialUser {
  email: string;
  name: string;
  provider: 'google' | 'facebook';
  googleId?: string;
  facebookId?: string;
}

import { Controller, Get, Req, UseGuards, Body, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

export class RegisterDto {
  email: string;
  password: string;
  username?: string;
}

export class LoginDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(): Promise<void> {
    // Redirige a Google para autenticación
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(
    @Req() req: Express.Request & { user?: SocialUser },
  ): Promise<{ user: SocialUser; token: string }> {
    if (!req.user) throw new Error('No user info from Google');
    const { user, token } = await this.authService.validateOrCreateSocialUser(
      req.user as SocialUser,
    );
    return { user, token };
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(): Promise<void> {
    // Redirige a Facebook para autenticación
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthCallback(
    @Req() req: Express.Request & { user?: SocialUser },
  ): Promise<{ user: SocialUser; token: string }> {
    if (!req.user) throw new Error('No user info from Facebook');
    const { user, token } = await this.authService.validateOrCreateSocialUser(
      req.user as SocialUser,
    );
    return { user, token };
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    // Lógica de registro, delegada al servicio
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    // Lógica de login, delegada al servicio
    return this.authService.login(body);
  }
}
