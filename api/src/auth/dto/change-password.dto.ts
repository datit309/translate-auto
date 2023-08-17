import { IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  username: string;

  @IsNotEmpty({ message: 'old password not empty' })
  old_password: string;

  @IsNotEmpty({ message: 'password not empty' })
  password: string;

  @IsNotEmpty({ message: 'password confirmation not empty' })
  password_confirmation: string;
}
