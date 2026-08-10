import React, { useState } from 'react';
import {
  ComponentInspector,
  CalculationSummaryCard,
} from './components/calculator';
import { PipingCanvas3D } from './components/3d';
import { PumpSpecReportView } from './components/report';
import { useCalculatorStore } from './store/useCalculatorStore';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'studio' | 'report'>('studio');
  const result = useCalculatorStore((state) => state.calculationResult);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      {/* Studio Top Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm print:hidden">
        <div className="w-full px-4 py-2.5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow">
              LC
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base leading-none tracking-tight text-slate-900 flex items-center gap-2">
                Loss Calc Studio <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono border border-blue-200">アイソメ図面モード</span>
              </h1>
              <p className="text-[10px] text-slate-500 leading-tight hidden sm:block">
                配管圧力損失・ポンプ全揚程・モータ出力 試算システム
              </p>
            </div>
          </div>

          {/* Quick Header Indicator Pill */}
          <div className="hidden md:flex items-center gap-4 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-200 text-xs font-mono">
            <div>
              <span className="text-slate-500 mr-1">計画全揚程 H_d:</span>
              <span className="text-blue-700 font-bold">{result.designHeadM.toFixed(2)} m</span>
            </div>
            <div className="w-px h-3 bg-slate-300" />
            <div>
              <span className="text-slate-500 mr-1">モータ P_m:</span>
              <span className="text-emerald-700 font-bold">{result.motorPowerKw.toFixed(2)} kW</span>
            </div>
          </div>

          {/* Action Tabs */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('studio')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  activeTab === 'studio'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                配管図面スタジオ
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('report')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  activeTab === 'report'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                仕様書レポート
              </button>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-3.5 py-2 rounded-xl transition-colors shadow flex items-center gap-1.5"
            >
              <span>🖨️</span> <span className="hidden sm:inline">印刷 / PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Body: Expanded Canvas + Inspector Layout */}
      <main className="flex-1 w-full p-3 space-y-3">
        {/* Print Layout */}
        <div className="hidden print:block mb-4">
          <PumpSpecReportView />
        </div>

        {/* Screen Interactive Tabs */}
        <div className="print:hidden">
          {activeTab === 'studio' ? (
            <div className="space-y-3">
              {/* Studio Workspace: Expanded 2-column layout (Canvas 9 cols = 75%, Inspector 3 cols = 25%) */}
              <div className="grid grid-cols-12 gap-3 items-start w-full">
                {/* Expanded Interactive Isometric Canvas (9 cols) */}
                <div className="col-span-12 lg:col-span-9 min-w-0">
                  <PipingCanvas3D />
                </div>

                {/* Component Inspector (3 cols) */}
                <div className="col-span-12 lg:col-span-3">
                  <ComponentInspector />
                </div>
              </div>

              {/* Bottom Section: Real-time Hydraulic Calculation Summary */}
              <CalculationSummaryCard />
            </div>
          ) : (
            <div className="py-4">
              <PumpSpecReportView />
            </div>
          )}
        </div>
      </main>

      {/* Studio Footer */}
      <footer className="border-t border-slate-200 py-2.5 text-center text-xs text-slate-500 bg-white print:hidden">
        Loss Calc Studio &copy; 2026. Interactive Piping Builder & Hydraulic Loss Engine.
      </footer>
    </div>
  );
};

export default App;
