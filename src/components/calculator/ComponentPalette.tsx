import React from 'react';
import { useCalculatorStore } from '../../store/useCalculatorStore';
import { FittingType } from '../../core/types';
import {
  FITTING_LOSS_COEFFICIENT_K,
  getFittingEquivalentLengthM,
} from '../../core/constants';

interface PaletteItem {
  type: FittingType | 'pipe';
  label: string;
  subLabel: string;
  icon: string;
}

const PALETTE_ITEMS: PaletteItem[] = [
  { type: 'elbow90', label: '90° エルボ', subLabel: '90° Elbow', icon: '↩️' },
  { type: 'elbow45', label: '45° エルボ', subLabel: '45° Elbow', icon: '↗️' },
  { type: 'gateValve', label: '仕切弁', subLabel: 'Gate Valve', icon: '🚪' },
  { type: 'checkValve', label: '逆止弁', subLabel: 'Check Valve', icon: '🛡️' },
  { type: 'globeValve', label: '玉形弁', subLabel: 'Globe Valve', icon: '🚰' },
  { type: 'teeBranch', label: 'チーズ (分流)', subLabel: 'Tee Branch', icon: '🔀' },
  { type: 'teeFlowThrough', label: 'チーズ (直流)', subLabel: 'Tee Run', icon: '➡️' },
];

export const ComponentPalette: React.FC = () => {
  const addFitting = useCalculatorStore((state) => state.addFitting);
  const innerDiameterM = useCalculatorStore((state) => state.pipeLine.pipe.innerDiameterM);

  const handleAddItem = (type: FittingType) => {
    const itemInfo = PALETTE_ITEMS.find((i) => i.type === type);
    const k = FITTING_LOSS_COEFFICIENT_K[type] ?? 0.5;
    const le = getFittingEquivalentLengthM(type, innerDiameterM);

    addFitting({
      type,
      name: itemInfo ? itemInfo.label : type,
      count: 1,
      lossCoefficientK: k,
      equivalentLengthM: le,
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm space-y-3 h-full">
      <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider border-b border-slate-200 pb-2">
        <span>🎨</span> 配管部品パレット
      </h3>

      <div className="space-y-1.5">
        <p className="text-[10px] text-slate-500">クリックして図面に接続:</p>
        <div className="grid grid-cols-1 gap-1.5">
          {PALETTE_ITEMS.map((item) => (
            <button
              key={item.type}
              type="button"
              onClick={() => handleAddItem(item.type as FittingType)}
              className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-800 transition-all text-left group"
            >
              <span className="text-base p-1 bg-white rounded border border-slate-200 group-hover:border-blue-400 flex-shrink-0">
                {item.icon}
              </span>
              <div className="overflow-hidden min-w-0">
                <span className="font-semibold text-xs text-slate-900 block truncate">{item.label}</span>
                <span className="text-[9px] text-slate-500 block font-mono truncate">{item.subLabel}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
