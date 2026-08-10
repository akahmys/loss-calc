import React, { useState, useMemo } from 'react';

type ViewMode = 'IS1_SW' | 'IS2_SE' | 'IS3_NE' | 'IS4_NW';

export const PipingCanvas3D: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('IS1_SW');

  // Isometric Grid Constants (Exact 30° grid: width 60, height 60 * tan 30° = 34.641)
  const gridW = 60;
  const gridH = 34.64101615137754;

  const L1 = 180; // Pipe length of Leg 1 (S -> B)
  const L2 = 200; // Pipe length of Leg 2 (B -> E)

  const centerCanvas = { x: 350, y: 320 };

  const geom = useMemo(() => {
    const cos30 = 0.8660254037844386;
    const sin30 = 0.5000000000000000;

    let pipeDx = 0;
    let pipeDy = 0;
    let crossDx = 0;
    let crossDy = 0;

    // Correct isometric projection vectors per view angle:
    // IS1_SW: Pipe along 30° axis (dx = L1*cos30, dy = -L1*sin30). Cross axis along 150° axis
    // IS2_SE: Pipe along 150° axis (dx = -L1*cos30, dy = -L1*sin30). Cross axis along 30° axis
    // IS3_NE: Pipe along 210° axis (dx = -L1*cos30, dy = L1*sin30). Cross axis along 330° axis
    // IS4_NW: Pipe along 330° axis (dx = L1*cos30, dy = L1*sin30). Cross axis along 210° axis

    if (viewMode === 'IS1_SW') {
      pipeDx = L1 * cos30;   pipeDy = -L1 * sin30;
      crossDx = -90 * cos30; crossDy = -90 * sin30;
    } else if (viewMode === 'IS2_SE') {
      pipeDx = -L1 * cos30;  pipeDy = -L1 * sin30;
      crossDx = 90 * cos30;  crossDy = -90 * sin30;
    } else if (viewMode === 'IS3_NE') {
      pipeDx = -L1 * cos30;  pipeDy = L1 * sin30;
      crossDx = 90 * cos30;  crossDy = 90 * sin30;
    } else if (viewMode === 'IS4_NW') {
      pipeDx = L1 * cos30;   pipeDy = L1 * sin30;
      crossDx = -90 * cos30; crossDy = 90 * sin30;
    }

    // 3D Depth Determination for Parallel Lines:
    // Line 1 (A) at Y = -90, Line 2 (B) at Y = +90
    // Camera Depth equation = X*sin(theta) - Y*cos(theta)
    // SW (30°):   Line A depth = -250*sin30 - (-90)*cos30 = -125 + 77.9 = -47.1
    //             Line B depth = -250*sin30 - (+90)*cos30 = -125 - 77.9 = -202.9 -> Line A is CLOSER (FRONT)
    // SE (120°):  Line B is CLOSER (FRONT)
    // NE (210°):  Line A depth = -250*sin210 - (-90)*cos210 = +125 - 77.9 = +47.1
    //             Line B depth = -250*sin210 - (+90)*cos210 = +125 + 77.9 = +202.9 -> Line B is CLOSER (FRONT)
    // NW (300°):  Line B is CLOSER (FRONT)
    const isLineAInFront = viewMode === 'IS1_SW';

    const originA = { x: centerCanvas.x - crossDx / 2, y: centerCanvas.y - crossDy / 2 };
    const originB = { x: centerCanvas.x + crossDx / 2, y: centerCanvas.y + crossDy / 2 };

    const createPipeLine = (cx: number, cy: number, prefix: string, index: number) => {
      const pS = { x: cx, y: cy };
      const pB = { x: cx + pipeDx, y: cy + pipeDy };
      const pE = { x: pB.x, y: pB.y - L2 };

      return { prefix, index, pS, pB, pE };
    };

    const lineA = createPipeLine(originA.x, originA.y, 'A', 1);
    const lineB = createPipeLine(originB.x, originB.y, 'B', 2);

    return {
      backLine: isLineAInFront ? lineB : lineA,
      frontLine: isLineAInFront ? lineA : lineB,
    };
  }, [viewMode]);

  const renderPipeLine = (g: typeof geom.backLine) => {
    const sLabel = g.index === 1 ? 'S1' : 'S2';
    const bLabel = g.index === 1 ? 'B1' : 'B2';
    const eLabel = g.index === 1 ? 'E1' : 'E2';
    const pipeColor = '#000000';

    return (
      <g key={g.prefix}>
        {/* Leg 1: S -> B */}
        <line
          x1={g.pS.x}
          y1={g.pS.y}
          x2={g.pB.x}
          y2={g.pB.y}
          stroke={pipeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Leg 2: B -> E */}
        <line
          x1={g.pB.x}
          y1={g.pB.y}
          x2={g.pE.x}
          y2={g.pE.y}
          stroke={pipeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Node S */}
        <circle cx={g.pS.x} cy={g.pS.y} r="4" fill={pipeColor} />
        <text
          x={g.pS.x - 14}
          y={g.pS.y + 16}
          fontSize="12"
          fontFamily="monospace"
          fontWeight="bold"
          fill={pipeColor}
        >
          {sLabel}
        </text>

        {/* Node B */}
        <circle cx={g.pB.x} cy={g.pB.y} r="4" fill={pipeColor} />
        <text
          x={g.pB.x + 8}
          y={g.pB.y + 16}
          fontSize="12"
          fontFamily="monospace"
          fontWeight="bold"
          fill={pipeColor}
        >
          {bLabel}
        </text>

        {/* Node E */}
        <circle cx={g.pE.x} cy={g.pE.y} r="4" fill={pipeColor} />
        <text
          x={g.pE.x + 10}
          y={g.pE.y - 8}
          fontSize="12"
          fontFamily="monospace"
          fontWeight="bold"
          fill={pipeColor}
        >
          {eLabel}
        </text>
      </g>
    );
  };

  return (
    <div id="canvas-3d-piping-view" className="w-full bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm flex flex-col select-none">
      {/* Viewport Control Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-700 mr-2">視点選択:</span>
          {(['IS1_SW', 'IS2_SE', 'IS3_NE', 'IS4_NW'] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setViewMode(v)}
              className={`px-3 py-1.5 text-xs rounded font-mono font-bold transition-colors ${
                viewMode === v ? 'bg-blue-600 text-white shadow-xs' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Board */}
      <div className="relative w-full h-[600px] bg-white flex justify-center items-center overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 700 540" className="w-full h-full">
          {/* Infinite Seamless Grid Background */}
          <defs>
            <pattern id="iso-grid-infinite" width={gridW} height={gridH} patternUnits="userSpaceOnUse">
              <path d={`M 0 ${gridH} L ${gridW} 0`} stroke="#cbd5e1" strokeWidth="0.8" />
              <path d={`M 0 0 L ${gridW} ${gridH}`} stroke="#cbd5e1" strokeWidth="0.8" />
            </pattern>

            {/* Dynamic Mask for 14px Intersection Line Cutout on Back Line */}
            <mask id="front-pipe-mask">
              <rect x="-1000" y="-1000" width="3000" height="3000" fill="white" />
              <g stroke="black" strokeWidth="14" strokeLinecap="square">
                <line
                  x1={geom.frontLine.pS.x}
                  y1={geom.frontLine.pS.y}
                  x2={geom.frontLine.pB.x}
                  y2={geom.frontLine.pB.y}
                />
                <line
                  x1={geom.frontLine.pB.x}
                  y1={geom.frontLine.pB.y}
                  x2={geom.frontLine.pE.x}
                  y2={geom.frontLine.pE.y}
                />
              </g>
            </mask>
          </defs>

          <rect x="-1000" y="-1000" width="3000" height="3000" fill="url(#iso-grid-infinite)" />

          {/* Render Back Pipe Line WITH SVG MASK (Mask applies exact 14px gap break at intersection) */}
          <g mask="url(#front-pipe-mask)">
            {renderPipeLine(geom.backLine)}
          </g>

          {/* Render Front Pipe Line (Solid line passing clean over the gap cutout) */}
          {renderPipeLine(geom.frontLine)}
        </svg>
      </div>
    </div>
  );
};
