import { useState, useEffect } from 'react';
import { getPredictions } from '../api/predictions';
import { motion } from 'framer-motion';
import { AlertCircle, FileText, CheckCircle2, TrendingUp, DollarSign, Activity } from 'lucide-react';
import KPICard from '../components/KPICard';
import { LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function PaperBetting() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getPredictions();
      setPredictions(Array.isArray(data) ? data : [data]);
      setError(null);
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const betCount = predictions.filter(item => item.recommendation === "BET").length;
  const watchCount = predictions.filter(item => item.recommendation === "WATCH").length;
  const skipCount = predictions.filter(item => item.recommendation === "SKIP").length;

  const paperBets = predictions
    .filter(item => item.recommendation === "BET")
    .map(item => {
      // profit logic based on 1 unit stake
      const isWinner = item.target === 1;
      const profit = isWinner ? (Number(item.dec) - 1) : -1;
      return {
        ...item,
        profit,
        isWinner
      };
    });

  const totalBets = paperBets.length;
  const winningBets = paperBets.filter(bet => bet.isWinner).length;
  const winRate = totalBets > 0 ? (winningBets / totalBets) : 0;
  const totalStake = totalBets;
  const totalProfit = paperBets.reduce((sum, bet) => sum + bet.profit, 0);
  const roi = totalStake > 0 ? (totalProfit / totalStake) : 0;
  const averageOdds = totalBets > 0 ? (paperBets.reduce((sum, bet) => sum + Number(bet.dec), 0) / totalBets) : 0;
  const totalReturn = totalStake + totalProfit;

  const kpis = [
    { title: 'Total Paper Bets', value: totalBets.toString(), icon: FileText, delay: 0 },
    { title: 'Winning Bets', value: winningBets.toString(), icon: CheckCircle2, delay: 0.1 },
    { title: 'Win Rate', value: `${(winRate * 100).toFixed(2)}%`, icon: Activity, delay: 0.2 },
    { title: 'Total Profit (Units)', value: `${totalProfit > 0 ? '+' : ''}${totalProfit.toFixed(2)}`, icon: TrendingUp, delay: 0.3 },
    { title: 'ROI', value: `${roi > 0 ? '+' : ''}${(roi * 100).toFixed(2)}%`, icon: DollarSign, delay: 0.4 },
    { title: 'Average Odds', value: averageOdds.toFixed(2), icon: Activity, delay: 0.5 },
  ];

  let cumulative = 0;
  const cumulativeProfitData = paperBets.map((bet, index) => {
    cumulative += bet.profit;
    return {
      bet: index + 1,
      profit: Number(cumulative.toFixed(2))
    };
  });

  const profitLossData = paperBets.map((bet, index) => ({
    bet: index + 1,
    profit: Number(bet.profit.toFixed(2)),
    isWinner: bet.isWinner
  }));

  const topWinning = [...paperBets].filter(bet => bet.isWinner).sort((a, b) => b.profit - a.profit).slice(0, 5);
  const biggestLosses = [...paperBets].filter(bet => !bet.isWinner).sort((a, b) => a.profit - b.profit).slice(0, 5);

  if (error) {
    return (
      <div className="glass-card p-8 flex flex-col items-center justify-center text-center flex-1 mx-auto max-w-7xl mt-10">
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-lg font-bold mb-2">Paper Betting Analytics Offline</h2>
        <p className="text-[#A1A1AA] max-w-md mb-6">Unable to retrieve prediction data.</p>
        <button onClick={loadData} className="px-6 py-2 bg-[#00FF9D] text-black hover:bg-[#00FF9D]/90 rounded-lg transition-colors font-bold">
          Retry
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="glass-card flex-1 p-6 space-y-4 max-w-7xl mx-auto w-full mt-10">
        <div className="text-[#A1A1AA] mb-4 font-medium">Calculating paper-betting performance...</div>
        <div className="h-10 bg-white/5 rounded animate-pulse w-full mb-8"></div>
        {[1,2,3,4,5].map(i => (
          <div key={i} className="h-16 bg-white/5 rounded animate-pulse w-full"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 flex flex-col pb-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-3">
            Paper Betting Analytics
            <span className="px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] uppercase font-bold tracking-wider">PAPER BETTING - Historical Simulation</span>
          </h1>
          <p className="text-[#A1A1AA] text-sm">Evaluating historical performance with a 1-unit flat stake on all BET signals.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <KPICard key={i} {...kpi} trend={null} trendValue={null} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 h-[400px]">
          <h2 className="text-lg font-bold mb-6">Cumulative Paper Profit</h2>
          <ResponsiveContainer width="100%" height="100%" className="pb-8">
            <LineChart data={cumulativeProfitData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="bet" stroke="#71717A" tick={{ fill: '#71717A', fontSize: 12 }} tickMargin={10} />
              <YAxis stroke="#71717A" tick={{ fill: '#71717A', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0D0F12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#00FF9D', fontWeight: 'bold' }}
                labelStyle={{ color: '#A1A1AA', marginBottom: '4px' }}
              />
              <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
              <Line type="monotone" dataKey="profit" name="Profit (Units)" stroke="#00FF9D" strokeWidth={3} dot={false} animationDuration={1500} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6 flex flex-col">
          <h2 className="text-lg font-bold mb-4">Paper ROI</h2>
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`w-40 h-40 rounded-full flex flex-col items-center justify-center border-[8px] ${roi > 0 ? 'border-[#00FF9D]' : 'border-red-500'} mb-6`}
            >
              <span className={`text-3xl font-bold ${roi > 0 ? 'text-[#00FF9D]' : 'text-red-500'}`}>
                {roi > 0 ? '+' : ''}{(roi * 100).toFixed(2)}%
              </span>
            </motion.div>
            
            <div className="grid grid-cols-2 w-full gap-4 mt-auto">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <span className="text-[#A1A1AA] text-xs uppercase tracking-wider block mb-1">Total Stake</span>
                <span className="text-lg font-bold">{totalStake} units</span>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <span className="text-[#A1A1AA] text-xs uppercase tracking-wider block mb-1">Total Return</span>
                <span className="text-lg font-bold">{totalReturn.toFixed(2)} units</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 lg:col-span-2 h-[350px]">
          <h2 className="text-lg font-bold mb-6">Profit / Loss (Per Bet)</h2>
          <ResponsiveContainer width="100%" height="100%" className="pb-8">
            <BarChart data={profitLossData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="bet" stroke="#71717A" tick={{ fill: '#71717A', fontSize: 12 }} />
              <YAxis stroke="#71717A" tick={{ fill: '#71717A', fontSize: 12 }} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#0D0F12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              />
              <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" />
              <Bar dataKey="profit" name="Profit/Loss">
                {profitLossData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.isWinner ? '#00FF9D' : '#EF4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6 flex flex-col justify-center">
          <h2 className="text-lg font-bold mb-6">Recommendation Performance</h2>
          <div className="space-y-4">
             <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <span className="font-bold text-[#00FF9D]">BET</span>
                <span className="text-lg font-medium text-white">{betCount}</span>
             </div>
             <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <span className="font-bold text-yellow-500">WATCH</span>
                <span className="text-lg font-medium text-white">{watchCount}</span>
             </div>
             <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <span className="font-bold text-[#A1A1AA]">SKIP</span>
                <span className="text-lg font-medium text-white">{skipCount}</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 flex flex-col relative overflow-hidden">
          <h2 className="text-lg font-bold mb-6 text-[#00FF9D]">Top Winning Opportunities</h2>
          <div className="space-y-3">
            {topWinning.length > 0 ? topWinning.map((horse, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                key={i} 
                className="flex items-center justify-between p-4 rounded-lg bg-[#00FF9D]/5 border border-[#00FF9D]/10 hover:bg-[#00FF9D]/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-[#00FF9D]/50 w-6">{i + 1}</span>
                  <div>
                    <span className="font-bold text-white block">{horse.horse_name}</span>
                    <span className="text-xs text-[#A1A1AA]">{Number(horse.dec).toFixed(2)} odds</span>
                  </div>
                </div>
                <span className="text-base font-bold text-[#00FF9D]">+{horse.profit.toFixed(2)} units</span>
              </motion.div>
            )) : (
              <div className="text-sm text-[#A1A1AA] p-4 text-center">No winning bets found.</div>
            )}
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col relative overflow-hidden">
          <h2 className="text-lg font-bold mb-6 text-red-500">Biggest Losses</h2>
          <div className="space-y-3">
            {biggestLosses.length > 0 ? biggestLosses.map((horse, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                key={i} 
                className="flex items-center justify-between p-4 rounded-lg bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <span className="font-bold text-white block">{horse.horse_name}</span>
                    <span className="text-xs text-[#A1A1AA]">{Number(horse.dec).toFixed(2)} odds</span>
                  </div>
                </div>
                <span className="text-base font-bold text-red-500">{horse.profit.toFixed(2)} units</span>
              </motion.div>
            )) : (
              <div className="text-sm text-[#A1A1AA] p-4 text-center">No losing bets found.</div>
            )}
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden mt-6">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-bold">Paper Betting Log</h2>
        </div>
        <div className="overflow-x-auto w-full">
          {paperBets.length > 0 ? (
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="bg-[#08090B]">
                <tr className="border-b border-white/10 text-xs text-[#A1A1AA] uppercase tracking-wider">
                  <th className="py-4 px-4 font-semibold">Race</th>
                  <th className="py-4 px-4 font-semibold">Horse</th>
                  <th className="py-4 px-4 font-semibold text-right">Odds</th>
                  <th className="py-4 px-4 font-semibold text-right">Mkt %</th>
                  <th className="py-4 px-4 font-semibold text-right">AI %</th>
                  <th className="py-4 px-4 font-semibold text-right">Value</th>
                  <th className="py-4 px-4 font-semibold text-center">Signal</th>
                  <th className="py-4 px-4 font-semibold text-center">Result</th>
                  <th className="py-4 px-4 font-semibold text-right">Profit</th>
                </tr>
              </thead>
              <tbody>
                {paperBets.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-xs font-mono text-[#A1A1AA]">{row.race_ID}</td>
                    <td className="py-3 px-4 font-medium">{row.horse_name}</td>
                    <td className="py-3 px-4 text-sm text-right text-[#A1A1AA]">{Number(row.dec).toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm text-right text-[#A1A1AA]">{(row.market_probability * 100).toFixed(2)}%</td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-white">{(row.demo_probability * 100).toFixed(2)}%</td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-[#00FF9D]">
                      +{(row.value_edge * 100).toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold border bg-[#00FF9D]/10 text-[#00FF9D] border-[#00FF9D]/20">
                        {row.recommendation}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${row.isWinner ? 'bg-[#00FF9D] text-black' : 'bg-[#1A1D21] text-[#A1A1AA] border border-white/10'}`}>
                        {row.isWinner ? 'WIN' : 'LOSS'}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-sm text-right font-bold ${row.isWinner ? 'text-[#00FF9D]' : 'text-red-500'}`}>
                      {row.isWinner ? '+' : ''}{row.profit.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <p className="text-white text-lg font-bold mb-2">No Paper Bets Available</p>
              <p className="text-[#A1A1AA] text-sm max-w-md">There are currently no predictions meeting the BET criteria for paper betting simulation.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 p-6 rounded-xl border border-white/10 bg-gradient-to-r from-blue-500/5 to-transparent text-[#A1A1AA] text-sm leading-relaxed flex items-start gap-4">
        <AlertCircle className="text-blue-400 shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="text-white font-bold mb-1">Historical Paper-Betting Simulation</h4>
          <p>
            This section uses historical race results to demonstrate how the prediction recommendations would have performed under a simple 1-unit-per-bet paper betting strategy.
          </p>
          <p className="mt-2 text-[#71717A]">
            This is a prototype analysis and does not represent guaranteed future performance or real-money betting results.
          </p>
        </div>
      </div>
    </div>
  );
}
