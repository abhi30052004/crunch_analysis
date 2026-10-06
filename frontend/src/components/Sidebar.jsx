import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Target, Activity, Video, Database, Settings, CircleDollarSign, PlugZap, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const links = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/predictions', label: 'Predictions', icon: Target },
    { to: '/analytics', label: 'Analytics', icon: Activity },
    { to: '/paper-betting', label: 'Paper Betting', icon: CircleDollarSign },
    { to: '/exchange', label: 'Exchange', icon: PlugZap },
    { to: '/automation', label: 'Automation Engine', icon: Cpu },
    { to: '/video', label: 'Video Analyzer', icon: Video, badge: 'PROTOTYPE' },
    { to: '/data', label: 'Data Explorer', icon: Database },
  ];

  return (
    <aside className="w-64 bg-[#08090B] border-r border-white/10 hidden md:flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-lg text-white">
            RA
          </div>
          <div>
            <h1 className="font-bold text-white tracking-wide">RaceAI</h1>
            <p className="text-xs text-[#71717A]">Prediction Intelligence</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-[#00FF9D]/10 text-[#00FF9D]' : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <link.icon size={18} />
              <span className="font-medium text-sm">{link.label}</span>
            </div>
            {link.badge && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-white/10 text-white/60">
                {link.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 space-y-4">
        <div className="glass-card p-4 space-y-3">
          <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">System Status</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#A1A1AA]">Data Stream</span>
              <span className="flex items-center gap-1.5 text-xs text-[#00FF9D]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-pulse" /> Live
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#A1A1AA]">Model API</span>
              <span className="flex items-center gap-1.5 text-xs text-white/50">
                <span className="w-1.5 h-1.5 rounded-full bg-white/50" /> Demo
              </span>
            </div>
          </div>
        </div>
        <button className="flex items-center gap-3 px-4 py-3 text-[#A1A1AA] hover:text-white w-full rounded-lg transition-colors">
          <Settings size={18} />
          <span className="font-medium text-sm">Settings</span>
        </button>
      </div>
    </aside>
  );
}
