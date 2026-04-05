import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'João Silva',
    description: 'Nome do usuário',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
