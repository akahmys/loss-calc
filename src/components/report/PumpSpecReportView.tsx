import React from 'react';
import { useCalculatorStore } from '../../store/useCalculatorStore';

export const PumpSpecReportView: React.FC = () => {
  const fluid = useCalculatorStore((state) => state.fluid);
  const pipeLine = useCalculatorStore((state) => state.pipeLine);
  const dutyInput = useCalculatorStore((state) => state.dutyInput);
  const minorLossMethod = useCalculatorStore((state) => state.minorLossMethod);
  const result = useCalculatorStore((state) => state.calculationResult);

  const currentDate = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <div
      id="report-pump-spec-sheet"
      className="bg-white text-slate-900 p-8 max-w-4xl mx-auto rounded-xl shadow-2xl font-sans print:shadow-none print:p-0 print:max-w-none border border-slate-200 print:border-none"
    >
      {/* Printable Header */}
      <div className="border-b-2 border-slate-800 pb-4 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">ポンプ仕様書 兼 損失計算書</h1>
          <p className="text-xs text-slate-500 mt-1">
            Pump Specification Sheet & Piping Pressure Loss Calculation Report
          </p>
        </div>
        <div className="text-right text-xs text-slate-600">
          <div>発行日 (Date): <span className="font-mono font-semibold">{currentDate}</span></div>
          <div>計算方式: <span className="font-semibold">{minorLossMethod === 'K_COEFFICIENT' ? 'K係数方式' : '相当長方式'}</span></div>
        </div>
      </div>

      {/* Grid: Fluid & Piping Specs */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Fluid properties table */}
        <div>
          <h2 className="text-sm font-bold text-slate-800 mb-2 border-l-4 border-cyan-600 pl-2">
            1. 流体条件 (Fluid Conditions)
          </h2>
          <table className="w-full text-xs border-collapse border border-slate-300">
            <tbody>
              <tr className="bg-slate-50">
                <th className="border border-slate-300 px-2 py-1 text-left font-medium text-slate-600">流体名称</th>
                <td className="border border-slate-300 px-2 py-1 font-semibold">{fluid.name}</td>
              </tr>
              <tr>
                <th className="border border-slate-300 px-2 py-1 text-left font-medium text-slate-600">液温</th>
                <td className="border border-slate-300 px-2 py-1 font-mono">{fluid.temperatureCelsius.toFixed(1)} °C</td>
              </tr>
              <tr className="bg-slate-50">
                <th className="border border-slate-300 px-2 py-1 text-left font-medium text-slate-600">密度 ρ</th>
                <td className="border border-slate-300 px-2 py-1 font-mono">{fluid.densityKgM3.toFixed(1)} kg/m³</td>
              </tr>
              <tr>
                <th className="border border-slate-300 px-2 py-1 text-left font-medium text-slate-600">動粘性係数 ν</th>
                <td className="border border-slate-300 px-2 py-1 font-mono">
                  {(fluid.kinematicViscosityM2S * 1e6).toFixed(3)} ×10⁻⁶ m²/s
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Straight pipe specs table */}
        <div>
          <h2 className="text-sm font-bold text-slate-800 mb-2 border-l-4 border-cyan-600 pl-2">
            2. 直管条件 (Pipe Line Specifications)
          </h2>
          <table className="w-full text-xs border-collapse border border-slate-300">
            <tbody>
              <tr className="bg-slate-50">
                <th className="border border-slate-300 px-2 py-1 text-left font-medium text-slate-600">管材質 / 呼称径</th>
                <td className="border border-slate-300 px-2 py-1 font-semibold">
                  {pipeLine.pipe.material} / {pipeLine.pipe.nominalDiameterMm}A
                </td>
              </tr>
              <tr>
                <th className="border border-slate-300 px-2 py-1 text-left font-medium text-slate-600">管内径 D</th>
                <td className="border border-slate-300 px-2 py-1 font-mono">
                  {(pipeLine.pipe.innerDiameterM * 1000).toFixed(1)} mm
                </td>
              </tr>
              <tr className="bg-slate-50">
                <th className="border border-slate-300 px-2 py-1 text-left font-medium text-slate-600">直管合計長 L</th>
                <td className="border border-slate-300 px-2 py-1 font-mono">{pipeLine.pipe.lengthM.toFixed(1)} m</td>
              </tr>
              <tr>
                <th className="border border-slate-300 px-2 py-1 text-left font-medium text-slate-600">管内粗さ ε</th>
                <td className="border border-slate-300 px-2 py-1 font-mono">
                  {(pipeLine.pipe.roughnessM * 1000).toFixed(3)} mm
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Fittings inventory table */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-slate-800 mb-2 border-l-4 border-cyan-600 pl-2">
          3. 継手・弁一覧 (Fittings & Valves Inventory)
        </h2>
        <table className="w-full text-xs border-collapse border border-slate-300 text-center">
          <thead>
            <tr className="bg-slate-100 font-medium text-slate-700">
              <th className="border border-slate-300 px-2 py-1 text-left">品名 (Item Name)</th>
              <th className="border border-slate-300 px-2 py-1 w-20">数量 (Qty)</th>
              <th className="border border-slate-300 px-2 py-1 w-28">損失係数 K</th>
              <th className="border border-slate-300 px-2 py-1 w-28">相当長 Le (m)</th>
            </tr>
          </thead>
          <tbody>
            {pipeLine.fittings.length === 0 ? (
              <tr>
                <td colSpan={4} className="border border-slate-300 px-2 py-2 text-slate-400">
                  登録された継手・弁はありません。
                </td>
              </tr>
            ) : (
              pipeLine.fittings.map((fit) => (
                <tr key={fit.id}>
                  <td className="border border-slate-300 px-2 py-1 text-left font-medium">{fit.name}</td>
                  <td className="border border-slate-300 px-2 py-1 font-mono">{fit.count}</td>
                  <td className="border border-slate-300 px-2 py-1 font-mono">{fit.lossCoefficientK}</td>
                  <td className="border border-slate-300 px-2 py-1 font-mono">{fit.equivalentLengthM.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pump Operating Results Summary */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-slate-800 mb-2 border-l-4 border-cyan-600 pl-2">
          4. ポンプ試算仕様 兼 損失計算結果 (Calculation Results)
        </h2>
        <table className="w-full text-xs border-collapse border border-slate-300">
          <tbody>
            <tr className="bg-slate-50">
              <th className="border border-slate-300 px-3 py-1.5 text-left font-medium text-slate-700 w-1/3">
                計画吐出量 (Flow Rate Q)
              </th>
              <td className="border border-slate-300 px-3 py-1.5 font-mono font-bold text-slate-900">
                {dutyInput.flowRateM3H.toFixed(2)} m³/h
                <span className="text-slate-500 font-normal ml-2">({(result.flowRateM3S * 1000).toFixed(2)} L/s)</span>
              </td>
            </tr>
            <tr>
              <th className="border border-slate-300 px-3 py-1.5 text-left font-medium text-slate-700">
                管内平均流速 (Mean Velocity v)
              </th>
              <td className="border border-slate-300 px-3 py-1.5 font-mono font-bold text-slate-900">
                {result.flowVelocityMS.toFixed(2)} m/s
              </td>
            </tr>
            <tr className="bg-slate-50">
              <th className="border border-slate-300 px-3 py-1.5 text-left font-medium text-slate-700">
                実揚程 (Static Head Hs)
              </th>
              <td className="border border-slate-300 px-3 py-1.5 font-mono text-slate-800">
                {dutyInput.staticHeadM.toFixed(2)} m
              </td>
            </tr>
            <tr>
              <th className="border border-slate-300 px-3 py-1.5 text-left font-medium text-slate-700">
                直管摩擦損失水頭 (Pipe Loss hf,p)
              </th>
              <td className="border border-slate-300 px-3 py-1.5 font-mono text-slate-800">
                {result.pipeFrictionHeadLossM.toFixed(2)} m
              </td>
            </tr>
            <tr className="bg-slate-50">
              <th className="border border-slate-300 px-3 py-1.5 text-left font-medium text-slate-700">
                継手弁局所損失水頭 (Fitting Loss hf,m)
              </th>
              <td className="border border-slate-300 px-3 py-1.5 font-mono text-slate-800">
                {result.fittingHeadLossM.toFixed(2)} m
              </td>
            </tr>
            <tr>
              <th className="border border-slate-300 px-3 py-1.5 text-left font-medium text-slate-700">
                全水頭損失 (Total Loss hf)
              </th>
              <td className="border border-slate-300 px-3 py-1.5 font-mono font-semibold text-amber-700">
                {result.totalHeadLossM.toFixed(2)} m
              </td>
            </tr>
            <tr className="bg-cyan-50">
              <th className="border border-slate-300 px-3 py-2 text-left font-bold text-cyan-950">
                全必要揚程 (Total Required Head H)
              </th>
              <td className="border border-slate-300 px-3 py-2 font-mono text-base font-black text-cyan-900">
                {result.totalRequiredHeadM.toFixed(2)} m
              </td>
            </tr>
            <tr className="bg-cyan-100/60">
              <th className="border border-slate-300 px-3 py-2 text-left font-bold text-cyan-950">
                計画全揚程 (Design Head Hd)
                <span className="block text-[10px] font-normal text-slate-600">
                  (安全余裕率 ×{dutyInput.marginRatio.toFixed(2)})
                </span>
              </th>
              <td className="border border-slate-300 px-3 py-2 font-mono text-lg font-black text-cyan-950">
                {result.designHeadM.toFixed(2)} m
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Power requirements */}
      <div className="bg-slate-50 border border-slate-300 rounded-lg p-4 mb-4">
        <h3 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
          動力計算結果 (Power Requirements Summary)
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <span className="text-[11px] text-slate-500 block">水動力 (Water Power Pw)</span>
            <span className="text-sm font-bold font-mono text-slate-800">{result.waterPowerKw.toFixed(2)} kW</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block">
              軸動力 (Shaft Power Ps) <span className="text-[9px]">(ηp={Math.round(dutyInput.pumpEfficiencyRatio * 100)}%)</span>
            </span>
            <span className="text-sm font-bold font-mono text-slate-800">{result.shaftPowerKw.toFixed(2)} kW</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-600 font-medium block">
              必要モータ出力 (Motor Power Pm) <span className="text-[9px]">(ηm={Math.round(dutyInput.motorEfficiencyRatio * 100)}%)</span>
            </span>
            <span className="text-base font-black font-mono text-emerald-700">{result.motorPowerKw.toFixed(2)} kW</span>
          </div>
        </div>
      </div>

      {/* Footer Notes */}
      <div className="text-[10px] text-slate-400 border-t border-slate-200 pt-3 flex justify-between">
        <div>Loss Calc - Pump Spec & Piping Loss Engine (JSME Standard Equations)</div>
        <div>Page 1 of 1</div>
      </div>
    </div>
  );
};
