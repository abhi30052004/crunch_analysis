import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Zap, Target } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00FF9D]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <nav className="flex items-center justify-between p-6 md:p-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-lg">
            RA
          </div>
          <span className="font-bold text-xl tracking-wide">RaceAI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-sm font-medium text-[#A1A1AA] hover:text-white transition-colors">
            Login
          </Link>
          <Link to="/dashboard" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-colors backdrop-blur-sm border border-white/10">
            Request Access
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-bold tracking-wider uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" /> Client Demo
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-white to-white/60 text-transparent bg-clip-text">
            Predict Smarter.<br />Find Racing Value.
          </h1>
          
          <p className="text-lg md:text-xl text-[#A1A1AA] mb-10 max-w-2xl mx-auto leading-relaxed">
            An AI-powered horse racing analytics platform for probability estimation and value discovery.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/dashboard" 
              className="flex items-center gap-2 px-8 py-4 bg-[#00FF9D] text-black rounded-full font-bold text-lg hover:bg-[#00FF9D]/90 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,157,0.3)]"
            >
              Explore Demo <ArrowRight size={20} />
            </Link>
            <Link 
              to="/dashboard" 
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-bold text-lg text-white hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              View AI Analysis
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-20 flex items-center justify-center gap-4 md:gap-8 text-[#71717A] text-sm md:text-base font-medium"
        >
          <div className="flex items-center gap-2"><Activity size={18} className="text-[#00FF9D]" /> Race Data</div>
          <ArrowRight size={16} className="opacity-30" />
          <div className="flex items-center gap-2"><Cpu size={18} className="text-[#00FF9D]" /> AI Model</div>
          <ArrowRight size={16} className="opacity-30" />
          <div className="flex items-center gap-2"><Target size={18} className="text-[#00FF9D]" /> Probability</div>
          <ArrowRight size={16} className="opacity-30" />
          <div className="flex items-center gap-2"><Zap size={18} className="text-yellow-400" /> Value</div>
        </motion.div>
      </main>
    </div>
  );
}

function Cpu({ size, className }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>;
}
