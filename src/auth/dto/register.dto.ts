import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  @Matches(/(?=.*[A-Za-z])/, {
    message: 'Senha deve conter letras',
  })
  @Matches(/(?=.*\d)/, {
    message: 'Senha deve conter números',
  })
  @Matches(/(?=.*[@$!%*#?&])/, {
    message: 'Senha deve conter caractere especial',
  })
  password: string;

  @IsString()
  @MinLength(2)
  name: string;
}
