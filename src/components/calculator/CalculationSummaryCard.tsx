import React from 'react';
import { useCalculatorStore } from '../../store/useCalculatorStore';

export const CalculationSummaryCard: React.FC = () => {
  const result = useCalculatorStore((state) => state.calculationResult);

  return (
    <div className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-5 shadow-xl shadow-cyan-950/20 text-slate-100 relative overflow-hidden">
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      <h3 className="text-lg font-bold mb-4 text-cyan-300 flex items-center gap-2 border-b border-slate-800 pb-2">
        <span>📊</span> 計算結果サマリー (Calculation Results)
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/50">
          <span className="text-slate-400 text-xs block">管内平均流速 v</span>
          <span id="display-flow-velocity" className="text-lg font-bold font-mono text-cyan-300">
            {result.flowVelocityMS.toFixed(2)} <span className="text-xs text-slate-400 font-normal">m/s</span>
          </span>
        </div>

        <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/50">
          <span className="text-slate-400 text-xs block">直管摩擦損失 hf,p</span>
          <span className="text-lg font-bold font-mono text-slate-200">
            {result.pipeFrictionHeadLossM.toFixed(2)} <span className="text-xs text-slate-400 font-normal">m</span>
          </span>
        </div>

        <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/50">
          <span className="text-slate-400 text-xs block">継手弁損失 hf,m</span>
          <span className="text-lg font-bold font-mono text-slate-200">
            {result.fittingHeadLossM.toFixed(2)} <span className="text-xs text-slate-400 font-normal">m</span>
          </span>
        </div>

        <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/50">
          <span className="text-slate-400 text-xs block">全摩擦損失 hf</span>
          <span className="text-lg font-bold font-mono text-amber-300">
            {result.totalHeadLossM.toFixed(2)} <span className="text-xs text-slate-400 font-normal">m</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
        <div className="bg-cyan-950/40 border border-cyan-800/50 p-3.5 rounded-xl">
          <span className="text-slate-300 text-xs block font-medium">全必要揚程 Total Head (H)</span>
          <span id="display-total-head" className="text-2xl font-black font-mono text-cyan-300">
            {result.totalRequiredHeadM.toFixed(2)} <span className="text-sm font-semibold">m</span>
          </span>
        </div>

        <div className="bg-cyan-900/40 border border-cyan-700/50 p-3.5 rounded-xl">
          <span className="text-cyan-200 text-xs block font-medium">計画揚程 Design Head (H_d)</span>
          <span id="display-design-head" className="text-2xl font-black font-mono text-cyan-200">
            {result.designHeadM.toFixed(2)} <span className="text-sm font-semibold">m</span>
          </span>
        </div>

        <div className="bg-emerald-950/40 border border-emerald-800/50 p-3.5 rounded-xl">
          <span className="text-emerald-300 text-xs block font-medium">必要モータ出力 Motor Power (P_m)</span>
          <span id="display-motor-power" className="text-2xl font-black font-mono text-emerald-300">
            {result.motorPowerKw.toFixed(2)} <span className="text-sm font-semibold">kW</span>
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">
            水動力 {result.waterPowerKw.toFixed(2)} kW / 軸動力 {result.shaftPowerKw.toFixed(2)} kW
          </span>
        </div>
      </div>
    </div>
  );
};
