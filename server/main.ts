if(!process.env.NODE_ENV){
    process.env.NODE_ENV = 'development';
}

import { NestFactory } from '@nestjs/core';
import history from 'connect-history-api-fallback';
import cookieParser from 'cookie-parser';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app/app.module';
import configLoader from './config/config.loader';
import loggerConfig from './logger/logger.config';
import { AllExceptionsFilter } from './nestjs/exceptions/all.exception.filter';
import SessionStore from './services/sessionStore.service';
// import { startupJob } from './util/AgendaJobSetup';
import { conditionalCSRF } from './util/csurf.util';
import { initPassport } from './util/PassportUtil';
async function bootstrap() {
    const logger = WinstonModule.createLogger(loggerConfig);
    await configLoader.loadConfig(logger);
    const app = await NestFactory.create(AppModule, {
        logger: logger
    });
    app.use(helmet.hidePoweredBy());
    app.use(helmet.hsts());
    app.use(helmet.dnsPrefetchControl());
    app.use(helmet.expectCt());
    app.use(helmet.frameguard({ action: 'SAMEORIGIN' }));
    app.use(helmet.ieNoOpen());
    app.use(helmet.noSniff());
    app.use(helmet.permittedCrossDomainPolicies());
    app.use(helmet.referrerPolicy());
    app.use(helmet.xssFilter());
    app.setGlobalPrefix('api');
    app.enableCors();

    const sessionStore = await app.resolve(SessionStore);
    const sessionConfig = {
        name: 'SUBM-SID',
        rolling: true,
        saveUninitialized: false,
        resave: false,
        secret: 'subm-console-session-secret',
        store: sessionStore,
        cookie: {
            maxAge: 1000 * 60 * 30
        }
    } as any;

    app.use(session(sessionConfig));
    app.use(cookieParser());

    initPassport(app.getHttpAdapter());

    app.use('/api/*',conditionalCSRF);
    app.useGlobalFilters(new AllExceptionsFilter(logger));
    // app.useGlobalGuards(new DefaultAuthGuard());
    app.use((req, res, next) => {
        if (req.originalUrl.match('^/api')) {
            next();
        } else {
            history()(req, res, next);
        }
    });

    if (process.env.NODE_ENV !== 'development') {
        logger.log('Using production build');
        app.use(express.static('dist/client'));
    }

    const port = process.env.PORT || 3001;
    await app.listen(port, () => {
        logger.log('Listening on port ' + port);
    });
}

bootstrap();


