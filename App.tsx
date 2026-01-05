import React, { useState } from 'react';
import { FunctionType } from './types';
import ControlPanel from './components/ControlPanel';
import MathGraph from './components/MathGraph';

const App: React.FC = () => {
  // State
  const [functionType, setFunctionType] = useState<FunctionType>(FunctionType.PROPORTIONAL);
  const [a, setA] = useState<number>(1);
  const [b, setB] = useState<number>(0);

  // Handlers
  const handleTypeChange = (newType: FunctionType) => {
    setFunctionType(newType);
    // Reset reasonable defaults when switching types for better UX
    if (newType === FunctionType.QUADRATIC) {
      setA(1); // Standard parabola
      setB(0);
    } else if (newType === FunctionType.INVERSE) {
      setA(2); // Visible curve
      setB(0);
    } else {
      setA(1);
      setB(0);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">関数シミュレーター</h1>
            <p className="text-slate-500 mt-1 text-sm">中学生向け数学学習ツール</p>
          </div>
          <a href="#" className="text-xs text-indigo-500 hover:text-indigo-700 font-medium">
            使い方のヒント
          </a>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[600px]">
          
          {/* Controls - Takes 4 columns on large screens */}
          <div className="lg:col-span-4 h-full">
            <ControlPanel
              currentType={functionType}
              onTypeChange={handleTypeChange}
              a={a}
              setA={setA}
              b={b}
              setB={setB}
            />
          </div>

          {/* Graph - Takes 8 columns on large screens */}
          <div className="lg:col-span-8 h-[400px] lg:h-full">
            <MathGraph
              type={functionType}
              a={a}
              b={b}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;