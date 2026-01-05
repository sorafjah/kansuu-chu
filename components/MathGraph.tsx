import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { FunctionType } from '../types';

interface MathGraphProps {
  type: FunctionType;
  a: number;
  b: number;
}

const MathGraph: React.FC<MathGraphProps> = ({ type, a, b }) => {
  
  // Memoize data calculation for performance
  const data = useMemo(() => {
    let xValues: number[] = [];
    
    // 1. Generate standard grid points
    // We use a reasonably fine step to ensure curves look smooth
    const step = 0.1;
    for (let x = -11; x <= 11; x += step) {
      xValues.push(x);
    }

    // 2. For inverse functions, add high-resolution points near x=0
    // This ensures the curve extends visually to the top/bottom of the graph
    // even when 'a' is small (e.g., 0.1).
    if (type === FunctionType.INVERSE) {
      // Add points closer to 0 than the standard step
      // e.g. 0.01, 0.02... up to step size
      const extras = [0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09];
      extras.forEach(val => {
        xValues.push(val);
        xValues.push(-val);
      });
    }

    // 3. Sort and remove duplicates (using round to avoid float precision dupes)
    // We use 3 decimal places for precision
    const uniqueX = new Set<number>();
    xValues.forEach(x => {
      // Round to 3 decimals to align standard points and extras
      uniqueX.add(Math.round(x * 1000) / 1000);
    });
    
    const sortedX = Array.from(uniqueX).sort((u, v) => u - v);

    return sortedX.map(x => {
      let y: number | null = 0;

      switch (type) {
        case FunctionType.PROPORTIONAL:
          y = a * x;
          break;
        case FunctionType.INVERSE:
          // Handle asymptote: strictly at 0
          // Since we might have 0 in the list from the loop or rounding
          if (Math.abs(x) < 0.0001) {
             y = null;
          } else {
             y = a / x;
          }
          break;
        case FunctionType.LINEAR:
          y = a * x + b;
          break;
        case FunctionType.QUADRATIC:
          y = a * Math.pow(x, 2);
          break;
      }

      return { x, y };
    });
  }, [type, a, b]);

  // Generate ticks from -10 to 10 with step 1
  const ticks = useMemo(() => {
    return Array.from({ length: 21 }, (_, i) => i - 10);
  }, []);

  return (
    <div className="w-full h-full bg-white rounded-xl shadow-lg border border-slate-200 p-4 relative overflow-hidden">
      <div className="absolute top-4 right-4 z-10 bg-indigo-50 px-3 py-1 rounded text-xs text-indigo-800 font-bold border border-indigo-100">
        グラフ
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          
          {/* Main Axes */}
          <XAxis
            dataKey="x"
            type="number"
            domain={[-10, 10]}
            allowDataOverflow={true}
            ticks={ticks}
            tick={{ fontSize: 10, fill: '#64748b' }}
            stroke="#94a3b8"
            interval={0} // Force show all ticks
          />
          <YAxis
            dataKey="y"
            type="number"
            domain={[-10, 10]}
            allowDataOverflow={true}
            ticks={ticks}
            tick={{ fontSize: 10, fill: '#64748b' }}
            stroke="#94a3b8"
            interval={0} // Force show all ticks
          />

          {/* Highlighted Origin Axes */}
          <ReferenceLine x={0} stroke="#475569" strokeWidth={2} />
          <ReferenceLine y={0} stroke="#475569" strokeWidth={2} />

          {/* The Function Plot */}
          <Line
            type="monotone"
            dataKey="y"
            stroke="#4f46e5"
            strokeWidth={3}
            dot={false}
            isAnimationActive={false} // Disable animation for instant slider feedback
            connectNulls={false} // Crucial for Inverse function to not draw line across x=0
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MathGraph;