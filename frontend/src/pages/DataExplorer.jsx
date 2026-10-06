import { Search, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getPredictions } from '../api/predictions';

export default function DataExplorer() {
  const [filter, setFilter] = useState('ALL');
  const [rawData, setRawData] = useState([]);

  useEffect(() => {
    getPredictions().then(data => {
      setRawData(Array.isArray(data) ? data : [data]);
    }).catch(console.error);
  }, []);

  const filteredData = filter === 'ALL' ? rawData : filter === 'VALUE' ? rawData.filter(d => d.value_edge > 0.05) : rawData.filter(d => d.recommendation === filter);

  return (
    <div className="max-w-7xl mx-auto space-y-6 flex flex-col h-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Data Explorer</h1>
          <p className="text-[#A1A1AA] text-sm">Search and filter historical predictions.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
            <input 
              type="text" 
              placeholder="Search horses or races..." 
              className="w-full bg-[#0D0F12] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#00FF9D]/50 transition-colors"
            />
          </div>
          <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#A1A1AA] hover:text-white transition-colors flex items-center justify-center">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 pb-2 overflow-x-auto">
        {['ALL', 'BET', 'WATCH', 'SKIP', 'VALUE'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider transition-colors whitespace-nowrap ${
              filter === f 
                ? 'bg-white text-black' 
                : 'bg-white/5 text-[#A1A1AA] hover:bg-white/10'
            }`}
          >
            {f === 'VALUE' ? 'EDGE > 5%' : f}
          </button>
        ))}
      </div>

      <div className="glass-card flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="sticky top-0 bg-[#08090B] z-10 shadow-md">
              <tr className="border-b border-white/10 text-xs text-[#A1A1AA] uppercase tracking-wider">
                <th className="py-4 px-4 font-semibold">Race ID</th>
                <th className="py-4 px-4 font-semibold">Horse</th>
                <th className="py-4 px-4 font-semibold">Course</th>
                <th className="py-4 px-4 font-semibold text-right">Odds</th>
                <th className="py-4 px-4 font-semibold text-right">Mkt %</th>
                <th className="py-4 px-4 font-semibold text-right">AI %</th>
                <th className="py-4 px-4 font-semibold text-right">Value Edge</th>
                <th className="py-4 px-4 font-semibold text-center">Signal</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-xs font-mono text-[#A1A1AA]">{row.race_ID}</td>
                  <td className="py-3 px-4 font-medium">{row.horse_name}</td>
                  <td className="py-3 px-4 text-sm text-[#A1A1AA]">Unknown</td>
                  <td className="py-3 px-4 text-sm text-right text-[#A1A1AA]">{row.dec.toFixed(2)}</td>
                  <td className="py-3 px-4 text-sm text-right text-[#A1A1AA]">{(row.market_probability * 100).toFixed(2)}%</td>
                  <td className="py-3 px-4 text-sm text-right font-medium">{(row.demo_probability * 100).toFixed(2)}%</td>
                  <td className={`py-3 px-4 text-sm text-right font-bold ${row.value_edge > 0 ? 'text-[#00FF9D]' : 'text-[#A1A1AA]'}`}>
                    {row.value_edge > 0 ? '+' : ''}{(row.value_edge * 100).toFixed(2)}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                      row.recommendation === 'BET' ? 'bg-[#00FF9D]/10 text-[#00FF9D] border-[#00FF9D]/20' : 
                      row.recommendation === 'WATCH' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                      'bg-white/5 text-[#A1A1AA] border-white/10'
                    }`}>
                      {row.recommendation}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-[#A1A1AA]">
          <span>Showing {filteredData.length} entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
