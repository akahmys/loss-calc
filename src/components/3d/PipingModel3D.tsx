import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCalculatorStore } from '../../store/useCalculatorStore';

export const PipingModel3D: React.FC = () => {
  const pipe = useCalculatorStore((state) => state.pipeLine.pipe);
  const fittings = useCalculatorStore((state) => state.pipeLine.fittings);
  const flowVelocityMS = useCalculatorStore((state) => state.calculationResult.flowVelocityMS);

  const particlesRef = useRef<THREE.Group>(null);

  // Derive visual dimensions scaled for 3D viewport
  const radius = Math.max(0.15, Math.min(0.6, pipe.innerDiameterM * 4));
  const pipeLength = Math.max(3, Math.min(10, pipe.lengthM * 0.2));

  // Count elbows
  const elbowCount = fittings
    .filter((f) => f.type.startsWith('elbow'))
    .reduce((sum, f) => sum + f.count, 0);

  // Flow animation frame update
  useFrame((_, delta) => {
    if (particlesRef.current) {
      const speed = Math.max(0.5, flowVelocityMS * 0.8);
      particlesRef.current.children.forEach((child) => {
        child.position.z += speed * delta;
        if (child.position.z > pipeLength / 2) {
          child.position.z = -pipeLength / 2;
        }
      });
    }
  });

  return (
    <group>
      {/* Centrifugal Pump Model (Housing & Flanges) */}
      <group position={[0, 0, -pipeLength / 2 - 0.8]}>
        {/* Volute casing */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 0.5, 32]} />
          <meshStandardMaterial color="#0284c7" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Motor body */}
        <mesh position={[-0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.45, 0.45, 1.2, 24]} />
          <meshStandardMaterial color="#334155" metalness={0.4} roughness={0.5} />
        </mesh>
        {/* Discharge flange */}
        <mesh position={[0, 0, 0.35]}>
          <cylinderGeometry args={[radius * 1.4, radius * 1.4, 0.1, 24]} />
          <meshStandardMaterial color="#0ea5e9" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Main Straight Pipe Segment */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius, radius, pipeLength, 32]} />
        <meshPhysicalMaterial
          color={pipe.material === 'SUS' ? '#e2e8f0' : pipe.material === 'VP' ? '#38bdf8' : '#64748b'}
          metalness={pipe.material === 'SUS' ? 0.9 : 0.3}
          roughness={pipe.material === 'VP' ? 0.1 : 0.4}
          transparent
          opacity={0.75}
        />
      </mesh>

      {/* Elbow Fitting Models rendered along line */}
      {Array.from({ length: Math.min( elbowCount, 6) }).map((_, idx) => {
        const offsetZ = -pipeLength / 2 + (pipeLength / (elbowCount + 1)) * (idx + 1);
        return (
          <mesh key={idx} position={[0, 0, offsetZ]} rotation={[Math.PI / 4, 0, 0]}>
            <torusGeometry args={[radius * 1.2, radius * 0.3, 16, 32, Math.PI / 2]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.3} />
          </mesh>
        );
      })}

      {/* Flow Indicator Particles inside Pipe */}
      <group ref={particlesRef}>
        {Array.from({ length: 12 }).map((_, idx) => {
          const z = -pipeLength / 2 + (pipeLength / 12) * idx;
          return (
            <mesh key={idx} position={[0, 0, z]}>
              <sphereGeometry args={[radius * 0.2, 12, 12]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};
