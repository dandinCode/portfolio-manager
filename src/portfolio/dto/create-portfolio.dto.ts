import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreatePortfolioDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsNumber()
  totalRisk?: number;

  @IsOptional()
  @IsNumber()
  totalReturn?: number;

  @IsArray()
  stocks: {
    stock: string;
    percentage: number;
  }[];
}
