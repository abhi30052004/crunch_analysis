import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Power, AlertTriangle, ShieldAlert, BarChart3, 
  Activity, Play, Pause, AlertOctagon, TrendingUp, DollarSign 
} from 'lucide-react';
import { 
  getAutomationConfig, 
  updateAutomationConfig, 
  getExchangeBalance, 
  getExchangeOrders 
} from '../api/exchange';

export default function Automation() {
  const [config, setConfig] = useState(null);
  const [balance, setBalance] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmStop, setConfirmStop] = useState(false);

  const loadData = async () => {
    try {
      const [conf, bal, ords] = await Promise.all([
        getAutomationConfig(),
        getExchangeBalance(),
        getExchangeOrders()
      ]);
      setConfig(conf);
      setBalance(bal);
      setOrders(ords);
      setError(false);
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleConfigChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const saveConfig = async (newConfig = null) => {
    try {
      setSaving(true);
      const confToSave = newConfig || config;
      const updated = await updateAutomationConfig(confToSave);
      setConfig(updated);
    } catch (e) {
      console.error("Failed to save config");
    } finally {
      setSaving(false);
    }
  };

  const toggleAutomation = async () => {
    if (config.emergency_stop) return;
    const newState = !config.automation_enabled;
    setConfig(prev => ({ ...prev, automation_enabled: newState }));
    await saveConfig({ ...config, automation_enabled: newState });
  };

  const triggerEmergencyStop = async () => {
    const newState = { ...config, emergency_stop: true, automation_enabled: false };
    setConfig(newState);
    await saveConfig(newState);
    setConfirmStop(false);
  };

  if (loading && !config) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-4 w-full h-full">
        <div className="w-8 h-8 border-4 border-[#00FF9D]/20 border-t-[#00FF9D] rounded-full animate-spin"></div>
        <div className="text-[#A1A1AA] font-medium">Loading automation engine...</div>
      </div>
    );
  }

  if (error && !config) {
    return (
      <div className="glass-card p-8 flex flex-col items-center justify-center text-center flex-1 max-w-2xl mx-auto mt-20">
        <AlertTriangle size={32} className="text-red-500 mb-4" />
        <h2 className="text-lg font-bold mb-2">Automation Offline</h2>
        <p className="text-[#A1A1AA] mb-6">Unable to connect to the backend engine.</p>
        <button onClick={loadData} className="px-6 py-2 bg-[#00FF9D] text-black hover:bg-[#00FF9D]/90 rounded-lg font-bold">
          Retry
        </button>
      </div>
    );
  }

  const isEStop = config.emergency_stop;
  const isRunning = config.automation_enabled && !isEStop;

  const todayProfit = orders.reduce((sum, o) => sum + (o.profit_loss || 0), 0);
  const matchedOrders = orders.filter(o => o.status === "MATCHED" || o.status === "SETTLED").length;
  const blockedCount = 0; // Simulated blocked metric

  const dailyLossUsage = Math.min(100, Math.max(0, (-todayProfit / config.max_daily_loss) * 100));
  const totalExposureUsage = Math.min(100, (balance?.exposure / config.max_total_exposure) * 100);

  return (
    <div className="max-w-7xl mx-auto space-y-6 flex flex-col pb-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-3">
            Automated Betting Engine
            <span className="px-2 py-1 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] uppercase font-bold tracking-wider">PAPER EXECUTION ONLY</span>
          </h1>
          <p className="text-[#A1A1AA] text-sm">Configure betting rules, risk controls, and automated paper trading parameters.</p>
        </div>
      </div>

      {isEStop && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 p-6 rounded-xl flex items-center gap-4 text-red-500"
        >
          <AlertOctagon size={32} className="shrink-0" />
          <div>
            <h3 className="font-bold text-lg">AUTOMATION HALTED - EMERGENCY STOP ACTIVE</h3>
            <p className="text-sm opacity-80 mt-1">All new orders are blocked. Automation cannot be re-enabled until the emergency stop is lifted.</p>
          </div>
          <button 
            onClick={async () => { await saveConfig({...config, emergency_stop: false}); }}
            className="ml-auto px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors"
          >
            Lift Stop
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex flex-col h-full lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Automation Status</h2>
            <span className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase">
              <span className={`w-2.5 h-2.5 rounded-full ${isEStop ? 'bg-red-500' : isRunning ? 'bg-[#00FF9D] animate-pulse' : 'bg-[#71717A]'}`}></span>
              {isEStop ? <span className="text-red-500">HALTED</span> : isRunning ? <span className="text-[#00FF9D]">READY</span> : <span className="text-[#A1A1AA]">OFF</span>}
            </span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center py-8">
            <button 
              onClick={toggleAutomation}
              disabled={isEStop}
              className={`w-40 h-40 rounded-full flex flex-col items-center justify-center transition-all duration-300 border-4 shadow-2xl relative ${
                isEStop 
                  ? 'border-red-500/20 bg-red-500/5 text-red-500/50 cursor-not-allowed' 
                  : isRunning
                  ? 'border-[#00FF9D] bg-[#00FF9D]/10 text-[#00FF9D] hover:bg-[#00FF9D]/20 shadow-[0_0_50px_rgba(0,255,157,0.3)] hover:scale-105'
                  : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:border-white/20 hover:scale-105 hover:text-white'
              }`}
            >
              {isRunning ? <Pause size={48} className="mb-2" /> : <Play size={48} className="mb-2 ml-2" />}
              <span className="font-bold text-lg">{isRunning ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-auto">
            <div className="bg-[#08090B]/50 p-4 rounded-xl border border-white/5">
              <span className="text-[#A1A1AA] text-xs uppercase tracking-wider block mb-1">Paper Balance</span>
              <span className="font-bold text-lg">{balance?.balance?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="bg-[#08090B]/50 p-4 rounded-xl border border-white/5">
              <span className="text-[#A1A1AA] text-xs uppercase tracking-wider block mb-1">Exposure</span>
              <span className="font-bold text-lg text-yellow-500">{balance?.exposure?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="bg-[#08090B]/50 p-4 rounded-xl border border-white/5">
              <span className="text-[#A1A1AA] text-xs uppercase tracking-wider block mb-1">Today's P/L</span>
              <span className={`font-bold text-lg ${todayProfit > 0 ? 'text-[#00FF9D]' : todayProfit < 0 ? 'text-red-500' : ''}`}>
                {todayProfit > 0 ? '+' : ''}{todayProfit.toFixed(2)}
              </span>
            </div>
            <div className="bg-[#08090B]/50 p-4 rounded-xl border border-white/5">
              <span className="text-[#A1A1AA] text-xs uppercase tracking-wider block mb-1">Matched</span>
              <span className="font-bold text-lg">{matchedOrders}</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col border border-red-500/20">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 text-red-500 mb-6 mx-auto">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-xl font-bold text-center mb-2">Emergency Stop</h2>
          <p className="text-sm text-[#A1A1AA] text-center mb-8">
            Immediately halt all automation and block any new paper orders from being placed.
          </p>

          <div className="mt-auto">
            {!confirmStop ? (
              <button 
                onClick={() => setConfirmStop(true)}
                disabled={isEStop}
                className="w-full py-4 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:hover:bg-red-500 text-white font-bold text-lg transition-colors flex items-center justify-center gap-2"
              >
                EMERGENCY STOP
              </button>
            ) : (
              <div className="space-y-3">
                <span className="block text-center text-red-500 font-bold mb-2">Are you sure?</span>
                <button 
                  onClick={triggerEmergencyStop}
                  className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors"
                >
                  Confirm Stop
                </button>
                <button 
                  onClick={() => setConfirmStop(false)}
                  className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Settings size={18} className="text-[#00FF9D]" /> Betting Rules & Staking
            </h2>
            <button onClick={() => saveConfig()} disabled={saving} className="px-4 py-1.5 bg-[#00FF9D]/10 hover:bg-[#00FF9D]/20 text-[#00FF9D] rounded-lg text-sm font-bold transition-colors">
              {saving ? 'Saving...' : 'Save Config'}
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-[#A1A1AA] mb-2">Staking Plan</label>
              <div className="flex bg-[#08090B] p-1 rounded-lg border border-white/5">
                {['fixed', 'percentage', 'capped_percentage'].map(plan => (
                  <button 
                    key={plan}
                    onClick={() => handleConfigChange('staking_plan', plan)}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${config.staking_plan === plan ? 'bg-[#00FF9D]/10 text-[#00FF9D]' : 'text-[#71717A] hover:text-white'}`}
                  >
                    {plan.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2">Fixed Stake (Units)</label>
                <input 
                  type="number" step="1" 
                  value={config.fixed_stake} 
                  onChange={e => handleConfigChange('fixed_stake', Number(e.target.value))}
                  className="w-full bg-[#08090B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00FF9D]/50"
                />
              </div>
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2">Bankroll %</label>
                <input 
                  type="number" step="0.1" 
                  value={config.bankroll_percentage} 
                  onChange={e => handleConfigChange('bankroll_percentage', Number(e.target.value))}
                  className="w-full bg-[#08090B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00FF9D]/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2">Min Value Edge (%)</label>
                <input 
                  type="number" step="0.5" 
                  value={config.min_value_edge} 
                  onChange={e => handleConfigChange('min_value_edge', Number(e.target.value))}
                  className="w-full bg-[#08090B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00FF9D]/50"
                />
              </div>
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2">Min AI Prob (%)</label>
                <input 
                  type="number" step="1" 
                  value={config.min_probability} 
                  onChange={e => handleConfigChange('min_probability', Number(e.target.value))}
                  className="w-full bg-[#08090B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00FF9D]/50"
                />
              </div>
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2">Min Odds</label>
                <input 
                  type="number" step="0.1" 
                  value={config.min_odds} 
                  onChange={e => handleConfigChange('min_odds', Number(e.target.value))}
                  className="w-full bg-[#08090B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00FF9D]/50"
                />
              </div>
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2">Max Odds</label>
                <input 
                  type="number" step="1" 
                  value={config.max_odds} 
                  onChange={e => handleConfigChange('max_odds', Number(e.target.value))}
                  className="w-full bg-[#08090B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00FF9D]/50"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
           <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <ShieldAlert size={18} className="text-red-500" /> Risk Controls
          </h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2">Max Stake</label>
                <input 
                  type="number" step="1" 
                  value={config.max_stake} 
                  onChange={e => handleConfigChange('max_stake', Number(e.target.value))}
                  className="w-full bg-[#08090B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500/50"
                />
              </div>
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2">Max Open Bets</label>
                <input 
                  type="number" step="1" 
                  value={config.max_open_bets} 
                  onChange={e => handleConfigChange('max_open_bets', Number(e.target.value))}
                  className="w-full bg-[#08090B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500/50"
                />
              </div>
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2">Max Daily Loss</label>
                <input 
                  type="number" step="10" 
                  value={config.max_daily_loss} 
                  onChange={e => handleConfigChange('max_daily_loss', Number(e.target.value))}
                  className="w-full bg-[#08090B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500/50"
                />
              </div>
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2">Max Race Exp.</label>
                <input 
                  type="number" step="10" 
                  value={config.max_race_exposure} 
                  onChange={e => handleConfigChange('max_race_exposure', Number(e.target.value))}
                  className="w-full bg-[#08090B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500/50"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-[#A1A1AA] mb-2">Max Total Exposure</label>
                <input 
                  type="number" step="10" 
                  value={config.max_total_exposure} 
                  onChange={e => handleConfigChange('max_total_exposure', Number(e.target.value))}
                  className="w-full bg-[#08090B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500/50"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-4">
              <h3 className="text-sm font-bold text-white mb-4">Risk Utilization</h3>
              
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-[#A1A1AA] uppercase tracking-wider">Daily Loss</span>
                  <span className={dailyLossUsage > 80 ? 'text-red-500' : 'text-[#00FF9D]'}>{dailyLossUsage.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${dailyLossUsage > 80 ? 'bg-red-500' : 'bg-[#00FF9D]'}`} style={{width: `${dailyLossUsage}%`}}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-[#A1A1AA] uppercase tracking-wider">Total Exposure</span>
                  <span className={totalExposureUsage > 80 ? 'text-red-500' : 'text-yellow-500'}>{totalExposureUsage.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${totalExposureUsage > 80 ? 'bg-red-500' : 'bg-yellow-500'}`} style={{width: `${totalExposureUsage}%`}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden mt-6">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-lg font-bold">Paper Order History</h2>
          <select className="bg-[#08090B] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none">
            <option>All Orders</option>
            <option>Matched</option>
            <option>Pending</option>
            <option>Settled</option>
          </select>
        </div>
        <div className="overflow-x-auto w-full max-h-96 overflow-y-auto">
          {orders.length > 0 ? (
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="bg-[#08090B] sticky top-0">
                <tr className="border-b border-white/10 text-xs text-[#A1A1AA] uppercase tracking-wider">
                  <th className="py-4 px-4 font-semibold">Order ID</th>
                  <th className="py-4 px-4 font-semibold">Race / Market</th>
                  <th className="py-4 px-4 font-semibold">Horse</th>
                  <th className="py-4 px-4 font-semibold text-right">Odds</th>
                  <th className="py-4 px-4 font-semibold text-right">Stake</th>
                  <th className="py-4 px-4 font-semibold text-center">Status</th>
                  <th className="py-4 px-4 font-semibold text-right">P/L</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-xs font-mono text-[#A1A1AA]">{o.id.substring(0,8)}</td>
                    <td className="py-3 px-4 text-sm">{o.market_id}</td>
                    <td className="py-3 px-4 font-medium">{o.selection}</td>
                    <td className="py-3 px-4 text-sm text-right text-[#A1A1AA]">{o.odds.toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm text-right text-[#A1A1AA]">{o.stake.toFixed(2)}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${
                        o.status === 'MATCHED' ? 'bg-[#00FF9D]/10 text-[#00FF9D] border-[#00FF9D]/20' : 
                        o.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                        o.status === 'SETTLED' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                        'bg-white/5 text-[#A1A1AA] border-white/10'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-sm text-right font-bold ${o.profit_loss > 0 ? 'text-[#00FF9D]' : o.profit_loss < 0 ? 'text-red-500' : 'text-[#A1A1AA]'}`}>
                      {o.profit_loss !== 0 ? (o.profit_loss > 0 ? '+' : '') + o.profit_loss.toFixed(2) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <p className="text-white text-lg font-bold mb-2">No Order History</p>
              <p className="text-[#A1A1AA] text-sm max-w-md">There are currently no paper orders recorded for this session.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
