import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Portfolio')
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo portfólio' })
  @ApiResponse({ status: 201, description: 'Portfólio criado com sucesso' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Req() req: any, @Body() dto: CreatePortfolioDto) {
    return this.portfolioService.create(req.user.sub, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar portfólios do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de portfólios' })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findMyPortfolios(@Req() req: any) {
    return this.portfolioService.findAllByUser(req.user.sub);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir um portfólio' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Portfólio excluído com sucesso' })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req) {
    const userId = req.user.sub;

    return this.portfolioService.deletePortfolio(userId, Number(id));
  }
}
