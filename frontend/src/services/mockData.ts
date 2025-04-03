import { PuzzlePieceDto } from "../pages/Mainpage/dto";
import { ZONES } from "../util/zone";
import { EventTopicName, NftExchangeOfferStatus, NFTType } from "./type";

export const MOCK_USER_DATA = {
  walletAddress: "0xeB4774d30E9798aE17142069527ec0855d33C4Cf",
  name: "파이퍼스나이퍼",
  email: "pipersniper@duzzle.com",
  image: "/assets/images/mock/user/goblin_baby.png",
  profileType: "PUBLIC",
  history: {
    rankedFirst: 5,
    rankedThird: 12,
    questStreak: 3,
  },
};

// 프로필 타입 NONE(비공개)
export const MOCK_USER2 = {
  walletAddress: "0x1DC91f13De44B7D6f7c7F95B3AadDc873F436c99",
  image: "/assets/images/mock/user/profile_default.png",
  name: "duksoon",
};

// 프로필 타입 PRIVATE(로그인한 유저에게만 허용)
export const MOCK_USER3 = {
  walletAddress: "0xABcdeF111122223333444455557ec0855d33C4Cf",
  image: "/assets/images/mock/user/duk.png",
  name: "hahahohohihi",
};

const MOCK_USERS = [MOCK_USER_DATA, MOCK_USER2, MOCK_USER3];

