import {Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, HttpStatus, UseGuards} from '@nestjs/common';
import { LinkService } from './link.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import {GetLinkDto} from "./dto/get-link.dto";
import {RoleGuard} from "../auth/guards/role.guard";
import {Roles} from "../auth/roles.decorator";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import {Role} from "../auth/enums/role.enum";
import {RoleClientGuard} from "../auth/guards/role-client.guard";

@Controller('link')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}
  // @Roles('client')
  // @UseGuards(JwtAuthGuard, RoleClientGuard)
  @Post('create')
  async createLink(@Body() body: CreateLinkDto, @Req() req, @Res() res) {
    try {
      const ip = req.headers['x-real-ip'] || req['connection']['remoteAddress'];
      return res.status(HttpStatus.OK).send({
        data: await this.linkService.createLink(body, String(ip)),
        success: true,
        message: 'request success'
      });
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        data: null,
        success: false,
        message: e.message
      });
    }
  }

  @Post('get')
  async getLink(@Body() body: GetLinkDto, @Req() req, @Res() res) {
    try {
      return res.status(HttpStatus.OK).send({
        data: await this.linkService.findOne(body.short_link),
        success: true,
        message: 'request success'
      });
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        data: null,
        success: false,
        message: e.message
      });
    }

  }

  @Post('get-link-password')
  async getLinkWithPassword(@Body() body: GetLinkDto, @Req() req, @Res() res) {
    try {

      return res.status(HttpStatus.OK).send({
        data: await this.linkService.checkPassword(body.short_link, body.password),
        success: true,
        message: 'request success'
      });
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        data: null,
        success: false,
        message: e.message
      });
    }

  }

  @Post('list')
  @Roles('client')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth('defaultBearerAuth')
  async getListLink(@Body() body: any, @Req() req, @Res() res) {
    try {
      let user_id = req.user.user_id
      return res.status(HttpStatus.OK).send({
        data: await this.linkService.findAll(user_id, body.page, body.limit),
        success: true,
        message: 'request success'
      });
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        data: null,
        success: false,
        message: e.message
      });
    }

  }

}
