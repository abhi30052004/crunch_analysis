import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, BarChart2, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAutomationConfig, placeExchangeOrder, getExchangeBalance } from '../api/exchange';

export default function HorseDrawer({ horse, onClose }) {
  const [config, setConfig] = useState(null);
  const [balance, setBalance] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [orderRes, setOrderRes] = useState(null);

  useEffect(() => {
    if (horse) {
      Promise.all([getAutomationConfig(), getExchangeBalance()])
        .then(([c, b]) => { setConfig(c); setBalance(b); })
        .catch(console.error);
    }
  }, [horse]);

  if (!horse) return null;

  let stake = 0;
  let riskStatus = 'BLOCKED';
  let riskReason = 'Loading configuration...';

  if (config && balance) {
    if (!config.automation_enabled && !config.emergency_stop) {
      riskStatus = 'APPROVED'; // Manual override allowed
    }
    
    if (config.emergency_stop) {
      riskStatus = 'BLOCKED';
      riskReason = 'Emergency stop is active.';
    } else {
      // Calculate Stake
      if (config.staking_plan === 'fixed') stake = config.fixed_stake;
      else if (config.staking_plan === 'percentage') stake = (balance.balance * (config.bankroll_percentage / 100));
      else if (config.staking_plan === 'capped_percentage') stake = Math.min(config.max_stake, (balance.balance * (config.bankroll_percentage / 100)));
      
      stake = Math.min(stake, config.max_stake);

      if (horse.recommendation !== 'BET') {
        riskStatus = 'BLOCKED';
        riskReason = 'Only BET recommendations can be executed.';
      } else if (stake <= 0) {
        riskStatus = 'BLOCKED';
        riskReason = 'Calculated stake is 0 or invalid.';
      } else if ((horse.value_edge * 100) < config.min_value_edge) {
        riskStatus = 'BLOCKED';
        riskReason = `Value edge below configured threshold (${config.min_value_edge}%).`;
      } else if ((horse.demo_probability * 100) < config.min_probability) {
        riskStatus = 'BLOCKED';
        riskReason = `AI probability below threshold (${config.min_probability}%).`;
      } else if (horse.dec < config.min_odds || horse.dec > config.max_odds) {
        riskStatus = 'BLOCKED';
        riskReason = `Odds outside allowed range (${config.min_odds} - ${config.max_odds}).`;
      } else if ((balance.exposure + stake) > config.max_total_exposure) {
        riskStatus = 'BLOCKED';
        riskReason = 'Maximum total exposure would be exceeded.';
      } else {
        riskStatus = 'APPROVED';
      }
    }
  }

  const handlePlaceOrder = async () => {
    if (riskStatus !== 'APPROVED') return;
    setPlacing(true);
    try {
      const res = await placeExchangeOrder({
        market_id: horse.race_ID || "MKT-123",
        selection: horse.horse_name,
        side: "BACK",
        odds: horse.dec,
        stake: stake
      });
      setOrderRes(res);
      // Refresh balance logic would typically go here or trigger a global state update
    } catch (e) {
      console.error(e);
      setOrderRes({ error: e.message || 'Order failed' });
    } finally {
      setPlacing(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex justify-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-md h-full bg-[#08090B] border-l border-white/10 shadow-2xl flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="text-[#A1A1AA] text-xs font-semibold uppercase tracking-wider mb-1">Horse Analysis</h2>
              <h1 className="text-2xl font-bold text-white">{horse.horse_name}</h1>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4">
                <span className="text-xs text-[#A1A1AA] block mb-1">Race</span>
                <span className="font-semibold">{horse.race_ID || 'RID2791-GB-14'}</span>
              </div>
              <div className="glass-card p-4">
                <span className="text-xs text-[#A1A1AA] block mb-1">Decimal Odds</span>
                <span className="font-semibold">{horse.dec.toFixed(2)}</span>
              </div>
            </div>

            {/* Probability Comparison */}
            <div className="glass-card p-5 space-y-5">
              <h3 className="text-sm font-semibold flex items-center gap-2"><BarChart2 size={16} className="text-[#00FF9D]" /> Probability Comparison</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#A1A1AA]">Market Probability</span>
                  <span className="font-medium">{(horse.market_probability * 100).toFixed(2)}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${horse.market_probability * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-[#71717A] rounded-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#A1A1AA]">AI Probability</span>
                  <span className="font-medium text-[#00FF9D]">{(horse.demo_probability * 100).toFixed(2)}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden shadow-[0_0_10px_rgba(0,255,157,0.2)]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${horse.demo_probability * 100}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="h-full bg-[#00FF9D] rounded-full relative"
                  >
                    <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/30" />
                  </motion.div>
                </div>
              </div>
              
              <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-sm font-medium">Value Edge</span>
                <span className={`text-lg font-bold flex items-center gap-1 ${horse.value_edge > 0 ? 'text-[#00FF9D]' : 'text-red-400'}`}>
                  {horse.value_edge > 0 && <TrendingUp size={18} />}
                  {horse.value_edge > 0 ? '+' : ''}{(horse.value_edge * 100).toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Recommendation */}
            <div className="flex items-center justify-between p-5 rounded-xl border border-white/10 bg-[#0D0F12]">
              <span className="text-sm font-medium text-[#A1A1AA]">Recommendation</span>
              <span className={`px-4 py-1.5 rounded-lg text-sm font-bold border ${horse.recommendation === 'BET' ? 'bg-[#00FF9D]/10 text-[#00FF9D] border-[#00FF9D]/20' : horse.recommendation === 'WATCH' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-white/5 text-[#A1A1AA] border-white/10'}`}>
                {horse.recommendation}
              </span>
            </div>

            {/* Order Preview */}
            <div className="glass-card p-5 space-y-4 border border-[#00FF9D]/20">
              <h3 className="text-sm font-semibold mb-4">Order Preview (Paper)</h3>
              
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-[#A1A1AA] text-sm">Stake</span>
                <span className="font-bold text-white">{stake > 0 ? stake.toFixed(2) : '-'} units</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-[#A1A1AA] text-sm">Risk Check</span>
                <span className={`font-bold flex items-center gap-1.5 ${riskStatus === 'APPROVED' ? 'text-[#00FF9D]' : 'text-red-500'}`}>
                  {riskStatus === 'APPROVED' ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
                  {riskStatus}
                </span>
              </div>
              
              {riskStatus === 'BLOCKED' && (
                <div className="text-xs text-red-400 bg-red-500/10 p-3 rounded border border-red-500/20">
                  <span className="font-bold block mb-1">Reason:</span>
                  {riskReason}
                </div>
              )}

              {orderRes ? (
                orderRes.error ? (
                  <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm border border-red-500/20 flex items-start gap-2">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block mb-1">Order rejected</span>
                      Reason: {orderRes.error}
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#00FF9D]/10 text-[#00FF9D] p-3 rounded-lg text-sm border border-[#00FF9D]/20 text-center">
                    <CheckCircle2 size={24} className="mx-auto mb-2" />
                    <span className="font-bold block mb-1">Order created</span>
                    Order ID: {orderRes.id?.substring(0,8)}
                  </div>
                )
              ) : (
                <button 
                  onClick={handlePlaceOrder}
                  disabled={riskStatus !== 'APPROVED' || placing}
                  className={`w-full py-3 rounded-xl font-bold transition-colors mt-4 flex items-center justify-center gap-2 ${
                    riskStatus === 'APPROVED' 
                      ? 'bg-[#00FF9D] text-black hover:bg-[#00FF9D]/90 shadow-[0_0_15px_rgba(0,255,157,0.2)]' 
                      : 'bg-white/5 text-[#A1A1AA] cursor-not-allowed'
                  }`}
                >
                  {placing ? 'Submitting...' : 'PLACE ORDER'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