export const CHRISTMAS_PUZZLES: PuzzlePieceDto[] = [
  {
    zoneId: 0,
    zoneNameKr: ZONES[0].nameKr,
    zoneNameUs: ZONES[0].nameUs,
    pieceId: 0,
    coordinates: "281.41502435562575,388.0032430543258",
    minted: false,
    data: {
      requiredItems: [
        {
          name: "붉은 벽돌",
          image: "/assets/images/brick.png",
          count: 3,
        },
        {
          name: `설계도면(${ZONES[0].nameKr})`,
          image: "/assets/images/blueprint.png",
          count: 1,
        },
        {
          name: "산타 양말",
          image: "/assets/images/christmas-stocking.png",
          count: 1,
        },
        {
          name: "유리",
          image: "/assets/images/glass.png",
          count: 3,
        },
      ],
    },
  },
  {
    zoneId: 1,
    zoneNameKr: ZONES[1].nameKr,
    zoneNameUs: ZONES[1].nameUs,
    pieceId: 1,
    coordinates: "177.41371023585066,352.0029421523780",
    minted: false,
    data: {
      requiredItems: [
        {
          name: "붉은 벽돌",
          image: "/assets/images/brick.png",
          count: 3,
        },
        {
          name: `설계도면(${ZONES[1].nameKr})`,
          image: "/assets/images/blueprint.png",
          count: 1,
        },
        {
          name: "산타 양말",
          image: "/assets/images/christmas-stocking.png",
          count: 1,
        },
        {
          name: "망치",
          image: "/assets/images/hammer.png",
          count: 5,
        },
      ],
    },
  },
  {
    zoneId: 2,
    zoneNameKr: ZONES[2].nameKr,
    zoneNameUs: ZONES[2].nameUs,
    pieceId: 2,
    coordinates: "123.41302790442897,322.00269140075494",
    minted: false,
    data: {
      requiredItems: [
        {
          name: "모래",
          image: "/assets/images/sand.png",
          count: 4,
        },
        {
          name: `설계도면(${ZONES[2].nameKr})`,
          image: "/assets/images/blueprint.png",
          count: 1,
        },
        {
          name: "산타 양말",
          image: "/assets/images/christmas-stocking.png",
          count: 1,
        },
        {
          name: "망치",
          image: "/assets/images/hammer.png",
          count: 2,
        },
      ],
    },
  },
  {
    zoneId: 3,
    zoneNameKr: ZONES[3].nameKr,
    zoneNameUs: ZONES[3].nameUs,
    pieceId: 3,
    coordinates: "172.4136470570153,287.00239885719463",
    minted: false,
    data: {
      requiredItems: [
        {
          name: "붉은 벽돌",
          image: "/assets/images/brick.png",
          count: 3,
        },
        {
          name: `설계도면(${ZONES[3].nameKr})`,
          image: "/assets/images/blueprint.png",
          count: 1,
        },
        {
          name: "산타 양말",
          image: "/assets/images/christmas-stocking.png",
          count: 1,
        },
        {
          name: "유리",
          image: "/assets/images/glass.png",
          count: 10,
        },
      ],
    },
  },
  {
    zoneId: 4,
    zoneNameKr: ZONES[4].nameKr,
    zoneNameUs: ZONES[4].nameUs,
    pieceId: 4,
    coordinates: "273.41492326948924,258.0021564639589",
    minted: false,
    data: {
      requiredItems: [
        {
          name: "붉은 벽돌",
          image: "/assets/images/brick.png",
          count: 3,
        },
        {
          name: `설계도면(${ZONES[4].nameKr})`,
          image: "/assets/images/blueprint.png",
          count: 1,
        },
        {
          name: "산타 양말",
          image: "/assets/images/christmas-stocking.png",
          count: 1,
        },
        {
          name: "유리",
          image: "/assets/images/glass.png",
          count: 6,
        },
      ],
    },
  },
  {
    zoneId: 5,
    zoneNameKr: ZONES[5].nameKr,
    zoneNameUs: ZONES[5].nameUs,
    pieceId: 5,
    coordinates: "392.41642692577034,291.00243229074437",
    minted: false,
    data: {
      requiredItems: [
        {
          name: "붉은 벽돌",
          image: "/assets/images/brick.png",
          count: 3,
        },
        {
          name: `설계도면(${ZONES[5].nameKr})`,
          image: "/assets/images/blueprint.png",
          count: 1,
        },
        {
          name: "산타 양말",
          image: "/assets/images/christmas-stocking.png",
          count: 1,
        },
        {
          name: "모래",
          image: "/assets/images/sand.png",
          count: 5,
        },
      ],
    },
  },
  {
    zoneId: 6,
    zoneNameKr: ZONES[6].nameKr,
    zoneNameUs: ZONES[6].nameUs,
    pieceId: 6,
    coordinates: "264.4148095475856,303.0025325913936",
    minted: true,
    data: {
      season: "christmas",
      owner: {
        name: MOCK_USER2.name,
        walletAddress: MOCK_USER2.walletAddress,
      },
      tokenId: 21,
      nftThumbnailUrl: "/assets/images/puzzle_thumb/christmas-6",
      threeDModelUrl: "/assets/models/christmas-6.gltf",
      description:
        "덕성여자대학교 도서관은 1984년에 지어진 철근콘크리트조의 지상 4층 건물입니다. 붉은 벽돌로 지었으며 도서관 건축물로는 보기 드물게 중정을 두어 건물 전체의 형태나 크기, 규모가 잘 응용된 학교 건축물입니다.",
      architect: "김수근",
    },
  },
  {
    zoneId: 7,
    zoneNameKr: ZONES[7].nameKr,
    zoneNameUs: ZONES[7].nameUs,
    pieceId: 7,
    coordinates: "316.41546660747315,352.00294215237807",
    minted: true,
    data: {
      season: "christmas",
      owner: {
        name: MOCK_USER3.name,
        walletAddress: MOCK_USER3.walletAddress,
      },
      tokenId: 13,
      nftThumbnailUrl: "/assets/images/puzzle_thumb/christmas-7",
      threeDModelUrl: "/assets/models/christmas-7.gltf",
      description: "대학의 설립자이신 차미리사 선생님 기념 동상이 세워져 있다",
      architect: "김수근",
    },
  },
  {
    zoneId: 8,
    zoneNameKr: ZONES[8].nameKr,
    zoneNameUs: ZONES[8].nameUs,
    pieceId: 8,
    coordinates: "400.4165280119069,387.0032346959384",
    minted: true,
    data: {
      season: "christmas",
      owner: {
        name: "pipersniper",
        walletAddress: "0xeB4774d30E9798aE17142069527ec0855d33C4Cf",
      },
      tokenId: 33,
      nftThumbnailUrl: "/assets/images/puzzle_thumb/christmas-8",
      threeDModelUrl: "/assets/models/christmas-8.gltf",
      description: "까치, 토끼, 너구리들이 놀러오는 영근터",
      architect: "김수근",
    },
  },
  {
    zoneId: 9,
    zoneNameKr: ZONES[9].nameKr,
    zoneNameUs: ZONES[9].nameUs,
    pieceId: 9,
    coordinates: "485.4176020521077,421.00351888111123",
    minted: false,
    data: {
      requiredItems: [
        {
          name: "붉은 벽돌",
          image: "/assets/images/brick.png",
          count: 3,
        },
        {
          name: `설계도면(${ZONES[9].nameKr})`,
          image: "/assets/images/blueprint.png",
          count: 1,
        },
        {
          name: "산타 양말",
          image: "/assets/images/christmas-stocking.png",
          count: 1,
        },
        {
          name: "모래",
          image: "/assets/images/sand.png",
          count: 5,
        },
      ],
    },
  },
  {
    zoneId: 10,
    zoneNameKr: ZONES[10].nameKr,
    zoneNameUs: ZONES[10].nameUs,
    pieceId: 10,
    coordinates: "556.4184991915696,442.00369440724745",
    minted: false,
    data: {
      requiredItems: [
        {
          name: "붉은 벽돌",
          image: "/assets/images/brick.png",
          count: 6,
        },
        {
          name: `설계도면(${ZONES[10].nameKr})`,
          image: "/assets/images/blueprint.png",
          count: 1,
        },
        {
          name: "산타 양말",
          image: "/assets/images/christmas-stocking.png",
          count: 1,
        },
        {
          name: "망치",
          image: "/assets/images/hammer.png",
          count: 5,
        },
      ],
    },
  },
  {
    zoneId: 11,
    zoneNameKr: ZONES[11].nameKr,
    zoneNameUs: ZONES[11].nameUs,
    pieceId: 11,
    coordinates: "623.8360075468781,402.00336007174997",
    minted: false,
    data: {
      requiredItems: [
        {
          name: "모래",
          image: "/assets/images/sand.png",
          count: 3,
        },
        {
          name: `설계도면(${ZONES[11].nameKr})`,
          image: "/assets/images/blueprint.png",
          count: 1,
        },
        {
          name: "산타 양말",
          image: "/assets/images/christmas-stocking.png",
          count: 1,
        },
        {
          name: "망치",
          image: "/assets/images/hammer.png",
          count: 5,
        },
      ],
    },
  },
  {
    zoneId: 12,
    zoneNameKr: ZONES[12].nameKr,
    zoneNameUs: ZONES[12].nameUs,
    pieceId: 12,
    coordinates: "632.8361212687818,332.0027749846293",
    minted: false,
    data: {
      requiredItems: [
        {
          name: "붉은 벽돌",
          image: "/assets/images/brick.png",
          count: 3,
        },
        {
          name: "모래",
          image: "/assets/images/sand.png",
          count: 3,
        },
        {
          name: `설계도면(${ZONES[12].nameKr})`,
          image: "/assets/images/blueprint.png",
          count: 1,
        },
        {
          name: "산타 양말",
          image: "/assets/images/christmas-stocking.png",
          count: 1,
        },
        {
          name: "망치",
          image: "/assets/images/hammer.png",
          count: 5,
        },
      ],
    },
  },
  {
    zoneId: 13,
    zoneNameKr: ZONES[13].nameKr,
    zoneNameUs: ZONES[13].nameUs,
    pieceId: 13,
    coordinates: "519.834693427103,349.5029212564095",
    minted: false,
    data: {
      requiredItems: [
        {
          name: "붉은 벽돌",
          image: "/assets/images/brick.png",
          count: 3,
        },

        {
          name: `설계도면(${ZONES[13].nameKr})`,
          image: "/assets/images/blueprint.png",
          count: 1,
        },
        {
          name: "산타 양말",
          image: "/assets/images/christmas-stocking.png",
          count: 1,
        },
        {
          name: "망치",
          image: "/assets/images/hammer.png",
          count: 5,
        },
      ],
    },
  },
  {
    zoneId: 14,
    zoneNameKr: ZONES[14].nameKr,
    zoneNameUs: ZONES[14].nameUs,
    pieceId: 14,
    coordinates: "476.83415008911913,278.66899714220904",
    minted: false,
    data: {
      requiredItems: [
        {
          name: "유리",
          image: "/assets/images/glass.png",
          count: 3,
        },

        {
          name: `설계도면(${ZONES[14].nameKr})`,
          image: "/assets/images/blueprint.png",
          count: 1,
        },
        {
          name: "산타 양말",
          image: "/assets/images/christmas-stocking.png",
          count: 1,
        },
      ],
    },
  },
  {
    zoneId: 15,
    zoneNameKr: ZONES[15].nameKr,
    zoneNameUs: ZONES[15].nameUs,
    pieceId: 15,
    coordinates: "550.8350851358822,254.5021272096029",
    minted: false,
    data: {
      requiredItems: [
        {
          name: "유리",
          image: "/assets/images/glass.png",
          count: 7,
        },

        {
          name: `설계도면(${ZONES[15].nameKr})`,
          image: "/assets/images/blueprint.png",
          count: 1,
        },
        {
          name: "산타 양말",
          image: "/assets/images/christmas-stocking.png",
          count: 1,
        },
        {
          name: "망치",
          image: "/assets/images/hammer.png",
          count: 5,
        },
      ],
    },
  },
  {
    zoneId: 16,
    zoneNameKr: ZONES[16].nameKr,
    zoneNameUs: ZONES[16].nameUs,
    pieceId: 16,
    coordinates: "600.8357169242356,239.16866317117606",
    minted: false,
    data: {
      requiredItems: [
        {
          name: "붉은 벽돌",
          image: "/assets/images/brick.png",
          count: 5,
        },

        {
          name: `설계도면(${ZONES[16].nameKr})`,
          image: "/assets/images/blueprint.png",
          count: 1,
        },
        {
          name: "산타 양말",
          image: "/assets/images/christmas-stocking.png",
          count: 1,
        },
        {
          name: "망치",
          image: "/assets/images/hammer.png",
          count: 5,
        },
      ],
    },
  },
  {
    zoneId: 17,
    zoneNameKr: ZONES[17].nameKr,
    zoneNameUs: ZONES[17].nameUs,
    pieceId: 17,
    coordinates: "653.8363866198902,208.00173854458703",
    minted: false,
    data: {
      requiredItems: [
        {
          name: "붉은 벽돌",
          image: "/assets/images/brick.png",
          count: 6,
        },

        {
          name: `설계도면(${ZONES[17].nameKr})`,
          image: "/assets/images/blueprint.png",
          count: 1,
        },
        {
          name: "산타 양말",
          image: "/assets/images/christmas-stocking.png",
          count: 1,
        },
        {
          name: "모래",
          image: "/assets/images/sand.png",
          count: 4,
        },
      ],
    },
  },
  {
    zoneId: 18,
    zoneNameKr: ZONES[18].nameKr,
    zoneNameUs: ZONES[18].nameUs,
    pieceId: 18,
    coordinates: "718.8372079447496,187.00156301845084",
    minted: false,
    data: {
      requiredItems: [
        {
          name: "붉은 벽돌",
          image: "/assets/images/brick.png",
          count: 3,
        },

        {
          name: `설계도면(${ZONES[18].nameKr})`,
          image: "/assets/images/blueprint.png",
          count: 1,
        },
        {
          name: "산타 양말",
          image: "/assets/images/christmas-stocking.png",
          count: 1,
        },
        {
          name: "모래",
          image: "/assets/images/sand.png",
          count: 4,
        },
      ],
    },
  },
  {
    zoneId: 19,
    zoneNameKr: ZONES[19].nameKr,
    zoneNameUs: ZONES[19].nameUs,
    pieceId: 19,
    coordinates: "671.8366140636974,147.33456353083943",
    minted: false,
    data: {
      requiredItems: [
        {
          name: "붉은 벽돌",
          image: "/assets/images/brick.png",
          count: 5,
        },

        {
          name: `설계도면(${ZONES[19].nameKr})`,
          image: "/assets/images/blueprint.png",
          count: 1,
        },
        {
          name: "산타 양말",
          image: "/assets/images/christmas-stocking.png",
          count: 1,
        },
        {
          name: "모래",
          image: "/assets/images/sand.png",
          count: 4,
        },
        {
          name: "망치",
          image: "/assets/images/hammer.png",
          count: 1,
        },
      ],
    },
  },
];

