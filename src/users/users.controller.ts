import { Body, Controller, Put, UseGuards, Request } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { UsersService } from './users.service'

@Controller('users')
export class UserController {
  
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Put('me')
  async updateMe(
    @Request() req,
    @Body() body: { name: string }
  ) {
    return this.userService.updateUser(req.user.sub, body)
  }
}