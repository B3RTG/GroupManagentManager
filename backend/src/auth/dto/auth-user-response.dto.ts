import { Expose } from 'class-transformer';

export class AuthUserResponseDto {
    @Expose()
    id: string;

    @Expose()
    name?: string;

    @Expose()
    username: string;

    @Expose()
    email: string;

    @Expose()
    preferredSports?: string[];

    @Expose()
    avatarUrl?: string;

    @Expose()
    phoneNumber?: string;

    @Expose()
    isActive: boolean;

    @Expose()
    lastLogin?: Date;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}
