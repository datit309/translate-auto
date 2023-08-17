import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException, HttpStatus,
} from '@nestjs/common';
import {Response} from 'express';
import {ThrottlerException} from '@nestjs/throttler';
import Telegram from '../utils/telegram';
import * as moment from 'moment-timezone';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const exceptionResponse = exception.getResponse();
        const time = moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss');
        const domain =
            // @ts-ignore
            ctx.contextType + '://' + request.headers?.host + request.url;
        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;
        // Telegram.send(`
        // Host: ${domain}\nTime: ${time}\nStatus: ${status}\nMessage: ${
        //   exception instanceof ThrottlerException
        //     ? 'too many requests'
        //     : // @ts-ignore
        //       exceptionResponse?.message
        // }`);

        return response.status(httpStatus).json({
            success: false,
            data: null,
            message: exception instanceof ThrottlerException ? 'too many requests' : exceptionResponse['message'],
            status: httpStatus,
            timestamp: new Date().toISOString(),
        });
    }
}
