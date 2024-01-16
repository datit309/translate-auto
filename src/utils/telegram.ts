import * as TelegramBot from 'node-telegram-bot-api';
import { ConfigService } from '@nestjs/config';
import * as process from 'process';

export default class Telegram {
  private static configService: ConfigService = new ConfigService();
  private static bot;

  static send(
    message: string = null,
    room_id: string = process.env.TELEGRAM_DEFAULT_ROOM_ID,
  ) {
    if (!this.bot) {
      this.bot = new TelegramBot(process.env.TELEGRAM_PRIVATE_KEY, {
        polling: false,
      });
    }
    if (this.bot != null && message != null && message.length > 0) {
      // @ts-ignore
      this.bot.sendMessage(room_id, message, {
        parse_mode: 'HTML',
      });
    }
  }
}
