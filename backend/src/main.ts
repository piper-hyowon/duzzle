import { NestFactory, Reflector } from '@nestjs/core';
import { MainModule } from './module/main.module';
import {
  BadRequestException,
  ClassSerializerInterceptor,
  HttpStatus,
  RequestMethod,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from './module/config/config.service';

import { ServerResponse } from 'http';
import morganBody from 'morgan-body';
import { json, urlencoded, Request, NextFunction } from 'express';
import helmet from 'helmet';
import { v4 as uuidV4 } from 'uuid';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { setupSwagger } from './setup-swagger';
import { ZoneService } from './module/zone/zone.service';
import { LogProvider } from './provider/log.provider';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create<NestExpressApplication>(
    MainModule,
    new ExpressAdapter(),
    {
      cors: true,
    },
  );

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.setBaseViewsDir('./views');
  app.setViewEngine('hbs');

  const configService: ConfigService = app.get<ConfigService>(ConfigService);

  const isProduction = configService.isProduction();
  const port = configService.get<number>('PORT');

  app.setGlobalPrefix(configService.get<string>('API_VERSION'), {
    exclude: [
      { path: '/metadata(.*)', method: RequestMethod.GET },
      { path: '/health', method: RequestMethod.GET },
      { path: '/maintenance', method: RequestMethod.GET },
      { path: '/version', method: RequestMethod.GET },
    ],
  });

  app.use((_req: Request, _res: Response, next: NextFunction) =>
    LogProvider.scope(uuidV4(), next),
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  app.use(json({ limit: configService.get<string>('HTTP_BODY_SIZE_LIMIT') }));

  app.use(
    urlencoded({
      extended: true,
      limit: configService.get<number>('HTTP_URL_LIMIT'),
    }),
  );

  morganBody(app.getHttpAdapter().getInstance(), {
    noColors: true,
    prettify: false,
    includeNewLine: false,
    logRequestBody: true,
    logAllReqHeader: true,
    skip(_req: Request, _res: ServerResponse) {
      if (_req.url === '/health') {
        return true;
      }

      // return isProduction ? res.statusCode < 400 : false;
      return false;
    },
    stream: {
      write: (message: string) => {
        LogProvider.info(message, 'Http');
        return true;
      },
    },
  });

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  app.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      transform: true,
      // dismissDefaultMessages: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      disableErrorMessages: false,
      validationError: {
        target: true,
        value: true,
      },
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );

  if (!isProduction) {
    setupSwagger(app);
  }

  await app.listen(port);

  // zones.ts 에 정의한 zone 목록으로 DB 초기화
  // await app.get<ZoneService>(ZoneService).setZones();

  console.info(
    `Server ${configService.get<string>('ENV')} running on port ${port}`,
    'APP',
  );
}
bootstrap();
