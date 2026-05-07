import { ApiProperty } from '@nestjs/swagger';
export class AccessTokenDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token de acceso JWT generado para el usuario autenticado.',
  })
  readonly accessToken!: string;
  readonly refreshToken!: string;
}
