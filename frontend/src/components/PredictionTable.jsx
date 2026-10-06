import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PredictionTable({ horses, onRowClick }) {
  if (!horses || horses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <p className="text-[#A1A1AA] text-lg font-medium">No race selected</p>
        <p className="text-[#71717A] text-sm mt-2">Select a race to view AI probability and value analysis.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b border-white/10 text-xs text-[#A1A1AA] uppercase tracking-wider">
            <th className="py-4 px-4 font-semibold sticky left-0 bg-[#0D0F12]">Horse</th>
            <th className="py-4 px-4 font-semibold text-right">Odds</th>
            <th className="py-4 px-4 font-semibold text-right">Market %</th>
            <th className="py-4 px-4 font-semibold text-right">AI %</th>
            <th className="py-4 px-4 font-semibold text-right">Value</th>
            <th className="py-4 px-4 font-semibold text-center">Signal</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {horses.map((horse, idx) => (
              <motion.tr
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                key={idx}
                onClick={() => onRowClick(horse)}
                className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <td className="py-4 px-4 font-medium sticky left-0 bg-[#0D0F12] group-hover:bg-[#15171A] transition-colors">
                  {horse.horse_name}
                </td>
                <td className="py-4 px-4 text-right text-[#A1A1AA]">{horse.dec.toFixed(2)}</td>
                <td className="py-4 px-4 text-right text-[#A1A1AA]">{(horse.market_probability * 100).toFixed(2)}%</td>
                <td className="py-4 px-4 text-right font-medium">{(horse.demo_probability * 100).toFixed(2)}%</td>
                <td className={`py-4 px-4 text-right font-bold ${horse.value_edge > 0 ? 'text-[#00FF9D]' : 'text-red-400'}`}>
                  {horse.value_edge > 0 ? '+' : ''}{(horse.value_edge * 100).toFixed(2)}%
                </td>
                <td className="py-4 px-4">
                  <div className="flex justify-center">
                    <SignalBadge signal={horse.recommendation} />
                  </div>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}

function SignalBadge({ signal }) {
  const styles = {
    BET: 'bg-[#00FF9D]/10 text-[#00FF9D] border-[#00FF9D]/20',
    WATCH: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    SKIP: 'bg-white/5 text-[#A1A1AA] border-white/10',
  };

  return (
    <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${styles[signal] || styles.SKIP}`}>
      {signal}
    </span>
  );
}
