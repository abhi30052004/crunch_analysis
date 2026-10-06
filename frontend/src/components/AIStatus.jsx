import { motion } from 'framer-motion';
import { Cpu, CheckCircle2, CircleDashed } from 'lucide-react';
import { useState } from 'react';

export default function AIStatus() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6 flex flex-col h-full"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#00FF9D]/10 text-[#00FF9D] flex items-center justify-center border border-[#00FF9D]/20">
              <Cpu size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg tracking-tight">AI Prediction Engine</h3>
              <p className="text-sm text-[#A1A1AA]">TabPFN Pretrained Tabular AI</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase font-bold tracking-wider text-[#A1A1AA] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Demo Model Active
          </span>
        </div>

        <div className="space-y-3 mb-6 flex-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#F5F5F5]">Feature Processing</span>
            <CheckCircle2 size={16} className="text-[#00FF9D]" />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#F5F5F5]">Race Analysis</span>
            <CheckCircle2 size={16} className="text-[#00FF9D]" />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#F5F5F5]">Probability Estimation</span>
            <CheckCircle2 size={16} className="text-[#00FF9D]" />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#F5F5F5]">Value Detection</span>
            <CheckCircle2 size={16} className="text-[#00FF9D]" />
          </div>
          <div className="flex items-center justify-between text-sm pt-2 border-t border-white/5">
            <span className="text-[#A1A1AA]">Live Model Inference</span>
            <span className="flex items-center gap-1.5 text-xs text-yellow-500/80 font-medium">
              <CircleDashed size={14} className="animate-[spin_4s_linear_infinite]" /> Prototype
            </span>
          </div>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium"
        >
          View Model Details
        </button>
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0D0F12] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
          >
            <h3 className="text-xl font-bold mb-4">Model Details</h3>
            <p className="text-[#A1A1AA] text-sm leading-relaxed mb-4">
              This demonstration uses a pretrained tabular AI approach combined with racing and market features to demonstrate probability and value analysis.
            </p>
            <p className="text-[#A1A1AA] text-sm leading-relaxed mb-6">
              Full production inference infrastructure is planned for future deployment.
            </p>
            <div className="flex justify-end">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-[#00FF9D] text-black font-semibold rounded-lg hover:bg-[#00FF9D]/90 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
