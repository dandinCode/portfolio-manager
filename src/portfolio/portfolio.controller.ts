import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Req() req: any, @Body() dto: CreatePortfolioDto) {
    return this.portfolioService.create(req.user.sub, dto);
  }

  @Get()
  async findMyPortfolios(@Req() req: any) {
    return this.portfolioService.findAllByUser(req.user.sub);
  }
}
