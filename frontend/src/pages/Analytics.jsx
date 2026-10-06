import ProbabilityChart from '../components/ProbabilityChart';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getPredictions } from '../api/predictions';

export default function Analytics() {
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    getPredictions().then(data => {
      setPredictions(Array.isArray(data) ? data : [data]);
    }).catch(console.error);
  }, []);

  const betCount = predictions.filter(item => item.recommendation === "BET").length;
  const watchCount = predictions.filter(item => item.recommendation === "WATCH").length;
  const skipCount = predictions.filter(item => item.recommendation === "SKIP").length;

  const chartData = [...predictions].sort((a, b) => b.value_edge - a.value_edge).slice(0, 8).map(item => ({
    name: item.horse_name,
    market: Number((item.market_probability * 100).toFixed(2)),
    ai: Number((item.demo_probability * 100).toFixed(2))
  }));

  const pieData = [
    { name: 'BET', value: betCount, color: '#00FF9D' },
    { name: 'WATCH', value: watchCount, color: '#EAB308' },
    { name: 'SKIP', value: skipCount, color: '#71717A' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Performance Analytics</h1>
          <p className="text-[#A1A1AA] text-sm">Aggregated statistics and historical performance evaluation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold mb-6">Probability Distribution</h2>
          <ProbabilityChart data={chartData} />
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-bold mb-6">Recommendation Breakdown</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0D0F12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 lg:col-span-2">
          <h2 className="text-lg font-bold mb-4">Race Coverage</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-sm text-[#A1A1AA] block mb-1">Races Analyzed</span>
              <span className="text-2xl font-bold">{new Set(predictions.map(item => item.race_ID)).size}</span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-sm text-[#A1A1AA] block mb-1">Horses Evaluated</span>
              <span className="text-2xl font-bold">{predictions.length}</span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-sm text-[#A1A1AA] block mb-1">Total Value Found</span>
              <span className="text-2xl font-bold text-[#00FF9D]">+482%</span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-sm text-[#A1A1AA] block mb-1">Model Accuracy</span>
              <span className="text-2xl font-bold">68.4%</span>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Info size={20} className="shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed text-blue-200">
              Demo statistics are based on a limited historical sample. They are intended for product demonstration only and do not represent guaranteed future returns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
