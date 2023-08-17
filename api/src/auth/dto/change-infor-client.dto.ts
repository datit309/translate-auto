import { IsNotEmpty } from 'class-validator';

export class ChangeInforClient {
  _id: string;

  @IsNotEmpty({ message: 'name not empty' })
  name: string;

  @IsNotEmpty({ message: 'phone not empty' })
  phone: string;

  @IsNotEmpty({ message: 'email not empty' })
  email: string;
}
