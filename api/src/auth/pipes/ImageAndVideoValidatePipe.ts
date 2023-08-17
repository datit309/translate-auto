import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class ImageAndVideoValidatePipe implements PipeTransform {
  transform(files: Express.Multer.File[], metadata: ArgumentMetadata) {
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
    for (let i = 0; i < files.length; i++) {
      if (
        files !== undefined &&
        !files[i].mimetype.match(/\/(mp4|mpeg|jpg|jpeg|png|gif)$/)
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
    }
    return files;
  }
}
