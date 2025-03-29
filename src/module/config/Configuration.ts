import { Expose, plainToInstance, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsPositive,
  IsString,
  validateSync,
} from 'class-validator';
import path from 'path';
import { LogProvider } from 'src/provider/log.provider';

export enum SupportedEnvironment {
  local = 'local',
  development = 'dev',
  production = 'prod',
}

export class EnvironmentVariables {
  // STAGE Environment
  @IsEnum(SupportedEnvironment)
  @Expose({ name: 'NODE_ENV' })
  readonly ENV: SupportedEnvironment;

  // API SERVICE VARIABLE
  @IsPositive()
  @Type(() => Number)
  @Expose()
  readonly PORT: number;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly API_VERSION: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly HTTP_BODY_SIZE_LIMIT: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly HTTP_URL_LIMIT: string;

  // DB
  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly DB_HOST: string;

  @IsPositive()
  @Type(() => Number)
  @Expose()
  readonly DB_PORT: number;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly DB_NAME: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly DB_USER: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly DB_PASSWORD: string;

  @IsBoolean()
  @Type(() => Boolean)
  @Expose()
  readonly DB_USE_SYNCHRONIZE: boolean;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly DB_SSL_CA: string;

  // JWT
  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly JWT_SECRET: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly JWT_ACCESS_EXPIRES_IN: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly JWT_REFRESH_EXPIRES_IN: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly WEB3AUTH_JWKS_ENDPOINT_SOCIAL_LOGIN: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly WEB3AUTH_JWKS_ENDPOINT_EXTERNAL_WALLET: string;

  // MAILGUN
  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly MAILGUN_USERNAME: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly MAILGUN_KEY: string;

  // RPC URL
  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly BLOCKCHAIN_POLYGON_RPC_ENDPOINT: string;

  // RPC URL for Collecting Tx Logs Schdeuler
  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly BLOCKCHAIN_POLYGON_RPC_ENDPOINT_FOR_TX_LOGS: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly BLOCKCHAIN_POLYGON_RPC_ENDPOINT_FOR_TX_LOGS_2: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  BLOCKCHAIN_POLYGON_RPC_ENDPOINT_FOR_TX_LOGS_3: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  BLOCKCHAIN_POLYGON_RPC_ENDPOINT_FOR_TX_LOGS_4: string;

  // In-momory DB
  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly REDIS_PATH: string;

  // AWS
  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly AWS_REGION: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly AWS_S3_ACCESS_KEY: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly AWS_S3_SECRET_ACCESS_KEY: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly AWS_S3_BUCKET_NAME: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly OWNER_PK_AMOY: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly DISCORD_WEBHOOK_URL: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly DISCORD_WEBHOOK_URL_TX_COLLECT: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly DISCORD_WEBHOOK_URL_SUPPORT: string;
}

export const getEnvFilePath = (): string =>
  path.join(
    process.cwd(),
    `/env/.env.${process.env.NODE_ENV ?? SupportedEnvironment.development}`,
  );

export type EnvironmentKey = keyof EnvironmentVariables;

export function validate(
  configuration: Record<string, unknown>,
): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, configuration, {
    excludeExtraneousValues: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length) {
    for (const error of errors) {
      const { property, value, constraints } = error;
      LogProvider.info(
        `[${property}: ${value}] ${JSON.stringify(constraints)}`,
        'Environment',
      );
    }

    throw new Error(Object.values(errors[0].constraints!).toString());
  }

  Object.entries(validatedConfig).map((value: [string, unknown]) =>
    LogProvider.info(value.join(':'), 'Environment'),
  );

  return validatedConfig;
}
