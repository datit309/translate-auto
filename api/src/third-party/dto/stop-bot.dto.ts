import { IsNotEmpty } from 'class-validator';

export class StopBotDto {
  @IsNotEmpty()
  username: string;
}