export const MY_PUZZLES = [
  {
    id: 0,
    name: "Duksung Xmas Puzzle #87",
    image: "/src/assetss/images/puzzle_thumb/chirstmas/christmas-6.png",
    zoneUs: ZONES[6].nameUs,
    zoneKr: ZONES[6].nameKr,
    seasonUs: "Christmas",
    seasonKr: "크리스마스",
    tokenId: "87",
    threeDModelUrl: "/assets/models/christmas-6",
  },
  {
    id: 0,
    name: "Duksung Xmas Puzzle #101",
    image: "/src/assetss/images/puzzle_thumb/chirstmas/christmas-7.png",
    zoneUs: ZONES[7].nameUs,
    zoneKr: ZONES[7].nameKr,
    seasonUs: "Christmas",
    seasonKr: "크리스마스",
    tokenId: "87",
    threeDModelUrl: "/assets/models/christmas-7",
  },
  {
    id: 0,
    name: "Duksung Xmas Puzzle #105",
    image: "/src/assetss/images/puzzle_thumb/chirstmas/christmas-8.png",
    zoneUs: ZONES[8].nameUs,
    zoneKr: ZONES[8].nameKr,
    seasonUs: "Christmas",
    seasonKr: "크리스마스",
    tokenId: "87",
    threeDModelUrl: "/assets/models/christmas-8",
  },
];

