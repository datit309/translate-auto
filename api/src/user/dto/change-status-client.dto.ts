import { IsNotEmpty } from 'class-validator';

export class ChangeStatusClientDto {
  @IsNotEmpty({ message: 'id not empty' })
  id: string;

  @IsNotEmpty({ message: 'status not empty' })
  status: string;
}
