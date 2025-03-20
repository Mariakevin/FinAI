
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, MeshWobbleMaterial, MeshDistortMaterial, Float, Sparkles, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { MathUtils } from 'three';

const FinancialObjects = () => {
  const coinRef = useRef<THREE.Mesh>(null);
  const creditCardRef = useRef<THREE.Mesh>(null);
  const graphRef = useRef<THREE.Mesh>(null);

  // Subtle animation for the objects
  useFrame((state) => {
    if (coinRef.current) {
      coinRef.current.rotation.y += 0.01;
      coinRef.current.position.y = MathUtils.lerp(
        coinRef.current.position.y,
        Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2,
        0.02
      );
    }
    
    if (creditCardRef.current) {
      creditCardRef.current.rotation.y += 0.005;
      creditCardRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
    }
    
    if (graphRef.current) {
      graphRef.current.rotation.y += 0.007;
      graphRef.current.position.y = MathUtils.lerp(
        graphRef.current.position.y,
        Math.sin(state.clock.getElapsedTime() * 0.3 + 1) * 0.2,
        0.02
      );
    }
  });

  return (
    <>
      {/* Coin */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={coinRef} position={[-2, 0, 0]}>
          <cylinderGeometry args={[1, 1, 0.2, 32]} />
          <MeshWobbleMaterial 
            color="#FFD700" 
            factor={0.1} 
            speed={1} 
            metalness={1} 
            roughness={0.3}
          />
        </mesh>
      </Float>

      {/* Credit Card */}
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.4}>
        <mesh ref={creditCardRef} position={[0, 0, 0]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[2.5, 1.5, 0.05]} />
          <MeshDistortMaterial 
            color="#5046e5" 
            speed={2} 
            distort={0.2} 
            metalness={0.8} 
            roughness={0.2}
          />
        </mesh>
      </Float>

      {/* Graph/Chart */}
      <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.3}>
        <mesh ref={graphRef} position={[2, 0, 0]}>
          <group rotation={[0, 0, 0]}>
            {/* Base */}
            <mesh position={[0, -0.5, 0]}>
              <boxGeometry args={[1.6, 0.1, 1]} />
              <meshStandardMaterial color="#e0e0e0" />
            </mesh>
            
            {/* Bars */}
            <mesh position={[-0.6, -0.2, 0]}>
              <boxGeometry args={[0.2, 0.5, 0.2]} />
              <meshStandardMaterial color="#4CAF50" />
            </mesh>
            
            <mesh position={[-0.2, 0, 0]}>
              <boxGeometry args={[0.2, 0.9, 0.2]} />
              <meshStandardMaterial color="#2196F3" />
            </mesh>
            
            <mesh position={[0.2, -0.1, 0]}>
              <boxGeometry args={[0.2, 0.7, 0.2]} />
              <meshStandardMaterial color="#9C27B0" />
            </mesh>
            
            <mesh position={[0.6, 0.1, 0]}>
              <boxGeometry args={[0.2, 1.1, 0.2]} />
              <meshStandardMaterial color="#FF9800" />
            </mesh>
          </group>
        </mesh>
      </Float>

      {/* Sparkles */}
      <Sparkles 
        count={50} 
        scale={10} 
        size={2} 
        speed={0.3} 
        color="#5046e5" 
      />
    </>
  );
};

const FinancialScene = () => {
  return (
    <div className="w-full h-full">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 40 }}
        dpr={[1, 2]}
        className="bg-gradient-to-b from-blue-50 to-indigo-50"
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#5046e5" intensity={0.5} />
        
        <FinancialObjects />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          rotateSpeed={0.2}
          maxPolarAngle={Math.PI / 2} 
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
};

export default FinancialScene;
