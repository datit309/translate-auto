import { IsNotEmpty } from 'class-validator';

export class ChangePasswordClientDto {
  @IsNotEmpty({ message: 'phone id not empty' })
  phone_id: string;

  @IsNotEmpty({ message: 'password not empty' })
  new_password: string;

  @IsNotEmpty({ message: 'password confirmation not empty' })
  new_password_confirmation: string;
}
