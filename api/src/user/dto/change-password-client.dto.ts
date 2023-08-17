import { IsNotEmpty } from 'class-validator';

export class ChangePasswordClientDto {
  @IsNotEmpty({ message: 'id not empty' })
  id: string;

  @IsNotEmpty({ message: 'password not empty' })
  password: string;
}