export const STORIES: {
  storyId: number;
  zoneId: number;
  title: string;
  story: {
    content: string;
    image?: string;
    audio?: string;
  }[];
}[] = [
  {
    storyId: 0,
    zoneId: 0,
    title: "창학이념과 인재상",
    story: [
      {
        image: "/assets/images/mock/story/덕새.jpg",
        content: `덕성의 창학이념은 차미리사 선생의 말씀으로 "살되, 네 생명을 살아라. 생각하되, 네 생각으로 하여라. 알되, 네가 깨달아 알아라."라는 말로 표현된다.`,
      },
      {
        image: "/assets/images/mock/story/복단이.jpg",
        content: `덕성의 인재상은 창의적인 지식인, 협력하는 전문인, 실천하는 시민을 지향하며, 이를 뒷받침하는 핵심 역량으로 창의역량, 협업역량, 도전역량, 미래역량, 공감역량, 시민역량을 강조하고 있다.`,
      },
      {
        image: "/assets/images/mock/story/덕새.jpg",
        content:
          "창의역량은 개방적 사고, 확산적 사고, 수렴적 사고를 바탕으로 새로운 생각과 가치를 창출하고 문제를 해결하는 능력을 의미하며, 협업역량은 사회적 책임감을 바탕으로 협력적 소통을 통해 공통의 목표를 달성하는 능력을 말한다.",
      },
      {
        content: `이러한 이념을 바탕으로 덕성은 덕성(德性)을 갖춘 창의적 지식인을 육성하는 것을 교육의 목적으로 삼고 있으며, 구체적인 교육 목표로는 창의적 능력 배양, 올바른 가치관 실현, 융합적 사고 함양을 설정하고 있다.`,
      },
    ],
  },
  {
    storyId: 1,
    zoneId: 0,
    title: "상징",
    story: [
      {
        image: "/assets/images/mock/story/덕새.jpg",
        content:
          "교표의 전체 이미지인 다섯 개의 잎사귀는 교화인 무궁화를 상징한다.",
      },
      {
        image: "/assets/images/mock/story/복단이.jpg",

        content:
          "무궁화는 국화(國花)이며 거룩하고 고결하고 끈기 있는 민족혼을 상징한 꽃으로, 1920년 창설한 근화동산에서 교장 차미리사 선생은 물론 모두가 무궁화를 사랑하여 학교의 상징이 되었다. 이는 숭고한 3.1 정신을 받들어 이 땅에 여성교육으로 민족정기를 발휘하여 일제에게 빼앗긴 국권을 되찾고자 했던 의지를 표현한 것이다.",
      },
      {
        image: "/assets/images/mock/story/덕새.jpg",

        content:
          "무궁화 속에 덕성을 아로새겨 넣은 것은 정녕 우리의 은근과 끈기를 담은 민족혼과 덕성과 사랑이 혼연일체(渾然一體)가 되어서, 늘 밝혀주고, 채찍질해 주고, 가르쳐 주고 깨닫게 해주고자 함이다.",
      },
    ],
  },
  {
    storyId: 2,

    zoneId: 0,
    title: "캐릭터",
    story: [
      {
        image: "/assets/images/mock/story/덕새.jpg",

        content: `'덕새'는 덕성여자대학교를 나타내는 모든 커뮤니케이션의 대표적 상징물로, 교새인 까치와 예로부터 행운을 상징하는 흰 까치를 상징화하였다. 또한 교색인 자주색과 거룩하고 끈기 있는 민족혼을 상징하는 교화, 무궁화를 가슴에 품은 형태로 우리 대학의 정체성을 표현하였다.`,
      },
      {
        image: "/assets/images/mock/story/복단이F.jpg",
        content: `'덕새'의 단짝 친구 '복단이'도 있다.`,
      },
    ],
  },
  {
    storyId: 3,

    zoneId: 0,
    title: "설립자 차미리 선생",
    story: [
      {
        content: `차미리사(車美理士) 선생\n독립유공자 · 덕성학원 설립자(고종 16: 1879~1955)\n"살되, 네 생명을 살아라\n생각하되, 네 생각으로 하여라\n알되, 네가 꺠달아 알아라"`,
      },
      {
        content: `차미리사 선생은 1879년 8월 21일(음력) 서울 아현동에서 ‘섭섭이’라는 이름으로 태어났다. 열일곱에 출가하여 딸 하나를 낳고 3년 만에 남편 김씨와 사별한 후 기독교를 받아들여 상동교회에서 ‘미리사’라는 세례명을 받았다. 이후 그는 교회의 관습에 의거하여 남편 성을 따라 ‘김미리사’라는 이름으로 사회 활동을 하였다.`,
      },
    ],
  },
  {
    storyId: 4,

    zoneId: 7,
    title: "소개",
    story: [
      {
        content: `준비중입니다`,
      },
    ],
  },
  {
    storyId: 5,

    zoneId: 2,
    title: "소개",
    story: [{ content: `준비중입니다` }],
  },
  {
    storyId: 6,

    zoneId: 2,
    title: "편의시설",
    story: [{ content: `준비중입니다` }],
  },
  {
    storyId: 7,

    zoneId: 3,
    title: "편의시설",
    story: [{ content: `준비중입니다` }],
  },
  {
    storyId: 8,
    zoneId: 0,
    title: "교가",
    story: [
      {
        audio: "/assets/audio/덕성교가(1절_2절).mp3",
        content: `닦으리라 정의의 길을 조찰한-빛깔로
배우리라 예지의 샘물 세기에 앞서서
넓고 크게 맑고 또 희게 덕성에 배우네 
샛별 같은 눈동자 송백 같은 그 마음 우리는 대-덕성의 
젊은이들 세-세대를 창조-하는 일꾼이라-네

진실 순결 깨끗한 이 몸 나-라의 빛일세 
자유위해 인류 모두의 횃불이 되려네
밝히어라 새로운 학설 덕성에 배우리
샛별 같은 눈동자 송백 같은 그 마음 우리는 대-덕성의 
젊은이들 세-세대를 창조-하는 일꾼이라-네`,
      },
    ],
  },
  {
    storyId: 9,

    zoneId: 2,
    title: "준공 순서",
    story: [{ content: `준비중입니다` }],
  },
  {
    storyId: 10,

    zoneId: 4,
    title: "살되.. ",
    story: [{ content: `준비중입니다` }],
  },
  {
    storyId: 11,

    zoneId: 6,
    title: "도서관 이용",
    story: [
      {
        content:
          "도서관에서는 3D 프린터, 레이져 커팅기, 비닐커터, 재봉틀, 3D펜, VR 기기, 크로마키 스튜디오를 이용할 수 있다.",
      },
    ],
  },
  {
    storyId: 12,

    zoneId: 7,
    title: "덕성 민주화 운동",
    story: [
      {
        content: `준비중입니다`,
      },
    ],
  },
  {
    storyId: 13,

    zoneId: 9,
    title: "덕(德)",
    story: [
      {
        content: `준비중입니다`,
      },
    ],
  },
  {
    storyId: 14,

    zoneId: 14,
    title: "소개",
    story: [
      {
        content: `준비중입니다`,
      },
    ],
  },
  {
    storyId: 15,

    zoneId: 16,
    title: "편의 시설",
    story: [
      {
        content: `준비중입니다`,
      },
    ],
  },
];

