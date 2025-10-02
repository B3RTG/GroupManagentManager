import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
      callbackURL: process.env.FACEBOOK_CALLBACK_URL || '',
      profileFields: ['id', 'displayName', 'emails'],
      scope: ['email'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: {
      emails?: { value: string }[];
      displayName?: string;
      id?: string;
    },
  ): {
    email?: string;
    name?: string;
    provider: string;
    facebookId?: string;
  } {
    return {
      email: profile.emails?.[0]?.value,
      name: profile.displayName,
      provider: 'facebook',
      facebookId: profile.id,
    };
  }
}
