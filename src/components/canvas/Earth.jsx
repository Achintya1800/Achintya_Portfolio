import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import * as THREE from "three";

import CanvasLoader from "../Loader";

const Earth = () => {
  const [earth, setEarth] = React.useState(null);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    const loadModel = async () => {
      try {
        const model = await useGLTF.preload("./planet/scene.gltf");
        
        // Validate the model has proper geometry
        if (model?.scene) {
          let hasValidGeometry = false;
          model.scene.traverse((child) => {
            if (child.isMesh && child.geometry) {
              // Check if geometry has valid position attributes
              const positions = child.geometry.attributes.position;
              if (positions && positions.array && positions.array.length > 0) {
                // Check for NaN values in position data
                const hasNaN = Array.from(positions.array).some(val => isNaN(val));
                if (!hasNaN) {
                  hasValidGeometry = true;
                }
              }
            }
          });
          
          if (hasValidGeometry) {
            setEarth(model);
          } else {
            console.warn("Planet model has invalid geometry data");
            setError(true);
          }
        } else {
          setError(true);
        }
      } catch (err) {
        console.warn("Failed to load planet model:", err);
        setError(true);
      }
    };

    loadModel();
  }, []);

  if (error || !earth) {
    // Fallback: Create a simple animated planet
    return (
      <group>
        <mesh>
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshStandardMaterial 
            color="#4A90E2"
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
        {/* Add some simple "continents" */}
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
      </group>
    );
  }

  try {
    return (
      <primitive 
        object={earth.scene} 
        scale={2.5} 
        position-y={0} 
        rotation-y={0} 
      />
    );
  } catch (error) {
    console.warn("Error rendering Earth model:", error);
    return (
      <mesh>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshStandardMaterial color="#4A90E2" />
      </mesh>
    );
  }
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
