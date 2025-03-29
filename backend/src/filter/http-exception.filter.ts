import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from 'src/module/config/config.service';
import { ApplicationException } from 'src/types/error/application-exceptions.base';

@Catch(ApplicationException)
export class HttpExceptionFilter<T extends ApplicationException>
  implements ExceptionFilter
{
  constructor(private readonly configService: ConfigService) {}

  catch(exception: T, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const isProduction = this.configService.isProduction();

    response.status(exception.getStatus()).json({
      result: false,
      code: isProduction ? 'error' : exception.code,
      message: isProduction ? 'error' : exception.message,
    });
  }
}
