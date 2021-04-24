import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@email.com', description: 'email пользователя' })
  readonly email: string;
  @ApiProperty({ example: 'qwerty', description: 'пароль' })
  readonly password: string;
}
