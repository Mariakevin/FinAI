
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const FinancialObjects = () => {
  const coinRef = useRef<THREE.Mesh>(null);
  const cardRef = useRef<THREE.Mesh>(null);
  const chartRef = useRef<THREE.Group>(null);

  // Subtle animation
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (coinRef.current) {
      coinRef.current.rotation.y = time * 0.3;
    }
    
    if (cardRef.current) {
      cardRef.current.position.y = Math.sin(time * 0.5) * 0.1;
      cardRef.current.rotation.z = Math.sin(time * 0.3) * 0.05;
    }
    
    if (chartRef.current) {
      chartRef.current.rotation.y = time * 0.2;
      chartRef.current.position.y = Math.sin(time * 0.4) * 0.1;
    }
  });

  return (
    <>
      {/* Golden Coin */}
      <Float speed={1.5} rotationIntensity={0} floatIntensity={1}>
        <mesh ref={coinRef} position={[-2, 0, 0]}>
          <cylinderGeometry args={[1, 1, 0.2, 32]} />
          <meshStandardMaterial 
            color="#FFD700" 
            metalness={0.8} 
            roughness={0.2}
            emissive="#FF9500"
            emissiveIntensity={0.2}
          />
        </mesh>
      </Float>

      {/* Credit Card */}
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.8}>
        <mesh ref={cardRef} position={[0, 0, 0]} rotation={[0.1, 0, 0]}>
          <boxGeometry args={[2.5, 1.5, 0.05]} />
          <MeshDistortMaterial 
            color="#8B5CF6" 
            speed={1.5} 
            distort={0.15} 
            metalness={0.7} 
            roughness={0.2}
          />
        </mesh>
      </Float>

      {/* Growth Chart */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.6}>
        <group ref={chartRef} position={[2, 0, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.8, 0.1, 1]} />
            <meshStandardMaterial color="#f1f5f9" />
          </mesh>
          
          {/* Chart Bars */}
          {[
            { position: [-0.7, 0.2, 0], height: 0.4, color: "#4ADE80" },
            { position: [-0.35, 0.35, 0], height: 0.7, color: "#818CF8" },
            { position: [0, 0.4, 0], height: 0.8, color: "#F472B6" },
            { position: [0.35, 0.5, 0], height: 1, color: "#60A5FA" },
            { position: [0.7, 0.65, 0], height: 1.3, color: "#6366F1" },
          ].map((bar, index) => (
            <mesh 
              key={index}
              position={[bar.position[0], bar.position[1], bar.position[2]]}
            >
              <boxGeometry args={[0.2, bar.height, 0.2]} />
              <meshStandardMaterial 
                color={bar.color} 
                emissive={bar.color}
                emissiveIntensity={0.3}
                metalness={0.3} 
                roughness={0.4}
              />
            </mesh>
          ))}
        </group>
      </Float>

      {/* Ambient Particles */}
      <Sparkles 
        count={30} 
        scale={10} 
        size={1} 
        speed={0.2} 
        color="#8B5CF6" 
        opacity={0.5}
      />
      
      <Sparkles 
        count={20} 
        scale={10} 
        size={1.5} 
        speed={0.1} 
        color="#60A5FA" 
        opacity={0.3}
      />
    </>
  );
};

const FinancialScene = () => {
  return (
    <div className="w-full h-full">
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 2]}
        className="bg-gradient-to-b from-purple-50 to-indigo-50"
      >
        <color attach="background" args={['#f5f3ff']} />
        <fog attach="fog" args={['#f5f3ff', 5, 15]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.7} color="#ffffff" />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#8B5CF6" />
        
        <FinancialObjects />
        
        {/* Removed OrbitControls to eliminate mouse cursor and user interaction */}
      </Canvas>
    </div>
  );
};

export default FinancialScene;