const MOCK_SEASON_ZONES = [
  {
    id: 0,
    seasonName: "봄",
    zoneName: `${ZONES[0].nameKr}`,
    imageUrl: "/assets/images/puzzle_thumb/spring/spring-0.png",
  },
  {
    id: 1,
    seasonName: "봄",
    zoneName: `${ZONES[1].nameKr}`,
    imageUrl: "/assets/images/puzzle_thumb/spring/spring-1.png",
  },
  {
    id: 2,
    seasonName: "봄",
    zoneName: `${ZONES[2].nameKr}`,
    imageUrl: "/assets/images/puzzle_thumb/spring/spring-2.png",
  },
  {
    id: 3,
    seasonName: "봄",
    zoneName: `${ZONES[3].nameKr}`,
    imageUrl: "/assets/images/puzzle_thumb/spring/spring-3.png",
  },
  {
    id: 4,
    seasonName: "봄",
    zoneName: `${ZONES[4].nameKr}`,
    imageUrl: "/assets/images/puzzle_thumb/spring/spring-4.png",
  },
  {
    id: 5,
    seasonName: "봄",
    zoneName: `${ZONES[5].nameKr}`,
    imageUrl: "/assets/images/puzzle_thumb/spring/spring-5.png",
  },
  {
    id: 0,
    seasonName: "크리스마스",
    zoneName: `${ZONES[0].nameKr}`,
    imageUrl: "/assets/images/puzzle_thumb/christmas/christmas-0.png",
  },
  {
    id: 1,
    seasonName: "크리스마스",
    zoneName: `${ZONES[1].nameKr}`,
    imageUrl: "/assets/images/puzzle_thumb/christmas/christmas-1.png",
  },
  {
    id: 2,
    seasonName: "크리스마스",
    zoneName: `${ZONES[2].nameKr}`,
    imageUrl: "/assets/images/puzzle_thumb/christmas/christmas-2.png",
  },
  {
    id: 3,
    seasonName: "크리스마스",
    zoneName: `${ZONES[3].nameKr}`,
    imageUrl: "/assets/images/puzzle_thumb/christmas/christmas-3.png",
  },
  {
    id: 4,
    seasonName: "크리스마스",
    zoneName: `${ZONES[4].nameKr}`,
    imageUrl: "/assets/images/puzzle_thumb/christmas/christmas-4.png",
  },
  {
    id: 5,
    seasonName: "크리스마스",
    zoneName: `${ZONES[5].nameKr}`,
    imageUrl: "/assets/images/puzzle_thumb/christmas/christmas-5.png",
  },
];

