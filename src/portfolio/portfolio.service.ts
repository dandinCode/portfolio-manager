import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreatePortfolioDto) {
    if (!dto.stocks.length) {
      throw new BadRequestException('Portfólio sem ativos');
    }

    const symbols = dto.stocks
      .map((s) => s.trim().toUpperCase())
      .filter((s): s is string => !!s);

    const stocks = await this.prisma.stock.findMany({
      where: {
        symbol: {
          symbol: {
            in: symbols,
          },
        },
      },
    });

    if (!stocks.length) {
      throw new BadRequestException('Nenhuma ação válida encontrada');
    }

    const portfolio = await this.prisma.portfolio.create({
      data: {
        name: dto.name,
        userId,
        totalRisk: dto.totalRisk,
        totalReturn: dto.totalReturn,
        portfolioStocks: {
          create: stocks.map((stock) => ({
            stockId: stock.id,
          })),
        },
      },
      include: {
        portfolioStocks: {
          include: {
            stock: true,
          },
        },
      },
    });

    return portfolio;
  }

  async findAllByUser(userId: number) {
    return this.prisma.portfolio.findMany({
      where: { userId },

      include: {
        portfolioStocks: {
          include: {
            stock: {
              select: {
                id: true,
                companyName: true,
                sector: true,
                dividendYield: true,
                volatility: true,
                lastFetchedAt: true,
                symbol: {
                  select: {
                    symbol: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
