import React from 'react';
import { FunctionType, FUNCTION_DEFS } from '../types';

interface ControlPanelProps {
  currentType: FunctionType;
  onTypeChange: (type: FunctionType) => void;
  a: number;
  setA: (val: number) => void;
  b: number;
  setB: (val: number) => void;
}

// Utility to convert decimal to fraction
const decimalToFraction = (val: number) => {
  const sign = val < 0 ? -1 : 1;
  const abs = Math.abs(val);
  
  // Handle integers
  if (Math.abs(abs - Math.round(abs)) < 0.0001) {
    return { n: Math.round(abs), d: 1, sign };
  }

  // Handle decimals (max denominator 100 for safety with slider inputs)
  let n = abs;
  let d = 1;
  while (Math.abs(n - Math.round(n)) > 0.0001 && d < 100) {
    n *= 10;
    d *= 10;
  }
  n = Math.round(n);
  
  // Simplify
  const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
  const divisor = gcd(n, d);
  
  return { n: n / divisor, d: d / divisor, sign };
};

// Component to render a mathematical fraction or value
const FractionDisplay = ({ 
  val, 
  variable = '', 
  isInverse = false,
  forceSign = false 
}: { 
  val: number, 
  variable?: string, 
  isInverse?: boolean,
  forceSign?: boolean 
}) => {
  if (val === 0) return <span className="mx-1">0</span>;

  const { n, d, sign } = decimalToFraction(val);
  const showSign = sign < 0 || forceSign;
  const signChar = sign < 0 ? '-' : '+';

  // Inverse Function Logic: y = a/x
  if (isInverse) {
    // Result is (n) / (d * x)
    // If d is 1, denominator is x. If d > 1, denominator is dx.
    const denomDisplay = d === 1 ? 'x' : <>{d}<span className="italic">x</span></>;
    
    return (
      <div className="inline-flex items-center mx-1">
        {showSign && <span className="mr-1.5 font-bold mb-[1px]">{signChar}</span>}
        <div className="flex flex-col items-center text-center leading-none">
          <span className="border-b-2 border-indigo-700 pb-0.5 px-1 w-full">{n}</span>
          <span className="pt-0.5 px-1">{denomDisplay}</span>
        </div>
      </div>
    );
  }

  // Normal Logic (Proportional/Linear/Quadratic): y = (n/d) * x
  // If n/d is 1/1 -> x
  // If n/d is 2/1 -> 2x
  // If n/d is 1/2 -> (1/2)x
  
  // Render the coefficient part
  let coefContent: React.ReactNode = null;
  
  if (d === 1) {
    // Integer coefficient
    if (n === 1 && variable) {
      // 1x -> x (don't show 1)
      coefContent = null;
    } else {
      coefContent = <span>{n}</span>;
    }
  } else {
    // Fraction coefficient
    coefContent = (
      <div className="inline-flex flex-col items-center text-center leading-none align-middle mx-1">
        <span className="border-b-2 border-indigo-700 pb-0.5 px-1 w-full">{n}</span>
        <span className="pt-0.5 px-1">{d}</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center">
      {/* Show sign if negative OR if it's a secondary term (forceSign) */}
      {(showSign) && <span className={`mr-1 font-bold mb-[1px]`}>{signChar}</span>}
      {coefContent}
      {variable && <span className="italic ml-0.5">{variable}</span>}
    </div>
  );
};

const ControlPanel: React.FC<ControlPanelProps> = ({
  currentType,
  onTypeChange,
  a,
  setA,
  b,
  setB,
}) => {
  const currentDef = FUNCTION_DEFS[currentType];

  const handleSliderChange = (setter: (val: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(parseFloat(e.target.value));
  };

  const handleNumberChange = (setter: (val: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      setter(val);
    }
  };

  const renderFormula = () => {
    return (
      <div className="flex flex-wrap items-center justify-center text-3xl text-indigo-700 font-serif min-h-[3rem]">
        <span className="mr-2 italic">y =</span>
        
        {currentType === FunctionType.PROPORTIONAL && (
          a === 0 ? <span>0</span> : <FractionDisplay val={a} variable="x" />
        )}

        {currentType === FunctionType.INVERSE && (
          a === 0 ? <span>0</span> : <FractionDisplay val={a} isInverse />
        )}

        {currentType === FunctionType.LINEAR && (
          <>
            {a === 0 ? (b === 0 ? <span>0</span> : null) : <FractionDisplay val={a} variable="x" />}
            {/* Show b if it's not 0, or if a is 0 (to show y=b) */}
            {(b !== 0 || a === 0) && (
              <FractionDisplay 
                val={b} 
                forceSign={a !== 0 && b > 0} // Show + sign if it's the second term and positive
              />
            )}
          </>
        )}

        {currentType === FunctionType.QUADRATIC && (
          a === 0 ? <span>0</span> : <FractionDisplay val={a} variable="x²" />
        )}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 h-full flex flex-col gap-6">
      
      {/* Type Selection */}
      <div>
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">関数の種類</h2>
        <div className="flex flex-wrap gap-2">
          {Object.values(FUNCTION_DEFS).map((def) => (
            <button
              key={def.type}
              onClick={() => onTypeChange(def.type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentType === def.type
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {def.label}
            </button>
          ))}
        </div>
      </div>

      {/* Formula Display */}
      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-center flex flex-col items-center justify-center min-h-[140px]">
        <div className="text-xs text-slate-400 font-mono mb-2">現在の式</div>
        {renderFormula()}
        <p className="text-sm text-slate-500 mt-4">{currentDef.description}</p>
      </div>

      {/* Sliders */}
      <div className="space-y-6">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">係数の調整</h2>
        
        {/* Coefficient A */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="param-a" className="font-serif italic font-bold text-lg text-slate-700">a =</label>
            <input
              type="number"
              value={a}
              onChange={handleNumberChange(setA)}
              step={0.1}
              className="w-20 px-2 py-1 text-right border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <input
            id="param-a"
            type="range"
            min="-5"
            max="5"
            step="0.1"
            value={a}
            onChange={handleSliderChange(setA)}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Coefficient B (Conditional) */}
        {currentDef.hasB && (
          <div className="space-y-2 pt-2 border-t border-slate-100">
             <div className="flex justify-between items-center">
              <label htmlFor="param-b" className="font-serif italic font-bold text-lg text-slate-700">b =</label>
              <input
                type="number"
                value={b}
                onChange={handleNumberChange(setB)}
                step={0.1}
                className="w-20 px-2 py-1 text-right border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <input
              id="param-b"
              type="range"
              min="-10"
              max="10"
              step="0.5"
              value={b}
              onChange={handleSliderChange(setB)}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;