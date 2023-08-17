import { IsNotEmpty } from 'class-validator';

export class CheckPhoneDto {
  @IsNotEmpty({ message: 'phone not empty' })
  phone: string;
}
