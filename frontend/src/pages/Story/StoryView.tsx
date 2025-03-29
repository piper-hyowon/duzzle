import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./StoryView.css";
import MyHeader from "../../components/MyHeader/MyHeader";
import MyButton from "../../components/MyButton/MyButton";
import { useAudio } from "../../services/useAudio";

interface StoryContent {
  storyId: number;
  currentPage: number;
  totalPage: number;
  content: string;
  image?: string;
  audio?: string;
}

const StoryView: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [story, setStory] = useState<StoryContent | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const RequestURL = import.meta.env.VITE_REQUEST_URL;
  const token = localStorage.getItem("accessToken");
  const zoneId = state?.zoneId as string;
  const title = state?.title as string;
  const zoneNameKr = state?.zoneNameKr as string;
  const { audioRef } = useAudio(story?.audio);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const fetchStoryContent = async (page: number) => {
      try {
        const response = await axios.get(`${RequestURL}/v1/story`, {
          params: { storyId, page },
        });
        const storyData = response.data.data;
        setStory(storyData);
      } catch (error) {
        console.error("스토리 내용 로딩 오류:", error);
      }
    };

    fetchStoryContent(currentPage + 1);
  }, [storyId, RequestURL, token, currentPage]);

  const updateStoryProgress = async (storyId: number, readPage: number) => {
    try {
      if (token) {
        const response = await axios.patch(
          `${RequestURL}/v1/story/progress`,
          { storyId, readPage },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      }
    } catch (error) {
      console.error("진행 상태 업데이트 오류:", error);
    }
  };

  const handlePreviousPage = async () => {
    if (story && currentPage > 0) {
      const newPage = currentPage - 1;
      await updateStoryProgress(story.storyId, newPage + 1);
      setCurrentPage(newPage);
    }
  };

  const handleNextPage = async () => {
    if (story && currentPage < story.totalPage - 1) {
      const newPage = currentPage + 1;
      await updateStoryProgress(story.storyId, newPage + 1);
      setCurrentPage(newPage);
    }
  };

  const handleFinish = async () => {
    if (story && zoneId) {
      await updateStoryProgress(story.storyId, story.totalPage);
      navigate(`/zone/${zoneId}`, { state: { zoneNameKr } });
    }
  };

  const handleAudio = useCallback(() => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
      } else {
        audioRef.current
          .play()
          .then(() => setPlaying(true))
          .catch((e) => console.error("Audio play error:", e));
      }
      setPlaying(!playing);
    }
  }, [audioRef, playing]);

  if (!story) {
    return (
      <div className="LO">
        <p>스토리 불러오는데 오류가 발생했습니다.</p>
        <p>다시 시도해주세요.</p>
        <button className="button_error" onClick={() => navigate(-1)}>
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="c3">
      <MyHeader leftChild={<MyButton />} headerText={""} />
      <div className="container_view">
        <p className="content_title">{title}</p>
        <div className="content_view">
          {story.audio && (
            <button className="button_audio" onClick={handleAudio}>
              {playing ? "음악 일시정지" : "음악 재생"}
            </button>
          )}
          <img className="content_image" src={story.image} />
          <p className="content">{story.content}</p>
        </div>
        {currentPage > 0 && (
          <button className="button_previous" onClick={handlePreviousPage}>
            이전 페이지
          </button>
        )}
        {currentPage < story.totalPage - 1 && (
          <button className="button_next" onClick={handleNextPage}>
            다음 페이지
          </button>
        )}
        {currentPage >= story.totalPage - 1 && (
          <button className="button_finish" onClick={handleFinish}>
            끝내기
          </button>
        )}
        <div>
          <span className="current_view">
            {currentPage + 1}/{story.totalPage}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StoryView;
