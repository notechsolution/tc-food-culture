import { Global, Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggingMiddleware } from '../nestjs/middlewares/logging.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import FileUtils from '../util/file.util';
import configLoader from '../config/config.loader';
import { KeycloakAuthMiddleware } from '../nestjs/middlewares/keycloakAuth.middleware';
import { KeycloakCallbackMiddleware } from '../nestjs/middlewares/keycloakCallback.middleware';
import { AuthMiddleware } from '../nestjs/middlewares/auth.middleware';

const controllers = FileUtils.loadClassesFromFiles('dist/server/**/*.controller.js');
const services = FileUtils.loadClassesFromFiles('dist/server/**/*.service.js');
const models = FileUtils.loadModelsFromFiles('dist/server/**/*.entity.js');

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configLoader.getConfig]
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('mongodbURI')
      }),
      inject: [ConfigService]
    }),
    MongooseModule.forFeature(models)
  ],
  controllers: controllers,
  providers: [Logger].concat(services),
  exports: [Logger]
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggingMiddleware, AuthMiddleware).forRoutes('*');
    consumer.apply(KeycloakAuthMiddleware).forRoutes('auth/login');
    consumer.apply(KeycloakCallbackMiddleware).forRoutes('auth/custom/callback');
  }
}
