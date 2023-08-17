import {Logger} from '@nestjs/common';

const logger = new Logger(process.env.NODE_ENV);

export function getConnectionStringMongo() {
    const DB_HOST = process.env.DATABASE_HOST;
    const DB_PORT = process.env.DATABASE_PORT;
    const DB_DATABASE = process.env.DATABASE_NAME;
    const DB_USERNAME = process.env.DATABASE_USERNAME;
    const DB_PASSWORD = process.env.DATABASE_PASSWORD;
    const DB_AUTHENTICATION_DATABASE = process.env.DB_AUTHENTICATION_DATABASE;
    let uri = '';

    if (
        DB_USERNAME.length > 0 &&
        DB_PASSWORD.length > 0 &&
        DB_AUTHENTICATION_DATABASE.length > 0
    ) {
        uri =
            'mongodb://' +
            DB_USERNAME +
            ':' +
            DB_PASSWORD +
            '@' +
            DB_HOST +
            ':' +
            DB_PORT +
            '/' +
            DB_DATABASE +
            '?retryWrites=false&authSource=' +
            DB_AUTHENTICATION_DATABASE;
    } else {
        uri =
            'mongodb://' +
            DB_HOST +
            ':' +
            DB_PORT +
            '/' +
            DB_DATABASE +
            '?retryWrites=false';
    }

    logger.debug('Connection string Mongo: ' + uri);

    return uri;
}
