import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import {HttpAdapterHost} from '@nestjs/core';

const _ = require('lodash')

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {
    }

    catch(exception: HttpException, host: ArgumentsHost): void {
        const {httpAdapter} = this.httpAdapterHost;
        const ctx = host.switchToHttp();

        let message = 'Error Unknown'
        if (exception['inner']) {
            message = exception['inner']['message']
        } else if (exception['response']) {
            message = exception['response']['message'] ? exception['response']['message'] : exception['response']
        } else {
            message = exception['message']
        }
        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const responseBody = {
            success: false,
            data: null,
            message: message,
            status: httpStatus,
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
        };

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}
