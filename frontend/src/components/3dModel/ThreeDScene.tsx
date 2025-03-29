import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  PerspectiveCamera,
  Text,
  Plane,
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
}: {
  info: PieceDto;
  position: [number, number, number];
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

  const textProps = {
    fontSize: 18,
    color: "#239834",
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
    color: "#239834",
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

function Lights() {
  return (
    <>
      {/* 단일 전역 조명만 사용 */}
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
      {/* 약한 주변광 추가 */}
      <ambientLight intensity={2} />
    </>
  );
}

function Model({
  url,
  nftInfo,
  isModal,
}: {
  url: string;
  nftInfo?: PieceDto;
  isModal?: boolean;
}) {
  const { scene } = useGLTF(url);
  const [centerPosition, setCenterPosition] = useState<
    [number, number, number]
  >([0, 150, 0]);
  const [modelCenter, setModelCenter] = useState<[number, number, number]>([
    0, 50, 0,
  ]);
  const [cameraDistance, setCameraDistance] = useState<number>(500);

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
        }
      }
    });
    // 모델의 바운딩 박스 계산
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    // 모델의 부피를 고려한 크기 계산
    const volume = size.x * size.y * size.z;
    const normalizedSize = Math.cbrt(volume); // 부피의 세제곱근으로 대표 크기 계산

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

  return (
    <>
      <primitive object={scene} />
      {nftInfo && <NFTInfoText info={nftInfo} position={centerPosition} />}
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
  return (
    <div style={{ width, height, backgroundColor: "#f4f1e3" }}>
      <Canvas
        gl={{
          preserveDrawingBuffer: true,
          toneMapping: THREE.NoToneMapping,
          outputColorSpace: THREE.LinearDisplayP3ColorSpace,
        }}
      >
        <PerspectiveCamera
          makeDefault
          position={[400, 400, 400]}
          fov={isModal ? 30 : 40} // 모달일 때 더 낮은 FOV
          near={1}
          far={2000}
        />
        {/* <color attach="background" args={["#f4f1e3"]} /> */}

        <Suspense fallback={null}>
          <Model url={url} nftInfo={nftInfo} isModal={isModal} />
        </Suspense>

        <Lights />
      </Canvas>
    </div>
  );
}

export default ThreeDScene;
