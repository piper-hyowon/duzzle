import { JwtService } from '@nestjs/jwt';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { verify, JwtHeader, decode } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import Web3 from 'web3';
import { randomUUID } from 'crypto';

import { ConfigService } from 'src/module/config/config.service';
import { UserRepositoryService } from '../repository/service/user.repository.service';
import {
  JWT,
  LoginJwtPayload,
  LoginRequest,
  LoginResponse,
  RefreshTokenDto,
  RefreshTokenPayload,
  UserDto,
} from './dto/auth.dto';
import { LoginType } from '../repository/enum/user.enum';
import { WelcomeMailData } from 'src/types/mail-data';
import { MailService } from '../email/email.service';
import { MailTemplate } from '../repository/enum/mail.enum';
import {
  IncorrectLoginInfo,
  InvalidatedRefreshTokenError,
  InvalidIdTokenError,
  InvalidWalletAddress,
} from 'src/types/error/application-exceptions/401-unautorized';
import { RefreshTokenIdsStorage } from './refresh-token-ids.storage';
import { ReportProvider } from 'src/provider/report.provider';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepositoryService: UserRepositoryService,
    private readonly mailService: MailService,

    @Inject(JwtService)
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {}

  private async getKey(
    isWalletLogin: boolean,
    header: JwtHeader,
  ): Promise<string> {
    const jwksUri: string = isWalletLogin
      ? this.configService.get<string>('WEB3AUTH_JWKS_ENDPOINT_EXTERNAL_WALLET')
      : this.configService.get<string>('WEB3AUTH_JWKS_ENDPOINT_SOCIAL_LOGIN');

    const client = jwksClient({
      jwksUri,
    });
    const publicKey = (await client.getSigningKey(header.kid)).getPublicKey();

    return publicKey;
  }

  private async verifyLoginIdToken(
    idToken: string,
    params: LoginRequest,
  ): Promise<any> {
    const isWalletLogin: boolean = params.loginType === LoginType.Metamask;
    let payload: any;
    try {
      const secret = await this.getKey(
        isWalletLogin,
        decode(idToken, { complete: true }).header,
      );
      payload = verify(idToken, secret);
    } catch (e) {
      Logger.error(this.verifyLoginIdToken.name, e.stack);

      throw new InvalidIdTokenError();
    }

    // TODO: Social Login 일 경우 body.app_pub_key, payload.wallets.app_pub_key 확인 필요
    if (
      isWalletLogin &&
      (payload?.['wallets'][0]?.['address'] as string).toLowerCase() !==
        params.walletAddress.toLowerCase()
    ) {
      throw new InvalidWalletAddress();
    }

    const loginProvider: string = payload?.aggregateVerifier || payload?.iss;
    if (!loginProvider.includes(params.loginType.toLowerCase())) {
      throw new IncorrectLoginInfo();
    }

    return payload;
  }

  async login(idToken: string, params: LoginRequest): Promise<LoginResponse> {
    const payload = await this.verifyLoginIdToken(idToken, params);
    const { walletAddress, loginType } = params;
    const checksummedAddresses = Web3.utils.toChecksumAddress(walletAddress);
    let user =
      await this.userRepositoryService.findUserByWalletAddress(
        checksummedAddresses,
      );

    // 이미 등록된 지갑 주소인데 요청 로그인 타입이 다름
    if (user && user?.loginType !== params.loginType) {
      throw new IncorrectLoginInfo();
    }
    if (!user) {
      user = await this.userRepositoryService.insertUser({
        loginType,
        walletAddress: checksummedAddresses,
        email: payload?.email,
      });

      if (user.email) {
        const mailData: WelcomeMailData = {
          email: user.email,
        };

        try {
          await this.mailService.sendMail(
            user.email,
            MailTemplate.Welcome,
            mailData,
          );
        } catch (err) {
          ReportProvider.warn(err, { email: user.email }, AuthService.name);
          Logger.error(err.message, err.stack);
        }
      }
    }

    const jwt: JWT = await this.generateTokens({
      walletAddress,
      id: user.id,
    });

    return {
      ...jwt,
      user: UserDto.from(user),
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub, refreshTokenId } =
        await this.jwtService.verifyAsync<RefreshTokenPayload>(
          refreshTokenDto.refreshToken,
        );
      const user = await this.userRepositoryService.getUserById(sub);
      const isValid = await this.refreshTokenIdsStorage.validate(
        user.id,
        refreshTokenId,
      );

      if (!isValid) {
        throw Error();
      }

      // Refresh Token Rotation
      // 한 번 사용된 refresh token 은 무효화 시키기
      await this.refreshTokenIdsStorage.invalidate(user.id);

      return this.generateTokens({
        id: user.id,
        walletAddress: user.walletAddress,
      });
    } catch {
      throw new InvalidatedRefreshTokenError();
    }
  }

  private async generateTokens(payload: LoginJwtPayload): Promise<JWT> {
    const refreshTokenPayload: RefreshTokenPayload = {
      refreshTokenId: randomUUID(),
      sub: payload.id,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<number>('JWT_ACCESS_EXPIRES_IN'),
      }),
      this.jwtService.signAsync(refreshTokenPayload, {
        expiresIn: this.configService.get<number>('JWT_REFRESH_EXPIRES_IN'),
      }),
    ]);
    await this.refreshTokenIdsStorage.insert(
      payload.id,
      refreshTokenPayload.refreshTokenId,
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
