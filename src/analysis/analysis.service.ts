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
import { oneYearRange, toISODate } from 'src/common/utils/date.util';

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
    this.validateAndSetDateRange(getStocksDto);

    const stock_list: string[] = [];
    const dy_list: number[] = [];
    const std_dev_list: number[] = [];
    const sectors_list: string[] = [];

    for (const symbol of getStocksDto.stocks) {
      const result = await this.processStockSymbol(symbol, getStocksDto);
      if (result) {
        stock_list.push(result.symbol);
        dy_list.push(result.dividendYield);
        std_dev_list.push(result.volatility);
        sectors_list.push(result.sector);
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

  private validateAndSetDateRange(getStocksDto: GetStocksDto): void {
    if (!getStocksDto.start || !getStocksDto.end) {
      const range = oneYearRange();
      getStocksDto.start = range.start;
      getStocksDto.end = range.end;
    } else {
      getStocksDto.start =
        toISODate(getStocksDto.start) ?? oneYearRange().start;
      getStocksDto.end = toISODate(getStocksDto.end) ?? oneYearRange().end;
    }

    console.log(`${getStocksDto.start} - ${getStocksDto.end}`);
  }

  private async processStockSymbol(
    symbol: string,
    getStocksDto: GetStocksDto,
  ): Promise<{
    symbol: string;
    dividendYield: number;
    volatility: number;
    sector: string;
  } | null> {
    try {
      const symbolWithSuffix = this.normalizeSymbol(symbol);

      const { companyData, financialData } =
        await this.fetchYahooFinanceData(symbolWithSuffix);
      const volatility = await this.calculateVolatility(
        symbolWithSuffix,
        getStocksDto,
      );

      if (volatility === null) {
        await this.markStockAsInvalid(symbol);
        return null;
      }

      await this.saveStockData(symbol, companyData, financialData, volatility);

      return {
        symbol,
        dividendYield: financialData.dividendYield,
        volatility,
        sector: companyData.sector,
      };
    } catch (err) {
      this.logger.warn(`Erro ao buscar dados de ${symbol}: ${err.message}`);
      await this.markStockAsInvalid(symbol);
      return null;
    }
  }

  private normalizeSymbol(symbol: string): string {
    return symbol.endsWith('.SA') ? symbol : `${symbol}.SA`;
  }

  private async fetchYahooFinanceData(symbol: string): Promise<{
    companyData: { name: string; sector: string };
    financialData: { dividendYield: number };
  }> {
    const summary = await yahooFinance.quoteSummary(symbol, {
      modules: ['assetProfile', 'summaryDetail', 'price', 'financialData'],
    });

    return {
      companyData: {
        name: summary.price?.longName || 'Unknown',
        sector: summary.assetProfile?.sector || 'Unknown',
      },
      financialData: {
        dividendYield: summary.summaryDetail?.dividendYield
          ? summary.summaryDetail.dividendYield * 100
          : 0,
      },
    };
  }

  private async calculateVolatility(
    symbol: string,
    getStocksDto: GetStocksDto,
  ): Promise<number | null> {
    const historical = await yahooFinance.chart(symbol, {
      period1: getStocksDto.start,
      period2: getStocksDto.end,
      interval: '1d',
    });

    const prices = historical.quotes
      .map((q) => q.close)
      .filter((p): p is number => p != null);

    if (!prices.length) {
      return null;
    }

    return this.calculateAnnualVolatility(prices);
  }

  private calculateAnnualVolatility(prices: number[]): number {
    const returns = prices.slice(1).map((p, i) => (p - prices[i]) / prices[i]);

    const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance =
      returns.reduce((sum, r) => sum + Math.pow(r - meanReturn, 2), 0) /
      (returns.length - 1);

    return Math.sqrt(variance) * Math.sqrt(252);
  }

  private async saveStockData(
    symbol: string,
    companyData: { name: string; sector: string },
    financialData: { dividendYield: number },
    volatility: number,
  ): Promise<void> {
    const stockSymbol = await this.stocksService.upsertStockSymbol(
      symbol,
      StockStatus.validated,
      1,
    );

    await this.stocksService.registerStockData(stockSymbol.id, {
      companyName: companyData.name,
      sector: companyData.sector,
      dividendYield: financialData.dividendYield,
      volatility,
    });
  }

  private async markStockAsInvalid(symbol: string): Promise<void> {
    await this.stocksService.upsertStockSymbol(symbol, StockStatus.invalid, 1);
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
