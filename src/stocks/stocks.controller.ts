import { Controller, Post, Body } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { GetStocksDto } from './dto/get-stocks.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Controller('stocks')
export class StocksController {
  private readonly optimizerUrl: string;

  constructor(
    private readonly stocksService: StocksService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.optimizerUrl = this.configService.get<string>('OPTIMIZER_API_URL')!;
  }

  @Post('analyze')
  async analyzeStocks(@Body() dto: GetStocksDto) {
    const analysis = await this.stocksService.getStocksData(dto);

    try {
      const response = await firstValueFrom(
        this.httpService.post(this.optimizerUrl, analysis)
      );

      return {
        analysis,
        optimization: response.data,
      };
    } catch (error) {
      console.error('Error calling optimization API:', error.message);
      return {
        analysis,
        optimization: null,
        error: 'Failed to call optimization API',
      };
    }
  }
}
