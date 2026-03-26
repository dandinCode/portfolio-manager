import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateStockSymbolDto } from './dto/create-stock-symbol.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('symbol')
  @ApiOperation({ summary: 'Cadastra um novo símbolo de ação' })
  @ApiResponse({ status: 201, description: 'Símbolo cadastrado com sucesso' })
  @ApiResponse({ status: 409, description: 'Símbolo já existe' })
  @ApiBody({ type: CreateStockSymbolDto })
  async create(@Body() dto: CreateStockSymbolDto, @Req() req: any) {
    return this.stocksService.createStockSymbol(dto, req.user.sub);
  }

  @Get('symbols')
  @ApiOperation({ summary: 'Lista todos os símbolos cadastrados' })
  async findAll() {
    return this.stocksService.findAllStockSymbols();
  }

  @Get('summary')
  async getSummary() {
    return this.stocksService.getStocksSummary();
  }
}
