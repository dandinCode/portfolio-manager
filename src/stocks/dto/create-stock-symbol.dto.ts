import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateStockSymbolDto {
  @ApiProperty({ example: 'PETR4', description: 'Símbolo da ação' })
  @IsString()
  symbol: string;

  @ApiProperty({
    example: 1,
    description: 'ID do usuário que cadastrou',
    required: false,
  })
  @IsInt()
  @IsOptional()
  createdById?: number;
}
