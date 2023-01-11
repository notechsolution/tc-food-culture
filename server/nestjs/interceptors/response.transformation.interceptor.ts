import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import ServiceResponse from '../../services/response/ServiceResponse';

@Injectable()
export class ResponseTransformationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(map(data => {
        return new ServiceResponse(data);
      }));
  }
}
