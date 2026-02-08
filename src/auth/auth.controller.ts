import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

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
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
}
