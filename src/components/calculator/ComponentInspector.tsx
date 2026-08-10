import React from 'react';
import { useCalculatorStore } from '../../store/useCalculatorStore';
import { PipeMaterial } from '../../core/types';
import { JIS_PIPE_DIMENSIONS } from '../../core/constants';

export const ComponentInspector: React.FC = () => {
  const selectedId = useCalculatorStore((state) => state.selectedComponentId);
  const selectComponent = useCalculatorStore((state) => state.selectComponent);

  const fluid = useCalculatorStore((state) => state.fluid);
  const setTemperatureCelsius = useCalculatorStore((state) => state.setTemperatureCelsius);

  const pipe = useCalculatorStore((state) => state.pipeLine.pipe);
  const setPipeSegment = useCalculatorStore((state) => state.setPipeSegment);

  const fittings = useCalculatorStore((state) => state.pipeLine.fittings);
  const updateFitting = useCalculatorStore((state) => state.updateFitting);
  const removeFitting = useCalculatorStore((state) => state.removeFitting);

  const duty = useCalculatorStore((state) => state.dutyInput);
  const setDutyInput = useCalculatorStore((state) => state.setDutyInput);

  const selectedFitting = fittings.find((f) => f.id === selectedId);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm space-y-3 text-slate-800 min-h-[400px]">
      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
          <span>🛠️</span> 部品プロパティ設定
        </h3>
        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-600 font-mono">
          ID: {selectedId || 'None'}
        </span>
      </div>

      {/* 1. Pump Inspector */}
      {selectedId === 'pump' && (
        <div className="space-y-3 text-xs">
          <div className="bg-blue-50/70 p-2.5 rounded-lg border border-blue-200">
            <span className="font-bold text-blue-900 block mb-0.5">渦巻ポンプ (Centrifugal Pump)</span>
            <p className="text-[11px] text-blue-700">水力供給起点および要求水頭の算定対象。</p>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">吐出量 Q [m³/h]</label>
            <input
              type="number"
              min="0.1"
              step="0.5"
              value={duty.flowRateM3H}
              onChange={(e) => setDutyInput({ flowRateM3H: parseFloat(e.target.value) || 0 })}
              className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-right font-mono text-slate-900 focus:bg-white focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">実揚程 Hs [m]</label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={duty.staticHeadM}
              onChange={(e) => setDutyInput({ staticHeadM: parseFloat(e.target.value) || 0 })}
              className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-right font-mono text-slate-900 focus:bg-white focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-700 font-medium mb-1">ポンプ効率 [%]</label>
              <input
                type="number"
                min="10"
                max="100"
                value={Math.round(duty.pumpEfficiencyRatio * 100)}
                onChange={(e) => setDutyInput({ pumpEfficiencyRatio: (parseFloat(e.target.value) || 0) / 100 })}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-right font-mono text-slate-900 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">モータ効率 [%]</label>
              <input
                type="number"
                min="10"
                max="100"
                value={Math.round(duty.motorEfficiencyRatio * 100)}
                onChange={(e) => setDutyInput({ motorEfficiencyRatio: (parseFloat(e.target.value) || 0) / 100 })}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-right font-mono text-slate-900 focus:bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. Pipe Inspector */}
      {selectedId === 'pipe' && (
        <div className="space-y-3 text-xs">
          <div className="bg-slate-100 p-2.5 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block mb-0.5">直管セグメント (Straight Pipe)</span>
            <p className="text-[11px] text-slate-600">主管ラインの呼称径・材質・長さ・水温。</p>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">管材質 (Material)</label>
            <select
              value={pipe.material}
              onChange={(e) => setPipeSegment({ material: e.target.value as PipeMaterial })}
              className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 focus:bg-white"
            >
              <option value="SGP">SGP (配管用炭素鋼鋼管)</option>
              <option value="STPG">STPG (圧力配管用鋼管)</option>
              <option value="SUS">SUS (ステンレス鋼管)</option>
              <option value="VP">VP (硬質塩化ビニル管)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">呼称径 (Nominal Size)</label>
            <select
              value={pipe.nominalDiameterMm}
              onChange={(e) => setPipeSegment({ nominalDiameterMm: parseInt(e.target.value, 10) })}
              className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 focus:bg-white"
            >
              {JIS_PIPE_DIMENSIONS.map((item) => (
                <option key={item.nominalA} value={item.nominalA}>
                  {item.nominalA}A ({item.nominalB}")
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-700 font-medium mb-1">管長 L [m]</label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={pipe.lengthM}
                onChange={(e) => setPipeSegment({ lengthM: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-right font-mono text-slate-900 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">水温 [°C]</label>
              <input
                type="number"
                min="0"
                max="100"
                value={fluid.temperatureCelsius}
                onChange={(e) => setTemperatureCelsius(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-right font-mono text-slate-900 focus:bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. Selected Fitting Inspector */}
      {selectedFitting && (
        <div className="space-y-3 text-xs">
          <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200">
            <span className="font-bold text-amber-900 block mb-0.5">{selectedFitting.name}</span>
            <p className="text-[11px] text-amber-700">選択中継手・弁の個別設定。</p>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">数量 (Quantity)</label>
            <input
              type="number"
              min="1"
              max="99"
              value={selectedFitting.count}
              onChange={(e) => updateFitting(selectedFitting.id, { count: Math.max(1, parseInt(e.target.value, 10) || 1) })}
              className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-right font-mono text-slate-900 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-700 font-medium mb-1">損失係数 K</label>
              <input
                type="number"
                step="0.05"
                value={selectedFitting.lossCoefficientK}
                onChange={(e) => updateFitting(selectedFitting.id, { lossCoefficientK: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-right font-mono text-slate-900 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">相当長 Le [m]</label>
              <input
                type="number"
                step="0.1"
                value={selectedFitting.equivalentLengthM}
                onChange={(e) => updateFitting(selectedFitting.id, { equivalentLengthM: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-right font-mono text-slate-900 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => removeFitting(selectedFitting.id)}
            className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-medium p-2 rounded transition-colors"
          >
            このパーツを削除
          </button>
        </div>
      )}

      {/* Fallback default prompt */}
      {!selectedFitting && selectedId !== 'pump' && selectedId !== 'pipe' && (
        <div className="text-center py-10 text-slate-400 text-xs">
          図面上のパーツをクリックするか、左パレットから部品を選択してください。
        </div>
      )}

      {/* Switch back button */}
      <div className="pt-2 border-t border-slate-200 text-center">
        <button
          type="button"
          onClick={() => selectComponent('pipe')}
          className="text-[11px] text-blue-600 hover:underline"
        >
          直管プロパティに戻る
        </button>
      </div>
    </div>
  );
};
