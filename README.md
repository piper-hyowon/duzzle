# Duzzle (더즐)

블록체인 기반 캠퍼스 NFT 퍼즐 플랫폼

## Overview

학교 건축물을 NFT 퍼즐로 만들어 사용자들이 함께 완성하는 Web3 플랫폼입니다.
Web3Auth 소셜 로그인으로 암호화폐 지갑 없이도 NFT를 경험할 수 있습니다.

**Links**: [Demo](https://try-duzzle.com) | [Backend](https://github.com/Duksung-Kkureogi/duzzle-be) | [Frontend](https://github.com/Duksung-Kkureogi/duzzle_fe) | [Contracts](https://github.com/Duksung-Kkureogi/duzzle-contract)

<details>
<summary>📌 데모 버전 안내</summary>

현재 데모는 프론트엔드 전용 버전입니다.
- **배경**: 실제 서비스는 RPC 비용 이슈로 중단
- **특징**: 백엔드/블록체인 통신 제거, 가상 데이터로 핵심 기능 체험 가능
- **원본 코드**: 완전한 구현은 GitHub 리포지토리에서 확인

</details>

## Tech Stack

- **Smart Contract**: Solidity 0.8.24, Hardhat, OpenZeppelin
- **Blockchain**: Polygon Amoy Testnet
- **Backend**: TypeScript, NestJS, TypeORM, Socket.io
- **Database**: PostgreSQL, Redis
- **Frontend**: React, Vite, Web3Auth
- **Infrastructure**: DigitalOcean Droplet, AWS S3, GitHub Actions

## Architecture

### Service Architecture
<div align="center">
  <img width="600" alt="Service Architecture" src="https://github.com/user-attachments/assets/9f02d913-6916-47a2-be1d-2c26063493e1" />
</div>

### Contract Structure
<div align="center">
  <img width="600" alt="Contract Structure" src="https://github.com/user-attachments/assets/67ad0147-228f-468d-99d6-55e6183d98b5" />
</div>

## Key Features

### 1. Web3 온보딩 간소화
Web3Auth 소셜 로그인으로 지갑 생성/관리 과정 제거

### 2. 안전한 P2P NFT 거래
사용자는 approve만 수행하고 백엔드가 BACKEND_ROLE로 거래 실행

### 3. 시즌제 NFT 발행 시스템
시즌별 제한된 수량 발행으로 희소성 보장, offset으로 tokenId 충돌 방지

### 4. 실시간 협업 퍼즐 게임
WebSocket 기반 실시간 미니게임과 퍼즐 완성 현황 공유

## Technical Implementation

### Smart Contracts

#### 컨트랙트 구성
- **PlayDuzzle.sol**: 게임 로직, 시즌 관리, 아이템 발행
- **NFTSwap.sol**: P2P NFT 거래 시스템
- **Dal.sol**: ERC-20 게임 화폐
- **MaterialItem.sol, BlueprintItem.sol, PuzzlePiece.sol**: ERC-721 NFT

#### 핵심 구현

**시즌 관리 및 토큰 ID 충돌 방지**
```solidity
// contracts/contracts/service/PlayDuzzle.sol
function startSeason(...) public onlyRole(DEFAULT_ADMIN_ROLE) {
    offset = offset + seasons[thisSeasonId].totalPieceCount;
    if (seasonIds.length > 0) {
        ++thisSeasonId;
    }
    // 시즌 데이터 설정...
}
```

**P2P NFT 거래 보안**
```solidity
// contracts/contracts/service/NFTSwap.sol
contract NFTSwap is ReentrancyGuard, AccessControl {
    bytes32 public constant BACKEND_ROLE = keccak256("BACKEND_ROLE");
    
    function executeNFTSwap(
        address[] calldata nftContractsGivenByA,
        uint256[] calldata tokenIdsGivenByA,
        address[] calldata nftContractsGivenByB,
        uint256[] calldata tokenIdsGivenByB,
        address userA,
        address userB
    ) external nonReentrant onlyRole(BACKEND_ROLE) {
        // 사용자 대신 백엔드가 안전하게 거래 실행
    }
}
```

**랜덤 아이템 획득**
```solidity
// contracts/contracts/library/Utils.sol
function getRandomNumber(uint256 from, uint256 to) internal view returns (uint256) {
    uint256 seed = uint256(
        keccak256(abi.encodePacked(block.timestamp, block.prevrandao))
    );
    // 다단계 해싱으로 예측 불가능한 랜덤 생성
    return ((result % (to - from)) + from);
}
```

### Backend

#### RPC 비용 최적화 스케줄러
```typescript
// backend/src/module/scheduler/transaction-collection.scheduler.service.ts

// UTC 시간대별로 RPC 제공자 자동 전환
@Cron('*/5 * 0-5 * * *', { timeZone: 'UTC' })
async collectBlockchainTransaction_0() {
    await this._collectBlockchainTransaction(RPCProvider.INFURA);
}

@Cron('*/5 * 6-11 * * *', { timeZone: 'UTC' })
async collectBlockchainTransaction_1() {
    await this._collectBlockchainTransaction(RPCProvider.DRPC);
}

// 제공자별 API 제한 관리
const ApiRequestLimits = {
    [RPCProvider.INFURA]: { rps: 10, maxBlockRange: 10_000 },
    [RPCProvider.DRPC]: { rps: 1, maxBlockRange: 10_000 },
    [RPCProvider.ANKR]: { rps: 25, maxBlockRange: 3_000 },
    [RPCProvider.CHAINSTACK]: { rps: 20, maxBlockRange: 100 }
};
```

#### 퀘스트 시스템
```typescript
// backend/src/module/quest/quest.service.ts
async getResult(userId: number | null, params: GetResultRequest): Promise<boolean> {
    // 시간 제한 내 정답 확인
    const isSucceeded = 
        dayjs().isBefore(
            dayjs(log.createdAt).add(quest.timeLimit * 1000 + latency)
        ) && quest.answer === answer.join(',');
    
    // 성공시 DAL 토큰 보상
    if (isSucceeded && !log.isGuestUser) {
        await this.smartContractInteraction.mintDalToken(
            user.walletAddress,
            QuestTokenReward
        );
    }
}
```

#### 블록체인 데이터 동기화
```typescript
// backend/src/module/blockchain/blockchain.transaction.service.ts
async syncAllNftOwnersOfLogs(logs: Partial<LogTransactionEntity>[]) {
    // NFT 소유권 변경 DB 반영
    await Promise.all([
        ...puzzlePieceMintedLogs.map(e =>
            this.puzzleRepositoryService.updateOwner(e.tokenId, e.to)
        ),
        ...blueprintMintedLogs.map(e =>
            this.itemRepositoryService.updateBlueprintOwner(e.tokenId, e.to)
        ),
        ...materialMintedLogs.map(e =>
            this.itemRepositoryService.upsertMaterialOwner(e.tokenId, e.to, e.contractAddress)
        )
    ]);
}
```

### Database

#### 주요 테이블
- `log_transaction`: 블록체인 트랜잭션 로그 (Transfer, Mint, Burn 이벤트)
- `log_quest`: 퀘스트 진행 상태 및 보상 지급 내역
- `port_allocations`: DB 인스턴스용 NodePort 할당 (30000-31999)
- `puzzle_pieces`, `items`: NFT 소유권 및 메타데이터

#### ERD
<details>
<summary> 전체 ERD 보기 (클릭시 확장) </summary>

<div align="center">
<a href="./duzzle_erd.png" target="_blank">
  <img src="./duzzle_erd_thumb.jpg" alt="ERD" width="800"/>
</a>
</div>

</details>


## Smart Contract Testing

Hardhat과 TypeScript로 작성된 테스트 코드로 스마트 컨트랙트 검증

### 주요 테스트 파일

**PlayDuzzle.test.ts**
- 랜덤 아이템 획득 로직 검증
- DAL 토큰 차감 및 NFT 발행 확인
- 퍼즐 조각 잠금해제 시 필요 재료 소각 검증
- 최대 발행량 초과시 SoldOutItems 에러 처리

**PlayDuzzle-second-season.test.ts**
- 시즌 전환 시 offset 증가 확인
- 이전 시즌 재료 아이템 재사용 가능 검증
- 시즌별 독립적인 tokenId 관리

**PlayDuzzleInitialization.test.ts**
- startSeason() 권한 검증 (onlyOwner)
- setZoneData() 20개 구역 설정 확인
- 시즌 데이터 저장 검증

```typescript
// test/PlayDuzzle.test.ts 예시
it("get puzzle piece nft burning required items", async function () {
    // 필요한 재료 민팅
    await _.playDuzzleInstance!.connect(addr1).getRandomItem();
    
    // 퍼즐 조각 잠금해제 (재료 소각)
    await _.playDuzzleInstance!.connect(addr1).unlockPuzzlePiece(3);
    
    // 소유권 확인
    expect(await _.puzzlePieceInstance!.ownerOf(4)).to.equal(addr1.address);
});
```