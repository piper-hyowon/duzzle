import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { description, name, version } from '../package.json';
import { AuthorizationToken } from './constant/authorization-token';
import { ExceptionCode } from './constant/exception';

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle(name)
    .setVersion(version)
    .setDescription(
      `\n\
      API 공통\n\n\n\
        * 잘못된 요청 파라미터 - 400 Bad Request\n\
        {\n\
          "code": ${ExceptionCode.InvalidParameter},\n\
          "message": "",\n\
        }\n\n\
        * 서버 에러 - 500 Internal Server Error \n\
        {\n\
          "code": ${ExceptionCode.InternalServerError},\n\
          "message": "",\n\
        }\n\
        `,
    )
    .addBearerAuth(
      {
        name: 'Authorization',
        in: 'header',
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'User Authorization Token',
      },
      AuthorizationToken.BearerUserToken,
    )
    .addBearerAuth(
      {
        name: 'Authorization',
        in: 'header',
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Web3Auth Id Token',
      },
      AuthorizationToken.BearerLoginIdToken,
    )
    .build();

  const SWAGGER_UI_CONSTANTS = {
    TOPBAR: {
      BACKGROUND_COLOR: '#ff69b4',
    },
  };
  const customCss = `
 .topbar-wrapper { content:url('https://duzzle-s3-bucket.s3.ap-northeast-2.amazonaws.com/a%E1%84%83%E1%85%A5%E1%84%8C%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A9%E1%84%80%E1%85%A9.png'); width:242px; height:auto; }
  .topbar-wrapper svg { visibility: hidden; }
  .swagger-ui .topbar { background-color: ${SWAGGER_UI_CONSTANTS.TOPBAR.BACKGROUND_COLOR}; }


 /* GET 메소드 색상 */
  .swagger-ui .opblock-get .opblock-summary-method {
    background-color: #ffb6c1 !important; /* 연한 핑크 */
    color: white !important;
  }

  /* POST 메소드 색상 */
  .swagger-ui .opblock-post .opblock-summary-method {
    background-color: #ff69b4 !important; /* 진한 핑크 */
    color: white !important;
  }

  /* PUT 메소드 색상 */
  .swagger-ui .opblock-put .opblock-summary-method {
    background-color: #ff1493 !important; /* 진한 핑크 */
    color: white !important;
  }

  /* DELETE 메소드 색상 */
  .swagger-ui .opblock-delete .opblock-summary-method {
    background-color: #ff4500 !important; /* 주황색 */
    color: white !important;
  }

  /* PATCH 메소드 색상 */
  .swagger-ui .opblock-patch .opblock-summary-method {
    background-color: #db7093 !important; /* 핑크 계열 */
    color: white !important;
  }

  /* OPTIONS 메소드 색상 */
  .swagger-ui .opblock-options .opblock-summary-method {
    background-color: #ffdab9 !important; /* 피치 색상 */
    color: white !important;
  }

  /* 기타 스타일 */
  .swagger-ui .opblock-summary-method {
    border-radius: 10px; /* 둥근 모서리 */
    padding: 5px 10px; /* 박스 안의 텍스트 패딩 */
  }
    /* 상단 바 배경색 */
    .swagger-ui .topbar { 
      background-color: #ff69b4; /* 핑크 */
    }

    /* 메인 설명 섹션 텍스트 */
    .swagger-ui .info { 
      color: #ff1493; /* 진한 핑크 */
    }

    /* API 블록 배경 */
    .swagger-ui .opblock { 
      background-color: #ffe4e1; /* 밝은 핑크 */
    }

    /* API 요청 버튼 색상 */
    .swagger-ui .btn.execute { 
      background-color: #ff69b4; /* 핑크 */
      color: white;
    }

    /* API 요청 상태 코드 블록 */
    .swagger-ui .responses-inner h4 { 
      color: #ff69b4; /* 핑크 */
    }

    /* 일반 버튼 (예: Authorize) */
    .swagger-ui .btn.authorize { 
      background-color: #ff69b4; /* 핑크 */
      border-radius: 10px; /* 둥근 모서리 */
    }

    /* 텍스트 박스 테두리 색상 */
    .swagger-ui input[type="text"], .swagger-ui textarea { 
      border-color: #ff69b4; /* 핑크 */
    }

    /* 헤더 글씨 스타일 */
    .swagger-ui .opblock-tag { 
      font-family: 'Comic Sans MS', cursive; /* 귀여운 폰트 */
      color: #ff69b4; /* 핑크 */
    }

     /* 첫 번째 엔드포인트의 배경색 변경 */
  .swagger-ui .opblock:nth-child(1) {
    background-color: #ffe4e1; /* 밝은 핑크 */
  }

  /* 두 번째 엔드포인트의 텍스트 색상 변경 */
  .swagger-ui .opblock:nth-child(2) .opblock-summary {
    color: #ff69b4; /* 핑크 */
  }

  /* 특정 HTTP 메소드 별 스타일 (POST 요청의 버튼 색상) */
  .swagger-ui .opblock-post .opblock-summary-method {
    background-color: #ff69b4; /* 핑크 */
    color: white;
  }

  /* 특정 엔드포인트의 제목 텍스트 꾸미기 */
  .swagger-ui .opblock:nth-child(1) .opblock-summary-path {
    font-family: 'Comic Sans MS', cursive; /* 귀여운 폰트 */
    font-size: 18px;
    color: #ff1493; /* 진한 핑크 */
  }
  `;

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('documentation', app, document, {
    customfavIcon:
      'https://duzzle-s3-bucket.s3.ap-northeast-2.amazonaws.com/duzzlefavi.png',
    customSiteTitle: 'Duzzle API Documentation',
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customCss,
  });
}
