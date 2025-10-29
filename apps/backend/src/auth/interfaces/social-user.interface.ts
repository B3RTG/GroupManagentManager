export interface SocialUser {
    email: string;
    name: string;
    provider: 'google' | 'facebook';
    googleId?: string;
    facebookId?: string;
}