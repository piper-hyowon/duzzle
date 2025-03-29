import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ExceptionCode } from 'src/constant/exception';
import { ConfigService } from 'src/module/config/config.service';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const isProduction = this.configService.isProduction();

    response
      .status(
        exception.getStatus ? exception.getStatus() : HttpStatus.NOT_FOUND,
      )
      .json({
        result: false,
        code: isProduction ? 'error' : ExceptionCode.PageNotFound,
        message: isProduction ? 'error' : exception.message,
      });
  }
}
