import { useNavigate } from "react-router-dom";
import MyButton from "../../components/MyButton/MyButton";
import MyHeader from "../../components/MyHeader/MyHeader";
import { MouseEventHandler, useState } from "react";
import styled from "styled-components";

import "./Setting.css";

function Setting() {
  const navigate = useNavigate();
  const [vibration_on, setVibration_on] = useState(true);
  const [vibration_off, setVibration_off] = useState(false);
  const [volume, setVolume] = useState(0);
  const [language, setLanguage] = useState("한국어");
  const [isShowOptions, setShowOptions] = useState(false);

  const handleOnChangeSelectValue: MouseEventHandler<HTMLElement> = (e) => {
    const eventTarget = e.target as HTMLElement;
    setLanguage(eventTarget.innerText);
  };

  interface SelectOptionProps {
    show: boolean;
  }

  const SelectOptions = styled.ul<SelectOptionProps>`
    max-height: ${(props) => (props.show ? " none " : " 0 ")};
  `;

  return (
    <div className="Setting">
      <MyHeader headerText="설정" leftChild={<MyButton />} />
      <div className="setting_name">
        <p>나의 설정</p>
      </div>
      <div className="setting_menu">
        <section className="setting_vib">
          <p>진동</p>
          <div className="setting_vib_button">
            <button
              className={["button_vib", `button_vib_${vibration_on}`].join(" ")}
              onClick={() => {
                setVibration_on(true);
                setVibration_off(false);
              }}
            >
              <img src="/src/assets/images/vibration.png" />
            </button>
            <button
              className={`button_vib_${vibration_off}`}
              onClick={() => {
                setVibration_off(true);
                setVibration_on(false);
              }}
            >
              <img src="/src/assets/images/vibration_X.png" />
            </button>
          </div>
        </section>
        <section className="setting_vol">
          <p>효과음</p>
          <div className="setting_vol_bar">
            <input
              type="range"
              min={0}
              max={1}
              color="gray"
              step={0.02}
              value={volume}
              onChange={(event) => {
                setVolume(event.target.valueAsNumber);
              }}
            />
          </div>
        </section>
        <section className="setting_lang">
          <p>언어</p>
          <div className="setting_lang_box">
            <div onClick={() => setShowOptions((prev) => !prev)}>
              <label>{language}</label>
              <SelectOptions show={isShowOptions}>
                <li onClick={handleOnChangeSelectValue}>한국어</li>
                <li onClick={handleOnChangeSelectValue}>English</li>
                <li onClick={handleOnChangeSelectValue}>Deutsch</li>
              </SelectOptions>
            </div>
          </div>
        </section>
        <section className="setting_cc">
          <p>고객센터</p>
          <div className="setting_cc_button">
            <button onClick={() => navigate("/faq")}>
              자주하는 질문(FAQ)
              <svg
                data-slot="icon"
                fill="none"
                strokeWidth="4.0"
                stroke="#606060"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                ></path>
              </svg>
            </button>
            <button onClick={() => navigate("/qna")}>
              1:1 문의하기
              <svg
                data-slot="icon"
                fill="none"
                strokeWidth="4.0"
                stroke="#606060"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                ></path>
              </svg>
            </button>
            <button>
              커뮤니티
              <svg
                data-slot="icon"
                fill="none"
                strokeWidth="4.0"
                stroke="#606060"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                ></path>
              </svg>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Setting;
