import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import * as THREE from "three";

import CanvasLoader from "../Loader";

const Computers = ({ isMobile }) => {
  // Use fallback computer instead of loading corrupted GLTF model
  return (
    <group>
      <hemisphereLight intensity={0.15} groundColor='black' />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={1} />
      
      {/* Monitor */}
      <mesh position={[0, -1, 0]}>
        <boxGeometry args={[3, 2, 0.2]} />
        <meshStandardMaterial color="#2C2C2C" />
      </mesh>
      
      {/* Screen */}
      <mesh position={[0, -1, 0.11]}>
        <boxGeometry args={[2.7, 1.7, 0.01]} />
        <meshStandardMaterial color="#000000" emissive="#1a1a2e" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Base */}
      <mesh position={[0, -2.5, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.3]} />
        <meshStandardMaterial color="#2C2C2C" />
      </mesh>
      
      {/* Tower */}
      <mesh position={[2, -1.5, -0.5]}>
        <boxGeometry args={[0.8, 2.5, 1.5]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Keyboard */}
      <mesh position={[0, -2.8, 1]}>
        <boxGeometry args={[2, 0.1, 0.8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Mouse */}
      <mesh position={[1.5, -2.75, 0.5]}>
        <boxGeometry args={[0.3, 0.05, 0.5]} />
        <meshStandardMaterial color="#2C2C2C" />
      </mesh>
    </group>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Add a listener for changes to the screen size
    const mediaQuery = window.matchMedia("(max-width: 500px)");

    // Set the initial value of the `isMobile` state variable
    setIsMobile(mediaQuery.matches);

    // Define a callback function to handle changes to the media query
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    // Add the callback function as a listener for changes to the media query
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Remove the listener when the component is unmounted
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop='demand'
      shadows
      dpr={[1, 2]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers isMobile={isMobile} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
