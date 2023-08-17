import {IsEmail, IsNotEmpty} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterClientDto {
  @IsNotEmpty()
  @ApiProperty({
    default: 'user1',
  })
  username: string;

  @IsNotEmpty()
  @ApiProperty({
    default: 'user@123',
  })
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
