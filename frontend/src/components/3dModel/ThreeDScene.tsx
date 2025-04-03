import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  PerspectiveCamera,
  Text,
  Plane,
  Sky,
  Stars,
} from "@react-three/drei";
import * as THREE from "three";

import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { Minted, PieceDto } from "../../Data/DTOs/PieceDTO";
import { ContractAddress } from "../../constant/contract";

extend({ TextGeometry });

declare module "@react-three/fiber" {
  interface ThreeElements {
    textGeometry: React.PropsWithChildren<{
      args?: ConstructorParameters<typeof TextGeometry>;
    }>;
  }
}

function FlashyText({
  content,
  position,
  fontSize,
}: {
  content: string;
  position: [number, number, number];
  fontSize: number;
}) {
  const colors = [
    "#FF6F61", // Coral
    "#6B5B95", // Purple
    "#88B04B", // Olive Green
    "#F7CAC9", // Light Pink
    "#92A8D1", // Light Blue
    "#955251", // Wine Red
    "#B3CDE0", // Light Cyan
    "#F15A29", // Orange Red
  ];

  const textRef = useRef<THREE.Mesh>(null);
  const [colorIndex, setColorIndex] = useState(0); // 색상 인덱스 상태

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const opacity = 0.5 + 0.5 * Math.sin(elapsedTime * 3); // 반짝임
    const scale = 1.5 + 0.1 * Math.sin(elapsedTime * 5); // 크기 변화

    // 0.1초마다 색상 변경
    if (Math.floor(elapsedTime * 70) % 10 === 0) {
      setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    }

    if (textRef.current) {
      if (textRef.current.material instanceof THREE.MeshStandardMaterial) {
        textRef.current.material.opacity = opacity;
        textRef.current.material.color.set(colors[colorIndex]); // 변경된 색상 적용
      }
      textRef.current.scale.set(scale, scale, scale); // 크기 변환 적용
    }
  });

  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={fontSize}
      anchorX="center"
      anchorY="middle"
      fontWeight={"bold"}
      material={
        new THREE.MeshStandardMaterial({
          transparent: true,
          color: "#ff6347",
          side: THREE.DoubleSide,
        })
      }
    >
      {content}
    </Text>
  );
}

function NFTInfoText({
  info,
  position,
  isNightMode,
}: {
  info: PieceDto;
  position: [number, number, number];
  isNightMode: boolean;
}) {
  const { zoneNameKr, zoneNameUs } = info;
  const { season, owner, nftThumbnailUrl, tokenId, description, architect } =
    info.data as Minted;

  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(nftThumbnailUrl, (loadedTexture) => {
      setTexture(loadedTexture);
    });
  }, [nftThumbnailUrl]);

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const color = isNightMode ? "#ffffff" : "#239834";

  const textProps = {
    fontSize: 18,
    color,
    anchorX: "center" as const,
    anchorY: "middle" as const,
    material: new THREE.MeshStandardMaterial({
      metalness: 0,
      roughness: 0.5,
      side: THREE.DoubleSide,
    }),
    letterSpacing: 0.1,
    resolution: 1024,
  };

  const titleProps = {
    ...textProps,
    fontSize: 20,
    color,
    fontWeight: "bold",
  };

  const contentProps = {
    ...textProps,
    fontSize: 15,
    maxWidth: 280,
    lineHeight: 1.5,
    anchorY: "top" as const,
  };

  const baseY = position[1];
  const sideY = baseY;
  const detailY = baseY - 50;

  const sideOffset = 220;
  const linePadding = -40;
  const descriptionPadding = -50;

  return (
    <group position={position}>
      {/* 중앙 섹션 */}
      {texture && (
        <group position={[0, baseY, 0]}>
          <Plane args={[60, 60]} position={[0, 0, 0]}>
            <meshBasicMaterial
              map={texture}
              side={THREE.DoubleSide}
              transparent={true}
            />
          </Plane>
          <Text position={[0, 60, 0]} {...titleProps}>
            {`${zoneNameKr} (${zoneNameUs})`}
          </Text>
        </group>
      )}

      {/* 왼쪽 섹션 */}
      <group position={[sideOffset, sideY, 0]}>
        <Text {...titleProps}>NFT 정보</Text>
        <Text position={[0, linePadding, 0]} {...textProps}>
          {`토큰 ID: ${tokenId}`}
        </Text>
        <Text position={[0, linePadding * 2, 0]} {...textProps}>
          {`컨트랙트 주소: ${formatWalletAddress(ContractAddress.PuzzlePiece)}`}
        </Text>
        <Text position={[0, linePadding * 3, 0]} {...textProps}>
          {`시즌: ${season}`}
        </Text>
      </group>

      {/* 오른쪽 섹션 */}
      <group position={[-sideOffset, sideY, 0]}>
        <Text {...titleProps}>소유자 정보</Text>

        <FlashyText
          content={owner.name}
          position={[0, linePadding, 0]}
          fontSize={16}
        />

        <Text position={[0, linePadding * 2, 0]} {...textProps}>
          {formatWalletAddress(owner.walletAddress)}
        </Text>
      </group>

      {/* 상세 정보 */}
      <group position={[0, detailY, 0]}>
        <Text {...titleProps}>상세 정보</Text>
        {architect && (
          <Text position={[0, descriptionPadding, 0]} {...textProps}>
            {`건축가: ${architect}`}
          </Text>
        )}
        {description && (
          <Text position={[0, descriptionPadding - 10, 0]} {...contentProps}>
            {description}
          </Text>
        )}
      </group>
    </group>
  );
}

