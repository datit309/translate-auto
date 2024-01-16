import { Controller, Get, Post, Res } from '@nestjs/common';

@Controller()
export class AppController {
  @Post('/ping')
  ping(@Res() res): string {
    return res.status(200).send({
      status: 200,
      message: 'success',
      success: true,
      data: true,
    });
  }
}
