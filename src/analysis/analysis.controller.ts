import { HttpService } from '@nestjs/axios';
import { Body, Controller, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AnalysisService } from './analysis.service';
import { GetStocksDto } from './dto/get-stocks.dto';
import { firstValueFrom } from 'rxjs';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Analysis')
@Controller('analysis')
export class AnalysisController {
      private readonly optimizerUrl: string;
    
      constructor(
        private readonly analysisService:AnalysisService,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
      ) {
        this.optimizerUrl = this.configService.get<string>('OPTIMIZER_API_URL')!;
      }
    
      @Post('analyze')
      @ApiOperation({ summary: 'Analisa um conjunto de ações e retorna métricas financeiras' })
      @ApiResponse({ status: 200, description: 'Análise realizada com sucesso' })
      @ApiResponse({ status: 400, description: 'Erro de validação nos parâmetros enviados' })
      @ApiBody({ type: GetStocksDto })
      async analyzeStocks(@Body() getStocksDto: GetStocksDto) {
        const analysis = await this.analysisService.getStocksData(getStocksDto);
    
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
