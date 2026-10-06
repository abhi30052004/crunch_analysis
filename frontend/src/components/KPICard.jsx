import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function KPICard({ title, value, icon: Icon, trend, trendValue, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -2 }}
      className="glass-card p-6 group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-[#A1A1AA] text-sm font-medium">{title}</h3>
        <div className="p-2 rounded-lg bg-white/5 text-[#A1A1AA] group-hover:text-[#00FF9D] transition-colors">
          <Icon size={18} />
        </div>
      </div>
      <div className="flex items-baseline gap-3 relative z-10">
        <motion.span 
          className="text-3xl font-bold text-white tracking-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: delay + 0.2 }}
        >
          {value}
        </motion.span>
        {trend && (
          <span className={`flex items-center text-xs font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {trendValue}
          </span>
        )}
      </div>
      <div className="absolute -inset-px rounded-xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
}
