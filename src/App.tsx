import React from 'react';
import {
  ComponentInspectorTable,
  CalculationSummaryCard,
} from './components/calculator';
import { PipingCanvas3D } from './components/3d';
import { PumpSpecReportView } from './components/report';

export const App: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      {/* Studio Top Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm print:hidden">
        <div className="w-full px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow">
              LC
            </div>
            <h1 className="font-bold text-base leading-none tracking-tight text-slate-900">
              Loss Calc Studio
            </h1>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-4 py-2 rounded-xl transition-colors shadow flex items-center gap-1.5"
            >
              <span>🖨️</span> <span>印刷 / 帳票PDF出力</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout: Top = Isometric Piping Canvas, Bottom = Component List Table & Summary */}
      <main className="flex-1 w-full p-4 space-y-4 max-w-[1600px] mx-auto">
        {/* Print Layout */}
        <div className="hidden print:block mb-4">
          <PumpSpecReportView />
        </div>

        {/* Interactive Screen Layout */}
        <div className="print:hidden space-y-4">
          {/* Top Section: Full Width Interactive Isometric Piping Canvas */}
          <div className="w-full">
            <PipingCanvas3D />
          </div>

          {/* Bottom Section: Component List Table & Property Inspector */}
          <div className="w-full">
            <ComponentInspectorTable />
          </div>

          {/* Real-time Hydraulic Calculation Summary */}
          <div className="w-full">
            <CalculationSummaryCard />
          </div>
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
