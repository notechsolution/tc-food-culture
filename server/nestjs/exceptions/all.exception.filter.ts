import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, LoggerService } from '@nestjs/common';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import * as _ from 'lodash';
import { ServiceError } from '../../services/response/ServiceError';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

  constructor(
    private readonly logger: LoggerService
  ) {}



  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const responseStatus = exception.status || exception.statusCode || exception.httpCode || HttpStatus.INTERNAL_SERVER_ERROR;
    this.logger.error(exception.stack);
    response.status(responseStatus).json(this.buildResponseData(exception, responseStatus));
  }

  private buildResponseData(error, status) {
    const responseError: ResponseError = {
      message: httpStatus[status].toString(),
      errors: []
    };

    if (process.env.NODE_ENV === 'development') {
      responseError.stack = error.stack;
    }

    if (error instanceof ServiceError) {
      responseError.stack = (process.env.NODE_ENV === 'development' && error.stack);
      responseError.errors = [{
        code: error.code,
        message: error.message
      }];
    } else if (error instanceof Error && Array.isArray(_.get(error, 'errors'))) {
      responseError.message = _.get(error, 'errors.message');
    } else {
      responseError.errors = [{
        code: error.code,
        message: error.message
      }];
    }

    return {
      error: responseError
    };
  }
}

interface ResponseError {
  message: string,
  stack?: string,
  errors?: CustomError[]
}

interface CustomError {
  code: number,
  message: string
}
