import { Injectable } from '@nestjs/common';
import yahooFinance from 'yahoo-finance2';
import { GetStocksDto } from './dto/get-stocks.dto';

@Injectable()
export class AnalysisService {
    async getStocksData(getStocksDto: GetStocksDto) {
        const stock_list: string[] = [];
        const dy_list: number[] = [];
        const std_dev_list: number[] = [];
        const sectors_list: string[] = [];
    
        for (const symbol of getStocksDto.stocks) {
          try {
            const symbolWithSuffix = symbol.endsWith('.SA') ? symbol : `${symbol}.SA`;
    
            const summary = await yahooFinance.quoteSummary(symbolWithSuffix, {
              modules: ['assetProfile', 'summaryDetail', 'defaultKeyStatistics', 'financialData'],
            });
    
            const sector = summary.assetProfile?.sector || 'Unknown';
            const dividendYield = summary.summaryDetail?.dividendYield
              ? summary.summaryDetail.dividendYield * 100
              : 0;
    
            const historical = await yahooFinance.chart(symbolWithSuffix, {
              period1: getStocksDto.start,
              period2: getStocksDto.end,
              interval: '1d',
            });
    
            const prices = historical.quotes.map(q => q.close).filter(p => p != null);
            if (!prices.length) continue;
    
            const returns: number[] = [];
            for (let i = 1; i < prices.length; i++) {
              returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
            }
    
            const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
            const variance = returns.reduce((sum, r) => sum + Math.pow(r - meanReturn, 2), 0) / (returns.length - 1);
            const stdDevDaily = Math.sqrt(variance);
    
            const stdDevAnnual = stdDevDaily * Math.sqrt(252);
    
            stock_list.push(symbol);
            dy_list.push(dividendYield);
            std_dev_list.push(stdDevAnnual);
            sectors_list.push(sector);
    
          } catch (err) {
            console.warn(`Erro ao buscar dados de ${symbol}:`, err.message);
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
}
