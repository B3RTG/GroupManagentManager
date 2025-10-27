
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
    @ApiProperty({ example: 'b1a2c3d4-5678-90ab-cdef-1234567890ab' })
    @Expose()
    id: string;

    @ApiProperty({ example: 'Nombre Apellido', required: false })
    @Expose()
    name?: string;

    @ApiProperty({ example: 'usuario123' })
    @Expose()
    username: string;

    @ApiProperty({ example: 'user@email.com' })
    @Expose()
    email: string;

    @ApiProperty({ example: ['fútbol', 'tenis'], required: false, type: [String] })
    @Expose()
    preferredSports?: string[];

    @ApiProperty({ example: 'https://example.com/avatar.png', required: false })
    @Expose()
    avatarUrl?: string;

    @ApiProperty({ example: '+34123456789', required: false })
    @Expose()
    phoneNumber?: string;

    @ApiProperty({ example: true })
    @Expose()
    isActive: boolean;

    @ApiProperty({ example: '2025-10-22T12:34:56.789Z', required: false })
    @Expose()
    lastLogin?: Date;

    @ApiProperty({ example: '2025-10-22T12:34:56.789Z' })
    @Expose()
    createdAt: Date;

    @ApiProperty({ example: '2025-10-22T12:34:56.789Z' })
    @Expose()
    updatedAt: Date;
}
