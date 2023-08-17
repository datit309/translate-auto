import {resolve} from 'path';
import * as session from 'express-session';

import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';

const MongoDBStore = require('connect-mongodb-session')(session);
const fs = require('fs');
const path = require('path');
import {NestExpressApplication} from '@nestjs/platform-express';
import {
    ArgumentMetadata,
    PipeTransform,
    ValidationPipe,
} from '@nestjs/common';
import * as _ from 'lodash';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {getConnectionStringMongo} from './utils/mongo';
import {HttpExceptionFilter} from './exceptions/http-exception.filter';
import { WsAdapter } from '@nestjs/platform-ws';
import {ethers} from 'ethers'
const crypto = require('crypto');

async function bootstrap() {
    let app = null;
    if (process.env.NODE_ENV !== 'development') {
        const httpsOptions = {
            key: fs.readFileSync(
                path.join(__dirname, '..', '/ssl/' + process.env.SSL_PRIVATE_KEY),
            ),
            cert: fs.readFileSync(
                path.join(__dirname, '..', '/ssl/' + process.env.SSL_PRIVATE_CRT),
            ),
            cors: true,
        };
        app = await NestFactory.create<NestExpressApplication>(AppModule, {
            httpsOptions,
            logger: ['error', 'warn'],
        });
        app.enableCors((req, callback) => {
            const allowlist = process.env.CORS.toString().split(',');

            let corsOptions;

            if (allowlist.includes(req.header('Origin'))) {
                corsOptions = {
                    credentials: true,
                    origin: true,
                    methods: ['GET', 'POST'],
                };
            } else {
                corsOptions = {origin: false}; // disable CORS for this request
            }
            callback(null, corsOptions); // callback expects two parameters: error and options
        });
    } else {
        app = await NestFactory.create<NestExpressApplication>(AppModule);
        app.enableCors({
            credentials: true,
            origin: '*',
        });
    }
    app.useWebSocketAdapter(new WsAdapter(app));
    app.set('trust proxy', true); // trust first proxy

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );

    app.useGlobalPipes(new ParseQueryFilterToObject());
    app.useGlobalFilters(new HttpExceptionFilter());

    app.use(
        session({
            secret: process.env.APP_KEY,
            resave: false,
            saveUninitialized: true,
            store: new MongoDBStore({
                uri: getConnectionStringMongo(),
                collection: 'mySessions',
            }),
            cookie: {
                secure: true,
                maxAge: 36000,
                httpOnly: false,
            },
        }),
    );

    if (process.env.NODE_ENV === 'development') {
        const options = {
            swaggerOptions: {
                authAction: {
                    defaultBearerAuth: {
                        name: 'defaultBearerAuth',
                        schema: {
                            description: 'Default',
                            type: 'http',
                            in: 'header',
                            scheme: 'bearer',
                            bearerFormat: 'JWT',
                        },
                        value:
                            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpcCI6Ijo6MSIsInR5cGUiOiJhZG1pbiIsInVzZXJuYW1lIjoiYWRtaW4iLCJhZG1pbl9pZCI6MSwicm9sZXMiOlsiYWRtaW4uZnVsbCJdLCJhYmlsaXR5IjpbeyJhY3Rpb24iOiJtYW5hZ2UiLCJzdWJqZWN0IjoiYWxsIn1dLCJpYXQiOjE2NjE3NDQ3Nzd9.0Mo1-MnPz4xAmHIFJ_ToKhzFCOVdkkFP_VSvFdBIpiE',
                    },
                },
            },
        };
        //Swagger
        const config = new DocumentBuilder()
            .setTitle('API SmartCard')
            .setDescription('API SmartCard')
            .setVersion('1.0')
            .addBearerAuth(undefined, 'defaultBearerAuth')
            .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api', app, document, options);
    }

    // folder upload file image, mp3
    // app.useStaticAssets(resolve(process.cwd(), `storages`), {
    //   index: false,
    //   prefix: '/uploads',
    // });
    app.useStaticAssets(path.join(__dirname, '..', 'public'), {
        prefix: '/public/',
    });
    app.setGlobalPrefix('api');



    await app.listen(process.env.PORT);
    console.log(
        `Application is running on: ${await app.getUrl()}`,
        'Mode:',
        process.env.NODE_ENV,
    );


}

class ParseQueryFilterToObject implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        const {type} = metadata;
        if (type === 'query' && value.filters) return this.transformQuery(value);
        return value;
    }

    transformQuery(value) {
        if (_.isString(value.filters)) {
            value.filters = JSON.parse(value.filters);
        }
        if (_.isString(value.sort)) {
            value.sort = JSON.parse(value.sort);
        }
        return value;
    }
}

bootstrap();
