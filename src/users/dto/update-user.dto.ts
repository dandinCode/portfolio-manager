import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, Matches } from 'class-validator';
import {
  NAME_PATTERN,
  NAME_VALIDATION_MESSAGE,
} from 'src/common/utils/name.validation';

export class UpdateUserDto {
  @ApiProperty({
    example: 'João Silva',
    description: 'Nome do usuário',
    minLength: 5,
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Matches(NAME_PATTERN, { message: NAME_VALIDATION_MESSAGE })
  name: string;
}