// 재료 NFT 목업 데이터
export const MOCK_MATERIAL_NFTS = [
  {
    contractId: 1,
    name: "붉은 벽돌",
    imageUrl: "/assets/images/brick.png",
    type: NFTType.Material,
    tokens: [
      {
        tokenId: 101,
        owner: MOCK_USER_DATA.walletAddress,
        history: [
          {
            event: EventTopicName.Mint,
            date: new Date("2025-01-15"),
            to: MOCK_USER_DATA.name,
            toWalletAddress: MOCK_USER_DATA.walletAddress,
            blockExplorerUrl: "https://testnets.opensea.io/assets/amoy/0xe1742ae373b9383b06e3481ad55de8615bb0b1d0/42",
          },
        ],
      },
      {
        tokenId: 102,
        owner: MOCK_USER_DATA.walletAddress,
        history: [
          {
            event: EventTopicName.Mint,
            date: new Date("2025-01-20"),
            to: MOCK_USER_DATA.name,
            toWalletAddress: MOCK_USER_DATA.walletAddress,
            blockExplorerUrl: "https://testnets.opensea.io/assets/amoy/0xe1742ae373b9383b06e3481ad55de8615bb0b1d0/42",
          },
        ],
      },
    ],
  },
  {
    contractId: 2,
    name: "산타 양말",
    imageUrl: "/assets/images/christmas-stocking.png",
    type: NFTType.Material,
    tokens: [
      {
        tokenId: 201,
        owner: MOCK_USER2.walletAddress,
        history: [
          {
            event: EventTopicName.Mint,
            date: new Date("2025-02-10"),
            to: MOCK_USER2.name,
            toWalletAddress: MOCK_USER2.walletAddress,
            blockExplorerUrl: "https://testnets.opensea.io/assets/amoy/0xbc1351c028ab3dcf259f29971dec78eb896fe7e1/24",
          },
        ],
      },
    ],
  },
  {
    contractId: 3,
    name: "망치",
    imageUrl: "/assets/images/hammer.png",
    type: NFTType.Material,
    tokens: [
      {
        tokenId: 301,
        owner: MOCK_USER3.walletAddress,
        history: [
          {
            event: EventTopicName.Mint,
            date: new Date("2025-02-05"),
            to: MOCK_USER3.name,
            toWalletAddress: MOCK_USER3.walletAddress,
            blockExplorerUrl: "https://testnets.opensea.io/assets/amoy/0xe12910381a2b62d06fdf01ee4cd33317e83bb6fb/66",
          },
        ],
      },
    ],
  },
  {
    contractId: 4,
    name: "모래",
    imageUrl: "/assets/images/sand.png",
    type: NFTType.Material,
    tokens: [
      {
        tokenId: 401,
        owner: MOCK_USER_DATA.walletAddress,
        history: [
          {
            event: EventTopicName.Mint,
            date: new Date("2025-03-01"),
            to: MOCK_USER_DATA.name,
            toWalletAddress: MOCK_USER_DATA.walletAddress,
            blockExplorerUrl: "https://testnets.opensea.io/assets/amoy/0x73d24f126af6112c20579de5a2571f5f3c1851af/54",
          },
        ],
      },
    ],
  },
  {
    contractId: 5,
    name: "유리",
    imageUrl: "/assets/images/glass.png",
    type: NFTType.Material,
    tokens: [
      {
        tokenId: 501,
        owner: MOCK_USER2.walletAddress,
        history: [
          {
            event: EventTopicName.Mint,
            date: new Date("2025-03-15"),
            to: MOCK_USER2.name,
            toWalletAddress: MOCK_USER2.walletAddress,
            blockExplorerUrl: "https://etherscan.io/tx/0x128",
          },
        ],
      },
    ],
  },
];

