# Duzzle (모노레포)

**🔗 데모 사이트: [준비중]()**


## ⚠️ 이 브랜치는 서비스 이해를 돕기 위한 데모 버전입니다.
## 
> **전체 기능이 구현된 원본 코드는 아래 링크에서 확인할 수 있습니다:**
> 
> **원본 프로젝트:** 
> - 백엔드: [Duksung-Kkureogi/duzzle-be](https://github.com/Duksung-Kkureogi/duzzle-be)
> - 프론트엔드: [Duksung-Kkureogi/duzzle-contract](https://github.com/Duksung-Kkureogi/duzzle_fe.git)
> - 스마트 컨트랙트: [Duksung-Kkureogi/duzzle-contract](https://github.com/Duksung-Kkureogi/duzzle-contract.git)
> 
> 
> ## 데모 버전 배경 및 특징
>
>**배경:**
>- 실제 블록체인 서비스는 인프라 및 RPC 비용 이슈로 인해 현재 중단된 상태
>- 이 데모는 서비스의 핵심 기능과 사용자 경험을 보여주기 위해 제작됨
>
>**주요 특징:**
>- 백엔드와 블록체인 통신이 제거된 프론트엔드 전용 버전
>- 암호화폐 지갑 연동 로그인 생략 (자동 로그인 상태로 유지)
>- 백엔드 API, WebSocket 통신 생략
>- `axios`, `web3auth` 등의 외부 의존성 제거하여 성능 최적화
>- 블록체인 관련 데이터(ERC20/ERC721 토큰 보유 현황, 거래 기록 등)는 가상 데이터로 대체
>- 퀘스트 시스템 수정: 원본의 백엔드 기반 랜덤 퀘스트 할당 대신, 사용자가 직접 퀘스트를 선택할 수 있는 버튼 방식으로 변경
>- ERC20 토큰 보상 지급 과정 생략- 로그아웃 기능 비활성화 (항상 로그인 상태 유지)
>- ERC721 토큰(NFT)에 대한 소유권 이전 생략
>    - 퍼즐 조각 NFT 발행, 조각/아이템 NFT 거래