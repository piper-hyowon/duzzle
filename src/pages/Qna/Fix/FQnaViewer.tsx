import "./FQnaViewer.css";

const FQnaViewer = ({ sortType, email, content }) => {
  const sortTypeLabels = {
    MARKET: "거래",
    ACCOUNT: "계정",
    QUEST: "퀘스트",
    STORY: "스토리",
    ETC: "기타",
  };

  return (
    <div className="Viewer">
      <div className="info_title1">🌙 문의자 정보</div>
      <section className="info_section">
        <div>문의 종류 🧩: {sortTypeLabels[sortType] || "기타"} </div>
        <div>이메일 💌: {email}</div>
      </section>
      <section className="content_section">
        <div className="content_title">
          <div>🌙 문의 사항</div>
        </div>

        <div className="content_wrapper">
          <p>{content}</p>
        </div>
      </section>
    </div>
  );
};

export default FQnaViewer;
