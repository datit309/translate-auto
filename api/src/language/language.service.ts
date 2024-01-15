import { Injectable } from '@nestjs/common';
const { Translate } = require('@google-cloud/translate').v2;
import { resolve } from 'path';
const fs = require('fs');

@Injectable()
export class LanguageService {
  constructor() {
    const targetFilePHP = true; // true: PHP, false: JSON
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
    // return fs.unlink(resolve(process.cwd(), `locales/target_php/${fileName}.php`), (err) => {
    //   if (err) {
    //     console.error(err);
    //     return;
    //   }
    //   console.log('Delete file PHP success', fileName);
    //   //file removed
    // });
    return fs.writeFileSync(
        resolve(process.cwd(), `locales/target_php/${fileName}.json`),
        '',
        'utf8',
    );
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
