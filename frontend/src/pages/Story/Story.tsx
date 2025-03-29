import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Story.css";
import MyBottomNavBar from "../../components/MyBottomNavBar/MyBottomNavBar";

interface Zone {
  zoneId: number;
  zoneNameKr: string;
  zoneNameUs: string;
  totalStory: number;
  readStory: number;
}

const Story: React.FC = () => {
  const navigate = useNavigate();
  const [zones, setZones] = useState<Zone[]>([]);
  const RequestURL = import.meta.env.VITE_REQUEST_URL;
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = token
          ? await axios.get(`${RequestURL}/v1/story/progress`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            })
          : await axios.get(`${RequestURL}/v1/story/all`);
        setZones(response.data.data.list);
      } catch (error) {
        console.error("Error fetching zones:", error);
      }
    };

    fetchZones();
  }, [RequestURL, token]);

  const handleZoneClick = (zoneId: number, zoneNameKr: string) => {
    navigate(`/zone/${zoneId}`, { state: { zoneNameKr } });
  };

  return (
    <div className="c1">
      <div className="container_story">
        <h1 className="Story_title">DUZZLE STORY</h1>
        <img className="img_story" src="/src/pages/Story/mainImg.png" />
        <ul className="ul_story">
          {zones.map((zone) => (
            <li className="li_story" key={zone.zoneId}>
              <span className="story_name">
                {zone.zoneNameKr} ({zone.zoneNameUs})
              </span>
              <button
                className="button_b"
                onClick={() => handleZoneClick(zone.zoneId, zone.zoneNameKr)}
              >
                선택
              </button>
              <div className="progress-bar_1">
                <div
                  className="progress-bar-inner_1"
                  style={{
                    width: `${(zone.readStory / zone.totalStory) * 100}%`,
                  }}
                ></div>
                <div
                  className="star"
                  style={{
                    left: `${(zone.readStory / zone.totalStory) * 93}%`,
                  }}
                >
                  ⭐
                </div>
              </div>
              <span className="readstory">
                {zone.readStory}/{zone.totalStory}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <MyBottomNavBar />
    </div>
  );
};

export default Story;
