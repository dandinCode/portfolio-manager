import { ConflictException, Injectable } from '@nestjs/common';
import { CreateStockSymbolDto } from './dto/create-stock-symbol.dto';
import { PrismaService } from '../prisma/prisma.service';
import { StockStatus } from '@prisma/client';

@Injectable()
export class StocksService {
  constructor(private readonly prisma: PrismaService) {}
  async createStockSymbol(dto: CreateStockSymbolDto, userId: number) {
    const existing = await this.prisma.stockSymbol.findUnique({
      where: { symbol: dto.symbol },
    });

    if (existing) {
      throw new ConflictException('Símbolo já registrado.');
    }

    const stockSymbol = await this.prisma.stockSymbol.create({
      data: {
        symbol: dto.symbol,
        createdById: userId,
      },
    });

    return stockSymbol;
  }

  async findAllStockSymbols() {
    const data = await this.prisma.stockSymbol.findMany({
      include: {
        createdBy: true,
        stocks: {
          select: {
            companyName: true,
            sector: true,
          },
        },
      },
    });

    return data.map((item) => ({
      ...item,
      company: item.stocks[0]?.companyName,
      sector: item.stocks[0]?.sector,
    }));
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

  async getStocksSummary() {
    const totalAssets = await this.prisma.stock.count();

    const lastUpdatedStock = await this.prisma.stock.findFirst({
      orderBy: {
        lastFetchedAt: 'desc',
      },
      select: {
        lastFetchedAt: true,
      },
    });

    return {
      totalAssets,
      lastUpdate: lastUpdatedStock?.lastFetchedAt || null,
    };
  }
}
