import React, { useState, useMemo, useRef, useCallback } from 'react';
import { IsoViewType } from '../../core/types/iso';
import { FittingItem } from '../../core/types/piping';
import {
  GRID_WIDTH,
  GRID_HEIGHT,
  computeSingleIsoGeometry,
} from '../../core/calc/parallelIsoGeometry';
import { useCalculatorStore } from '../../store/useCalculatorStore';

const VIEW_MODES: IsoViewType[] = ['IS1_SW', 'IS2_SE', 'IS3_NE', 'IS4_NW'];

export const PipingCanvas3D: React.FC = () => {
  const [viewMode, setViewMode] = useState<IsoViewType>('IS1_SW');

  // Full 2D Pan Offset State (x, y in pixels)
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Get active fittings from calculation store
  const fittings = useCalculatorStore((state) => state.pipeLine.fittings);
  const selectedComponentId = useCalculatorStore((state) => state.selectedComponentId);
  const selectComponent = useCalculatorStore((state) => state.selectComponent);

  // Drag Event Handlers for 360° Panning
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Ignore dragging if clicking interactive fitting or node elements
      if ((e.target as HTMLElement).tagName === 'path' || (e.target as HTMLElement).tagName === 'polygon' || (e.target as HTMLElement).tagName === 'circle') {
        return;
      }
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      initialPanRef.current = { ...pan };
    },
    [pan]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      setPan({
        x: initialPanRef.current.x + deltaX,
        y: initialPanRef.current.y + deltaY,
      });
    },
    [isDragging]
  );

  const handleMouseUpOrLeave = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
  }, [isDragging]);

  const handleResetPan = useCallback(() => {
    setPan({ x: 0, y: 0 });
  }, []);

  // Compute single pipe line geometry
  const g = useMemo(
    () => computeSingleIsoGeometry(viewMode, pan.x, pan.y),
    [viewMode, pan.x, pan.y]
  );

  // Unit vector along Leg 1 (S -> B)
  const leg1Len = Math.hypot(g.pB.x - g.pS.x, g.pB.y - g.pS.y);
  const u1x = (g.pB.x - g.pS.x) / (leg1Len || 1);
  const u1y = (g.pB.y - g.pS.y) / (leg1Len || 1);

  // Midpoints for Pipe Leg 1 & Leg 2
  const pLeg1Mid = { x: (g.pS.x + g.pB.x) / 2, y: (g.pS.y + g.pB.y) / 2 };
  const pLeg2Mid = { x: (g.pB.x + g.pE.x) / 2, y: (g.pB.y + g.pE.y) / 2 };
  const pipeColor = '#000000';
  /**
   * Render individual PDF joint symbol based on FittingItem type and position (cx, cy) along pipe run
   */
  const renderFittingSymbol = (item: FittingItem, cx: number, cy: number, symbolCode: string, isVertical: boolean) => {
    const isSelected = selectedComponentId === item.id;
    const strokeColor = isSelected ? '#2563eb' : '#000000';

    // Isometric Standard Alignment:
    // For 30° Isometric Pipe Leg (horizontal isometric axis):
    // Standard JIS isometric joint strokes are strictly VERTICAL lines (dx=0, dy=1) crossing the 30° inclined pipe.
    // For Vertical Pipe Leg (Z-axis):
    // Standard JIS isometric joint strokes are aligned along the ISOMETRIC GRID AXIS (30° / 150° line: cos30, sin30)!
    const cos30 = 0.8660254037844386;
    const sin30 = 0.5;

    // Direct joint stroke orientation along 30° isometric grid for vertical pipe
    const nx = isVertical ? (viewMode === 'IS2_SE' || viewMode === 'IS3_NE' ? -cos30 : cos30) : 0;
    const ny = isVertical ? sin30 : 1;
    const ux = isVertical ? 0 : u1x;
    const uy = isVertical ? -1 : u1y;

    const size = 8;

    return (
      <g
        key={item.id}
        onClick={(e) => {
          e.stopPropagation();
          selectComponent(item.id);
        }}
        className="cursor-pointer group"
      >
        {/* PDF Standard Fitting Symbols */}
        {item.type === 'threadedSocketJoint' && (
          /* 1. ねじ込み・差込み継手 (Single perpendicular stroke across pipe) */
          <line
            x1={cx - nx * size}
            y1={cy - ny * size}
            x2={cx + nx * size}
            y2={cy + ny * size}
            stroke={strokeColor}
            strokeWidth="2.5"
          />
        )}

        {item.type === 'buttWeldedJoint' && (
          /* 2. 突合せ溶接継手 (Solid weld dot on pipe line) */
          <circle cx={cx} cy={cy} r="3.5" fill={strokeColor} />
        )}

        {item.type === 'flangedJoint' && (
          /* 3. フランジ継手 (Double flange lines ||) */
          <g>
            <line
              x1={cx - ux * 2 - nx * size}
              y1={cy - uy * 2 - ny * size}
              x2={cx - ux * 2 + nx * size}
              y2={cy - uy * 2 + ny * size}
              stroke={strokeColor}
              strokeWidth="2"
            />
            <line
              x1={cx + ux * 2 - nx * size}
              y1={cy + uy * 2 - ny * size}
              x2={cx + ux * 2 + nx * size}
              y2={cy + uy * 2 + ny * size}
              stroke={strokeColor}
              strokeWidth="2"
            />
          </g>
        )}

        {item.type === 'unionJoint' && (
          /* 4. ユニオン継手 (JIS Standard: 3 parallel strokes, center stroke is longer than side strokes) */
          <g>
            {/* Left/Lower side stroke */}
            <line
              x1={cx - ux * 3 - nx * (size - 2)}
              y1={cy - uy * 3 - ny * (size - 2)}
              x2={cx - ux * 3 + nx * (size - 2)}
              y2={cy - uy * 3 + ny * (size - 2)}
              stroke={strokeColor}
              strokeWidth="1.8"
            />
            {/* Center longer stroke */}
            <line
              x1={cx - nx * (size + 3)}
              y1={cy - ny * (size + 3)}
              x2={cx + nx * (size + 3)}
              y2={cy + ny * (size + 3)}
              stroke={strokeColor}
              strokeWidth="2.2"
            />
            {/* Right/Upper side stroke */}
            <line
              x1={cx + ux * 3 - nx * (size - 2)}
              y1={cy + uy * 3 - ny * (size - 2)}
              x2={cx + ux * 3 + nx * (size - 2)}
              y2={cy + uy * 3 + ny * (size - 2)}
              stroke={strokeColor}
              strokeWidth="1.8"
            />
          </g>
        )}

        {item.type === 'spigotSocketJoint' && (
          /* 5. インロー継手 (Symmetric 180° semi-circular arc claw along pipe axis) */
          <path
            d={`M ${cx - nx * size} ${cy - ny * size} Q ${cx + ux * size * 1.5} ${cy + uy * size * 1.5} ${cx + nx * size} ${cy + ny * size}`}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        )}

        {/* Component Symbol Label text e.g. J1, J2, J3 */}
        <text
          x={cx + nx * (size + 6)}
          y={cy + ny * (size + 6) + 4}
          fontSize="11"
          fontFamily="monospace"
          fontWeight="bold"
          fill={isSelected ? '#2563eb' : '#334155'}
        >
          {symbolCode}
        </text>
      </g>
    );
  };

  // Separate Leg 1 fittings (horizontal) and Leg 2 fittings (vertical)
  const leg1Fittings = fittings.slice(0, Math.ceil(fittings.length / 2));
  const leg2Fittings = fittings.slice(Math.ceil(fittings.length / 2));

  return (
    <div id="canvas-3d-piping-view" className="w-full bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm flex flex-col select-none">
      {/* Viewport Control Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          {VIEW_MODES.map((v) => (
            <button
              key={v}
              onClick={() => setViewMode(v)}
              className={`px-3 py-1.5 text-xs rounded-lg font-mono font-bold transition-colors ${
                viewMode === v
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600">
          <button
            type="button"
            onClick={handleResetPan}
            className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium px-3 py-1 rounded-lg transition-colors shadow-xs"
            title="配管モデルを中心に移動"
          >
            位置リセット
          </button>
        </div>
      </div>

      {/* SVG Viewport with Drag Handler */}
      <div
        className={`relative w-full h-[600px] bg-white flex justify-center items-center overflow-hidden ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        <svg width="100%" height="100%" viewBox="0 0 700 540" className="w-full h-full">
          <defs>
            {/* Infinite Seamless Grid Background Pattern */}
            <pattern
              id="iso-grid-infinite"
              width={GRID_WIDTH}
              height={GRID_HEIGHT}
              patternUnits="userSpaceOnUse"
              patternTransform={`translate(${pan.x}, ${pan.y})`}
            >
              <path d={`M 0 ${GRID_HEIGHT} L ${GRID_WIDTH} 0`} stroke="#cbd5e1" strokeWidth="0.8" />
              <path d={`M 0 0 L ${GRID_WIDTH} ${GRID_HEIGHT}`} stroke="#cbd5e1" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* Render Background Grid */}
          <rect x="-1000" y="-1000" width="3000" height="3000" fill="url(#iso-grid-infinite)" />

          {/* Leg 1: Start (S) -> Elbow (B) */}
          <line
            x1={g.pS.x}
            y1={g.pS.y}
            x2={g.pB.x}
            y2={g.pB.y}
            stroke={pipeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Pipe Leg 1 Label P1 */}
          <text
            x={pLeg1Mid.x + 4}
            y={pLeg1Mid.y - 12}
            fontSize="12"
            fontFamily="monospace"
            fontWeight="bold"
            fill={pipeColor}
          >
            P1
          </text>

          {/* Render Leg 1 Fitting Symbols evenly spaced along Leg 1 */}
          {leg1Fittings.map((item, idx) => {
            const t = (idx + 1) / (leg1Fittings.length + 1);
            const cx = g.pS.x + t * (g.pB.x - g.pS.x);
            const cy = g.pS.y + t * (g.pB.y - g.pS.y);
            const symbolCode = `J${idx + 1}`;
            return renderFittingSymbol(item, cx, cy, symbolCode, false);
          })}

          {/* Leg 2: Elbow (B) -> End (E) */}
          <line
            x1={g.pB.x}
            y1={g.pB.y}
            x2={g.pE.x}
            y2={g.pE.y}
            stroke={pipeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Pipe Leg 2 Label P2 */}
          <text
            x={pLeg2Mid.x + 16}
            y={pLeg2Mid.y + 4}
            fontSize="12"
            fontFamily="monospace"
            fontWeight="bold"
            fill={pipeColor}
          >
            P2
          </text>

          {/* Render Leg 2 Fitting Symbols evenly spaced along Leg 2 */}
          {leg2Fittings.map((item, idx) => {
            const t = (idx + 1) / (leg2Fittings.length + 1);
            const cx = g.pB.x + t * (g.pE.x - g.pB.x);
            const cy = g.pB.y + t * (g.pE.y - g.pB.y);
            const globalIdx = leg1Fittings.length + idx + 1;
            const symbolCode = `J${globalIdx}`;
            return renderFittingSymbol(item, cx, cy, symbolCode, true);
          })}

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
            S
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
            B1
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
            E
          </text>
        </svg>
      </div>
    </div>
  );
};
