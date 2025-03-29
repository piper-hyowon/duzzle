export interface UserDto {
  id: number;
  email: string;
  name: string;
  level: number;
  walletAddress: string;
  createdAt: Date;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}

export interface LoginRequest {
  idToken: string;
  loginType: string;
  walletAddress: string;
}
