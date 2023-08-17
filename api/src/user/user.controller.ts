import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Response } from 'express';
import { ChangeStatusClientDto } from './dto/change-status-client.dto';
import { FindAllDto } from './dto/find-all.dto';
import { FindUsernameDto } from './dto/find-username.dto';
import { ChangePasswordClientDto } from './dto/change-password-client.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '../auth/enums/role.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('change-status-user')
  async changeStatusClient(
    @Body() dto: ChangeStatusClientDto,
    @Request() req,
    @Res() res: Response,
  ) {
    try {
      return res.status(HttpStatus.OK).send({
        success: true,
        message: 'Update status success',
        data: await this.userService.changeStatusUser(dto.id, dto.status),
      });
    } catch (e) {
      return res.status(HttpStatus.OK).send({
        success: false,
        data: null,
        message: e.message,
      });
    }
  }

  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('find-all')
  async findAll(@Body() dto: FindAllDto, @Request() req, @Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).send({
        success: true,
        message: 'Request success',
        data: await this.userService.findAllUser(dto.page, dto.username),
      });
    } catch (e) {
      return res.status(HttpStatus.OK).send({
        success: false,
        data: null,
        message: e.message,
      });
    }
  }

  @Roles(Role.MANAGER, 'client')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('find-username')
  async findUsername(
    @Body() dto: FindUsernameDto,
    @Request() req,
    @Res() res: Response,
  ) {
    try {
      const { user } = req;
      if (user.type !== 'client') {
        // for admin
        return res.status(HttpStatus.OK).send({
          success: true,
          message: 'Request success',
          data: await this.userService.findUsername(dto.username),
        });
      }
      // for client
      return res.status(HttpStatus.OK).send({
        success: true,
        message: 'Request success',
        data: await this.userService.findUsername(user.username),
      });
    } catch (e) {
      return res.status(HttpStatus.OK).send({
        success: false,
        data: null,
        message: e.message,
      });
    }
  }

  @Roles(Role.MANAGER, 'client')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('update-password-client')
  async updatePasswordClient(
    @Body() dto: ChangePasswordClientDto,
    @Request() req,
    @Res() res: Response,
  ) {
    try {
      const { user } = req;
      if (user.type != 'client') {
        return res.status(HttpStatus.OK).send({
          success: true,
          message: 'Change password success',
          data: await this.userService.updatePassword(dto.id, dto.password),
        });
      }
      const usr = await this.userService.findUsername(user.username);
      return res.status(HttpStatus.OK).send({
        success: true,
        message: 'Change password success',
        data: await this.userService.updatePassword(usr._id, dto.password),
      });
    } catch (e) {
      return res.status(HttpStatus.OK).send({
        success: false,
        data: null,
        message: e.message,
      });
    }
  }
}
