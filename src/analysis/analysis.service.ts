import { Injectable, Logger } from '@nestjs/common';
import yahooFinance from 'yahoo-finance2';
import { GetStocksDto } from './dto/get-stocks.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import {
  AnalysisResult,
  PortfolioOptimization,
} from './interfaces/analysis-result.interface';
import { StockStatus } from 'generated/prisma';
import { StocksService } from 'src/stocks/stocks.service';

@Injectable()
export class AnalysisService {
  private readonly optimizerUrl: string;
  private readonly logger = new Logger(AnalysisService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly stocksService: StocksService,
  ) {
    this.optimizerUrl = this.configService.get<string>('OPTIMIZER_API_URL')!;
  }

  async getStocksData(getStocksDto: GetStocksDto): Promise<AnalysisResult> {
    const stock_list: string[] = [];
    const dy_list: number[] = [];
    const std_dev_list: number[] = [];
    const sectors_list: string[] = [];

    for (const symbol of getStocksDto.stocks) {
      try {
        const symbolWithSuffix = symbol.endsWith('.SA')
          ? symbol
          : `${symbol}.SA`;

        const summary = await yahooFinance.quoteSummary(symbolWithSuffix, {
          modules: ['assetProfile', 'summaryDetail', 'price', 'financialData'],
        });

        const companyName = summary.price?.longName || 'Unknown';
        const sector = summary.assetProfile?.sector || 'Unknown';
        const dividendYield = summary.summaryDetail?.dividendYield
          ? summary.summaryDetail.dividendYield * 100
          : 0;

        const historical = await yahooFinance.chart(symbolWithSuffix, {
          period1: getStocksDto.start,
          period2: getStocksDto.end,
          interval: '1d',
        });

        const prices = historical.quotes
          .map((q) => q.close)
          .filter((p): p is number => p != null);

        if (!prices.length) {
          await this.stocksService.upsertStockSymbol(
            symbol,
            StockStatus.invalid,
            1,
          );
          continue;
        }

        const returns = prices
          .slice(1)
          .map((p, i) => (p - prices[i]) / prices[i]);
        const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
        const variance =
          returns.reduce((sum, r) => sum + Math.pow(r - meanReturn, 2), 0) /
          (returns.length - 1);
        const stdDevAnnual = Math.sqrt(variance) * Math.sqrt(252);

        const stockSymbol = await this.stocksService.upsertStockSymbol(
          symbol,
          StockStatus.validated,
          1,
        );
        await this.stocksService.registerStockData(stockSymbol.id, {
          companyName,
          sector,
          dividendYield,
          volatility: stdDevAnnual,
        });

        stock_list.push(symbol);
        dy_list.push(dividendYield);
        std_dev_list.push(stdDevAnnual);
        sectors_list.push(sector);
      } catch (err) {
        this.logger.warn(`Erro ao buscar dados de ${symbol}: ${err.message}`);
        await this.stocksService.upsertStockSymbol(
          symbol,
          StockStatus.invalid,
          1,
        );
        continue;
      }
    }

    return {
      stock_list,
      dy_list,
      standard_deviation_list: std_dev_list,
      sectors_list,
      acceptable_risk: getStocksDto.acceptableRisk,
    };
  }

  async optimizePortfolio(getStocksDto: GetStocksDto): Promise<{
    analysis: AnalysisResult;
    optimization: PortfolioOptimization | null;
    error?: string;
  }> {
    const analysis = await this.getStocksData(getStocksDto);

    try {
      const response = await firstValueFrom(
        this.httpService.post(this.optimizerUrl, analysis),
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