function ChristmasLights({
  modelSize,
  modelCenter,
}: {
  modelSize: THREE.Vector3;
  modelCenter: [number, number, number];
}) {
  const starsRadius = Math.max(modelSize.x, modelSize.y, modelSize.z) * 0.8;

  const starPosition: [number, number, number] = [
    modelCenter[0],
    modelCenter[1] + 100,
    modelCenter[2],
  ];

  return (
    <>
      <group position={starPosition}>
        <Stars
          radius={starsRadius}
          depth={80}
          count={2000}
          factor={70}
          saturation={0}
          fade
          speed={0.9}
        />
        <Sky
          distance={450000}
          sunPosition={[0, -10, 0]}
          inclination={0}
          azimuth={180}
          mieCoefficient={0.005}
          mieDirectionalG={0.7}
          rayleigh={0.5}
          turbidity={1}
        />
      </group>

      <ambientLight intensity={1.6} color="#d1e2f0" />

      <rectAreaLight
        position={[2.96308, 4.93927, 0.56404]}
        rotation={[
          (-87.678 * Math.PI) / 180,
          (-121.251 * Math.PI) / 180,
          (-88.015 * Math.PI) / 180,
        ]}
        intensity={2}
        color="#FFF5E1"
        width={8}
        height={8}
      />

      <pointLight
        position={[0, 2, 2]}
        intensity={0.5}
        color="#FFF5E1"
        distance={10}
      />
    </>
  );
}

function Lights({
  isNightMode,
  modelSize,
  modelCenter,
}: {
  isNightMode: boolean;
  modelSize: THREE.Vector3;
  modelCenter: [number, number, number];
}) {
  return isNightMode ? (
    <ChristmasLights modelSize={modelSize} modelCenter={modelCenter} />
  ) : (
    <>
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
      <ambientLight intensity={2} />
    </>
  );
}

