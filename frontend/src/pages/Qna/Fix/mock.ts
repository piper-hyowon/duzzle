export const mockQnaList = [
  {
    id: 1,
    category: "MARKET",
    createdAt: new Date("2025-03-20T09:00:00"),
    question: "거래 관련 문의드립니다. 제가 거래한 아이템이 도착하지 않았어요.",
    email: "user1@example.com",
    answer:
      "안녕하세요. 거래 관련 문의에 답변드립니다. 거래 내역을 확인해보았습니다.",
    isAnswered: true,
    answeredAt: new Date("2025-03-21T14:30:00"),
  },
  {
    id: 2,
    category: "ACCOUNT",
    createdAt: new Date("2025-03-22T10:15:00"),
    question: "계정 로그인에 문제가 있습니다. 비밀번호를 재설정하고 싶어요.",
    email: "user2@example.com",
    answer: "",
    isAnswered: false,
    answeredAt: null,
  },
  {
    id: 3,
    category: "QUEST",
    createdAt: new Date("2025-03-18T16:45:00"),
    question: "퀘스트 완료 후 보상을 받지 못했습니다. 확인 부탁드립니다.",
    email: "user3@example.com",
    answer:
      "퀘스트 완료 보상에 대해 확인해보았습니다. 시스템 오류로 인해 지급이 지연되었습니다.",
    isAnswered: true,
    answeredAt: new Date("2025-03-19T11:20:00"),
  },
  {
    id: 4,
    category: "STORY",
    createdAt: new Date("2025-03-15T14:30:00"),
    question:
      "스토리 진행 중 버그가 발생했습니다. 다음 단계로 넘어갈 수 없어요.",
    email: "user4@example.com",
    answer: "",
    isAnswered: false,
    answeredAt: null,
  },
  {
    id: 5,
    category: "ETC",
    createdAt: new Date("2025-03-10T08:50:00"),
    question: "기타 문의사항입니다. 이벤트 참여 방법을 알고 싶어요.",
    email: "user5@example.com",
    answer:
      "이벤트 참여 방법에 대해 안내드립니다. 홈페이지 상단의 '이벤트' 배너를 클릭하세요.",
    isAnswered: true,
    answeredAt: new Date("2025-03-12T09:15:00"),
  },
];

// 목업 데이터 서비스
export const mockDataService = {
  // 모든 문의 목록 가져오기
  getQnaList: () => {
    return Promise.resolve({ data: { list: mockQnaList } });
  },

  // 특정 ID의 문의 상세 정보 가져오기
  getQnaById: (id) => {
    const qna = mockQnaList.find((q) => q.id === parseInt(id));
    if (qna) {
      return Promise.resolve({ data: { data: qna } });
    } else {
      return Promise.reject(new Error("문의를 찾을 수 없습니다."));
    }
  },

  // 문의 추가하기
  createQna: (qnaData) => {
    const newQna = {
      id: mockQnaList.length + 1,
      ...qnaData,
      createdAt: new Date(),
      answer: "",
      isAnswered: false,
      answeredAt: null,
    };
    mockQnaList.push(newQna);
    return Promise.resolve({ data: { data: newQna } });
  },

  // 문의 수정하기
  updateQna: (id, qnaData) => {
    const index = mockQnaList.findIndex((q) => q.id === parseInt(id));
    if (index !== -1) {
      const updatedQna = {
        ...mockQnaList[index],
        ...qnaData,
      };
      mockQnaList[index] = updatedQna;
      return Promise.resolve({ data: { data: updatedQna } });
    } else {
      return Promise.reject(new Error("문의를 찾을 수 없습니다."));
    }
  },

  // 문의 삭제하기
  deleteQna: (id) => {
    const index = mockQnaList.findIndex((q) => q.id === parseInt(id));
    if (index !== -1) {
      mockQnaList.splice(index, 1);
      return Promise.resolve({ data: { success: true } });
    } else {
      return Promise.reject(new Error("문의를 찾을 수 없습니다."));
    }
  },
};
