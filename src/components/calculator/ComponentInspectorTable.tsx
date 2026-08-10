import React from 'react';
import { useCalculatorStore } from '../../store/useCalculatorStore';
import { PipeMaterial, FittingType } from '../../core/types';
import { JIS_PIPE_DIMENSIONS } from '../../core/constants';

// Pure Japanese Joint Component Name Mapping for Selector
const COMPONENT_TYPE_OPTIONS: Array<{ label: string; value: FittingType; defaultK: number; defaultLe: number }> = [
  { label: 'ねじ込み・差込み継手', value: 'threadedSocketJoint', defaultK: 0.10, defaultLe: 0.2 },
  { label: '突合せ溶接継手', value: 'buttWeldedJoint', defaultK: 0.05, defaultLe: 0.1 },
  { label: 'フランジ継手', value: 'flangedJoint', defaultK: 0.15, defaultLe: 0.3 },
  { label: 'ユニオン継手', value: 'unionJoint', defaultK: 0.12, defaultLe: 0.25 },
  { label: 'インロー継手', value: 'spigotSocketJoint', defaultK: 0.10, defaultLe: 0.2 },
];

export const ComponentInspectorTable: React.FC = () => {
  const selectedId = useCalculatorStore((state) => state.selectedComponentId);
  const selectComponent = useCalculatorStore((state) => state.selectComponent);

  const fluid = useCalculatorStore((state) => state.fluid);
  const setTemperatureCelsius = useCalculatorStore((state) => state.setTemperatureCelsius);

  const pipe = useCalculatorStore((state) => state.pipeLine.pipe);
  const setPipeSegment = useCalculatorStore((state) => state.setPipeSegment);

  const fittings = useCalculatorStore((state) => state.pipeLine.fittings);
  const updateFitting = useCalculatorStore((state) => state.updateFitting);
  const addFitting = useCalculatorStore((state) => state.addFitting);
  const removeFitting = useCalculatorStore((state) => state.removeFitting);

  const duty = useCalculatorStore((state) => state.dutyInput);
  const setDutyInput = useCalculatorStore((state) => state.setDutyInput);

  const handleAddDefaultFitting = () => {
    addFitting({
      name: 'ねじ込み・差込み継手',
      type: 'threadedSocketJoint',
      lossCoefficientK: 0.10,
      equivalentLengthM: 0.2,
      count: 1,
    });
  };

  const handleTypeChange = (fittingId: string, newType: FittingType) => {
    const opt = COMPONENT_TYPE_OPTIONS.find((o) => o.value === newType);
    if (opt) {
      updateFitting(fittingId, {
        type: newType,
        name: opt.label.split(' ')[0], // Japanese short name e.g. "曲管", "仕切弁"
        lossCoefficientK: opt.defaultK,
        equivalentLengthM: opt.defaultLe,
      });
    }
  };

  return (
    <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm flex flex-col">
      {/* Section Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-sm text-slate-800">配管構成要素・動作条件 一覧表</h2>
        </div>
        <button
          type="button"
          onClick={handleAddDefaultFitting}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-3 py-1.5 rounded-lg transition-colors shadow-xs flex items-center gap-1"
        >
          <span>＋</span> コンポーネントを追加
        </button>
      </div>

      {/* Main Parts Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700 border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
              <th className="p-2.5 w-16 text-center">記号</th>
              <th className="p-2.5 min-w-[150px]">コンポーネント名</th>
              <th className="p-2.5 min-w-[180px]">種別 / 材質</th>
              <th className="p-2.5 min-w-[110px]">呼称径 / 口径</th>
              <th className="p-2.5 min-w-[110px] text-right">長さ L [m] / 実揚程 [m]</th>
              <th className="p-2.5 min-w-[80px] text-right">数量</th>
              <th className="p-2.5 min-w-[100px] text-right">損失係数 K</th>
              <th className="p-2.5 min-w-[100px] text-right">相当長 Le [m]</th>
              <th className="p-2.5 w-16 text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {/* 1. Start Node "S" */}
            <tr
              onClick={() => selectComponent('pump')}
              className={`cursor-pointer transition-colors ${
                selectedId === 'pump' ? 'bg-blue-50/80 font-medium' : 'hover:bg-slate-50'
              }`}
            >
              <td className="p-2.5 text-center font-mono font-bold text-blue-700">S</td>
              <td className="p-2.5 font-bold text-slate-900">
                ポンプ
              </td>
              <td className="p-2.5">
                <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded border border-blue-200 font-mono">
                  水力供給起点
                </span>
              </td>
              <td className="p-2.5 font-mono">
                Q={duty.flowRateM3H} m³/h
              </td>
              <td className="p-2.5 text-right font-mono">
                <div className="flex items-center justify-end gap-1">
                  <span className="text-[10px] text-slate-500">Hs:</span>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={duty.staticHeadM}
                    onChange={(e) => setDutyInput({ staticHeadM: parseFloat(e.target.value) || 0 })}
                    onClick={(e) => e.stopPropagation()}
                    className="w-20 bg-white border border-slate-300 rounded px-1.5 py-1 text-right font-mono text-slate-900 focus:border-blue-500"
                  />
                </div>
              </td>
              <td className="p-2.5 text-right font-mono text-slate-500">1</td>
              <td className="p-2.5 text-right text-slate-400">-</td>
              <td className="p-2.5 text-right text-slate-400">-</td>
              <td className="p-2.5 text-center text-slate-400">-</td>
            </tr>

            {/* 2. Pipe Segment P1 (Leg 1) */}
            <tr
              onClick={() => selectComponent('pipe')}
              className={`cursor-pointer transition-colors ${
                selectedId === 'pipe' ? 'bg-blue-50/80 font-medium' : 'hover:bg-slate-50'
              }`}
            >
              <td className="p-2.5 text-center font-mono font-bold text-slate-700">P1</td>
              <td className="p-2.5 font-bold text-slate-900">
                直管
              </td>
              <td className="p-2.5">
                <select
                  value={pipe.material}
                  onChange={(e) => setPipeSegment({ material: e.target.value as PipeMaterial })}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-900 focus:border-blue-500"
                >
                  <option value="SGP">SGP (鋼管)</option>
                  <option value="STPG">STPG (高圧)</option>
                  <option value="SUS">SUS (ステンレス)</option>
                  <option value="VP">VP (塩ビ)</option>
                </select>
              </td>
              <td className="p-2.5">
                <select
                  value={pipe.nominalDiameterMm}
                  onChange={(e) => setPipeSegment({ nominalDiameterMm: parseInt(e.target.value, 10) })}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-900 focus:border-blue-500"
                >
                  {JIS_PIPE_DIMENSIONS.map((item) => (
                    <option key={item.nominalA} value={item.nominalA}>
                      {item.nominalA}A ({item.nominalB}")
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-2.5 text-right font-mono">
                <div className="flex items-center justify-end gap-1">
                  <span className="text-[10px] text-slate-500">L:</span>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={pipe.lengthM / 2}
                    onChange={(e) => setPipeSegment({ lengthM: (parseFloat(e.target.value) || 0) * 2 })}
                    onClick={(e) => e.stopPropagation()}
                    className="w-20 bg-white border border-slate-300 rounded px-1.5 py-1 text-right font-mono text-slate-900 focus:border-blue-500"
                  />
                </div>
              </td>
              <td className="p-2.5 text-right font-mono text-slate-500">1</td>
              <td className="p-2.5 text-right text-slate-400">-</td>
              <td className="p-2.5 text-right text-slate-400">-</td>
              <td className="p-2.5 text-center text-slate-400">-</td>
            </tr>

            {/* 3. Components / Fittings Rows */}
            {fittings.map((item, idx) => {
              const isSelected = selectedId === item.id;
              const symbol = `J${idx + 1}`;
              return (
                <tr
                  key={item.id}
                  onClick={() => selectComponent(item.id)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-amber-50/90 font-medium' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="p-2.5 text-center font-mono font-bold text-amber-700">{symbol}</td>
                  <td className="p-2.5 font-bold text-slate-900">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateFitting(item.id, { name: e.target.value })}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-white border border-slate-300 rounded px-2 py-1 text-xs w-full text-slate-900 focus:border-blue-500"
                    />
                  </td>
                  <td className="p-2.5">
                    <select
                      value={item.type}
                      onChange={(e) => handleTypeChange(item.id, e.target.value as FittingType)}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-900 focus:border-blue-500 w-full"
                    >
                      {COMPONENT_TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2.5 font-mono text-xs text-slate-600">{pipe.nominalDiameterMm}A</td>
                  <td className="p-2.5 text-right font-mono text-slate-400">-</td>
                  <td className="p-2.5 text-right font-mono">
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={item.count}
                      onChange={(e) => updateFitting(item.id, { count: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                      onClick={(e) => e.stopPropagation()}
                      className="w-16 bg-white border border-slate-300 rounded px-1.5 py-1 text-right font-mono text-slate-900 focus:border-blue-500"
                    />
                  </td>
                  <td className="p-2.5 text-right font-mono">
                    <input
                      type="number"
                      step="0.05"
                      value={item.lossCoefficientK}
                      onChange={(e) => updateFitting(item.id, { lossCoefficientK: parseFloat(e.target.value) || 0 })}
                      onClick={(e) => e.stopPropagation()}
                      className="w-20 bg-white border border-slate-300 rounded px-1.5 py-1 text-right font-mono text-slate-900 focus:border-blue-500"
                    />
                  </td>
                  <td className="p-2.5 text-right font-mono">
                    <input
                      type="number"
                      step="0.1"
                      value={item.equivalentLengthM}
                      onChange={(e) => updateFitting(item.id, { equivalentLengthM: parseFloat(e.target.value) || 0 })}
                      onClick={(e) => e.stopPropagation()}
                      className="w-20 bg-white border border-slate-300 rounded px-1.5 py-1 text-right font-mono text-slate-900 focus:border-blue-500"
                    />
                  </td>
                  <td className="p-2.5 text-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFitting(item.id);
                      }}
                      className="text-rose-600 hover:text-rose-800 font-bold px-2 py-0.5 rounded hover:bg-rose-50 transition-colors"
                      title="パーツを削除"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              );
            })}

            {/* 4. Pipe Segment P2 (Leg 2) */}
            <tr
              onClick={() => selectComponent('pipe')}
              className={`cursor-pointer transition-colors ${
                selectedId === 'pipe' ? 'bg-blue-50/80 font-medium' : 'hover:bg-slate-50'
              }`}
            >
              <td className="p-2.5 text-center font-mono font-bold text-slate-700">P2</td>
              <td className="p-2.5 font-bold text-slate-900">
                直管
              </td>
              <td className="p-2.5">
                <span className="font-mono text-xs text-slate-600">{pipe.material}</span>
              </td>
              <td className="p-2.5">
                <span className="font-mono text-xs text-slate-600">{pipe.nominalDiameterMm}A</span>
              </td>
              <td className="p-2.5 text-right font-mono">
                <div className="flex items-center justify-end gap-1">
                  <span className="text-[10px] text-slate-500">L:</span>
                  <span className="font-mono text-xs text-slate-700">{(pipe.lengthM / 2).toFixed(1)}</span>
                </div>
              </td>
              <td className="p-2.5 text-right font-mono text-slate-500">1</td>
              <td className="p-2.5 text-right text-slate-400">-</td>
              <td className="p-2.5 text-right text-slate-400">-</td>
              <td className="p-2.5 text-center text-slate-400">-</td>
            </tr>

            {/* 5. End Node "E" */}
            <tr className="bg-slate-50/50">
              <td className="p-2.5 text-center font-mono font-bold text-slate-700">E</td>
              <td className="p-2.5 font-bold text-slate-900">
                終点
              </td>
              <td className="p-2.5">
                <span className="bg-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded font-mono">
                  大気開放/流出
                </span>
              </td>
              <td className="p-2.5 font-mono text-xs text-slate-600">{pipe.nominalDiameterMm}A</td>
              <td className="p-2.5 text-right text-slate-400">-</td>
              <td className="p-2.5 text-right font-mono text-slate-500">1</td>
              <td className="p-2.5 text-right text-slate-400">-</td>
              <td className="p-2.5 text-right text-slate-400">-</td>
              <td className="p-2.5 text-center text-slate-400">-</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Global Conditions Footer Toolbar */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-2.5 flex flex-wrap justify-between items-center gap-3 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-700">吐出量 Q:</span>
            <input
              type="number"
              min="0.1"
              step="0.5"
              value={duty.flowRateM3H}
              onChange={(e) => setDutyInput({ flowRateM3H: parseFloat(e.target.value) || 0 })}
              className="w-20 bg-white border border-slate-300 rounded px-2 py-1 text-right font-mono text-slate-900"
            />
            <span className="text-slate-500">m³/h</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-700">水温:</span>
            <input
              type="number"
              min="0"
              max="100"
              value={fluid.temperatureCelsius}
              onChange={(e) => setTemperatureCelsius(parseFloat(e.target.value) || 0)}
              className="w-16 bg-white border border-slate-300 rounded px-2 py-1 text-right font-mono text-slate-900"
            />
            <span className="text-slate-500">°C</span>
          </div>
        </div>

        <div className="text-slate-500 text-[11px]">
          💡 直管、曲管、仕切弁、蝶形弁、逆止弁、フラップ弁 をプルダウンで選択・追加できます。
        </div>
      </div>
    </div>
  );
};
