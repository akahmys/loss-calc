import React from 'react';
import { useCalculatorStore } from '../../store/useCalculatorStore';

export const PumpDutyForm: React.FC = () => {
  const duty = useCalculatorStore((state) => state.dutyInput);
  const setDutyInput = useCalculatorStore((state) => state.setDutyInput);

  return (
    <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/60 rounded-xl p-5 shadow-lg text-slate-100">
      <h3 className="text-lg font-semibold mb-4 text-cyan-400 flex items-center gap-2">
        <span>⚙️</span> ポンプ運用条件設定 (Pump Operating Duty)
      </h3>

      <div className="space-y-4">
        {/* Flow Rate & Static Head */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="input-flow-rate" className="block text-sm font-medium text-slate-300 mb-1">
              吐出量 Q (Flow Rate) [m³/h]
            </label>
            <input
              id="input-flow-rate"
              type="number"
              min="0.1"
              step="0.5"
              value={duty.flowRateM3H}
              onChange={(e) => setDutyInput({ flowRateM3H: parseFloat(e.target.value) || 0 })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-right font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label htmlFor="input-static-head" className="block text-sm font-medium text-slate-300 mb-1">
              実揚程 Hs (Static Head) [m]
            </label>
            <input
              id="input-static-head"
              type="number"
              min="0"
              step="0.5"
              value={duty.staticHeadM}
              onChange={(e) => setDutyInput({ staticHeadM: parseFloat(e.target.value) || 0 })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-right font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Margin Ratio & Efficiencies */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label htmlFor="input-margin-ratio" className="block text-xs font-medium text-slate-300 mb-1">
              安全余裕率 (Margin)
            </label>
            <input
              id="input-margin-ratio"
              type="number"
              min="1.0"
              max="2.0"
              step="0.05"
              value={duty.marginRatio}
              onChange={(e) => setDutyInput({ marginRatio: parseFloat(e.target.value) || 1.0 })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-right font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 text-sm"
            />
          </div>

          <div>
            <label htmlFor="input-pump-efficiency" className="block text-xs font-medium text-slate-300 mb-1">
              ポンプ効率 ηp [%]
            </label>
            <input
              id="input-pump-efficiency"
              type="number"
              min="10"
              max="100"
              step="1"
              value={Math.round(duty.pumpEfficiencyRatio * 100)}
              onChange={(e) =>
                setDutyInput({ pumpEfficiencyRatio: (parseFloat(e.target.value) || 0) / 100 })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-right font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 text-sm"
            />
          </div>

          <div>
            <label htmlFor="input-motor-efficiency" className="block text-xs font-medium text-slate-300 mb-1">
              モータ効率 ηm [%]
            </label>
            <input
              id="input-motor-efficiency"
              type="number"
              min="10"
              max="100"
              step="1"
              value={Math.round(duty.motorEfficiencyRatio * 100)}
              onChange={(e) =>
                setDutyInput({ motorEfficiencyRatio: (parseFloat(e.target.value) || 0) / 100 })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-right font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
