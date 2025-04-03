import "../Fix/FQnaViewer.css";

const FQnaViewer = ({ sortType, email, content, answer, isAnswered }) => {
  // 카테고리 한글 변환
  const getCategoryText = (category) => {
    switch (category) {
      case "MARKET":
        return "거래";
      case "ACCOUNT":
        return "계정";
      case "QUEST":
        return "퀘스트";
      case "STORY":
        return "스토리";
      case "ETC":
        return "기타";
      default:
        return category;
    }
  };

  return (
    <div className="QnaViewer">
      <section>
        <h4>분류</h4>
        <div className="content_wrapper">{getCategoryText(sortType)}</div>
      </section>
      <section>
        <h4>이메일</h4>
        <div className="content_wrapper">{email}</div>
      </section>
      <section>
        <h4>문의내용</h4>
        <div className="content_wrapper">{content}</div>
      </section>

      {isAnswered ? (
        <section className="answer_section">
          <h4>답변</h4>
          <div className="content_wrapper answer">{answer}</div>
        </section>
      ) : (
        <section className="no_answer_section">
          <div className="waiting_msg">답변 대기 중입니다.</div>
        </section>
      )}
    </div>
  );
};

export default FQnaViewer;
