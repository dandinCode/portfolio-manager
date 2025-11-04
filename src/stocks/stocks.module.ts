import { Module } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { StocksController } from './stocks.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [StocksService, PrismaService],
  controllers: [StocksController],
})
export class StocksModule {}
