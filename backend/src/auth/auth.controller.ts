export interface SocialUser {
  email: string;
  name: string;
  provider: 'google' | 'facebook';
  googleId?: string;
  facebookId?: string;
}

import { Controller, Get, Req, UseGuards, Body, Post } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiTags, ApiBearerAuth, ApiBody, ApiResponse, ApiOperation } from '@nestjs/swagger';

// ...existing code...

import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@email.com' })
  email: string;

  @ApiProperty({ example: 'password123' })
  password: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('google')
  @ApiOperation({ summary: 'Redirige a Google para autenticación OAuth' })
  @UseGuards(AuthGuard('google'))
  async googleAuth(): Promise<void> {
    // Redirige a Google para autenticación
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Callback de Google OAuth' })
  @ApiResponse({ status: 200, description: 'Usuario autenticado vía Google y token JWT.' })
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(
    @Req() req: Express.Request & { user?: SocialUser },
  ): Promise<{ user: SocialUser; token: string }> {
    if (!req.user) throw new Error('No user info from Google');
    const { user, token } = await this.authService.validateOrCreateSocialUser(
      req.user as SocialUser,
    );
    // Construir SocialUser combinando datos del usuario y el provider
    const socialUser: SocialUser = {
      email: user.email,
      name: user.name ?? '',
      provider: 'google',
      googleId: req.user.googleId,
    };
    return { user: socialUser, token };
  }

  @Get('facebook')
  @ApiOperation({ summary: 'Redirige a Facebook para autenticación OAuth' })
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(): Promise<void> {
    // Redirige a Facebook para autenticación
  }

  @Get('facebook/callback')
  @ApiOperation({ summary: 'Callback de Facebook OAuth' })
  @ApiResponse({ status: 200, description: 'Usuario autenticado vía Facebook y token JWT.' })
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthCallback(
    @Req() req: Express.Request & { user?: SocialUser },
  ): Promise<{ user: SocialUser; token: string }> {
    if (!req.user) throw new Error('No user info from Facebook');
    const { user, token } = await this.authService.validateOrCreateSocialUser(
      req.user as SocialUser,
    );
    // Construir SocialUser combinando datos del usuario y el provider
    const socialUser: SocialUser = {
      email: user.email,
      name: user.name ?? '',
      provider: 'facebook',
      facebookId: req.user.facebookId,
    };
    return { user: socialUser, token };
  }

  @Post('register')
  @ApiOperation({ summary: 'Registro de usuario local' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Usuario registrado correctamente.' })
  async register(@Body() body: RegisterDto) {
    // Lógica de registro, delegada al servicio
    return this.authService.register(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login de usuario local' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Usuario autenticado y token JWT.' })
  async login(@Body() body: LoginDto) {
    // Lógica de login, delegada al servicio
    return this.authService.login(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil del usuario autenticado.' })
  getProfile(
    @Req() req: Express.Request & { user?: SocialUser },
  ): SocialUser | undefined {
    return req.user;
  }
}
