import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useCalculatorStore } from '../../store/useCalculatorStore';

interface LineSegmentData {
  start: THREE.Vector3;
  end: THREE.Vector3;
  direction: THREE.Vector3;
  length: number;
}

interface FittingNodeData {
  id: string;
  type: string;
  name: string;
  position: THREE.Vector3;
  direction: THREE.Vector3;
}

/**
 * Pure 2D Flat JIS B 0011-2 Isometric Piping Engine
 * Uniform Stroke Width (すべて 1.5px / 0.02 相当の統一線幅)
 * - Pipes: 3D Line / Cylinder rendered with fixed thin stroke
 * - Tank: Fixed 1.5px stroke outline
 * - Valves: 1.5px SVG Stroke
 */
export const PipingModel3D: React.FC = () => {
  const pipe = useCalculatorStore((state) => state.pipeLine.pipe);
  const fittings = useCalculatorStore((state) => state.pipeLine.fittings);
  const selectComponent = useCalculatorStore((state) => state.selectComponent);

  const BLACK = '#000000';

  // Compute Isometric Single Line Route matching JIS B 0011-2 Fig 24
  const { segments, fittingNodes } = useMemo(() => {
    const segs: LineSegmentData[] = [];
    const nodes: FittingNodeData[] = [];

    const isoStep = 2.4;
    const dirs = [
      new THREE.Vector3(isoStep * Math.cos(Math.PI / 6), 0, isoStep * Math.sin(Math.PI / 6)),  // Iso X 30°
      new THREE.Vector3(0, isoStep, 0),                                                        // Iso Z Vertical 90°
      new THREE.Vector3(-isoStep * Math.cos(Math.PI / 6), 0, isoStep * Math.sin(Math.PI / 6)), // Iso Y 150°
      new THREE.Vector3(0, -isoStep, 0),
    ];
    let dirIndex = 0;
    let currentPos = new THREE.Vector3(0, 0, 0);

    fittings.forEach((item) => {
      const currentDir = dirs[dirIndex].clone();
      const nextPos = currentPos.clone().add(currentDir);

      segs.push({
        start: currentPos.clone(),
        end: nextPos.clone(),
        direction: currentDir.clone().normalize(),
        length: isoStep,
      });

      nodes.push({
        id: item.id,
        type: item.type,
        name: item.name,
        position: nextPos.clone(),
        direction: currentDir.clone().normalize(),
      });

      currentPos = nextPos.clone();
      dirIndex = (dirIndex + 1) % dirs.length;
    });

    const finalDir = dirs[dirIndex].clone();
    const finalPos = currentPos.clone().add(finalDir);
    segs.push({
      start: currentPos.clone(),
      end: finalPos.clone(),
      direction: finalDir.clone().normalize(),
      length: isoStep,
    });

    return { segments: segs, fittingNodes: nodes };
  }, [fittings, pipe.lengthM]);

  // Compute 2D rotation angle for 2D SVG valve based on 3D direction vector
  const get2DValvRotationAngleDeg = (dir: THREE.Vector3): number => {
    if (Math.abs(dir.y) > 0.8) {
      return 90; // Vertical pipe
    }
    if (dir.x > 0) {
      return -30; // 30 deg axis
    }
    return 30; // 150 deg axis
  };

  return (
    <group position={[-1.2, -0.6, -1.0]}>
      {/* 1. JIS Isometric XYZ Axis Indicator */}
      <Html position={[3.8, 3.2, -1.0]} center>
        <div className="font-mono text-[10px] text-black select-none font-bold bg-white/90 px-2 py-1 border border-black shadow-xs">
          Z ↑ &nbsp; Y ↖ &nbsp; X ↗
        </div>
      </Html>

      {/* 2. JIS Tank Vessel (Uniform 1.5px Thin Stroke) */}
      <group
        position={[0, 0.4, -0.5]}
        onClick={(e) => {
          e.stopPropagation();
          selectComponent('pump');
        }}
      >
        {/* Top Rim */}
        <mesh position={[0, 0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.49, 0.5, 32]} />
          <meshBasicMaterial color={BLACK} side={THREE.DoubleSide} />
        </mesh>
        {/* Bottom Rim */}
        <mesh position={[0, -0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.49, 0.5, 32]} />
          <meshBasicMaterial color={BLACK} side={THREE.DoubleSide} />
        </mesh>
        {/* Left Side Line */}
        <mesh position={[-0.5, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 1.4, 8]} />
          <meshBasicMaterial color={BLACK} />
        </mesh>
        {/* Right Side Line */}
        <mesh position={[0.5, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 1.4, 8]} />
          <meshBasicMaterial color={BLACK} />
        </mesh>
        {/* Center Line */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 1.8, 8]} />
          <meshBasicMaterial color={BLACK} />
        </mesh>
      </group>

      {/* 3. Pure Black JIS Centerline Pipe Routes (Uniform Thin Stroke 0.008) */}
      {segments.map((seg, idx) => {
        const midPoint = seg.start.clone().add(seg.end).multiplyScalar(0.5);
        const orientation = new THREE.Quaternion();
        orientation.setFromUnitVectors(new THREE.Vector3(0, 1, 0), seg.direction);

        return (
          <mesh
            key={`seg-${idx}`}
            position={midPoint}
            quaternion={orientation}
            onClick={(e) => {
              e.stopPropagation();
              selectComponent('pipe');
            }}
          >
            <cylinderGeometry args={[0.008, 0.008, seg.length, 8]} />
            <meshBasicMaterial color={BLACK} />
          </mesh>
        );
      })}

      {/* 4. 100% Flat 2D JIS Valve Symbols (Uniform 1.5px Stroke) */}
      {fittingNodes.map((node) => {
        const isValve = node.type.toLowerCase().includes('valve');
        const rotDeg = get2DValvRotationAngleDeg(node.direction);

        return (
          <group
            key={node.id}
            position={node.position}
            onClick={(e) => {
              e.stopPropagation();
              selectComponent(node.id);
            }}
          >
            {isValve ? (
              /* Uniform 1.5px Stroke 2D SVG Valve Symbol */
              <Html center pointerEvents="none">
                <div style={{ transform: `rotate(${rotDeg}deg)` }}>
                  <svg width="44" height="44" viewBox="-22 -22 44 44" className="overflow-visible">
                    {/* Flange Tick Left || */}
                    <line x1="-16" y1="-10" x2="-16" y2="10" stroke="#000000" strokeWidth="1.5" />
                    {/* Bowtie Left Triangle */}
                    <polygon points="-16,-8 0,0 -16,8" fill="white" stroke="#000000" strokeWidth="1.5" />
                    {/* Bowtie Right Triangle */}
                    <polygon points="16,-8 0,0 16,8" fill="white" stroke="#000000" strokeWidth="1.5" />
                    {/* Flange Tick Right || */}
                    <line x1="16" y1="-10" x2="16" y2="10" stroke="#000000" strokeWidth="1.5" />
                    {/* Stem & Handwheel Line */}
                    <line x1="0" y1="0" x2="0" y2="-14" stroke="#000000" strokeWidth="1.5" />
                    <line x1="-6" y1="-14" x2="6" y2="-14" stroke="#000000" strokeWidth="1.5" />
                  </svg>
                </div>
              </Html>
            ) : (
              /* Elbow Joint Node Point (Uniform 0.02 Dot) */
              <mesh>
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshBasicMaterial color={BLACK} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};
