import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      const hash = await bcrypt.hash(dto.password, 10);

      const user = await this.usersService.create({
        email: dto.email,
        password: hash,
        name: dto.name,
      });

      return {
        access_token: this.jwtService.sign({
          sub: user.id,
          email: user.email,
        }),
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email já cadastrado');
      }

      throw new InternalServerErrorException(
        'Erro ao criar conta. Tente novamente.',
      );
    }
  }
}
