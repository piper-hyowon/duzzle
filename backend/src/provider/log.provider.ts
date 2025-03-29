import { AsyncLocalStorage } from 'async_hooks';
import { SupportedEnvironment } from '../module/config/Configuration';
import { Logger } from '@nestjs/common';

export class LogProvider {
  private static als = new AsyncLocalStorage();

  static scope(store: string, callback: () => unknown): unknown {
    return this.als.run(store, callback);
  }

  static getTraceId(): string {
    return (this.als.getStore() as string) || '0';
  }

  static info(message: string, moduleName: string): void;
  static info(message: string, data: unknown, moduleName: string): void;
  static info(...args: unknown[]): void {
    let message: string;
    let data: unknown;
    let moduleName: string;

    if (args.length === 2) {
      message = args[0] as string;
      moduleName = args[1] as string;
    } else {
      message = args[0] as string;
      data = args[1];
      moduleName = args[2] as string;
    }

    Logger.log(
      process.env.NODE_ENV === SupportedEnvironment.local
        ? JSON.stringify(
            {
              message,
              data,
              moduleName,
              traceId: this.als.getStore() || '0',
            },
            undefined,
            4,
          )
        : JSON.stringify({
            message,
            data,
            moduleName,
            traceId: this.als.getStore() || '0',
          }),
    );
  }
}
