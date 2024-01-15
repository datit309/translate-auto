import { ConfigModule } from '@nestjs/config';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { getConnectionStringMongo } from './utils/mongo';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import * as process from 'process';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AllExceptionsFilter } from './exceptions/all-exceptions.filter';
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
    MongooseModule.forRoot(getConnectionStringMongo(), {
      connectionFactory: (connection) => {
        // autoIncrement.initialize(connection);
        // connection.plugin(require('mongoose-autopopulate'));
        return connection;
      },
      autoIndex: true,
    }),
    ScheduleModule.forRoot(),
    LanguageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // lọc IP cho router này
  }
}
