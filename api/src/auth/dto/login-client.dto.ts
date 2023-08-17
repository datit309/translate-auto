import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginClientDto {
  @IsNotEmpty({ message: 'username not empty' })
  @ApiProperty({
    default: 'user1',
  })
  username: string;

  @IsNotEmpty({ message: 'password not empty' })
  @ApiProperty({
    default: 'user@123',
  })
  password: string;

  roles: [];
}
