import { IsNotEmpty } from 'class-validator';

export class LinkBotAccountDto {
  @IsNotEmpty()
  botId: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  startAt: number;

  @IsNotEmpty()
  expireAt: number;
}
