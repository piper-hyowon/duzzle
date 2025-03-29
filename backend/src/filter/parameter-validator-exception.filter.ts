import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { ExceptionCode } from 'src/constant/exception';
import { ConfigService } from 'src/module/config/config.service';

@Catch(BadRequestException)
export class ValidationExceptionFilter
  implements ExceptionFilter<BadRequestException>
{
  constructor(private readonly configService: ConfigService) {}
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const exceptionObj = exception.getResponse() as Record<string, any>;

    const isProduction = this.configService.isProduction();

    response.status(exception.getStatus()).json({
      result: false,
      code: isProduction ? 'error' : ExceptionCode.InvalidParameter,
      message: isProduction ? 'error' : exceptionObj.message.toString(),
    });
  }
}
