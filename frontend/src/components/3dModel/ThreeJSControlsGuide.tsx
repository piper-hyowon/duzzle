import { useState, useEffect } from "react";

const Icon = ({ children, size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const RotateIcon = (props) => (
  <Icon {...props}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </Icon>
);

const MoveIcon = (props) => (
  <Icon {...props}>
    <path d="M5 9l-3 3 3 3" />
    <path d="M9 5l3-3 3 3" />
    <path d="M15 19l3-3-3-3" />
    <path d="M19 9l-3-3-3 3" />
    <path d="M2 12h20" />
    <path d="M12 2v20" />
  </Icon>
);

const ZoomIcon = (props) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </Icon>
);

const HelpIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </Icon>
);

const MonitorIcon = (props) => (
  <Icon {...props}>
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </Icon>
);

const SmartphoneIcon = (props) => (
  <Icon {...props}>
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </Icon>
);

const ThreeJSControlsGuide = ({ isFullscreen = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialOverlayShown, setInitialOverlayShown] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // 컴포넌트 마운트 시 상태값 초기화를 위한 useEffect 추가
  useEffect(() => {
    console.log("ThreeJSControlsGuide 컴포넌트 마운트됨");
    return () => {
      console.log("ThreeJSControlsGuide 컴포넌트 언마운트됨");
    };
  }, []);

  // 디바이스 타입 감지
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(
        window.innerWidth <= 768 ||
          "ontouchstart" in window ||
          navigator.maxTouchPoints > 0
      );
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // 전체화면 모드가 아니면 아무것도 렌더링하지 않음
  if (!isFullscreen) return null;

  // 초기 오버레이 닫기 함수
  const handleCloseInitialOverlay = () => {
    console.log("오버레이 닫기 함수 호출됨");
    setInitialOverlayShown(false);
  };

  // 초기 안내 오버레이 - 전체화면에서만 표시됨
  const InitialOverlay = () => (
    <div
      style={{
        position: "absolute",
        bottom: "70px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: "white",
        padding: "8px 12px",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
        zIndex: 50,
        maxWidth: "280px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "13px",
        textAlign: "center",
        pointerEvents: "auto", // 클릭 이벤트가 작동하도록 명시적으로 설정
      }}
    >
      <RotateIcon size={14} />
      {isMobile ? (
        <span>한 손가락으로 회전 | 두 손가락으로 패닝</span>
      ) : (
        <span>클릭+드래그로 회전 | 우클릭+드래그로 패닝</span>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation(); // 이벤트 버블링 방지
          handleCloseInitialOverlay();
        }}
        style={{
          marginLeft: "4px",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          padding: "2px 6px",
          borderRadius: "4px",
          border: "none",
          color: "white",
          cursor: "pointer",
          pointerEvents: "auto", // 클릭 이벤트가 작동하도록 명시적으로 설정
        }}
      >
        확인
      </button>
    </div>
  );

  // 모바일 컨트롤 가이드
  const MobileControlsContent = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            padding: "8px",
            backgroundColor: "#f5f5f5",
            borderRadius: "50%",
          }}
        >
          <RotateIcon />
        </div>
        <div>
          <p style={{ margin: "0 0 4px 0", fontWeight: "500" }}>회전</p>
          <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
            한 손가락으로 드래그
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            padding: "8px",
            backgroundColor: "#f5f5f5",
            borderRadius: "50%",
          }}
        >
          <MoveIcon />
        </div>
        <div>
          <p style={{ margin: "0 0 4px 0", fontWeight: "500" }}>패닝 (이동)</p>
          <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
            두 손가락으로 드래그
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            padding: "8px",
            backgroundColor: "#f5f5f5",
            borderRadius: "50%",
          }}
        >
          <ZoomIcon />
        </div>
        <div>
          <p style={{ margin: "0 0 4px 0", fontWeight: "500" }}>확대/축소</p>
          <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
            두 손가락 확대/축소 제스처
          </p>
        </div>
      </div>
    </div>
  );

  // PC 컨트롤 가이드
  const DesktopControlsContent = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            padding: "8px",
            backgroundColor: "#f5f5f5",
            borderRadius: "50%",
          }}
        >
          <RotateIcon />
        </div>
        <div>
          <p style={{ margin: "0 0 4px 0", fontWeight: "500" }}>회전</p>
          <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
            왼쪽 마우스 버튼 + 드래그
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            padding: "8px",
            backgroundColor: "#f5f5f5",
            borderRadius: "50%",
          }}
        >
          <MoveIcon />
        </div>
        <div>
          <p style={{ margin: "0 0 4px 0", fontWeight: "500" }}>패닝 (이동)</p>
          <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
            마우스: 오른쪽 클릭 + 드래그
            <br />
            터치패드: 두 손가락으로 드래그
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            padding: "8px",
            backgroundColor: "#f5f5f5",
            borderRadius: "50%",
          }}
        >
          <ZoomIcon />
        </div>
        <div>
          <p style={{ margin: "0 0 4px 0", fontWeight: "500" }}>확대/축소</p>
          <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
            마우스 휠 스크롤
            <br />
            터치패드: 두 손가락 확대/축소 제스처
          </p>
        </div>
      </div>
    </div>
  );

  const ControlsModal = () => (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={() => setIsOpen(false)}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          padding: "16px",
          maxWidth: "calc(100% - 32px)",
          width: "320px",
          margin: "0 16px",
          maxHeight: "calc(100vh - 160px)",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: "500", margin: 0 }}>
            3D 모델 컨트롤 가이드
          </h3>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              style={{
                padding: "4px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: !isMobile ? "#e6f0ff" : "transparent",
                color: !isMobile ? "#0066ff" : "#555",
                cursor: "pointer",
                pointerEvents: "auto",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setIsMobile(false);
              }}
              aria-label="PC 컨트롤 보기"
            >
              <MonitorIcon size={18} />
            </button>
            <button
              style={{
                padding: "4px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: isMobile ? "#e6f0ff" : "transparent",
                color: isMobile ? "#0066ff" : "#555",
                cursor: "pointer",
                pointerEvents: "auto",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setIsMobile(true);
              }}
              aria-label="모바일 컨트롤 보기"
            >
              <SmartphoneIcon size={18} />
            </button>
          </div>
        </div>

        {isMobile ? <MobileControlsContent /> : <DesktopControlsContent />}

        <button
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "10px",
            backgroundColor: "#0066ff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "15px",
            pointerEvents: "auto",
          }}
          onClick={() => setIsOpen(false)}
        >
          닫기
        </button>
      </div>
    </div>
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 30,
      }}
    >
      {initialOverlayShown && <InitialOverlay />}

      <button
        onClick={() => {
          console.log("도움말 버튼 클릭됨");
          setIsOpen(true);
        }}
        style={{
          position: "absolute",
          bottom: "70px",
          right: "16px",
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "50%",
          border: "none",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          zIndex: 40,
          pointerEvents: "auto",
          cursor: "pointer",
        }}
        aria-label="컨트롤 도움말"
      >
        <HelpIcon size={20} />
      </button>

      {isOpen && <ControlsModal />}
    </div>
  );
};

export default ThreeJSControlsGuide;
