import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsString,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

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
    required: false,
  })
  @IsOptional()
  @IsDateString()
  start?: string;

  @ApiProperty({
    example: '2024-12-31',
    description: 'Data final do período de análise (ISO 8601)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  end?: string;

  @ApiProperty({
    example: 2.5,
    description: 'Nível de risco aceitável para otimização (%)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  acceptableRisk?: number;
}
