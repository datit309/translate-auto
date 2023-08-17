import { ConfigModule } from '@nestjs/config';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SetupModule } from './setup/setup.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { getConnectionStringMongo } from './utils/mongo';
import { UserModule } from './user/user.module';
import { ThirdPartyModule } from './third-party/third-party.module';
import { IPMiddleware } from './middlewares/ip.middleware';
import { ThirdPartyController } from './third-party/third-party.controller';
import {ScheduleModule} from "@nestjs/schedule";
import {ThrottlerGuard, ThrottlerModule} from "@nestjs/throttler";
import {join} from "path";
import {APP_FILTER, APP_GUARD} from "@nestjs/core";
import {HttpExceptionFilter} from "./exceptions/http-exception.filter";
import * as process from "process";
import {ServeStaticModule} from '@nestjs/serve-static';
import {AllExceptionsFilter} from "./exceptions/all-exceptions.filter";
import { WebsocketModule } from './websocket/websocket.module';
import {WebsocketService} from "./websocket/websocket.service";
import { LinkModule } from './link/link.module';
import { LanguageModule } from './language/language.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: Number(process.env.SECOND_PER_REQUEST),
      limit: Number(process.env.RATE_LIMIT),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: [
        '.env',
        '.env.development',
        '.env.testnet',
        '.env.production',
      ],
    }),
    MongooseModule.forRoot(getConnectionStringMongo(),{
      connectionFactory: (connection) => {
        // autoIncrement.initialize(connection);
        // connection.plugin(require('mongoose-autopopulate'));
        return connection;
      },
      autoIndex: true
    }),
    ScheduleModule.forRoot(),
    SetupModule,
    AuthModule,
    UserModule,
    ThirdPartyModule,
    WebsocketModule,
    LinkModule,
    LanguageModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    WebsocketService
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // lọc IP cho router này

    if (process.env.NODE_ENV != 'development') {
      consumer.apply(IPMiddleware).forRoutes(ThirdPartyController);
    }
  }
}
