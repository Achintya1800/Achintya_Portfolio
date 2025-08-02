import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import * as THREE from "three";

import CanvasLoader from "../Loader";

const Earth = () => {
  // Use fallback planet instead of loading corrupted GLTF model
  return (
    <group>
      {/* Main planet body */}
      <mesh>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshStandardMaterial 
          color="#4A90E2"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      {/* Continent-like features */}
      <mesh position={[1, 0, 1]}>
        <sphereGeometry args={[2.52, 16, 16]} />
        <meshStandardMaterial 
          color="#2E7D32"
          roughness={0.8}
          transparent
          opacity={0.8}
        />
      </mesh>
      <mesh position={[-1, 1, -1]}>
        <sphereGeometry args={[2.51, 16, 16]} />
        <meshStandardMaterial 
          color="#388E3C"
          roughness={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* Cloud layer */}
      <mesh>
        <sphereGeometry args={[2.6, 16, 16]} />
        <meshStandardMaterial 
          color="#FFFFFF"
          transparent
          opacity={0.3}
          roughness={1}
        />
      </mesh>
    </group>
  );
};

const EarthCanvas = () => {
  return (
    <Canvas
      shadows
      frameloop='demand'
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-4, 3, 6],
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          autoRotate
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Earth />

        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default EarthCanvas;
