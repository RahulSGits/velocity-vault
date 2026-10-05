import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function BackgroundParticles() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const count = isMobile ? 800 : 2000;
  
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 50;
      p[i * 3 + 1] = (Math.random() - 0.5) * 50;
      p[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return p;
  }, [count]);

  const pointRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointRef.current) {
      pointRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      pointRef.current.rotation.x = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={pointRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        transparent
        color="#8b5cf6"
        size={isMobile ? 0.08 : 0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function FinancialGlobe() {
  const globeRef = useRef<THREE.Mesh>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const globeSize = isMobile ? 3 : 4;
  
  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group position={[0, isMobile ? -1 : -2, isMobile ? -8 : -5]}>
      <mesh ref={globeRef}>
        <sphereGeometry args={[globeSize, 32, 32]} />
        <meshStandardMaterial 
          color="#3b82f6" 
          wireframe 
          transparent 
          opacity={0.15}
        />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[globeSize + 0.5, 0.01, 16, 100]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[globeSize + 1, 0.01, 16, 100]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

export function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#030303] pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 15], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <fog attach="fog" args={['#030303', 10, 25]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#3b82f6" />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#8b5cf6" />
          <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={2} castShadow color="#06b6d4" />
          
          <BackgroundParticles />
          <FinancialGlobe />
          
          <mesh position={[0, -12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[100, 100, 50, 50]} />
            <meshStandardMaterial color="#111" wireframe transparent opacity={0.1} />
          </mesh>
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none" />
    </div>
  );
}

