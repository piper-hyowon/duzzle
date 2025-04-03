import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Setting from "./pages/Setting/Setting";
import Mypage from "./pages/Mypage/Mypage";
import Profile from "./pages/Profile/Profile";
import Store from "./pages/Store/Store";
import FQna from "./pages/Qna/Fix/FQna";
import FQnaDetail from "./pages/Qna/Fix/FQnaDetail";
import FQnaNew from "./pages/Qna/Fix/FQnaNew";
import FQnaEdit from "./pages/Qna/Fix/FQnaEdit";
import Quest from "./pages/Quest/Quest";
import QuestSuccess from "./pages/Quest/QuestSuccess";
import QuestFail from "./pages/Quest/QuestFail";
import QuestSpeed from "./pages/Quest/Speed/QuestSpeed";
import Faq from "./pages/Faq/Faq";
import AcidPage from "./pages/Quest/Acid/AcidPage";
import Items from "./pages/Items/Items";
import Pieces from "./pages/Pieces/Pieces";
import NotFound from "./pages/NotFound/NotFound";
import Mainpage from "./pages/Mainpage/Mainpage";
import Story from "./pages/Story/Story";
import StoryView from "./pages/Story/StoryView";
import Storylist from "./pages/Story/Storylist";
import OtherProfile from "./pages/Profile/OtherProfile";
import History from "./pages/History/History";
import HistorySeason from "./pages/History/HistorySeason";
import HistoryPuzzle from "./pages/History/HistoryPuzzle";
import HistoryRanking from "./pages/History/HistoryRanking";
import Deal from "./pages/Deal/Deal";
import Ranking from "./pages/Ranking/Ranking";
import DuksaeJumpPage from "./pages/Quest/Jump/DuksaeJumpPage";
import DrOne from "./pages/Deal/DrOne";
import DrTwo from "./pages/Deal/DrTwo";
import DrThree from "./pages/Deal/DrThree";
import PictureQuizPage from "./pages/Quest/Picture/PictureQuizPage";
import MusicQuizPage from "./pages/Quest/Music/MusicQuizPage";
import DealDetail from "./pages/Deal/DealDetail";
import NFTDetail from "./pages/NftDetail/NftDetailPage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Mainpage />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/mypage/items" element={<Items />} />
          <Route path="/mypage/pieces" element={<Pieces />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:walletAddress" element={<OtherProfile />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/store" element={<Store />} />
          <Route path="/qna" element={<FQna />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/qnadetail/:id" element={<FQnaDetail />} />
          <Route path="/qnanew" element={<FQnaNew />} />
          <Route path="/qnaedit/:id" element={<FQnaEdit />} />
          <Route path="/quest" element={<Quest />} />
          <Route path="/questsuccess" element={<QuestSuccess />} />
          <Route path="/questfail" element={<QuestFail />} />
          <Route path="/questspeed" element={<QuestSpeed />} />
          <Route path="/story" element={<Story />} />
          <Route path="/zone/:zoneId" element={<Storylist />} />
          <Route path="/story/:storyId" element={<StoryView />} />
          <Route path="/history" element={<History />} />
          <Route path="/history/:seasonId" element={<HistorySeason />} />
          <Route path="/history/:seasonId/puzzle" element={<HistoryPuzzle />} />
          <Route
            path="/history/:seasonId/ranking"
            element={<HistoryRanking />}
          />
          <Route path="/nft-exchange" element={<Deal />} />
          <Route path="/nft-exchange/:id" element={<DealDetail />} />
          <Route path="/nft-exchange/regist/stepOne" element={<DrOne />} />
          <Route path="/nft-exchange/regist/stepTwo" element={<DrTwo />} />
          <Route path="/nft-exchange/regist/stepThree" element={<DrThree />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/duksaejump" element={<DuksaeJumpPage />} />
          <Route path="/questacid?" element={<AcidPage />} />
          <Route path="/picturequiz" element={<PictureQuizPage />} />
          <Route path="/musicquiz" element={<MusicQuizPage />} />
          <Route path="/nft-detail" element={<NFTDetail />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
