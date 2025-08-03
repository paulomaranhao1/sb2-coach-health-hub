
import { memo } from 'react';

interface ChartData {
  label: string;
  value: number;
}

interface LightweightChartProps {
  data: ChartData[];
  type?: 'bar' | 'line';
  height?: number;
  color?: string;
}

const LightweightChart = memo(({ 
  data, 
  type = 'bar', 
  height = 200, 
  color = '#dc2626' 
}: LightweightChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-50 rounded-lg text-gray-500 text-sm"
        style={{ height }}
      >
        Sem dados para exibir
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  return (
    <div className="w-full" style={{ height }}>
      <div className="flex items-end justify-between h-full px-2 pb-4">
        {data.map((item, index) => {
          const normalizedHeight = ((item.value - minValue) / range) * (height - 40);
          
          return (
            <div key={index} className="flex flex-col items-center flex-1 mx-1">
              <div className="text-xs text-gray-600 mb-1">
                {item.value.toFixed(1)}
              </div>
              <div
                className="w-full rounded-t transition-all duration-300 hover:opacity-80"
                style={{
                  backgroundColor: color,
                  height: Math.max(normalizedHeight, 4),
                  minHeight: '4px'
                }}
              />
              <div className="text-xs text-gray-500 mt-1 text-center">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

LightweightChart.displayName = 'LightweightChart';

export default LightweightChart;
