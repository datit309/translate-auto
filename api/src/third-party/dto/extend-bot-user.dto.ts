import { IsInt, IsNotEmpty } from 'class-validator';

export class ExtendBotUserDto {
  @IsNotEmpty()
  _id: string;

  @IsNotEmpty()
  @IsInt()
  startAt: number;

  @IsNotEmpty()
  @IsInt()
  expireAt: number;
}
