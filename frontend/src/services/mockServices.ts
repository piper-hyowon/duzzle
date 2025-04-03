/* eslint-disable @typescript-eslint/no-explicit-any */
import { SeasonHistoryResponse } from "../Data/DTOs/HistoryDTO";
import { QuestType, StartQuestResponse } from "../enum/quest.enum";
import { PuzzlePieceDto } from "../pages/Mainpage/dto";
import { ZONES } from "../util/zone";
import {
  CHRISTMAS_PUZZLES,
  countAvailableNfts,
  getBlueprintOrPuzzleNftBySeasonZoneId,
  getMaterialNftByContractId,
  getSeasonZoneById,
  getUserByWalletAddress,
  MOCK_BLUEPRINT_PUZZLE_NFTS,
  MOCK_MATERIAL_NFTS,
  MOCK_NFT_EXCHANGES,
  MOCK_USER2,
  MOCK_USER3,
  MOCK_USER_DATA,
  MY_PUZZLES,
  STORIES,
} from "./mockData";
import {
  NftExchangeOfferStatus,
  NFTType,
  OtherUserProfileResponse,
  ProfileType,
  ResponsesList,
  StoryProgressResponse,
  UserPuzzleDetailResponse,
  UserPuzzleResponse,
} from "./type";

export const mockApiService = {
  story: {
    list: (): ResponsesList<StoryProgressResponse> => {
      return {
        result: true,
        data: {
          total: 9,
          list: [
            { zoneId: 0, total: 5 },
            { zoneId: 2, total: 3 },
            { zoneId: 3, total: 1 },
            { zoneId: 4, total: 1 },
            { zoneId: 6, total: 1 },
            { zoneId: 7, total: 2 },
            { zoneId: 9, total: 1 },
            { zoneId: 14, total: 1 },
            { zoneId: 16, total: 1 },
          ].map((e) => {
            return {
              zoneId: e.zoneId,
              zoneNameKr: ZONES[e.zoneId].nameKr,
              zoneNameUs: ZONES[e.zoneId].nameUs,
              totalStory: e.total,
              readStory: e.total - 1,
            };
          }),
        },
      };
    },
    detail: (
      storyId: number,
      page: number
    ): {
      data: {
        content: string;
        image?: string;
        audio?: string;
      };
      total: number;
    } => {
      const story = STORIES.filter((e) => e.storyId === storyId)[0];
      return {
        data: story.story[page],
        total: story.story.length,
      };
    },
  },

  myNft: {
    puzzleList: (): ResponsesList<UserPuzzleResponse> => {
      return {
        result: true,
        data: {
          total: MY_PUZZLES.length,
          list: MY_PUZZLES,
        },
      };
    },
    puzzleDetail: (id: number): UserPuzzleDetailResponse => {
      const data = MY_PUZZLES[id];
      const description =
        id === 6
          ? "덕성여자대학교 도서관은 1984년에 지어진 철근콘크리트조의 지상 4층 건물입니다. 붉은 벽돌로 지었으며 도서관 건축물로는 보기 드물게 중정을 두어 건물 전체의 형태나 크기, 규모가 잘 응용된 학교 건축물입니다."
          : id === 7
          ? "대학의 설립자이신 차미리사 선생님 기념 동상이 세워져 있다"
          : "까치, 토끼, 너구리들이 놀러오는 영근터";

      return {
        ...data,
        tokenId: +data.tokenId,
        zoneNameKr: data.zoneKr,
        zoneNameUs: data.zoneUs,
        season: data.seasonUs,
        owner: {
          name: MOCK_USER_DATA.name,
          walletAddress: MOCK_USER_DATA.walletAddress,
        },
        nftThumbnailUrl: `/src/assets/images/puzzle_thumbs/christmas/christmas-${id}`,
        description,
        architect: "김수근",
      };
    },
    items: () => {
      return {
        totalItems: 999,
        items: [
          {
            name: "붉은 벽돌",
            image: "/src/assets/images/brick.png",
            count: 33,
          },

          {
            name: "산타 양말",
            image: "/src/assets/images/christmas-stocking.png",
            count: 31,
          },
          {
            name: "망치",
            image: "/src/assets/images/hammer.png",
            count: 5,
          },
          {
            name: "모래",
            image: "/src/assets/images/sand.png",
            count: 1,
          },
          {
            name: "유리",
            image: "/src/assets/images/glass.png",
            count: 22,
          },
          {
            name: `설계도면(${ZONES[1].nameKr})`,
            image: "/src/assets/images/blueprint.png",
            count: 3,
          },
          {
            name: `설계도면(${ZONES[6].nameKr})`,
            image: "/src/assets/images/blueprint.png",
            count: 1,
          },
          {
            name: `설계도면(${ZONES[10].nameKr})`,
            image: "/src/assets/images/blueprint.png",
            count: 1,
          },
          {
            name: `설계도면(${ZONES[4].nameKr})`,
            image: "/src/assets/images/blueprint.png",
            count: 2,
          },
        ],
      };
    },
  },

  history: {
    list: (): SeasonHistoryResponse[] => {
      return [
        {
          id: 0,
          title: "2024 봄",
          thumbnailUrl: "/src/assets/images/mock/puzzle/crop.png",
          totalPieces: 100,
          mintedPieces: 80,
        },
        {
          id: 1,
          title: "2023 겨울",
          thumbnailUrl: "/src/assets/images/mock/puzzle/map_christmas_crop.png",
          totalPieces: 100,
          mintedPieces: 80,
        },
        {
          id: 2,
          title: "2023 할로윈",
          thumbnailUrl: "/src/assets/images/mock/puzzle/11339231.jpg",
          totalPieces: 100,
          mintedPieces: 80,
        },
      ];
    },
  },
  otherProfile: (walletAddress: string): OtherUserProfileResponse => {
    switch (walletAddress) {
      case MOCK_USER_DATA.walletAddress:
        return {
          id: 0,
          email: MOCK_USER_DATA.email,
          name: MOCK_USER_DATA.name,
          image: MOCK_USER_DATA.image,
          profileType: ProfileType.Public,
          level: 3,
          walletAddress: MOCK_USER_DATA.walletAddress,
          createdAt: new Date(),
          items: [
            {
              name: "붉은 벽돌",
              count: 99,
              image: "/src/assets/images/brick.png",
            },
            {
              name: "망치",
              count: 88,
              image: "/src/assets/images/hammer.png",
            },
            {
              name: "산타 양말",
              count: 11,
              image: "/src/assets/images/christmas-stocking.png",
            },
            {
              name: "유리",
              count: 99,
              image: "/src/assets/images/glass.png",
            },
            {
              name: "모래",
              count: 100,
              image: "/src/assets/images/sand.png",
            },
          ],
          puzzles: [
            {
              season: "spring",
              zone: ZONES[0].nameKr,
              count: 3,
              image: "/src/assets/images/puzzle_thumb/spring/spring-0.png",
            },
            {
              season: "spring",
              zone: ZONES[10].nameKr,
              count: 2,
              image: "/src/assets/images/puzzle_thumb/spring/spring-10.png",
            },
            {
              season: "christmas",
              zone: ZONES[3].nameKr,
              count: 1,
              image:
                "/src/assets/images/puzzle_thumb/christmas/christmas-3.png",
            },
          ],
          history: {
            rankedFirst: 5,
            rankedThird: 4,
            questStreak: 3,
          },
        };
      case MOCK_USER2.walletAddress:
        throw new Error("해당 사용자 프로필을 보려면 로그인이 필요합니다.");
      case MOCK_USER3.walletAddress:
        throw new Error("해당 사용자가 프로필 공개를 거부했습니다.");
    }
  },

  main: {
    getPuzzles: (): {
      total: number;
      minted: number;
      pieces: PuzzlePieceDto[];
    } => {
      return {
        total: 20,
        minted: 3,
        pieces: CHRISTMAS_PUZZLES,
      };
    },
  },

  quest: {
    start: (type: QuestType): StartQuestResponse => {
      const quest: { [key in QuestType]: StartQuestResponse } = {
        [QuestType.SpeedQuiz]: {
          type,
          timeLimit: 20,
          quest: `살되, 네 ?을 살아라
생각하되, 네 ?으로 하여라
알되, 네가 깨달아 ?.`,
        },
        [QuestType.AcidRain]: {
          type,
          timeLimit: 40,
          quest: `{"dropDistance": 4.5,"newWordIntervalMs": 1000,"gameoverLimit": 15,"passingScore": 5, "dropIntervalMs": 40 }`,
        },
        [QuestType.DuksaeJump]: {
          type,
          timeLimit: 40,
          quest: `{"objectSpeed": 100, "objectMaxSpeed": 500, "speedIncreaseRate": 1.001, "speedIncreaseInterval": 100, "gameoverLimit": 3, "passingScore": 9999}`,
        },
        [QuestType.PictureQuiz]: {
          type,
          timeLimit: 40,
          quest: [
            "/src/assets/images/mock/quest/DukWooDang1.png",
            "/src/assets/images/mock/quest/DukWooDang2.png",
            "/src/assets/images/mock/quest/DukWooDang3.PNG",
            "/src/assets/images/mock/quest/DukWooDang4.PNG",
          ].join("{}"),
        },
        [QuestType.MusicQuiz]: {
          type,
          timeLimit: 30,
          quest: `{"audioUrl": "/src/assets/audio/덕성교가(1절_2절).mp3","lyrics": "?? 같은 눈동자 ?? 같은 그 마음 우리는 대 ??의 젊은이들 새 세대를 창조하는 ??이라네" }
`,
        },
      };

      return quest[type];
    },
    result: (type: QuestType, answer: string[]): boolean => {
      switch (type) {
        case QuestType.AcidRain:
          break;
        case QuestType.DuksaeJump:
          break;
        case QuestType.MusicQuiz:
          return (
            JSON.stringify(answer) ===
            JSON.stringify(["샛별", "송백", "덕성", "일꾼"])
          );
        case QuestType.PictureQuiz:
          return answer[0] === "덕우당";
        case QuestType.SpeedQuiz:
          return (
            JSON.stringify(answer) ===
            JSON.stringify(["생명", "생각", "알아라"])
          );
      }
    },
  },

  // nftExchange: {
  //   list: (
  //     params: NftExchangeListRequest
  //   ): ResponsesList<NftExchangeOfferResponse> => {
  //     return {
  //       result: false,
  //       data: {
  //         total: 0,
  //         list: [],
  //       },
  //     };
  //   },
  //   detail: (id: number): NftExchangeOfferDetailResponse => {
  //     return {
  //       offeredNfts: [],
  //       requestedNfts: [],
  //       id: 0,
  //       offerorUser: {
  //         walletAddress: "0x1234567890abcdef",
  //         name: "사용자" + id,
  //         image: "https://example.com/user" + id + ".jpg",
  //       },
  //       status: NftExchangeOfferStatus.LISTED,
  //       createdAt: new Date(),
  //     };
  //   },
  //   accept: async (id: number): Promise<boolean> => {
  //     return true;
  //   },
  //   availableNftsToOffer: (): ResponsesList<AvailableNftDto> => {
  //     return {
  //       result: true,
  //       data: {
  //         total: 10,
  //         list: [
  //           {
  //             type: NFTType.Material,
  //             nftInfo: {
  //               contractId: 3,
  //               name: "",
  //               imageUrl: "",
  //               availableQuantity: 3,
  //             },
  //           },
  //           {
  //             type: NFTType.Blueprint,
  //             nftInfo: {
  //               seasonZoneId: 3,
  //               seasonName: "",
  //               zoneName: "",
  //               imageUrl: "",
  //               availableQuantity: 3,
  //             },
  //           },
  //           {
  //             type: NFTType.PuzzlePiece,
  //             nftInfo: {
  //               seasonZoneId: 3,
  //               seasonName: "",
  //               zoneName: "",
  //               imageUrl: "",
  //               availableQuantity: 3,
  //             },
  //           },
  //         ],
  //       },
  //     };
  //   },
  //   availableNftsToRequest: (
  //     name: string,
  //     count: number,
  //     page: number
  //   ): ResponsesList<AvailableNftDto> => {
  //     const list = []; // filter, slice 하기
  //     return {
  //       result: true,
  //       data: {
  //         total: 0,
  //         list,
  //       },
  //     };
  //   },
  //   cancel: (id: number): boolean => {
  //     return true;
  //   },
  //   my: (
  //     params: NftExchangeListRequest
  //   ): ResponsesList<NftExchangeOfferResponse> => {
  //     return {
  //       result: false,
  //       data: {
  //         total: 0,
  //         list: [],
  //       },
  //     };
  //   },
  //   register: (dto: PostNftExchangeRequest): boolean => {
  //     return true;
  //   },
  // },

  nftExchange: {
    // 유저가 제공 가능한 NFT 목록 조회
    getAvailableNftsToOffer: (walletAddress) => {
      const availableNfts = [];

      // 재료 NFT 추가
      MOCK_MATERIAL_NFTS.forEach((materialNft) => {
        const availableTokens = materialNft.tokens.filter(
          (token) => token.owner === walletAddress
        );
        if (availableTokens.length > 0) {
          availableNfts.push({
            type: NFTType.Material,
            nftInfo: {
              contractId: materialNft.contractId,
              name: materialNft.name,
              imageUrl: materialNft.imageUrl,
              availableQuantity: availableTokens.length,
            },
          });
        }
      });

      // 청사진 및 퍼즐 NFT 추가
      MOCK_BLUEPRINT_PUZZLE_NFTS.forEach((blueprintOrPuzzleNft) => {
        const availableTokens = blueprintOrPuzzleNft.tokens.filter(
          (token) => token.owner === walletAddress
        );
        if (availableTokens.length > 0) {
          const seasonZone = getSeasonZoneById(
            blueprintOrPuzzleNft.seasonZoneId
          );
          availableNfts.push({
            type: blueprintOrPuzzleNft.type,
            nftInfo: {
              seasonZoneId: blueprintOrPuzzleNft.seasonZoneId,
              seasonName: seasonZone.seasonName,
              zoneName: seasonZone.zoneName,
              imageUrl: seasonZone.imageUrl,
              availableQuantity: availableTokens.length,
            },
          });
        }
      });

      return {
        data: availableNfts,
      };
    },

    // 요청 가능한 NFT 목록 조회
    getAvailableNftsToRequest: (params) => {
      const { page = 1, limit = 10, name = "" } = params;

      const availableNfts = [];

      // 재료 NFT 추가
      MOCK_MATERIAL_NFTS.forEach((materialNft) => {
        if (
          name &&
          !materialNft.name.toLowerCase().includes(name.toLowerCase())
        ) {
          return;
        }

        availableNfts.push({
          type: NFTType.Material,
          nftInfo: {
            contractId: materialNft.contractId,
            name: materialNft.name,
            imageUrl: materialNft.imageUrl,
            availableQuantity: materialNft.tokens.length,
          },
        });
      });

      // 청사진 및 퍼즐 NFT 추가
      MOCK_BLUEPRINT_PUZZLE_NFTS.forEach((blueprintOrPuzzleNft) => {
        const seasonZone = getSeasonZoneById(blueprintOrPuzzleNft.seasonZoneId);

        if (
          name &&
          !seasonZone.seasonName.toLowerCase().includes(name.toLowerCase()) &&
          !seasonZone.zoneName.toLowerCase().includes(name.toLowerCase())
        ) {
          return;
        }

        availableNfts.push({
          type: blueprintOrPuzzleNft.type,
          nftInfo: {
            seasonZoneId: blueprintOrPuzzleNft.seasonZoneId,
            seasonName: seasonZone.seasonName,
            zoneName: seasonZone.zoneName,
            imageUrl: seasonZone.imageUrl,
            availableQuantity: blueprintOrPuzzleNft.tokens.length,
          },
        });
      });

      const total = availableNfts.length;
      const startIndex = (page - 1) * limit;
      const paginatedNfts = availableNfts.slice(startIndex, startIndex + limit);

      return {
        data: paginatedNfts,
        total: total,
        page: parseInt(page),
        limit: parseInt(limit),
      };
    },

    // 교환 제안 생성
    postNftExchange: (walletAddress, dto) => {
      throw new Error(`제공할 NFT의 수량이 부족합니다`);
    },

    // 교환 제안 취소
    deleteNftExchange: (walletAddress, exchangeId) => {
      const exchangeIndex = MOCK_NFT_EXCHANGES.findIndex(
        (exchange) =>
          exchange.id === parseInt(exchangeId) &&
          exchange.offerorWalletAddress === walletAddress
      );

      if (exchangeIndex === -1) {
        throw new Error("교환 제안을 찾을 수 없거나 접근 권한이 없습니다.");
      }

      if (
        MOCK_NFT_EXCHANGES[exchangeIndex].status !==
        NftExchangeOfferStatus.LISTED
      ) {
        throw new Error("이미 완료되거나 취소된 교환 제안입니다.");
      }

      MOCK_NFT_EXCHANGES[exchangeIndex].status =
        NftExchangeOfferStatus.SYSTEM_CANCELLED;

      return {
        data: true,
      };
    },

    // 교환 제안 목록
    getNftExchangeList: (params, walletAddress = null) => {
      const {
        page = 1,
        limit = 10,
        status,
        offeredNfts,
        requestedNfts,
        offerorUser,
      } = params;

      let filteredExchanges = [...MOCK_NFT_EXCHANGES];

      // 내가 등록한 교환 제안만 필터링
      if (walletAddress) {
        filteredExchanges = filteredExchanges.filter(
          (exchange) => exchange.offerorWalletAddress === walletAddress
        );
      }

      // 상태로 필터링
      if (status) {
        filteredExchanges = filteredExchanges.filter(
          (exchange) => exchange.status === status
        );
      }

      // 제안 NFT 이름으로 필터링
      if (offeredNfts) {
        filteredExchanges = filteredExchanges.filter((exchange) => {
          // 제안 NFT 타입별로 검사
          return exchange.offeredNfts.some((nft) => {
            if (nft.type === NFTType.Material) {
              const materialNft = getMaterialNftByContractId(nft.contractId);
              return (
                materialNft &&
                materialNft.name
                  .toLowerCase()
                  .includes(offeredNfts.toLowerCase())
              );
            } else {
              const seasonZone = getSeasonZoneById(nft.seasonZoneId);
              return (
                seasonZone &&
                (seasonZone.seasonName
                  .toLowerCase()
                  .includes(offeredNfts.toLowerCase()) ||
                  seasonZone.zoneName
                    .toLowerCase()
                    .includes(offeredNfts.toLowerCase()))
              );
            }
          });
        });
      }

      // 요청 NFT 이름으로 필터링
      if (requestedNfts) {
        filteredExchanges = filteredExchanges.filter((exchange) => {
          // 요청 NFT 타입별로 검사
          return exchange.requestedNfts.some((nft) => {
            if (nft.type === NFTType.Material) {
              const materialNft = getMaterialNftByContractId(nft.contractId);
              return (
                materialNft &&
                materialNft.name
                  .toLowerCase()
                  .includes(requestedNfts.toLowerCase())
              );
            } else {
              const seasonZone = getSeasonZoneById(nft.seasonZoneId);
              return (
                seasonZone &&
                (seasonZone.seasonName
                  .toLowerCase()
                  .includes(requestedNfts.toLowerCase()) ||
                  seasonZone.zoneName
                    .toLowerCase()
                    .includes(requestedNfts.toLowerCase()))
              );
            }
          });
        });
      }

      // 제안자 이름으로 필터링
      if (offerorUser) {
        filteredExchanges = filteredExchanges.filter((exchange) => {
          const user = getUserByWalletAddress(exchange.offerorWalletAddress);
          return (
            user &&
            user.name &&
            user.name.toLowerCase().includes(offerorUser.toLowerCase())
          );
        });
      }

      // 교환 제안을 응답 형식으로 변환하는 함수
      const formatExchangeResponse = (exchange) => {
        const offeror = getUserByWalletAddress(exchange.offerorWalletAddress);

        const formatNftList = (nftList) => {
          return nftList.map((nft) => {
            if (nft.type === NFTType.Material) {
              const materialNft = getMaterialNftByContractId(nft.contractId);
              return {
                type: NFTType.Material,
                name: materialNft.name,
                imageUrl: materialNft.imageUrl,
                quantity: nft.quantity,
              };
            } else {
              const seasonZone = getSeasonZoneById(nft.seasonZoneId);
              return {
                type: nft.type,
                seasonName: seasonZone.seasonName,
                zoneName: seasonZone.zoneName,
                imageUrl: seasonZone.imageUrl,
                quantity: nft.quantity,
              };
            }
          });
        };

        return {
          id: exchange.id,
          offerorUser: {
            walletAddress: offeror.walletAddress,
            name: offeror.name,
            image: offeror.image,
          },
          offeredNfts: formatNftList(exchange.offeredNfts),
          requestedNfts: formatNftList(exchange.requestedNfts),
          status: exchange.status,
          createdAt: exchange.createdAt,
        };
      };

      // 결과를 응답 형식으로 변환
      const total = filteredExchanges.length;
      const startIndex = (page - 1) * limit;
      const paginatedExchanges = filteredExchanges
        .slice(startIndex, startIndex + limit)
        .map(formatExchangeResponse);

      return {
        data: paginatedExchanges,
        total: total,
        page: parseInt(page),
        limit: parseInt(limit),
      };
    },

    // NFT 교환 제안 수락
    acceptNftExchange: (walletAddress, exchangeId) => {
      const exchange = MOCK_NFT_EXCHANGES.find(
        (exchange) => exchange.id === parseInt(exchangeId)
      );

      if (!exchange) {
        throw new Error("교환 제안을 찾을 수 없습니다.");
      }

      if (exchange.offerorWalletAddress === walletAddress) {
        throw new Error("자신의 교환 제안을 수락할 수 없습니다.");
      }

      if (exchange.status !== NftExchangeOfferStatus.LISTED) {
        throw new Error("이미 완료되거나 취소된 교환 제안입니다.");
      }

      // 요청 NFT의 소유자 체크
      for (const requestedNft of exchange.requestedNfts) {
        const availableCount = countAvailableNfts(
          requestedNft.type === NFTType.Material
            ? MOCK_MATERIAL_NFTS
            : MOCK_BLUEPRINT_PUZZLE_NFTS,
          walletAddress,
          requestedNft.type,
          requestedNft.type === NFTType.Material
            ? (<any>requestedNft).contractId
            : (<any>requestedNft).seasonZoneId
        );

        if (availableCount < requestedNft.quantity) {
          throw new Error(
            `요청된 NFT의 수량이 부족합니다: ${requestedNft.type}`
          );
        }
      }

      // 교환 처리
      exchange.status = NftExchangeOfferStatus.COMPLETED;
      exchange.completedAt = new Date();

      // NFT 소유권 변경 시뮬레이션 (실제로는 블록체인에서 처리됨)
      // 여기서는 실제 토큰 소유권을 변경하지는 않고, 성공했다고 가정

      return {
        data: true,
      };
    },

    // 교환 제안 상세 보기
    getNftExchangeById: (id) => {
      const exchange = MOCK_NFT_EXCHANGES.find(
        (exchange) => exchange.id === parseInt(id)
      );

      if (!exchange) {
        throw new Error("교환 제안을 찾을 수 없습니다.");
      }

      const offeror = getUserByWalletAddress(exchange.offerorWalletAddress);

      // NFT 정보를 상세 응답 형식으로 변환하는 함수
      const formatDetailedNftInfo = (nftList) => {
        return nftList.map((nft) => {
          if (nft.type === NFTType.Material) {
            const materialNft = getMaterialNftByContractId(nft.contractId);

            // 사용 가능한 토큰 목록
            const availableTokens = materialNft.tokens
              .filter((token) => token.owner === exchange.offerorWalletAddress)
              .slice(0, nft.quantity);

            return {
              type: NFTType.Material,
              name: materialNft.name,
              imageUrl: materialNft.imageUrl,
              quantity: nft.quantity,
              availableNfts: availableTokens.map((token) => ({
                tokenId: token.tokenId,
                history: token.history,
              })),
            };
          } else {
            const blueprintOrPuzzleNft = getBlueprintOrPuzzleNftBySeasonZoneId(
              nft.seasonZoneId,
              nft.type
            );
            const seasonZone = getSeasonZoneById(nft.seasonZoneId);

            // 사용 가능한 토큰 목록
            const availableTokens = blueprintOrPuzzleNft.tokens
              .filter((token) => token.owner === exchange.offerorWalletAddress)
              .slice(0, nft.quantity);

            return {
              type: nft.type,
              seasonName: seasonZone.seasonName,
              zoneName: seasonZone.zoneName,
              imageUrl: seasonZone.imageUrl,
              quantity: nft.quantity,
              availableNfts: availableTokens.map((token) => ({
                tokenId: token.tokenId,
                history: token.history,
              })),
            };
          }
        });
      };

      // 기본 정보 구성
      const result = {
        id: exchange.id,
        offerorUser: {
          walletAddress: offeror.walletAddress,
          name: offeror.name,
          image: offeror.image,
        },
        offeredNfts: formatDetailedNftInfo(exchange.offeredNfts),
        requestedNfts: formatDetailedNftInfo(exchange.requestedNfts),
        status: exchange.status,
        createdAt: exchange.createdAt,
        completedAt: exchange.completedAt,
      };

      return {
        data: result,
      };
    },
  },
};
