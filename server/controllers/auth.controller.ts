import { Controller, Get, Inject, Logger, Post, Request, Response } from '@nestjs/common';
import _ from 'lodash';
import configLoader from '../config/config.loader';
import ServiceResponse from '../services/response/ServiceResponse';


@Controller('auth')
export default class AuthController {
  
  @Inject() private readonly logger: Logger;

  @Get('login')
  // @UseGuards(KeycloakOAuthGuard)
  login() {
    return { loginResult: 'success' };
  }

  @Get('checkLogin')
  checkLogin(@Request() request: any, @Response() response: any) {
    if (_.isEmpty(request.user) || !request.user.email) {
      return response.status(401).json(new ServiceResponse({ checkResult: false }));
    }
    return response.status(200).json(new ServiceResponse({ checkResult: true, username: request.user.email, csrfToken: request.csrfToken() }));
  }

  @Post('custom/callback')
  loginCallback( @Response() response: any) {
   return response.redirect(configLoader.getConfig().strategyOptions.loginRedirectUrl || configLoader.getConfig().strategyOptions.clientBaseUrl);
  }
}
