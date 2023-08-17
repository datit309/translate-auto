import { Injectable } from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
const { Translate } = require('@google-cloud/translate').v2;
const {TranslationServiceClient} = require('@google-cloud/translate');
const {Storage} = require('@google-cloud/storage');
import { translate } from '@vitalets/google-translate-api';
import { HttpProxyAgent } from 'http-proxy-agent';
import { HttpsProxyAgent } from 'https-proxy-agent';

import puppeteer from 'puppeteer';
import * as _ from 'lodash';
import { resolve } from 'path';
const path = require('path');
const fs = require('fs');
const randomUseragent = require('random-useragent');

@Injectable()
export class LanguageService {
  constructor() {
    // Tiếng Anh: EN
    // Tây Ban Nha: ES
    // Tiếng Trung: ZH
    // Tiếng Pháp: FR
    // Tiếng Đức: DE
    // Tiếng Nhật: JA
    // Tiếng Hàn: KO
    // Tiếng Nga: RU
    // Tiếng Bồ Đào Nha: PT
    // Tiếng Ả Rập: AR
    // Tiếng Ý: IT
    // Tiếng Hà Lan: NL
    // Tiếng Thái: TH
    // Tiếng Thổ Nhĩ Kỳ: TR
    // Tiếng Ba Lan: PL
    // Tiếng Việt: VI

    const listCodeLanguages = [
      'vi',
      'zh',
      'ru',
      'es',
      'fr',
      'de',
      'ja',
      'ko',
      'pt',
      'ar',
      'it',
      'th',
    ];
    listCodeLanguages.forEach((language) => {
      this.translateAPI(language);
    })
  }
  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async translateAPI(target: string) {
    const translationClient = new TranslationServiceClient({
      key: 'AIzaSyBixUurpgUIJXaY4FalBVth3zeJzEm30ew',
    });
    const projectId = 'i18-translate-361002'
    const location = 'global'
    const jsonData = await this.readFile('en');
    const inputContent = Object.values(jsonData);
    const outputContent = {}

    const request = {
      parent: `projects/${projectId}/locations/${location}`,
      contents: inputContent,
      mimeType: 'text/plain', // mime types: text/plain, text/html
      sourceLanguageCode: 'en',
      targetLanguageCode: target,
    };

    // Run request
    const [response] = await translationClient.translateText(request);
    response.translations.forEach((value, index) => {
      // @ts-ignore
      outputContent[inputContent[index]] = value.translatedText;
    });

    await this.writeFile(target, JSON.stringify(outputContent, null, 4));

    // ===================== v2
    // const translate = new Translate({
    //   key: 'AIzaSyBixUurpgUIJXaY4FalBVth3zeJzEm30ew',
    // });
    // try {
    //   // Đọc file JSON
    //   const jsonData = await this.readFile('en');
    //   const newLanguage = {};
    //
    //   for (const key in jsonData) {
    //     if (jsonData.hasOwnProperty(key)) {
    //       const value = jsonData[key];
    //       const [translation] = await translate.translate(value, target);
    //       newLanguage[key] = translation
    //       console.log(key, ' => ', newLanguage[key]);
    //     }
    //   }
    //   // console.log('newLanguage', newLanguage);
    //   await this.writeFile(target, JSON.stringify(newLanguage, null, 4));
    // } catch (e) {
    //   console.log('error', e);
    // }
  }
  async readFile(fileName: string) {
    return JSON.parse(
      fs.readFileSync(
        resolve(process.cwd(), `locales/source/${fileName}.json`),
        'utf8',
      ),
    );
  }
  async writeFile(fileName: string, data: any) {
    console.log('writing file success', fileName);
    return fs.writeFileSync(
      resolve(process.cwd(), `locales/target/${fileName}.json`),
      data,
      'utf8',
    );
  }
  create(createLanguageDto: CreateLanguageDto) {
    return 'This action adds a new language';
  }

  findAll() {
    return `This action returns all language`;
  }

  findOne(id: number) {
    return `This action returns a #${id} language`;
  }

  update(id: number, updateLanguageDto: UpdateLanguageDto) {
    return `This action updates a #${id} language`;
  }

  remove(id: number) {
    return `This action removes a #${id} language`;
  }
}
