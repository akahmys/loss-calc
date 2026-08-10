import React, { useState } from 'react';
import {
  FluidInputForm,
  PipeInputForm,
  FittingManagerForm,
  PumpDutyForm,
  CalculationSummaryCard,
} from './components/calculator';
import { PipingCanvas3D } from './components/3d';
import { PumpSpecReportView } from './components/report';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calculator' | 'report'>('calculator');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-cyan-950/50">
              LC
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none tracking-tight text-white">
                Loss Calc <span className="text-xs text-cyan-400 font-normal font-mono ml-2">v1.0</span>
              </h1>
              <p className="text-[11px] text-slate-400 leading-tight">
                ポンプ仕様書 兼 配管圧力損失計算システム
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-800 p-1 rounded-xl border border-slate-700/60 flex text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('calculator')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  activeTab === 'calculator'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                計算シミュレータ (3D View)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('report')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  activeTab === 'report'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                仕様書レポート (Spec Sheet)
              </button>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-3.5 py-2 rounded-xl transition-colors shadow-lg shadow-emerald-950/40 flex items-center gap-1.5"
            >
              <span>🖨️</span> 印刷 / PDF出力
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Print Only Notice */}
        <div className="hidden print:block mb-4">
          <PumpSpecReportView />
        </div>

        {/* Screen Interactive Tabs */}
        <div className="print:hidden">
          {activeTab === 'calculator' ? (
            <div className="space-y-6">
              {/* Top Section: Live Calculation Summary Card */}
              <CalculationSummaryCard />

              {/* Middle Section: 3D Isometric View & Pump Duty */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <PipingCanvas3D />
                </div>
                <div>
                  <PumpDutyForm />
                </div>
              </div>

              {/* Bottom Section: Fluid, Pipe, Fittings Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FluidInputForm />
                <PipeInputForm />
                <FittingManagerForm />
              </div>
            </div>
          ) : (
            <div className="py-4">
              <PumpSpecReportView />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500 print:hidden">
        Loss Calc Engine &copy; 2026. Darcy-Weisbach & Hazen-Williams Fluid Dynamics Equations.
      </footer>
    </div>
  );
};

export default App;
