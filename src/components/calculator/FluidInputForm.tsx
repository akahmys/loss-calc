import React from 'react';
import { useCalculatorStore } from '../../store/useCalculatorStore';

export const FluidInputForm: React.FC = () => {
  const fluid = useCalculatorStore((state) => state.fluid);
  const setTemperatureCelsius = useCalculatorStore((state) => state.setTemperatureCelsius);

  return (
    <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/60 rounded-xl p-5 shadow-lg text-slate-100">
      <h3 className="text-lg font-semibold mb-4 text-cyan-400 flex items-center gap-2">
        <span>💧</span> 流体特性設定 (Fluid Properties)
      </h3>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="input-fluid-temp" className="text-sm font-medium text-slate-300">
              水温 (Water Temperature): <span className="text-cyan-300 font-mono font-bold">{fluid.temperatureCelsius.toFixed(1)} °C</span>
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              id="input-fluid-temp-range"
              type="range"
              min="0"
              max="100"
              step="1"
              value={fluid.temperatureCelsius}
              onChange={(e) => setTemperatureCelsius(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 bg-slate-700 rounded-lg cursor-pointer"
            />
            <input
              id="input-fluid-temp"
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={fluid.temperatureCelsius}
              onChange={(e) => setTemperatureCelsius(parseFloat(e.target.value) || 0)}
              className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-right font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-700/40 text-xs">
          <div>
            <span className="text-slate-400 block">密度 ρ (Density):</span>
            <span id="display-fluid-density" className="text-slate-200 font-mono font-semibold">
              {fluid.densityKgM3.toFixed(1)} kg/m³
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">動粘性係数 ν (Viscosity):</span>
            <span id="display-fluid-viscosity" className="text-slate-200 font-mono font-semibold">
              {(fluid.kinematicViscosityM2S * 1e6).toFixed(3)} ×10⁻⁶ m²/s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
