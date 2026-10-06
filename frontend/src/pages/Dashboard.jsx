import { useState, useEffect } from 'react';
import KPICard from '../components/KPICard';
import AIStatus from '../components/AIStatus';
import { Target, Users, Zap, Eye, Trophy } from 'lucide-react';
import { getPredictions } from '../api/predictions';
import { getAutomationConfig, getExchangeBalance, getExchangeOrders } from '../api/exchange';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [autoConfig, setAutoConfig] = useState(null);
  const [balance, setBalance] = useState(null);
  const [orders, setOrders] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [predData, conf, bal, ords] = await Promise.all([
        getPredictions(),
        getAutomationConfig().catch(() => null),
        getExchangeBalance().catch(() => null),
        getExchangeOrders().catch(() => [])
      ]);
      setPredictions(predData);
      setAutoConfig(conf);
      setBalance(bal);
      setOrders(ords);
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

  const totalRaces = new Set(predictions.map(item => item.race_ID)).size;
  const totalHorses = predictions.length;
  const betCount = predictions.filter(item => item.recommendation === "BET").length;
  const watchCount = predictions.filter(item => item.recommendation === "WATCH").length;

  const kpis = [
    { title: 'Races Analyzed', value: totalRaces.toString(), icon: Trophy, trend: 'up', trendValue: '+12%', delay: 0 },
    { title: 'Horses Analyzed', value: totalHorses.toString(), icon: Users, trend: 'up', trendValue: '+5%', delay: 0.1 },
    { title: 'BET Signals', value: betCount.toString(), icon: Zap, trend: 'up', trendValue: '+2', delay: 0.2 },
    { title: 'WATCH Signals', value: watchCount.toString(), icon: Eye, trend: 'down', trendValue: '-3', delay: 0.3 },
  ];

  const topOpportunities = [...predictions]
    .sort((a, b) => b.value_edge - a.value_edge)
    .slice(0, 10);

  const paperBetsList = predictions.filter(item => item.recommendation === "BET");
  const paperBetsCount = paperBetsList.length;
  const paperWinners = paperBetsList.filter(item => item.target === 1).length;
  const paperWinRate = paperBetsCount > 0 ? (paperWinners / paperBetsCount) : 0;
  const paperProfit = paperBetsList.reduce((sum, item) => sum + (item.target === 1 ? (Number(item.dec) - 1) : -1), 0);
  const paperROI = paperBetsCount > 0 ? (paperProfit / paperBetsCount) : 0;

  function formatPercentage(value) {
    return `${value > 0 ? '+' : ''}${(value * 100).toFixed(2)}%`;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {kpis.map((kpi, i) => (
            <KPICard key={i} {...kpi} />
          ))}
        </div>
        <div className="md:w-[400px]">
          <AIStatus />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 min-h-[400px] flex flex-col relative overflow-hidden">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h2 className="text-xl font-bold">Live Race Intelligence</h2>
            <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] uppercase font-bold text-[#A1A1AA]">Coming Soon</span>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-[#A1A1AA] mb-4">
              <Activity size={32} />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Real-time Data Integration</h3>
            <p className="text-sm text-[#A1A1AA] max-w-sm">Live market data and real-time odds integration will be available in the next version.</p>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#08090B] to-transparent pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[300px] max-h-[300px] border border-white/5 rounded-full animate-[spin_10s_linear_infinite]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[200px] max-h-[200px] border border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
        </div>

        <div className="glass-card p-6 flex flex-col relative overflow-hidden group">
           <div className="flex items-center justify-between mb-6 relative z-10">
            <h2 className="text-xl font-bold">Top Value Opportunities</h2>
          </div>
          
          <div className="space-y-3 relative z-10">
            {topOpportunities.length > 0 ? topOpportunities.map((horse, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
                key={i} 
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#A1A1AA] w-5">{(i + 1).toString().padStart(2, '0')}</span>
                  <span className="font-medium text-sm text-white">{horse.horse_name}</span>
                </div>
                <span className={`text-sm font-bold ${horse.value_edge > 0 ? 'text-[#00FF9D]' : 'text-[#A1A1AA]'}`}>{formatPercentage(horse.value_edge)}</span>
              </motion.div>
            )) : (
               <div className="text-sm text-[#A1A1AA] p-4 text-center">Loading opportunities...</div>
            )}
          </div>
        </div>
      </div>

      {/* Paper Betting Summary Card */}
      <div className="glass-card p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold mb-2">Paper Betting Performance</h2>
          <p className="text-[#A1A1AA] text-sm max-w-md">Historical simulation based on 1-unit flat stake across all BET signals.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-col">
            <span className="text-xs text-[#71717A] uppercase tracking-wider font-bold mb-1">Total Bets</span>
            <span className="font-bold text-white text-lg">{paperBetsCount}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-[#71717A] uppercase tracking-wider font-bold mb-1">Win Rate</span>
            <span className="font-bold text-white text-lg">{(paperWinRate * 100).toFixed(2)}%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-[#71717A] uppercase tracking-wider font-bold mb-1">Total Profit</span>
            <span className={`font-bold text-lg ${paperProfit > 0 ? 'text-[#00FF9D]' : 'text-red-500'}`}>{paperProfit > 0 ? '+' : ''}{paperProfit.toFixed(2)} u</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-[#71717A] uppercase tracking-wider font-bold mb-1">ROI</span>
            <span className={`font-bold text-lg ${paperROI > 0 ? 'text-[#00FF9D]' : 'text-red-500'}`}>{paperROI > 0 ? '+' : ''}{(paperROI * 100).toFixed(2)}%</span>
          </div>
        </div>
        
        <a href="/paper-betting" className="px-6 py-3 bg-[#00FF9D]/10 hover:bg-[#00FF9D]/20 border border-[#00FF9D]/20 text-[#00FF9D] rounded-xl font-bold transition-colors whitespace-nowrap">
          View Analysis &rarr;
        </a>
      </div>

      {/* Automation / Risk Card */}
      <div className="glass-card p-6 flex flex-col sm:flex-row items-center justify-between gap-6 mt-6">
        <div>
          <h2 className="text-xl font-bold mb-2">Automated Trading</h2>
          <p className="text-[#A1A1AA] text-sm max-w-md flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
            ● PAPER MODE
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-col">
            <span className="text-xs text-[#71717A] uppercase tracking-wider font-bold mb-1">Automation</span>
            {autoConfig?.emergency_stop ? (
              <span className="font-bold text-red-500 text-lg">HALTED</span>
            ) : autoConfig?.automation_enabled ? (
              <span className="font-bold text-[#00FF9D] text-lg">ON</span>
            ) : (
              <span className="font-bold text-[#A1A1AA] text-lg">OFF</span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-[#71717A] uppercase tracking-wider font-bold mb-1">Today's P/L</span>
            <span className={`font-bold text-lg ${orders.reduce((s, o) => s + (o.profit_loss || 0), 0) > 0 ? 'text-[#00FF9D]' : orders.reduce((s, o) => s + (o.profit_loss || 0), 0) < 0 ? 'text-red-500' : 'text-white'}`}>
              {orders.reduce((s, o) => s + (o.profit_loss || 0), 0) > 0 ? '+' : ''}{orders.reduce((s, o) => s + (o.profit_loss || 0), 0).toFixed(2)} units
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-[#71717A] uppercase tracking-wider font-bold mb-1">Exposure</span>
            <span className="font-bold text-yellow-500 text-lg">{balance?.exposure?.toFixed(2) || '0.00'} units</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-[#71717A] uppercase tracking-wider font-bold mb-1">Risk</span>
            <span className="font-bold text-[#00FF9D] text-lg">
              {balance && autoConfig ? (balance.exposure / autoConfig.max_total_exposure > 0.8 ? 'HIGH' : 'LOW') : 'LOW'}
            </span>
          </div>
        </div>
        
        <a href="/automation" className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold transition-colors whitespace-nowrap">
          View Automation &rarr;
        </a>
      </div>
    </div>
  );
}

function Activity({ size, className }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
}
