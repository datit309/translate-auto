import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { RegisterClientDto } from './dto/register-client.dto';
import { ThirdPartyService } from './third-party.service';

@Controller('third-party')
export class ThirdPartyController {
  constructor(private readonly thirdPartyService: ThirdPartyService) {}

  @Post('register-account')
  async registerAccount(@Body() dto: RegisterClientDto, @Res() res) {
    try {
      return res.status(HttpStatus.OK).send({
        success: true,
        data: await this.thirdPartyService.registerUser(dto),
        message: 'Register success',
      });
    } catch (e) {
      return res.status(HttpStatus.OK).send({
        success: false,
        data: null,
        message: e,
      });
    }
  }

}
