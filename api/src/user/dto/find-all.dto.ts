import { IsInt, IsNotEmpty } from 'class-validator';

export class FindAllDto {
  username: string;

  @IsNotEmpty({ message: 'page not empty' })
  @IsInt({ message: 'page must be integer' })
  page: number;
}
