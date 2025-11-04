import { ConflictException, Injectable } from '@nestjs/common';
import { CreateStockSymbolDto } from './dto/create-stock-symbol.dto';
import { PrismaService } from '../prisma/prisma.service';

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
        createdById: dto.createdById ?? null,
      },
    });

    return stockSymbol;
  }

  async findAllStockSymbols() {
    return this.prisma.stockSymbol.findMany({
      include: { createdBy: true },
    });
  }
}
