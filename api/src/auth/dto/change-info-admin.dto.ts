import { IsNotEmpty } from 'class-validator';

export class ChangeInfoAdminDto {
  _id: string;

  @IsNotEmpty({ message: 'full name not empty' })
  full_name: string;

  @IsNotEmpty({ message: 'phone not empty' })
  phone: string;
}
