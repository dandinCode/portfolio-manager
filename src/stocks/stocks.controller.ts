import { Body, Controller, Get, Post } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateStockSymbolDto } from './dto/create-stock-symbol.dto';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Post('symbol')
  @ApiOperation({ summary: 'Cadastra um novo símbolo de ação' })
  @ApiResponse({ status: 201, description: 'Símbolo cadastrado com sucesso' })
  @ApiResponse({ status: 409, description: 'Símbolo já existe' })
  @ApiBody({ type: CreateStockSymbolDto })
  async create(@Body() dto: CreateStockSymbolDto) {
    return this.stocksService.createStockSymbol(dto);
  }

  @Get('symbols')
  @ApiOperation({ summary: 'Lista todos os símbolos cadastrados' })
  async findAll() {
    return this.stocksService.findAllStockSymbols();
  }
}
