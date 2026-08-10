import React from 'react';
import { useCalculatorStore } from '../../store/useCalculatorStore';

export const CalculationSummaryCard: React.FC = () => {
  const result = useCalculatorStore((state) => state.calculationResult);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-slate-800">
      <h3 className="text-xs font-bold mb-3 text-slate-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
        <span>📊</span> 圧力損失 兼 ポンプ選定 試算サマリー
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          <span className="text-slate-500 text-[11px] block">管内平均流速 v</span>
          <span className="text-base font-bold font-mono text-slate-900">
            {result.flowVelocityMS.toFixed(2)} <span className="text-xs font-normal text-slate-500">m/s</span>
          </span>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          <span className="text-slate-500 text-[11px] block">直管摩擦損失 hf,p</span>
          <span className="text-base font-bold font-mono text-slate-900">
            {result.pipeFrictionHeadLossM.toFixed(2)} <span className="text-xs font-normal text-slate-500">m</span>
          </span>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          <span className="text-slate-500 text-[11px] block">継手弁損失 hf,m</span>
          <span className="text-base font-bold font-mono text-slate-900">
            {result.fittingHeadLossM.toFixed(2)} <span className="text-xs font-normal text-slate-500">m</span>
          </span>
        </div>

        <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200">
          <span className="text-amber-700 text-[11px] block">全水頭損失 hf</span>
          <span className="text-base font-bold font-mono text-amber-900">
            {result.totalHeadLossM.toFixed(2)} <span className="text-xs font-normal text-amber-700">m</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200">
        <div className="bg-blue-50/60 border border-blue-200 p-3 rounded-lg">
          <span className="text-blue-700 text-xs block font-medium">全必要揚程 Total Head (H)</span>
          <span className="text-xl font-black font-mono text-blue-900">
            {result.totalRequiredHeadM.toFixed(2)} <span className="text-xs font-semibold">m</span>
          </span>
        </div>

        <div className="bg-blue-100/60 border border-blue-300 p-3 rounded-lg">
          <span className="text-blue-900 text-xs block font-medium">計画全揚程 Design Head (H_d)</span>
          <span className="text-xl font-black font-mono text-blue-950">
            {result.designHeadM.toFixed(2)} <span className="text-xs font-semibold">m</span>
          </span>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
          <span className="text-emerald-800 text-xs block font-medium">必要モータ出力 Motor Power (P_m)</span>
          <span className="text-xl font-black font-mono text-emerald-900">
            {result.motorPowerKw.toFixed(2)} <span className="text-xs font-semibold">kW</span>
          </span>
        </div>
      </div>
    </div>
  );
};
