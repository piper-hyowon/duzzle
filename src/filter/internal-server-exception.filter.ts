import { ConfigService } from 'src/module/config/config.service';
import {
  ArgumentsHost,
  Catch,
  HttpStatus,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { ExceptionCode } from 'src/constant/exception';
import { ReportProvider } from 'src/provider/report.provider';

@Catch()
export class InternalServerErrorFilter extends BaseExceptionFilter {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();

    const { method, body, query, params, url, headers, _startTime } =
      http.getRequest();

    // Report
    if (!this.configService.isLocal()) {
      ReportProvider.error(exception, {
        method,
        body,
        query,
        params,
        url,
        headers,
        _startTime,
      });
    }

    // Error Log
    Logger.error(exception.message);
    Logger.error(exception.stack);

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      result: false,
      code: ExceptionCode.InternalServerError,
      message: '내부 서버 오류가 발생했습니다.',
    });
  }
}
