import { Inject, Injectable, Logger, LoggerService, NestMiddleware } from '@nestjs/common';
import { performance } from 'perf_hooks';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService
  ) {
  }
  
  use(request:any, response:any, next:(err?: any) => any): void {
    //only log those back-end api request
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    const isApiRequestUrl = request.originalUrl.match('^/api');
    if (isApiRequestUrl) {
      const requestTime = new Date();
      const start = performance.now();
      const end = response.end;
      response.end = function(chunk, encoding) {
        const usedTime = performance.now() - start;
        self.logger.log(`Inbound request method=${request.method}, url=${request.originalUrl}, request_at=${requestTime.toISOString()}, status_code=${response.statusCode}, used_time=${usedTime.toFixed(3)}`);
        response.end = end;
        response.end(chunk, encoding);
      };
    }
    next();
  }
}
