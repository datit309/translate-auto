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
import OpenAI from "openai";
import axios from "../utils/axios";

const openai = new OpenAI({
  apiKey: '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',
  organization: "org-tigXEB3Ga29pTSLewurWDmLm",
});


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
      // 'ru',
      // 'es',
      // 'fr',
      // 'de',
      // 'ja',
      // 'ko',
      // 'pt',
      // 'ar',
      // 'it',
      'vi', // vietnam
      // 'zh', // china
      // 'th', // thái
      //   'id', // indonesia
      //   'my', // malaysia
      //   'lo', // lào
      //   'km' // campuchia
    ];
    listCodeLanguages.forEach((language) => {
      // this.translateAPI(language, true, '$langs'); // PHP
      this.translateAPI(language); //JSON
    })

    // this.translateGPT()
  }

  async translateGPT(){
    const jsonData = await this.readFile('en');
    const inputContent = Object.values(jsonData);

    console.log('jsonData', inputContent)

    require('axios').post('https://api.openai.com/v1/chat/completions', {
      messages: [{ role: "system", content: `dịch theo cấu trúc json sang tiếng việt. chỉ dịch phần value: ${inputContent}` }],
      model: "gpt-3.5-turbo",
      "temperature": 0.9,
      "max_tokens": 2048,

    }, {
      headers: {
        Authorization: `Bearer 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`,
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      console.log(response.data.choices);
    }).catch((err) => {
      console.error(err.response.data.error)
    })

    // const response = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    //   messages: [{ role: "system", content: "You are a helpful assistant." }],
    //   // temperature: 0,
    //   // max_tokens: 256,
    //   // response_format: { type: "json_object" },
    // });
    // console.log(response)
  }
  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async translateAPI(target: string, exportPHP = false, variablePHP = '$langs') {
    // const translationClient = new TranslationServiceClient({
    //   key: 'AIzaSyBixUurpgUIJXaY4FalBVth3zeJzEm30ew',
    // });
    // const projectId = 'i18-translate-361002'
    // const location = 'global'
    // const jsonData = await this.readFile('en');
    // const inputContent = Object.values(jsonData);
    // const outputContent = {}

    // const request = {
    //   parent: `projects/${projectId}/locations/${location}`,
    //   contents: inputContent,
    //   mimeType: 'text/plain', // mime types: text/plain, text/html
    //   sourceLanguageCode: 'en',
    //   targetLanguageCode: target,
    // };

    // Run request
    // const [response] = await translationClient.translateText(request);
    // response.translations.forEach((value, index) => {
    //   // @ts-ignore
    //   outputContent[inputContent[index]] = value.translatedText;
    // });
    //
    // await this.writeFile(target, JSON.stringify(outputContent, null, 4));

    // ===================== v2
    const translate = new Translate({
      key: 'AIzaSyBixUurpgUIJXaY4FalBVth3zeJzEm30ew',
    });
    try {
      // Đọc file JSON
      const jsonData = await this.readFile('en_old');
      const newLanguage = {};

      for (const key in jsonData) {
        if (jsonData.hasOwnProperty(key)) {
          const value = jsonData[key];
          const [translation] = await translate.translate(value, target);
          newLanguage[key] = translation
          console.log(key, ' => ', newLanguage[key]);
        }
      }

      if(exportPHP) {
        // ======= PHP ===========
        await this.deleteFilePHP(target);
        await this.writeFilePHP(target, `<?php \n`);
        await this.writeFilePHP(target, `${variablePHP} = array( \n`);
        for (let key in newLanguage) {
          if (newLanguage.hasOwnProperty(key)) {
            await this.writeFilePHP(target, `"${key}" => "${newLanguage[key]}", \n`);
          }
        }
        await this.writeFilePHP(target, `); \n`);
        await this.writeFilePHP(target, `\n ?>`);
      } else {
        // ======= JSON ===========
        await this.writeFile(target, JSON.stringify(newLanguage, null, 4));
      }
      console.log('success', target);
    } catch (e) {
      console.log('error', e);
    }
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
    // console.log('writing file success', fileName);
    return fs.writeFileSync(
      resolve(process.cwd(), `locales/target/${fileName}.json`),
      data,
      'utf8',
    );
  }
  async deleteFilePHP(fileName: string) {
    console.log('Delete file PHP success', fileName);
    return fs.unlinkSync(resolve(process.cwd(), `locales/target_php/${fileName}.php`));
  }
  async writeFilePHP(fileName: string, data: any) {
    // console.log('writing file PHP success', fileName);
    return fs.appendFileSync(
        resolve(process.cwd(), `locales/target_php/${fileName}.php`),
        data,
        'utf8',
    );
  }
}
