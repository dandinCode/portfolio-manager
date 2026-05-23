import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength, Matches } from 'class-validator';
import {
  NAME_PATTERN,
  NAME_VALIDATION_MESSAGE,
} from 'src/common/utils/name.validation';

export class RegisterDto {
  @ApiProperty({
    example: 'João Silva',

    minLength: 5,
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Matches(NAME_PATTERN, { message: NAME_VALIDATION_MESSAGE })
  name: string;

  @ApiProperty({
    example: 'joao@email.com',
  })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({
    example: 'Senha@123',

    minLength: 8,
  })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9])/, {
    message: 'Senha deve conter letras, números e caractere especial',
  })
  password: string;
}
