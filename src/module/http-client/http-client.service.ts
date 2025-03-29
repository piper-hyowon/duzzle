import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { RawAxiosRequestHeaders } from 'axios';
import { catchError, lastValueFrom, retry } from 'rxjs';
import { LogProvider } from 'src/provider/log.provider';

@Injectable()
export class HttpClientService {
  constructor(private readonly httpService: HttpService) {}

  async sendGetRequest<T>(uri: string, params: Object): Promise<T> {
    const url: string = `${uri}?${Object.entries(params)
      .filter(([_, value]) => value !== null && value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`;

    LogProvider.info(url, params, HttpClientService.name);

    const res$ = this.httpService.get(url).pipe(
      retry(2),
      catchError((err) => {
        throw err;
      }),
    );

    const { data } = await lastValueFrom(res$);

    return <T>data.data;
  }

  async sendPostRequest<T>(
    url: string,
    body: Object,
    headers?: RawAxiosRequestHeaders,
  ): Promise<{ result: boolean; data: T; status?: number; error?: any }> {
    LogProvider.info(
      url,
      `${HttpClientService.name}.${this.sendPostRequest.name}`,
    );
    try {
      const res$ = this.httpService.post(url, body, { headers });
      const { data } = await lastValueFrom(res$);

      LogProvider.info(
        'RESPONSE',
        `${JSON.stringify(data)}`,
        `${HttpClientService.name}.${this.sendPostRequest.name}`,
      );

      return { result: true, data };
    } catch (err) {
      return {
        result: false,
        data: null,
        error: err?.response?.data,
        status: err?.response?.status,
      };
    }
  }
}
