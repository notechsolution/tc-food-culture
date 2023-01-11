// import { KeycloakOAuthAuthenStrategy } from 'fwk-passport-keycloak';
import passport from 'passport';
import configLoader from '../config/config.loader';

function initPassport(app) {
  const config = configLoader.getConfig();
  const strategyOptions = config.strategyOptions;
  // const strategy = new KeycloakOAuthAuthenStrategy({
  //   app: app,
  //   passport: passport,
  //   oauthserverBaseUrl: strategyOptions.oauthserverBaseUrl,
  //   realm: strategyOptions.realm,
  //   clientId: strategyOptions.client_id,
  //   clientSecret: strategyOptions.password,
  //   oauthScope: strategyOptions.oauthScope,
  //   clientBaseUrl: strategyOptions.clientBaseUrl,
  //   verifyBySignature: true,
  //   identityMetadata: `${strategyOptions.oauthserverBaseUrl}/auth/realms/${strategyOptions.realm}/.well-known/openid-configuration`,
  //   callbackUrl: '/api/auth/custom/callback',
  //   logoutRedirectUrl: strategyOptions.logoutRedirectUrl || strategyOptions.clientBaseUrl,
  //   useFragmentRedirect: false,
  //   storeTokenInCookie: false,
  //   checkState: false,
  //   enableRefreshToken: true,
  //   useSession: true
  // });
  //
  // passport.use('KeycloakOAuthAuth', strategy);
}

export {
  initPassport
};
