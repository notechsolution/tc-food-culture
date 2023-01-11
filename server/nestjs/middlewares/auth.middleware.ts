import { Injectable, NestMiddleware } from '@nestjs/common';
import _ from 'lodash';
import ServiceResponse from '../../services/response/ServiceResponse';

const whiteListAPI = [
  '/api/auth/*',
  '/api/session/*',
  '/api/billing',
  '/api/billing/chargedItems'
];

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  use(request: any, response: any, next: (err?: any) => any): void {
    if (this.isWhiteListAPI(request.originalUrl)) {
      return next();
    }

    if (request.isAuthenticated()) {
      return next();
    }
    
    return response.status(401).json(new ServiceResponse({ submLoginRequired: true }));

  }

  isWhiteListAPI(url: string) {
    return _.some(whiteListAPI, (pattern: string) => {
      return url.match(pattern);
    });
  }
}