function Model({
  url,
  nftInfo,
  isModal,
  isNightMode,
}: {
  url: string;
  nftInfo?: PieceDto;
  isModal?: boolean;
  isNightMode: boolean;
}) {
  const { scene } = useGLTF(url);
  const [centerPosition, setCenterPosition] = useState<
    [number, number, number]
  >([0, 150, 0]);
  const [modelCenter, setModelCenter] = useState<[number, number, number]>([
    0, 50, 0,
  ]);
  const [cameraDistance, setCameraDistance] = useState<number>(500);
  const [modelSize, setModelSize] = useState<THREE.Vector3>();

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material) {
          const originalMaterial = child.material;
          const newMaterial = new THREE.MeshStandardMaterial({
            color: originalMaterial.color,
            map: originalMaterial.map,
            transparent: originalMaterial.transparent,
            opacity: originalMaterial.opacity,
            flatShading: true,
            roughness: 1,
            metalness: 0,
            envMapIntensity: 0,
          });

          child.material = newMaterial;

          if (isNightMode) {
            if (
              child.name.includes("창문불켜짐") ||
              child.name.includes("가로등")
            ) {
              const emissiveMaterial = new THREE.MeshStandardMaterial({
                color: "#ffffff",
                emissive: "#ffffe0",
                emissiveIntensity: 1,
                metalness: 0,
                roughness: 0.2,
              });
              child.material = emissiveMaterial;
            } else if (child.name.includes("전구_주황")) {
              const emissiveMaterial = new THREE.MeshStandardMaterial({
                color: "#fc7f50",
                emissive: "#fc7f50",
                emissiveIntensity: 1.3,
                metalness: 0,
                roughness: 0.2,
              });
              child.material = emissiveMaterial;
            } else if (child.name.includes("전구_노랑")) {
              const emissiveMaterial = new THREE.MeshStandardMaterial({
                color: "#ed9121",
                emissive: "#ed9121",
                emissiveIntensity: 1.3,
                metalness: 0,
                roughness: 0.2,
              });
              child.material = emissiveMaterial;
            } else if (child.name.includes("전구_빨강")) {
              const emissiveMaterial = new THREE.MeshStandardMaterial({
                color: "#d64045",
                emissive: "#d64045",
                emissiveIntensity: 1.3,
                metalness: 0.3,
                roughness: 0.2,
              });
              child.material = emissiveMaterial;
            }
          }
        }
      }
    });
    // 모델의 바운딩 박스 계산
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    setModelSize(size);

    // 모델의 부피를 고려한 크기 계산
    const volume = size.x * size.y * size.z;
    const normalizedSize = Math.cbrt(volume);

    // 모델의 종횡비(aspect ratio) 고려
    const aspectRatio = Math.max(
      size.x / size.y,
      size.y / size.z,
      size.x / size.z
    );
    const aspectMultiplier = Math.max(1, Math.log10(aspectRatio) * 0.5);

    // 기본 거리 계산
    const baseDistance = normalizedSize * (isModal ? 1.2 : 2);

    // 최종 거리 계산 (종횡비 반영)
    const optimalDistance = baseDistance * aspectMultiplier;

    setCenterPosition([center.x, box.max.y + 70, center.z]);
    setModelCenter([center.x, center.y, center.z]);
    setCameraDistance(optimalDistance);
  }, [scene, isModal]);

  if (!modelSize) return null;

  return (
    <>
      <primitive object={scene} />
      {nftInfo && (
        <NFTInfoText
          info={nftInfo}
          position={centerPosition}
          isNightMode={isNightMode}
        />
      )}
      <Lights
        isNightMode={isNightMode}
        modelSize={modelSize}
        modelCenter={modelCenter}
      />

      <PerspectiveCamera
        makeDefault
        position={[cameraDistance, cameraDistance, cameraDistance]}
        fov={isModal ? 30 : 40} // 모달일 때는 FOV도 조절
        near={1}
        far={cameraDistance * 4}
      />
      <OrbitControls
        target={modelCenter}
        maxPolarAngle={Math.PI / 2}
        minDistance={isModal ? cameraDistance * 0.15 : cameraDistance * 0.25}
        maxDistance={isModal ? cameraDistance * 1.5 : cameraDistance * 2.5}
        zoomSpeed={0.6}
        enableDamping={true}
        dampingFactor={0.05}
        enableZoom={true}
      />
    </>
  );
}

function ThreeDScene({
  width,
  height,
  url,
  nftInfo,
  isModal = false,
}: {
  width: string;
  height: string;
  url: string;
  nftInfo?: PieceDto;
  isModal?: boolean;
}) {
  const isChristmasSeason = url.includes("christmas");
  const [isNightMode, setIsNightMode] = useState(isChristmasSeason); // 크리스마스 시즌이면 기본값이 밤 모드

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setIsNightMode(!isNightMode)}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 10,
          padding: "8px 16px",
          backgroundColor: isNightMode ? "#f4f1e3" : "#090924",
          color: isNightMode ? "#090924" : "#f4f1e3",
          border: "none",
          borderRadius: "20px",
          cursor: "pointer",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          transition: "all 0.3s ease",
        }}
      >
        {isNightMode ? "🌞 낮으로 전환" : "🌙 밤으로 전환"}
      </button>

      <div
        style={
          isNightMode
            ? { width, height, backgroundColor: "#090924" }
            : { width, height, backgroundColor: "#f4f1e3" }
        }
      >
        <Canvas
          gl={{
            preserveDrawingBuffer: true,
            toneMapping: isNightMode
              ? THREE.ACESFilmicToneMapping
              : THREE.NoToneMapping,
            toneMappingExposure: 1.2,

            outputColorSpace: THREE.LinearDisplayP3ColorSpace,
          }}
        >
          {isNightMode && <color attach="background" args={["#090924"]} />}
          <PerspectiveCamera
            makeDefault
            position={[400, 400, 400]}
            fov={isModal ? 30 : 40} // 모달일 때 더 낮은 FOV
            near={1}
            far={2000}
          />
          {/* <color attach="background" args={["#f4f1e3"]} /> */}

          <Suspense fallback={null}>
            <Model
              url={url}
              nftInfo={nftInfo}
              isModal={isModal}
              isNightMode={isNightMode}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}

export default ThreeDScene;
