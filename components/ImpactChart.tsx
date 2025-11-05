
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Label, Area } from 'recharts';
import type { QuarterlyDataPoint } from '../types';

interface ImpactChartProps {
  data: QuarterlyDataPoint[];
  kpiName: string;
}

export const ImpactChart: React.FC<ImpactChartProps> = ({ data, kpiName }) => {
  const chartData = data.map(d => ({
    ...d,
    // For stacking confidence band area
    confidenceRange: d.upperBound - d.lowerBound,
  }));

  const formatXAxis = (tick: { year: number, quarter: number }) => {
    return `Y${tick.year} Q${tick.quarter}`;
  };
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis 
            dataKey="quarter"
            tickFormatter={(tick, index) => `Y${data[index].year} Q${data[index].quarter}`}
            stroke="#6b7280" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            interval={3} // Show label every 4 quarters (1 year)
        >
          <Label value="Time (5-Year Forecast)" offset={0} position="insideBottom" style={{ fill: '#6b7280', fontSize: '14px' }} />
        </XAxis>
        <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin', 'dataMax']}>
          <Label value={kpiName} angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: '#6b7280', fontSize: '14px' }} />
        </YAxis>
        <Tooltip
          labelFormatter={(_, payload) => {
            if (payload && payload.length) {
              return `Year ${payload[0].payload.year}, Quarter ${payload[0].payload.quarter}`;
            }
            return null;
          }}
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }}
          formatter={(value: number, name: string, props: { payload?: QuarterlyDataPoint }) => {
            // props.payload contains the full data object for the hovered point.
            const { payload } = props;
            if (!payload) return null;

            if (name === 'Projected Value') {
              return [value.toFixed(2), name]; // Return value and name in an array
            }
            
            if (name === '90% Confidence Interval') {
              // The value for this series is `confidenceRange`, but we want to display the actual bounds.
              const lower = payload.lowerBound.toFixed(2);
              const upper = payload.upperBound.toFixed(2);
              return [`${lower} - ${upper}`, name];
            }

            // The `lowerBound` Area is used as a base for stacking and should not be shown in the tooltip.
            // By returning null, we hide it and any other unexpected series.
            return null;
          }}
        />
        <Legend wrapperStyle={{fontSize: "14px", paddingTop: "20px"}} />

        {/* Confidence Band: Drawn by stacking a transparent area for lower bound and a visible area for the range */}
        {/* FIX: The 'stroke' prop for an SVG element cannot be a boolean. Changed from `false` to `"none"` to correctly disable the stroke. */}
        <Area 
            type="monotone" 
            dataKey="lowerBound" 
            stackId="confidence" 
            stroke="none" 
            fill="transparent" 
            isAnimationActive={false}
        />
        {/* FIX: The 'stroke' prop for an SVG element cannot be a boolean. Changed from `false` to `"none"` to correctly disable the stroke. */}
        <Area 
            type="monotone" 
            dataKey="confidenceRange"
            name="90% Confidence Interval"
            stackId="confidence"
            stroke="none" 
            fill="#fb923c" 
            fillOpacity={0.2} 
            isAnimationActive={false}
        />

        <Line 
          type="monotone" 
          dataKey="value" 
          name="Projected Value"
          stroke="url(#lineGradient)" 
          strokeWidth={3} 
          dot={false}
          activeDot={{ r: 6 }}
          isAnimationActive={true}
        />
        <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="5%" stopColor="#fb923c" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ea580c" stopOpacity={0.8}/>
            </linearGradient>
        </defs>
      </LineChart>
    </ResponsiveContainer>
  );
};
