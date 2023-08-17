import { IsNotEmpty } from 'class-validator';

export class RegisterClientDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
