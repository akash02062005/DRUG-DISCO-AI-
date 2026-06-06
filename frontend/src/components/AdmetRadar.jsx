import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Legend,
} from 'recharts';

export default function AdmetRadar({ admet }) {
  if (!admet || admet.error) return null;
  const flat = {
    ...admet.absorption,
    ...admet.distribution,
    ...admet.metabolism,
    ...admet.toxicity,
  };
  const data = Object.entries(flat).map(([k, v]) => ({
    metric: k.replace(/_/g, ' ').slice(0, 20),
    value: Math.max(0, Math.min(1, typeof v === 'number' ? v : 0)),
  }));

  return (
    <div style={{ width: '100%', height: 360 }}>
      <ResponsiveContainer>
        <RadarChart data={data}>
          <PolarGrid stroke="#26305a" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: '#8a94c3', fontSize: 10 }} />
          <PolarRadiusAxis domain={[0, 1]} tick={{ fill: '#8a94c3', fontSize: 10 }} />
          <Radar
            name="ADMET Score"
            dataKey="value"
            stroke="#6d5efc"
            fill="#6d5efc"
            fillOpacity={0.45}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