// 청사진 및 퍼즐 NFT 목업 데이터
export const MOCK_BLUEPRINT_PUZZLE_NFTS = [
  {
    seasonZoneId: 1,
    type: NFTType.Blueprint,
    tokens: [
      {
        tokenId: 1001,
        owner: MOCK_USER_DATA.walletAddress,
        history: [
          {
            event: EventTopicName.Mint,
            date: new Date("2025-01-05"),
            to: MOCK_USER_DATA.name,
            toWalletAddress: MOCK_USER_DATA.walletAddress,
            blockExplorerUrl: "https://testnets.opensea.io/assets/amoy/0xa07b3f7f489013558f56b77a17a664421fefc5df/43",
          },
        ],
      },
    ],
  },
  {
    seasonZoneId: 2,
    type: NFTType.Blueprint,
    tokens: [
      {
        tokenId: 1002,
        owner: MOCK_USER2.walletAddress,
        history: [
          {
            event: EventTopicName.Mint,
            date: new Date("2025-01-10"),
            to: MOCK_USER2.name,
            toWalletAddress: MOCK_USER2.walletAddress,
            blockExplorerUrl: "https://testnets.opensea.io/assets/amoy/0xa07b3f7f489013558f56b77a17a664421fefc5df/43",
          },
        ],
      },
    ],
  },
  {
    seasonZoneId: 1,
    type: NFTType.PuzzlePiece,
    tokens: [
      {
        tokenId: 2001,
        owner: MOCK_USER3.walletAddress,
        history: [
          {
            event: EventTopicName.Mint,
            date: new Date("2025-02-15"),
            to: MOCK_USER3.name,
            toWalletAddress: MOCK_USER3.walletAddress,
            blockExplorerUrl: "https://testnets.opensea.io/assets/amoy/0xe9ee0fb75f7214e2301b47a3da6a088783531421/66",
          },
        ],
      },
    ],
  },
  {
    seasonZoneId: 3,
    type: NFTType.PuzzlePiece,
    tokens: [
      {
        tokenId: 2002,
        owner: MOCK_USER_DATA.walletAddress,
        history: [
          {
            event: EventTopicName.Mint,
            date: new Date("2025-02-25"),
            to: MOCK_USER_DATA.name,
            toWalletAddress: MOCK_USER_DATA.walletAddress,
            blockExplorerUrl: "https://testnets.opensea.io/assets/amoy/0xe9ee0fb75f7214e2301b47a3da6a088783531421/66",
          },
        ],
      },
    ],
  },
];

