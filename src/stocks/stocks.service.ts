import { ConflictException, Injectable } from '@nestjs/common';
import { CreateStockSymbolDto } from './dto/create-stock-symbol.dto';
import { PrismaService } from '../prisma/prisma.service';
import { StockStatus } from 'generated/prisma';

@Injectable()
export class StocksService {
  constructor(private readonly prisma: PrismaService) {}
  async createStockSymbol(dto: CreateStockSymbolDto) {
    const existing = await this.prisma.stockSymbol.findUnique({
      where: { symbol: dto.symbol },
    });

    if (existing) {
      throw new ConflictException('Símbolo já registrado.');
    }

    const stockSymbol = await this.prisma.stockSymbol.create({
      data: {
        symbol: dto.symbol,
        createdById: Number(dto.createdById),
      },
    });

    return stockSymbol;
  }

  async findAllStockSymbols() {
    return this.prisma.stockSymbol.findMany({
      include: { createdBy: true },
    });
  }

  async upsertStockSymbol(symbol: string, status: StockStatus, userId: number) {
    const baseSymbol = symbol.replace('.SA', '');

    return this.prisma.stockSymbol.upsert({
      where: { symbol: baseSymbol },
      update: { status, createdById: userId },
      create: { symbol: baseSymbol, status, createdById: userId },
    });
  }

  async registerStockData(
    symbolId: number,
    data: {
      companyName: string;
      sector: string;
      dividendYield: number;
      volatility: number;
    },
  ) {
    return await this.prisma.stock.upsert({
      where: { symbolId },
      update: {
        companyName: data.companyName,
        sector: data.sector,
        dividendYield: data.dividendYield,
        volatility: data.volatility,
        lastFetchedAt: new Date(),
      },
      create: {
        symbolId,
        companyName: data.companyName,
        sector: data.sector,
        dividendYield: data.dividendYield,
        volatility: data.volatility,
        lastFetchedAt: new Date(),
      },
    });
  }
}
