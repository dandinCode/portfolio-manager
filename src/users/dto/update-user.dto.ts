import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'João Silva',
    description: 'Nome do usuário',
  })
  name: string;
}
