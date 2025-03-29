import { useEffect } from "react";

export const usePreventRefresh = () => {
  const preventClose = (e: any) => {
    e.preventDefault();
    e.returnValue = "";
  };

  // 브라우저에 렌더링시 한 번만 실행
  useEffect(() => {
    (() => {
      window.addEventListener("beforeunload", preventClose);
    })();

    return () => {
      window.removeEventListener("beforeunload", preventClose);
    };
  });
};
