import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class FileValidatePipe implements PipeTransform {
  transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
    // if (file === undefined || file === null) {
    //   throw new HttpException(
    //     {
    //       success: false,
    //       message: 'File not empty',
    //       data: null,
    //     },
    //     HttpStatus.OK,
    //   );
    // }
    if (
      file !== undefined &&
      !file.mimetype.match(/\/(jpg|jpeg|png|gif|mpeg)$/)
    ) {
      throw new HttpException(
        {
          success: false,
          message: 'File is not valid',
          data: null,
        },
        HttpStatus.OK,
      );
    }
    return file;
  }
}
