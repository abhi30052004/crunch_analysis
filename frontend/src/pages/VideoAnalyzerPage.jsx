import { Play, UploadCloud, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VideoAnalyzerPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-3">
            Video Analyzer
            <span className="px-2 py-1 rounded bg-yellow-500/20 border border-yellow-500/30 text-yellow-500 text-[10px] uppercase font-bold tracking-wider">Prototype</span>
          </h1>
          <p className="text-[#A1A1AA] text-sm">Computer vision and race footage analysis.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-semibold transition-colors border border-white/10">
          <UploadCloud size={16} />
          Upload Race Video
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        <div className="lg:col-span-2 glass-card overflow-hidden flex flex-col relative min-h-[400px]">
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <div className="px-2 py-1 rounded bg-black/60 backdrop-blur text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Demo Preview
            </div>
          </div>
          
          <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
            {/* Mock video content */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599388372671-89e49c719e73?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 blur-[2px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            
            {/* Fake CV Bounding Boxes */}
            <motion.div 
              animate={{ x: [0, 50, 20], y: [0, -10, 5] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="absolute top-1/2 left-1/3 w-20 h-20 border-2 border-[#00FF9D] rounded-sm bg-[#00FF9D]/10 flex flex-col justify-end p-1"
            >
              <span className="text-[10px] bg-[#00FF9D] text-black font-bold px-1 w-max">ID: 04</span>
            </motion.div>
            <motion.div 
              animate={{ x: [0, -30, -10], y: [0, 15, -5] }}
              transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
              className="absolute top-[45%] left-1/2 w-24 h-24 border-2 border-yellow-400 rounded-sm bg-yellow-400/10 flex flex-col justify-end p-1"
            >
              <span className="text-[10px] bg-yellow-400 text-black font-bold px-1 w-max">ID: 07</span>
            </motion.div>

            <button className="z-10 w-16 h-16 rounded-full bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all">
              <Play size={24} className="text-white ml-1" fill="currentColor" />
            </button>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-black/60 backdrop-blur border border-white/10 text-sm font-medium text-white/80">
              Video Analysis — Coming Soon
            </div>
          </div>
          
          <div className="h-2 bg-white/10 relative">
            <div className="absolute top-0 left-0 h-full bg-[#00FF9D] w-1/3" />
          </div>
        </div>

        <div className="glass-card flex flex-col overflow-hidden h-full">
          <div className="p-4 border-b border-white/10 bg-white/[0.02]">
            <h3 className="font-semibold text-sm">Analysis Timeline</h3>
          </div>
          <div className="p-4 space-y-4 flex-1 overflow-y-auto">
            <div>
              <h4 className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider mb-3">Detected Events</h4>
              <div className="space-y-3 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                {[
                  { time: '00:04', event: 'Race Start' },
                  { time: '00:11', event: 'Horse Movement' },
                  { time: '00:18', event: 'Position Change' },
                  { time: '00:27', event: 'Final Stretch' },
                ].map((item, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white/20 bg-[#0D0F12] text-[#A1A1AA] text-[10px] font-bold z-10 mx-auto">
                      {i + 1}
                    </div>
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded bg-white/5 border border-white/10 flex justify-between items-center">
                      <span className="text-xs font-medium text-white">{item.event}</span>
                      <span className="text-xs text-[#71717A] font-mono">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10">
              <div className="flex items-start gap-3 text-[#A1A1AA]">
                <AlertCircle size={18} className="shrink-0 mt-0.5 text-yellow-500" />
                <div className="text-sm leading-relaxed space-y-2">
                  <p className="text-white font-medium mb-1">Prototype Preview</p>
                  <p>Race footage analysis is currently a prototype. Full computer vision processing will be enabled in a future version.</p>
                  <ul className="list-disc pl-4 space-y-1 text-xs mt-2 text-[#71717A]">
                    <li>Horse tracking & ID</li>
                    <li>Position detection</li>
                    <li>Speed estimation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
