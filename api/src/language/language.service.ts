import { Injectable } from '@nestjs/common';
const { Translate } = require('@google-cloud/translate').v2;
import { resolve } from 'path';
const fs = require('fs');
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: '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',
  organization: "org-tigXEB3Ga29pTSLewurWDmLm",
});


@Injectable()
export class LanguageService {
  constructor() {
    const targetFilePHP = false; // true: PHP, false: JSON
    const variableArrayPHP = '$langs'; // Biến hứng dữ liệu khi dịch sang PHP
    const listCodeLanguages = [ // Danh sách ngôn ngữ cần dịch
      // 'ru', // Nga
      // 'es', // Tay Ban Nha
      // 'fr', // Phap
      // 'de', // Duc
      // 'ja', // Nhat
      // 'ko', // Han
      // 'pt', // Bo Dao Nha
      // 'ar', // a rap
      // 'it', // italy
      'vi', // viet nam
      // 'zh', // china
      // 'th', // thái
      // 'id', // indonesia
      // 'my', // malaysia
      // 'lo', // lào
      // 'km' // campuchia
    ];
    listCodeLanguages.forEach((language) => {
      this.translateAPI('en',language, targetFilePHP, variableArrayPHP); //JSON
    })
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
  async translateAPI(source = 'en', target: string, exportPHP = false, variablePHP = '$langs') {
    // ===================== v2
    const translate = new Translate({
      key: process.env.GGC_KEY_TRANSLATE,
    });
    try {
      // Đọc file JSON
      const jsonData = await this.readFile(source);
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
