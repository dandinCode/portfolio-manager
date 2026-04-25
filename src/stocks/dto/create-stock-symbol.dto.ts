import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, Length } from 'class-validator';

export class CreateStockSymbolDto {
  @ApiProperty({ example: 'PETR4', description: 'Símbolo da ação' })
  @IsString()
  @Length(4, 6, { message: 'O símbolo deve ter entre 4 e 6 caracteres.' })
  @Matches(/^[A-Z]{4}\d{1,2}$/, {
    message:
      'Formato inválido. Use padrão como PETR4 (4 letras maiúsculas + 1 ou 2 números).',
  })
  symbol: string;
}
