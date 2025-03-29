/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import MyButton from "../../components/MyButton/MyButton";
import MyHeader from "../../components/MyHeader/MyHeader";

import "./Items.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Items() {
  const navigate = useNavigate();
  const [totalItems, setTotalItems] = useState(0);
  const [items, setItems] = useState<Item[]>([]);

  interface Item {
    name: string;
    count: number;
    image: string;
  }

  const RequestUrl = import.meta.env.VITE_REQUEST_URL;

  useEffect(() => {
    const getUserItem = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(RequestUrl + "/v1/my/nft-items", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        if (response.data.result) {
          setTotalItems(response.data.data.totalItems);
          setItems(response.data.data.items);
        } else {
          console.error("Failed to fetch items");
        }
      } catch (error) {
        console.error(error);
      }
    };
    getUserItem();
  }, [RequestUrl]);

  return (
    <div className="Items">
      <MyHeader headerText="아이템 NFT" leftChild={<MyButton />} />
      <div className="items_title">
        <p>나의 아이템</p>
        <div className="tooltip">
          <svg
            className="tooltip_icon"
            data-slot="icon"
            fill="none"
            strokeWidth="2.5"
            stroke="#8c8c8c"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
            ></path>
          </svg>
          <span className="tooltip_text">
            이번 시즌에 사용 가능한 아이템만 존재합니다.
          </span>
        </div>
      </div>
      <div className="items_total">
        <img src="/src/assets/images/item.png" />
        <p>{totalItems} Items</p>
      </div>
      <div className="items_main">
        {items.map((item) => (
          <div className="item" key={item.name}>
            <img src={item.image} alt={item.name} />
            <p>{item.name}</p>
            <p>수량 : {item.count}</p>
          </div>
        ))}
      </div>
      <div
        className="store_btn"
        onClick={() => {
          navigate("/store");
        }}
      >
        <svg
          data-slot="icon"
          fill="none"
          strokeWidth="2.0"
          stroke="white"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
          ></path>
        </svg>
        <p>상점</p>
      </div>
    </div>
  );
}

export default Items;
