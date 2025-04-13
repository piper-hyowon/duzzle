import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Story.css";
import MyBottomNavBar from "../../components/MyBottomNavBar/MyBottomNavBar";
import { mockApiService } from "../../services/mockServices";

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

  useEffect(() => {
    setZones(mockApiService.story.list().data.list);
  }, []);

  const handleZoneClick = (zoneId: number, zoneNameKr: string) => {
    navigate(`/zone/${zoneId}`, { state: { zoneNameKr } });
  };

  return (
    <div className="c1">
      <div className="container_story">
        <h1 className="Story_title">DUZZLE STORY</h1>
        <img className="img_story" src="/assets/images/mainImg.png" />
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