// NFT 교환 제안 목업 데이터
export const MOCK_NFT_EXCHANGES = [
  {
    id: 1,
    offerorWalletAddress: MOCK_USER_DATA.walletAddress,
    offeredNfts: [
      {
        type: NFTType.Material,
        contractId: 1,
        quantity: 1,
      },
    ],
    requestedNfts: [
      {
        type: NFTType.Material,
        contractId: 2,
        quantity: 1,
      },
    ],
    status: NftExchangeOfferStatus.LISTED,
    createdAt: new Date("2025-04-01T08:00:00Z"),
    completedAt: null,
  },
  {
    id: 2,
    offerorWalletAddress: MOCK_USER_DATA.walletAddress,
    offeredNfts: [
      {
        type: NFTType.Blueprint,
        seasonZoneId: 1,
        quantity: 1,
      },
    ],
    requestedNfts: [
      {
        type: NFTType.Blueprint,
        seasonZoneId: 2,
        quantity: 1,
      },
    ],
    status: NftExchangeOfferStatus.COMPLETED,
    createdAt: new Date("2025-03-28T10:30:00Z"),
    completedAt: new Date("2025-03-30T14:15:00Z"),
  },
  {
    id: 3,
    offerorWalletAddress: MOCK_USER_DATA.walletAddress,
    offeredNfts: [
      {
        type: NFTType.Material,
        contractId: 4,
        quantity: 1,
      },
    ],
    requestedNfts: [
      {
        type: NFTType.Material,
        contractId: 5,
        quantity: 1,
      },
    ],
    status: NftExchangeOfferStatus.SYSTEM_CANCELLED,
    createdAt: new Date("2025-03-20T09:45:00Z"),
    completedAt: null,
  },
  {
    id: 4,
    offerorWalletAddress: MOCK_USER2.walletAddress,
    offeredNfts: [
      {
        type: NFTType.Material,
        contractId: 2,
        quantity: 1,
      },
    ],
    requestedNfts: [
      {
        type: NFTType.Material,
        contractId: 3,
        quantity: 1,
      },
    ],
    status: NftExchangeOfferStatus.LISTED,
    createdAt: new Date("2025-04-02T11:20:00Z"),
    completedAt: null,
  },
];

// 헬퍼 함수
export const getUserByWalletAddress = (walletAddress) => {
  return MOCK_USERS.find((user) => user.walletAddress === walletAddress);
};

export const getMaterialNftByContractId = (contractId) => {
  return MOCK_MATERIAL_NFTS.find((nft) => nft.contractId === contractId);
};

export const getBlueprintOrPuzzleNftBySeasonZoneId = (seasonZoneId, type) => {
  return MOCK_BLUEPRINT_PUZZLE_NFTS.find(
    (nft) => nft.seasonZoneId === seasonZoneId && nft.type === type
  );
};

export const getSeasonZoneById = (id) => {
  return MOCK_SEASON_ZONES.find((sz) => sz.id === id);
};

export const countAvailableNfts = (nfts, walletAddress, type, id) => {
  if (type === NFTType.Material) {
    const materialNft = getMaterialNftByContractId(id);
    if (!materialNft) return 0;
    return materialNft.tokens.filter((token) => token.owner === walletAddress)
      .length;
  } else {
    const blueprintOrPuzzleNft = getBlueprintOrPuzzleNftBySeasonZoneId(
      id,
      type
    );
    if (!blueprintOrPuzzleNft) return 0;
    return blueprintOrPuzzleNft.tokens.filter(
      (token) => token.owner === walletAddress
    ).length;
  }
};
