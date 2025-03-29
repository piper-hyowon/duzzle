import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Storylist.css";
import MyHeader from "../../components/MyHeader/MyHeader";

interface Story {
  storyId: number;
  title: string;
  totalPage: number;
  readPage: number;
}

const Storylist: React.FC = () => {
  const { zoneId } = useParams<{ zoneId: string }>();
  const { zoneNameKr } = useLocation().state;
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>([]);
  const RequestURL = import.meta.env.VITE_REQUEST_URL;
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = token
          ? await axios.get(`${RequestURL}/v1/story/progress/${zoneId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            })
          : await axios.get(`${RequestURL}/v1/story/all/${zoneId}`);
        setStories(response.data.data.list);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchStories();
  }, [zoneId, RequestURL, token]);

  const handleStoryClick = (storyId: number, title: string) => {
    navigate(`/story/${storyId}`, { state: { zoneId, title, zoneNameKr } });
  };

  const BackButton = () => {
    return (
      <button className="back-button" onClick={() => navigate("/story")}>
        <svg
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
          ></path>
        </svg>
      </button>
    );
  };

  return (
    <div className="c2">
      <MyHeader headerText={zoneNameKr} leftChild={<BackButton />} />
      <div className="container_list">
        <ul className="ul_list">
          {stories.map((story) => (
            <li className="li_list" key={story.storyId}>
              <span className="story_title">{story.title}</span>
              <button
                className="button_r"
                onClick={() => handleStoryClick(story.storyId, story.title)}
              >
                읽기
              </button>
              <div className="progress-bar-r">
                <div
                  className="progress-bar-inner-r"
                  style={{
                    width: `${(story.readPage / story.totalPage) * 100}%`,
                  }}
                ></div>
              </div>
              <span className="readPage">
                {story.readPage}/{story.totalPage}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Storylist;
