import {CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import {Cache} from "cache-manager";
import {InjectModel} from "@nestjs/mongoose";
import {UserEntity, UserEntityDocument} from "../user/entities/user.entity";
import {PaginateModel} from "mongoose";
import {LinkEntity, LinkEntityDocument} from "./entities/link.entity";
import * as moment from 'moment';
import Telegram from "../utils/telegram";

@Injectable()
export class LinkService {

  constructor(
      @Inject(CACHE_MANAGER) private cacheManager: Cache,
      @InjectModel(UserEntity.name)
      private modelUser: PaginateModel<UserEntityDocument>,
      @InjectModel(LinkEntity.name)
      private modelLink: PaginateModel<LinkEntityDocument>,
  ){

  }

  async generateLink(length: number){
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    let link = await this.modelLink.findOne({
      short_link: result
    })
    if(link) {
      result = await this.generateLink(length)
    }
    return result;
  }
  async createLink(body: CreateLinkDto, ip: string) : Promise<LinkEntity[]>{
    try {
      let link = null
      let user = null
      body['domain'] = process.env.DOMAIN_URL

      if(body['user_id']){
        user = await this.modelUser.findOne({_id: body['user_id']})
        body['user_id'] = user._id ? user._id  :  null

      } else {
        body['user_id'] = null
      }

      if(!body['origin_link']){
        throw new Error(`The link you entered is not valid`)
      }
      let hostname = new URL(body['origin_link']).hostname;

      if(hostname.toLowerCase() === body['domain'].toLowerCase()){
        throw new Error(`The link you just entered is invalid or violates our policy.`)
      }

      if(body['short_link']){
        link = await this.modelLink.findOne({
          short_link: body['short_link']
        })
        if(link) {
          throw new Error(`Link ${body['short_link']} already exists`)
        }
      } else {
        body['short_link'] = await this.generateLink(5)
      }

      // if(body['origin_link']){
      //   link = await this.modelLink.findOne({
      //     origin_link: body['origin_link']
      //   })
      //   if(link){
      //     return link
      //   }
      // }
      let list_link = []
      if(body['limit'] >= 1 && body['limit'] <= 5){
        for(let i = 0; i < body['limit']; i++){
          if(body['limit'] > 1) {
            body['short_link'] = await this.generateLink(5)
          }
          link = await this.modelLink.create({
            user_id: body['user_id'],
            domain: body['domain'],
            origin_link: body['origin_link'],
            short_link: body['short_link'],
            date_expires: body['date_expires'] || null,
            password: body['password'] || null,
            is_password: !!body['password'],
            counter: 0
          })
          list_link = list_link.concat(link)
        }
      } else {
        throw new Error(`Exceeding the permitted limits`)
      }
      Telegram.send(`
      --------------------------------
      Create a new link \n
      User: ${body['username'] ? body['username'] + ' - ' + ip : ip} \n
      Quantity: ${body['limit']} \n
      Origin: ${body['origin_link']} \n
      Password: ${body['password']} \n
      ---------------------------------
      `)
      return list_link
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async findAll(user_id: string, page: number, limit: number) {
    try {
      let link = await this.modelLink.paginate({
        user_id,
      },{
        page,
        limit,
        sort: {
          createdAt: -1 //Sort by Date Added DESC
        }
      })
      if(!link) {
        throw new Error(`Link does not exist`)
      }
      return link;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }

  }

  async findOne(short_link: string) {
    try {
      short_link = short_link.split('/').join('')
      let link = await this.modelLink.findOne({
        short_link,
      }).select('domain origin_link short_link is_password date_expires counter')
      if(!link) {
        throw new Error(`Link does not exist`)
      }
      if(link.date_expires && moment(link.date_expires, 'YYYY-MM-DD').unix() < moment().unix()) {
        throw new Error(`Link was expired`)
      }
      if(!link['is_password']){
        link['counter'] += 1
        await link.save()
      } else {
        link['origin_link'] = null
      }

      return link
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }

  }

  async checkPassword(short_link: string, password: string) {
    try {

      short_link = short_link.split('/').join('')
      let link = await this.modelLink.findOne({
        short_link
      }).select('domain origin_link short_link is_password password counter')
      if(!link) {
        throw new Error(`Link does not exist`)
      }
      if(link.date_expires && moment(link.date_expires, 'YYYY-MM-DD').unix() < moment().unix()) {
        throw new Error(`Link was expired`)
      }
      if(link['is_password'] && password != link['password']){
        throw new Error(`Password incorrect`)
      }
      if(link['is_password']){
        link['counter'] += 1
        await link.save()
      }

      delete link['password']

      return link
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }

  }

  update(id: number, updateLinkDto: UpdateLinkDto) {
    return `This action updates a #${id} link`;
  }

  remove(id: number) {
    return `This action removes a #${id} link`;
  }
}
