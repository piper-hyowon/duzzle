import React, { useEffect, useState } from "react";

// 기존 토스트 타입 그대로 사용
export enum ToastType {
  Success,
  Error,
  Warning,
  Info,
}

// 데모 전용 토스트 타입 추가
export enum DemoToastType {
  UnavailableFeature, // 데모에서 사용할 수 없는 기능
}

// 기존 토스트 Props 인터페이스 확장
export interface ToastProps {
  message: string;
  type: ToastType | DemoToastType;
  duration?: number; // 토스트 메시지가 표시되는 시간(ms) 선택적
}

// 토스트 메시지 컴포넌트
export const ToastComponent: React.FC<ToastProps> = ({
  message,
  type,
  duration = 2000, // 기본값 2초로 설정
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration]);

  let backgroundColor: string;
  let textColor: string;
  let boxShadow: string;
  let icon: string | null = null;

  // 타입에 따른 스타일 설정
  switch (type) {
    case ToastType.Success:
      backgroundColor = "#5cb85c";
      textColor = "#FFFFFF";
      boxShadow = "0 4px 8px rgba(76, 175, 80, 0.4)";
      break;
    case ToastType.Error:
      backgroundColor = "#d9534f";
      textColor = "#FFFFFF";
      boxShadow = "0 4px 8px rgba(244, 67, 54, 0.4)";
      break;
    case ToastType.Warning:
      backgroundColor = "#f0ad4e";
      textColor = "#333333";
      boxShadow = "0 4px 8px rgba(255, 193, 7, 0.4)";
      break;
    case ToastType.Info:
      backgroundColor = "#5bc0de";
      textColor = "#333333";
      boxShadow = "0 4px 8px rgba(91, 192, 222, 0.4)"; // Info 색상 수정
      break;
    case DemoToastType.UnavailableFeature:
      backgroundColor = "#9c27b0"; // 보라색 사용 (구분을 위해)
      textColor = "#FFFFFF";
      boxShadow = "0 4px 8px rgba(156, 39, 176, 0.4)";
      icon = "🔒"; // 잠금 아이콘 추가
      break;
    default:
      backgroundColor = "#333";
      textColor = "#FFFFFF";
      boxShadow = "0 4px 8px rgba(0, 0, 0, 0.4)";
  }

  const toastStyles: React.CSSProperties = {
    position: "fixed",
    top: "100px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "15px 20px",
    backgroundColor: visible ? backgroundColor : "transparent",
    color: textColor,
    borderRadius: "10px",
    boxShadow: boxShadow,
    zIndex: 999,
    transition: "opacity 0.3s ease, transform 0.3s ease",
    opacity: visible ? 1 : 0,
    animation: visible ? "fadeInOut 3s forwards" : "",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "80%",
    minWidth: "250px",
  };

  const messageStyles: React.CSSProperties = {
    fontSize: "16px",
    fontWeight: "bold",
    margin: "0",
    textAlign: "center",
  };

  const iconStyles: React.CSSProperties = {
    marginRight: "10px",
    fontSize: "20px",
  };

  const animationKeyframes = `
    @keyframes fadeInOut {
      0% {
        opacity: 1;
        transform: translate(-50%, 0);
      }
      70% {
        opacity: 0.8;
        transform: translate(-50%, -20px);
      }
      100% {
        opacity: 0;
        transform: translate(-50%, -40px);
      }
    }
  `;

  return (
    <div className="toast">
      <style>{animationKeyframes}</style>
      <div style={toastStyles}>
        {icon && <span style={iconStyles}>{icon}</span>}
        <p style={messageStyles}>{message}</p>
      </div>
    </div>
  );
};

// 데모 버전에서 사용할 수 없는 기능에 대한 토스트 메시지 표시 함수
export const showDemoFeatureToast = (
  featureName: string = "이 기능은",
  container: HTMLElement = document.body
) => {
  // 토스트 메시지 컨테이너 생성
  const toastContainer = document.createElement("div");
  toastContainer.id = "demo-toast-container";
  container.appendChild(toastContainer);

  // React 컴포넌트를 렌더링
  const root = document.createElement("div");
  toastContainer.appendChild(root);

  // React 버전에 따라 적절한 렌더링 방식 사용
  try {
    // React 18: react-dom/client에서 createRoot 가져오기 시도
    import("react-dom/client")
      .then((ReactDOMClient) => {
        // React 18 방식 (createRoot 사용)
        const reactRoot = ReactDOMClient.createRoot(root);
        reactRoot.render(
          <ToastComponent
            message={`${featureName} 데모 버전에서는 사용할 수 없습니다`}
            type={DemoToastType.UnavailableFeature}
            duration={3000}
          />
        );

        // 일정 시간 후에 토스트 요소 제거
        setTimeout(() => {
          reactRoot.unmount();
          if (toastContainer.parentNode) {
            toastContainer.parentNode.removeChild(toastContainer);
          }
        }, 3500);
      })
      .catch((error) => {
        // React 18 import 실패 시 React 17 방식으로 폴백
        fallbackToReact17();
      });
  } catch (error) {
    // 다른 오류 발생 시 React 17 방식으로 폴백
    fallbackToReact17();
  }

  // React 17 이하 방식 (레거시 API)
  function fallbackToReact17() {
    import("react-dom").then((ReactDOM) => {
      ReactDOM.render(
        <ToastComponent
          message={`${featureName} 데모 버전에서는 사용할 수 없습니다`}
          type={DemoToastType.UnavailableFeature}
          duration={3000}
        />,
        root
      );

      // 일정 시간 후에 토스트 요소 제거
      setTimeout(() => {
        // @ts-ignore - React 17 이하에서 사용
        ReactDOM.unmountComponentAtNode(root);
        if (toastContainer.parentNode) {
          toastContainer.parentNode.removeChild(toastContainer);
        }
      }, 3500);
    });
  }
};
