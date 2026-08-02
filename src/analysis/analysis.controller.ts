import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AnalysisService } from './analysis.service';
import { GetStocksDto } from './dto/get-stocks.dto';
import {
  AnalysisResult,
  PortfolioOptimization,
} from './interfaces/analysis-result.interface';
import { OptimizationModelsRegistry } from './optimization-models/optimization-models.registry';

@ApiTags('Analysis')
@Controller('analysis')
export class AnalysisController {
  constructor(
    private readonly analysisService: AnalysisService,
    private readonly optimizationModelsRegistry: OptimizationModelsRegistry,
  ) {}

  @Get('models')
  @ApiOperation({ summary: 'Lista os modelos de otimização disponíveis' })
  @ApiResponse({ status: 200, description: 'Modelos retornados com sucesso' })
  listModels() {
    return this.optimizationModelsRegistry.listModels();
  }

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
