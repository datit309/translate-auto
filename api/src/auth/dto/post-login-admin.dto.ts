import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PostLoginAdminDto {
  @IsNotEmpty({ message: 'username is required' })
  @ApiProperty({
    default: 'admin',
  })
  username: string;

  @IsNotEmpty({ message: 'password is required' })
  @ApiProperty({
    default: 'admin@123',
  })
  password: string;
}
