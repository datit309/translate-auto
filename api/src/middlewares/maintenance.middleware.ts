// // import {HttpException, HttpStatus, Injectable, NestMiddleware} from '@nestjs/common';
// // import {ConfigService} from './config/config.service'
// //
// // import { Request, Response, NextFunction } from 'express';
// // import {ConfigDocument} from "./schemas/config.schema";
// // import {ItemTypeDocument} from "./schemas/items-type.schema";
// // import {Model} from "mongoose";
// //
// // export async function MaintenanceMiddleware(req: Request, res: Response, next: NextFunction) {
// //   console.log(`Request...`);
// //   let configService = new ConfigService();
// //   let maintenance = await ConfigService.findOne({type: 'ENABLE_MAINTENANCE'})
// //   if (!maintenance) throw new HttpException('Service unavailable', HttpStatus.SERVICE_UNAVAILABLE)
// //   if (maintenance.value) {
// //     throw new HttpException('Server is down for maintenance. Please come back later', HttpStatus.SERVICE_UNAVAILABLE)
// //   } else {
// //     next()
// //   }
// // };
//
// import {HttpException, HttpStatus, Injectable, Logger, NestMiddleware, UseFilters} from '@nestjs/common';
// import {Request, Response, NextFunction} from 'express';
// import {InjectModel} from "@nestjs/mongoose";
// import {Config, ConfigDocument} from "./schemas/config.schema";
// import {ItemType, ItemTypeDocument} from "./schemas/item-type.schema";
// import {Model} from "mongoose";
// import {ConfigService} from "./config/config.service";
// import {Env} from "./env";
// import {HttpExceptionFilter} from "./http-exception.filter";
// const ips = Env.get('IPS').toString().split(',');
//
// @Injectable()
// export class MaintenanceMiddleware implements NestMiddleware {
//   constructor(
//       private readonly configService: ConfigService) {
//   }
//     async use(req: Request, res: Response, next: NextFunction) {
//         // let logger = new Logger(req.ip);
//
//         // logger.debug(`Checking Maintenance...`)
//         let maintenance = await this.configService.findOne({type: 'ENABLE_MAINTENANCE'})
//         if (!maintenance) throw new HttpException('Service unavailable', HttpStatus.SERVICE_UNAVAILABLE)
//
//         let ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
//
//         if (maintenance.value) {
//             if (Env.get('NODE_ENV') === 'development') {
//                 next();
//             } else {
//                 if (ips.indexOf(ip.toString().replace('::ffff:', '')) >= 0) {
//                     next();
//                 } else {
//                     throw new HttpException('Server is down for maintenance. Please come back later', HttpStatus.SERVICE_UNAVAILABLE)
//                 }
//             }
//
//         } else {
//             next()
//         }
//     }
// }
