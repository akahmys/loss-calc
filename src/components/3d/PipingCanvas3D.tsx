import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { PipingModel3D } from './PipingModel3D';

export const PipingCanvas3D: React.FC = () => {
  return (
    <div
      id="canvas-3d-piping-view"
      className="w-full h-80 sm:h-96 bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative"
    >
      <div className="absolute top-3 left-3 z-10 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs text-slate-300 font-medium flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        3D Piping Skeleton View (R3F)
      </div>

      <Canvas camera={{ position: [5, 4, 6], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 15, 10]} intensity={1.2} />
        <directionalLight position={[-10, -5, -10]} intensity={0.4} color="#38bdf8" />

        <PipingModel3D />

        <Grid
          args={[20, 20]}
          cellSize={1}
          cellThickness={1}
          cellColor="#334155"
          sectionSize={5}
          sectionThickness={1.5}
          sectionColor="#0284c7"
          fadeDistance={25}
          fadeStrength={1}
        />

        <OrbitControls makeDefault enableDamping dampingFactor={0.05} minDistance={3} maxDistance={20} />
      </Canvas>
    </div>
  );
};
