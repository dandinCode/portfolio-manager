import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsNumber, IsString } from 'class-validator';

export class GetStocksDto {
  @ApiProperty({
    example: ['PETR4', 'VALE3', 'ITUB4'],
    description: 'Lista de tickers de ações a serem analisadas',
  })
  @IsArray()
  @IsString({ each: true })
  stocks: string[];

  @ApiProperty({
    example: '2024-01-01',
    description: 'Data inicial do período de análise (ISO 8601)',
  })
  @IsDateString()
  start: string;

  @ApiProperty({
    example: '2024-12-31',
    description: 'Data final do período de análise (ISO 8601)',
  })
  @IsDateString()
  end: string;

  @ApiProperty({
    example: 2.5,
    description: 'Nível de risco aceitável para otimização (%)',
  })
  @IsNumber()
  acceptableRisk: number;
}
