import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Stocks (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = app.get(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('/stocks/symbols (POST) deve criar um stock symbol', async () => {
    const response = await request(app.getHttpServer())
      .post('/stocks/symbol')
      .send({ symbol: 'AAPL' })
      .expect(201);

    expect(response.body.symbol).toBe('AAPL');
    expect(response.body.id).toBeDefined();
  });
});
