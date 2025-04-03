import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./StoryView.css";
import MyHeader from "../../components/MyHeader/MyHeader";
import MyButton from "../../components/MyButton/MyButton";
import { useAudio } from "../../services/useAudio";
import { mockApiService } from "../../services/mockServices";

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
  const zoneId = state?.zoneId as string;
  const title = state?.title as string;
  const zoneNameKr = state?.zoneNameKr as string;
  const { audioRef } = useAudio(story?.audio);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    try {
      // 페이지가 유효한지 확인
      if (currentPage >= 0) {
        const storyData = mockApiService.story.detail(
          Number(storyId),
          currentPage
        );
        
        // API 응답이 유효한지 확인
        console.log(storyData)
        if (storyData && storyData.data) {
          setStory({
            storyId: Number(storyId),
            currentPage: currentPage + 1,
            totalPage: storyData.total,
            content: storyData.data.content,
            image: storyData.data?.image,
            audio: storyData.data?.audio,
          });
        } else {
          console.error("Invalid story data received");
        }
      }
    } catch (error) {
      console.error("Error fetching story data:", error);
      // 오류 처리 - 필요한 경우 상태 업데이트
    }
  }, [storyId, currentPage]);

  // 컴포넌트 언마운트 시 오디오 정리를 위한 useEffect
  useEffect(() => {
    return () => {
      // 컴포넌트 언마운트 시 오디오 정리
      if (audioRef.current) {
        audioRef.current.pause();
        setPlaying(false);
      }
    };
  }, [audioRef]);

  const handlePreviousPage = async () => {
    if (story && currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
    }
  };

  const handleNextPage = async () => {
    if (story && currentPage < story.totalPage - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
    }
  };

  const handleFinish = async () => {
    if (story && zoneId) {
      navigate(`/zone/${zoneId}`, { state: { zoneNameKr } });
    } else {
      // zoneId가 없는 경우 이전 페이지로 이동
      navigate(-1);
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
          {story.image && (
            <img className="content_image" src={story.image} alt="Story content" />
          )}
          <p className="content">{story.content}</p>
        </div>
        <div className="navigation_buttons">
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
        </div>
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