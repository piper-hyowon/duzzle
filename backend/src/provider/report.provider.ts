import { Logger } from '@nestjs/common';
import axios from 'axios';
import { SeverityLevel } from './constants/severity-level';

export class ReportProvider {
  static error(
    error: Error,
    extra?: Record<string, unknown>,
    moduleName?: string,
  ): void {
    this.report({
      severity: SeverityLevel.Error,
      title: error.message,
      error,
      extra,
      moduleName,
    });
  }

  static info(
    message: string,
    extra?: Record<string, unknown>,
    moduleName?: string,
    hookUrl?: string,
  ): void {
    this.report({
      severity: SeverityLevel.Info,
      title: message,
      extra,
      moduleName,
      hookUrl,
    });
  }

  static warn(
    error: Error,
    extra?: Record<string, unknown>,
    moduleName?: string,
  ): void {
    this.report({
      severity: SeverityLevel.Warning,
      title: error.message,
      error,
      extra,
      moduleName,
    });
  }

  private static report(params: {
    severity: SeverityLevel;
    title: string;
    error?: Error;
    extra?: Record<string, unknown>;
    moduleName?: string;
    hookUrl?: string;
  }): void {
    const { severity, title, error, extra, moduleName, hookUrl } = params;
    let color: number;
    switch (severity) {
      case SeverityLevel.Error:
        color = 15400960;
        break;
      case SeverityLevel.Warning:
        color = 16744770;
        break;

      default:
        color = 3742673;
        break;
    }

    // Send to Discord
    const data = {
      embeds: [
        {
          title: [severity, moduleName, title].filter(Boolean).join(' - '),
          color,
          description: error?.stack,
          fields: Object.entries({ ...extra }).map(([key, value]) => ({
            name: key,
            value: JSON.stringify(value),
            inline: true,
          })),
        },
      ],
    };

    axios
      .post(hookUrl ?? process.env.DISCORD_WEBHOOK_URL!, data)
      .catch((err) => Logger.error(err));
  }
}
