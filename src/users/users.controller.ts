import { Body, Controller, Put, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar perfil do usuário logado' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  @UseGuards(AuthGuard('jwt'))
  @Put('me')
  async updateMe(@Request() req, @Body() body: UpdateUserDto) {
    return this.userService.updateUser(req.user.sub, body);
  }
}
