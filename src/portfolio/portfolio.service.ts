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
      .map((s) => s.stock.trim().toUpperCase())
      .filter((s): s is string => !!s);

    const stocks = await this.prisma.stock.findMany({
      where: {
        symbol: {
          symbol: {
            in: symbols,
          },
        },
      },
      include: {
        symbol: true,
      },
    });

    if (!stocks.length) {
      throw new BadRequestException('Nenhuma ação válida encontrada');
    }

    const allocationMap = Object.fromEntries(
      dto.stocks.map((s) => [s.stock.toUpperCase(), s.percentage]),
    );

    const portfolio = await this.prisma.portfolio.create({
      data: {
        name: dto.name,
        userId,
        totalRisk: dto.totalRisk,
        totalReturn: dto.totalReturn,

        portfolioStocks: {
          create: stocks.map((stock) => {
            const percentage = allocationMap[stock.symbol.symbol];

            if (percentage === undefined) {
              throw new BadRequestException(
                `Percentual não encontrado para ${stock.symbol.symbol}`,
              );
            }

            return {
              stockId: stock.id,
              percentage,
            };
          }),
        },
      },

      include: {
        portfolioStocks: {
          include: {
            stock: {
              include: {
                symbol: true,
              },
            },
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
