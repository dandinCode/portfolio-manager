import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Criar nova conta' })
  @ApiResponse({
    status: 201,
    description: 'Conta criada com sucesso',
    schema: {
      example: {
        access_token: 'jwt.token.aqui',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 409,
    description: 'Email já cadastrado',
  })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = await this.authService.register(dto);

    res.cookie('token', access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return { message: 'Conta criada com sucesso' };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    schema: {
      example: {
        access_token: 'jwt.token.aqui',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = await this.authService.login(dto);

    res.cookie('token', access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return { message: 'Login realizado com sucesso' };
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  me(@Req() req) {
    return req.user;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    return { message: 'Logout realizado com sucesso' };
  }
}
