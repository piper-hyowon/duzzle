import { Module, OnModuleInit } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import qs from 'qs';
import { HttpClientService } from './http-client.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        // timeout: 10000,
        maxRedirects: 5,
        retries: 1,
        retryDelay: () => 50,
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: 'repeat' }),
      }),
    }),
  ],
  providers: [HttpClientService],
  exports: [HttpClientService],
})
export class HttpClientModule implements OnModuleInit {
  constructor(private readonly httpService: HttpService) {}

  public onModuleInit(): void {
    this.httpService.axiosRef.interceptors.request.use(
      (request) => request,
      (error) => {
        throw error;
      },
    );

    this.httpService.axiosRef.interceptors.response.use(
      (response) => response,
      (error) => {
        throw error;
      },
    );
  }
}
