import React from 'react';
import { useCalculatorStore } from '../../store/useCalculatorStore';
import { PipeMaterial } from '../../core/types';
import { JIS_PIPE_DIMENSIONS } from '../../core/constants';

export const PipeInputForm: React.FC = () => {
  const pipe = useCalculatorStore((state) => state.pipeLine.pipe);
  const setPipeSegment = useCalculatorStore((state) => state.setPipeSegment);

  return (
    <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/60 rounded-xl p-5 shadow-lg text-slate-100">
      <h3 className="text-lg font-semibold mb-4 text-cyan-400 flex items-center gap-2">
        <span>🔧</span> 直管仕様設定 (Pipe Line Specifications)
      </h3>

      <div className="space-y-4">
        {/* Pipe Material & Nominal Size Selection */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="select-pipe-material" className="block text-sm font-medium text-slate-300 mb-1">
              管材 (Material)
            </label>
            <select
              id="select-pipe-material"
              value={pipe.material}
              onChange={(e) => setPipeSegment({ material: e.target.value as PipeMaterial })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              <option value="SGP">SGP (配管用炭素鋼鋼管)</option>
              <option value="STPG">STPG (圧力配管用鋼管)</option>
              <option value="SUS">SUS (ステンレス鋼管)</option>
              <option value="VP">VP (硬質塩化ビニル管)</option>
            </select>
          </div>

          <div>
            <label htmlFor="select-pipe-nominal" className="block text-sm font-medium text-slate-300 mb-1">
              呼称径 (Nominal Size)
            </label>
            <select
              id="select-pipe-nominal"
              value={pipe.nominalDiameterMm}
              onChange={(e) => setPipeSegment({ nominalDiameterMm: parseInt(e.target.value, 10) })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              {JIS_PIPE_DIMENSIONS.map((item) => (
                <option key={item.nominalA} value={item.nominalA}>
                  {item.nominalA}A ({item.nominalB}")
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pipe Length & Inner Diameter Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="input-pipe-length" className="block text-sm font-medium text-slate-300 mb-1">
              直管長 L (Length) [m]
            </label>
            <input
              id="input-pipe-length"
              type="number"
              min="0.1"
              step="0.5"
              value={pipe.lengthM}
              onChange={(e) => setPipeSegment({ lengthM: parseFloat(e.target.value) || 0 })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-right font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label htmlFor="input-pipe-inner-diameter" className="block text-sm font-medium text-slate-300 mb-1">
              管内径 D (Inner Dia) [mm]
            </label>
            <input
              id="input-pipe-inner-diameter"
              type="number"
              min="1"
              step="0.1"
              value={(pipe.innerDiameterM * 1000).toFixed(1)}
              onChange={(e) =>
                setPipeSegment({ innerDiameterM: (parseFloat(e.target.value) || 0) / 1000 })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-right font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Additional Roughness Info Display */}
        <div className="grid grid-cols-2 gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-700/40 text-xs">
          <div>
            <span className="text-slate-400 block">絶対粗さ ε (Roughness):</span>
            <span className="text-slate-200 font-mono font-semibold">
              {(pipe.roughnessM * 1000).toFixed(3)} mm
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Hazen-Williams C:</span>
            <span className="text-slate-200 font-mono font-semibold">{pipe.hazenWilliamsC}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
