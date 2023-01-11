import { Injectable, NestMiddleware } from '@nestjs/common';
import passport from 'passport';

@Injectable()
export class KeycloakAuthMiddleware implements NestMiddleware {
  
  use(request:any, response:any, next:(err?: any) => any): void {
    passport.authenticate('KeycloakOAuthAuth')(request, response, next);
  }
}
