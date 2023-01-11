import { validate } from '@nestjs/class-validator';
import * as classTransformer from 'class-transformer';
import * as lodash from 'lodash';

export class ValidateUtil {
  private static instance: ValidateUtil;

  private constructor() {
  }

  static getInstance() {
    return this.instance || (this.instance = new ValidateUtil());
  }

  async validate(Clazz, data): Promise<any> {
    const obj = classTransformer.plainToClass(Clazz, data);
    const errors = await validate(obj, { whitelist: true, forbidNonWhitelisted: true });
    if (errors.length > 0) {
      console.info(errors);
      throw new Error(lodash.values(errors[0].constraints)[0]);
    }
    return obj;
  }
}