import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as TelegramBot from 'node-telegram-bot-api';

let bot = null;
if (process.env.NODE_ENV !== 'development') {
  bot = new TelegramBot(process.env.TELEGRAM_PRIVATE_KEY, {
    polling: false,
  });
}

@Injectable()
export class LogTelegramMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const ip = req.headers['x-real-ip'] || req['connection']['remoteAddress'];
    if (bot != null) {
      try {
        const body = req.body;
        body.ip = ip;
        await bot.sendMessage('-880195752', JSON.stringify(body), {
          parse_mode: 'HTML',
        });
      } catch (e) {
        console.log(e.message);
      }
    }
    return next();
  }
}
