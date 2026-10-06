import { useState, useEffect } from 'react';
import { getPredictions } from '../api/predictions';
import { motion } from 'framer-motion';

export default function ApiStatus() {
  const [status, setStatus] = useState('CONNECTING'); // 'CONNECTING', 'CONNECTED', 'OFFLINE'

  useEffect(() => {
    let mounted = true;
    
    const checkStatus = async () => {
      try {
        await getPredictions();
        if (mounted) setStatus('CONNECTED');
      } catch (e) {
        if (mounted) setStatus('OFFLINE');
      }
    };
    
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30s
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <motion.span 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border flex items-center gap-1.5 ${
        status === 'CONNECTED' 
          ? 'bg-[#00FF9D]/10 text-[#00FF9D] border-[#00FF9D]/20' 
          : status === 'OFFLINE'
          ? 'bg-red-500/10 text-red-500 border-red-500/20'
          : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === 'CONNECTED' ? 'bg-[#00FF9D]' : status === 'OFFLINE' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'
      }`} />
      API {status}
    </motion.span>
  );
}
