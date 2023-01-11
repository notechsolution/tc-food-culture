import { HttpException } from '@nestjs/common';
import _ from 'lodash';

export const DEFAULT_ERR_CODE = 99999999;
export class ServiceError extends HttpException  {
    code: number;
    message: string;
    data: any;
    constructor(msg = '', code = DEFAULT_ERR_CODE, data = null, status=500) {
        super(/E\d{8}-/.test(msg) ? msg : `E${code}-${msg}`, status);
        this.code = code;
        this.message = msg;
        this.data = data;
        Object.setPrototypeOf(this, ServiceError.prototype);
    }

    toString() {
        if (_.isNull(this.data)) {
            return super.toString();
        }
        return `Params: ${JSON.stringify(this.data)} ${super.toString()}`;
    }
}