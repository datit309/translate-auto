import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import Telegram from '../utils/telegram';

@Injectable()
export class IPMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.headers['x-real-ip'] || req['connection']['remoteAddress'];
    const whitelist: string[] = process.env.IPS.split(',');

    if (whitelist.indexOf(String(ip)) !== -1) {
      return next();
    }
    Telegram.send(`Ip lạ truy cập: ${ip}`);
    return res.status(HttpStatus.UNAUTHORIZED).send({
      success: false,
      data: null,
      message: `Ip ${String(ip)} is not validate`,
    });
  }
}
