import { Injectable, NestMiddleware } from '@nestjs/common';
import passport from 'passport';

@Injectable()
export class KeycloakCallbackMiddleware implements NestMiddleware {
  
  use(request:any, response:any, next:(err?: any) => any): void {
    passport.authenticate('keycloakOAuthCallback')(request, response, next);
  }
}
