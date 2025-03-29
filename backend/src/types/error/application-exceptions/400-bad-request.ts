import { ExceptionCode } from 'src/constant/exception';
import { ApplicationException } from '../application-exceptions.base';

export class NoOngoingQuestError extends ApplicationException {
  constructor() {
    super(ExceptionCode.NoOngoingQuest, 'No ongoing quest');
  }
}

export class InvalidParamsError extends ApplicationException {
  constructor() {
    super(ExceptionCode.InvalidParameter, 'Invalid Parameter');
  }
}

export class InvalidFileNameExtensionError extends ApplicationException {
  constructor() {
    super(
      ExceptionCode.InvalidFileNameExtension,
      'Invalid Filename Extension. Only JPG, PNG, JPEG and GIF files are allowed.',
    );
  }
}

export class InvalidFileNameCharatersError extends ApplicationException {
  constructor() {
    super(
      ExceptionCode.InvalidFilenameCharacters,
      'File names can only contain English letters (a-z, A-Z), numbers (0-9), Korean characters, underscores (_), hyphens (-), and periods (.)',
    );
  }
}

export class InsufficientNFTError extends ApplicationException {
  constructor(
    details: {
      name: string;
      required: number;
      available: number;
    }[] = [
      {
        name: '붉은 벽돌',
        required: 1,
        available: 0,
      },
      {
        name: '모래',
        required: 2,
        available: 1,
      },
    ],
  ) {
    super(
      ExceptionCode.InsufficientNFT,
      `NFT 불충분: \
    ${details.map((e) => `${e.name} ${e.required}개 필요, ${e.available}개 보유`).join(', ')}`,
    );
  }
}

export class NFTBalanceChangedError extends ApplicationException {
  constructor() {
    super(
      ExceptionCode.NFTBalanceChanged,
      '거래 취소: 현재 제안자가 제안한 NFT 를 보유하고 있지 않아서 거래 진행 불가',
    );
  }
}
