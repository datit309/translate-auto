import { IsNotEmpty } from 'class-validator';

export class FindUsernameDto {
  @IsNotEmpty({ message: 'username not empty' })
  username: string;
}
