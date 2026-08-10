import React, { useState } from 'react';
import { useCalculatorStore } from '../../store/useCalculatorStore';
import { FittingType } from '../../core/types';
import {
  FITTING_LOSS_COEFFICIENT_K,
  FITTING_EQUIVALENT_LENGTH_LD,
  getFittingEquivalentLengthM,
} from '../../core/constants';
import { MinorLossMethod } from '../../core/calc';

const FITTING_OPTIONS: { type: FittingType; label: string }[] = [
  { type: 'threadedSocketJoint', label: 'ねじ込み・差込み継手' },
  { type: 'buttWeldedJoint', label: '突合せ溶接継手' },
  { type: 'flangedJoint', label: 'フランジ継手' },
  { type: 'unionJoint', label: 'ユニオン継手' },
  { type: 'spigotSocketJoint', label: 'インロー継手' },
];

export const FittingManagerForm: React.FC = () => {
  const fittings = useCalculatorStore((state) => state.pipeLine.fittings);
  const innerDiameterM = useCalculatorStore((state) => state.pipeLine.pipe.innerDiameterM);
  const minorLossMethod = useCalculatorStore((state) => state.minorLossMethod);
  const addFitting = useCalculatorStore((state) => state.addFitting);
  const updateFitting = useCalculatorStore((state) => state.updateFitting);
  const removeFitting = useCalculatorStore((state) => state.removeFitting);
  const setMinorLossMethod = useCalculatorStore((state) => state.setMinorLossMethod);

  const [selectedType, setSelectedType] = useState<FittingType>('threadedSocketJoint');
  const [inputCount, setInputCount] = useState<number>(1);

  const handleAddFitting = (e: React.FormEvent) => {
    e.preventDefault();
    const opt = FITTING_OPTIONS.find((o) => o.type === selectedType);
    const k = FITTING_LOSS_COEFFICIENT_K[selectedType] ?? 0.5;
    const le = getFittingEquivalentLengthM(selectedType, innerDiameterM);

    addFitting({
      type: selectedType,
      name: opt ? opt.label.split(' (')[0] : selectedType,
      count: Math.max(1, inputCount),
      lossCoefficientK: k,
      equivalentLengthM: le,
    });

    setInputCount(1);
  };

  return (
    <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/60 rounded-xl p-5 shadow-lg text-slate-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
          <span>🧩</span> 継手・弁損失設定 (Fittings & Valves)
        </h3>

        {/* Calculation Method Selection Toggle */}
        <select
          id="select-minor-loss-method"
          value={minorLossMethod}
          onChange={(e) => setMinorLossMethod(e.target.value as MinorLossMethod)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-cyan-300 focus:outline-none focus:border-cyan-500"
        >
          <option value="K_COEFFICIENT">K 係数方式 (K-Factor)</option>
          <option value="EQUIVALENT_LENGTH">相当長方式 (Equivalent Length Le)</option>
        </select>
      </div>

      {/* Add Fitting Form */}
      <form onSubmit={handleAddFitting} className="flex gap-2 mb-4">
        <select
          id="select-fitting-type"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as FittingType)}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
        >
          {FITTING_OPTIONS.map((opt) => (
            <option key={opt.type} value={opt.type}>
              {opt.label} (K={FITTING_LOSS_COEFFICIENT_K[opt.type]}, L/D={FITTING_EQUIVALENT_LENGTH_LD[opt.type]})
            </option>
          ))}
        </select>

        <input
          id="input-fitting-count"
          type="number"
          min="1"
          max="99"
          value={inputCount}
          onChange={(e) => setInputCount(parseInt(e.target.value, 10) || 1)}
          className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-center font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
        />

        <button
          id="button-add-fitting"
          type="submit"
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm flex items-center gap-1 shadow-md shadow-cyan-900/40"
        >
          追加
        </button>
      </form>

      {/* Fittings List */}
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {fittings.length === 0 ? (
          <p className="text-slate-500 text-xs text-center py-4">継手・弁が登録されていません。</p>
        ) : (
          fittings.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-slate-900/80 border border-slate-700/60 p-2.5 rounded-lg text-xs"
            >
              <div className="font-medium text-slate-200">
                {item.name}
                <span className="text-slate-400 text-[10px] ml-2">
                  (K={item.lossCoefficientK}, Le={item.equivalentLengthM.toFixed(2)}m)
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-700 rounded bg-slate-800">
                  <button
                    type="button"
                    onClick={() =>
                      updateFitting(item.id, { count: Math.max(1, item.count - 1) })
                    }
                    className="px-2 py-0.5 text-slate-300 hover:bg-slate-700 rounded-l"
                  >
                    -
                  </button>
                  <span className="px-2 font-mono text-cyan-300 font-semibold">{item.count}</span>
                  <button
                    type="button"
                    onClick={() => updateFitting(item.id, { count: item.count + 1 })}
                    className="px-2 py-0.5 text-slate-300 hover:bg-slate-700 rounded-r"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeFitting(item.id)}
                  className="text-rose-400 hover:text-rose-300 font-medium px-1.5 py-0.5 rounded hover:bg-rose-950/40 transition-colors"
                >
                  削除
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
