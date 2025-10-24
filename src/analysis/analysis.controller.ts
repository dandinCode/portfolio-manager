import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AnalysisService } from './analysis.service';
import { GetStocksDto } from './dto/get-stocks.dto';
import {
  AnalysisResult,
  PortfolioOptimization,
} from './interfaces/analysis-result.interface';

@ApiTags('Analysis')
@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post('analyze')
  @ApiOperation({
    summary:
      'Analisa um conjunto de ações e retorna métricas financeiras otimizadas',
  })
  @ApiResponse({ status: 200, description: 'Análise realizada com sucesso' })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação nos parâmetros enviados',
  })
  @ApiBody({ type: GetStocksDto })
  async analyzeStocks(@Body() dto: GetStocksDto): Promise<{
    analysis: AnalysisResult;
    optimization: PortfolioOptimization | null;
    error?: string;
  }> {
    return this.analysisService.optimizePortfolio(dto);
  }
}
