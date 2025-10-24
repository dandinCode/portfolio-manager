import { IsArray, IsDateString, IsNumber, IsString } from 'class-validator';

export class GetStocksDto {
  @IsArray()
  @IsString({ each: true })
  stocks: string[];

  @IsDateString()
  start: string;

  @IsDateString()
  end: string;

  @IsNumber()
  acceptableRisk: number;
}
