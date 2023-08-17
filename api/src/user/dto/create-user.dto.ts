import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  wallet_address: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
}
