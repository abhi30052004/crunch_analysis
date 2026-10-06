import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlugZap, CheckCircle2, AlertCircle, RefreshCw, Server, ShieldCheck, FileText, Activity } from 'lucide-react';
import { getExchangeStatus, getExchangeBalance } from '../api/exchange';

export default function Exchange() {
  const [status, setStatus] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [testing, setTesting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statusData, balanceData] = await Promise.all([
        getExchangeStatus(),
        getExchangeBalance()
      ]);
      setStatus(statusData);
      setBalance(balanceData);
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
  }, []);

  const handleTestConnection = async () => {
    setTesting(true);
    await loadData();
    setTimeout(() => setTesting(false), 800);
  };

  if (loading && !status) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-4 max-w-7xl mx-auto w-full mt-20">
        <div className="w-8 h-8 border-4 border-[#00FF9D]/20 border-t-[#00FF9D] rounded-full animate-spin"></div>
        <div className="text-[#A1A1AA] font-medium">Connecting to exchange sandbox...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 flex flex-col pb-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-3">
            Exchange Integration
            <span className="px-2 py-1 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
              PAPER TRADING
            </span>
          </h1>
          <p className="text-[#A1A1AA] text-sm max-w-2xl">Manage exchange connection, markets and automated paper execution. No real-money orders are being placed.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <PlugZap size={24} />
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${error ? 'bg-red-500/10 text-red-500' : 'bg-[#00FF9D]/10 text-[#00FF9D]'}`}>
              {error ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
              {error ? 'OFFLINE' : 'CONNECTED'}
            </span>
          </div>

          <h2 className="text-xl font-bold mb-6">Exchange Connection</h2>

          <div className="space-y-4 mb-8 flex-1">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-[#A1A1AA] text-sm">Status</span>
              <span className="font-bold text-yellow-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                SIMULATION MODE
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-[#A1A1AA] text-sm">Environment</span>
              <span className="font-medium text-white">Paper / Sandbox</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-[#A1A1AA] text-sm">Connection</span>
              <span className="font-medium text-white">{error ? 'Disconnected' : 'Connected'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-[#A1A1AA] text-sm">API</span>
              <span className="font-medium text-white">Exchange Adapter</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-[#A1A1AA] text-sm">Last Sync</span>
              <span className="font-medium text-white">{status ? status.last_sync : 'Unknown'}</span>
            </div>
          </div>

          <button 
            onClick={handleTestConnection}
            disabled={testing}
            className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 font-bold transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} className={testing ? "animate-spin" : ""} />
            {testing ? 'Testing...' : 'Test Connection'}
          </button>
        </div>

        <div className="lg:col-span-2 glass-card p-6 flex flex-col relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#00FF9D]/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <h2 className="text-xl font-bold mb-2 text-[#00FF9D]">Paper Balance</h2>
          <p className="text-[#A1A1AA] text-sm mb-8">Simulation funds for automated trading execution.</p>

          <div className="flex items-end gap-2 mb-10">
            <span className="text-5xl font-bold text-white tracking-tight">
              {balance ? balance.balance.toLocaleString('en-US', {minimumFractionDigits: 2}) : '0.00'}
            </span>
            <span className="text-xl text-[#A1A1AA] mb-1 font-medium">units</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
             <div className="bg-[#08090B]/50 p-4 rounded-xl border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#71717A] text-xs font-bold uppercase tracking-wider">Available</span>
                  <ShieldCheck size={16} className="text-[#A1A1AA]" />
                </div>
                <div className="text-xl font-bold text-white">
                  {balance ? balance.available.toLocaleString('en-US', {minimumFractionDigits: 2}) : '0.00'}
                </div>
             </div>
             <div className="bg-[#08090B]/50 p-4 rounded-xl border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#71717A] text-xs font-bold uppercase tracking-wider">Active Exposure</span>
                  <Activity size={16} className="text-yellow-500" />
                </div>
                <div className="text-xl font-bold text-yellow-500">
                  {balance ? balance.exposure.toLocaleString('en-US', {minimumFractionDigits: 2}) : '0.00'}
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 rounded-xl border border-yellow-500/20 bg-gradient-to-r from-yellow-500/5 to-transparent text-[#A1A1AA] text-sm leading-relaxed flex items-start gap-4">
        <AlertCircle className="text-yellow-500 shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="text-yellow-500 font-bold mb-1">DEMO MODE RESTRICTION</h4>
          <p>
            The current application is running in a strict Sandbox environment. No real-money orders can be submitted to any exchange.
          </p>
          <p className="mt-2 text-[#71717A]">
            The architecture supports hot-swapping the <span className="font-mono text-xs">PaperExchangeAdapter</span> for an authorized exchange API in the future without altering the automated decision pipeline.
          </p>
        </div>
      </div>
    </div>
  );
}
