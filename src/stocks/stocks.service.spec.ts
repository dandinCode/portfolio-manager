import { Test, TestingModule } from '@nestjs/testing';
import { StocksService } from './stocks.service';
import { PrismaService } from '../prisma/prisma.service';
import { StockStatus } from '../../generated/prisma';

describe('StocksService', () => {
  let service: StocksService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StocksService,
        {
          provide: PrismaService,
          useValue: {
            stockSymbol: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<StocksService>(StocksService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('deve criar um novo stock symbol', async () => {
    const dto = { symbol: 'AAPL' };
    const mockCreated = {
      id: 1,
      symbol: 'AAPL',
      status: StockStatus.pending,
      createdAt: new Date(),
      createdById: null,
    };

    jest.spyOn(prisma.stockSymbol, 'create').mockResolvedValue(mockCreated);

    const result = await service.createStockSymbol(dto);

    expect(prisma.stockSymbol.create).toHaveBeenCalledWith({
      data: { symbol: dto.symbol, createdById: null },
    });

    expect(result).toEqual(mockCreated);
  });
});
