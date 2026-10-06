import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function RaceSelector({ onSelect, selectedRace, races = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-50">
      <label className="block text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-2">Select Race</label>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-[240px] flex items-center justify-between px-4 py-2.5 bg-[#0D0F12] border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#00FF9D]/50"
      >
        <span className={selectedRace ? 'text-white' : 'text-[#A1A1AA]'}>
          {selectedRace || 'Choose a race...'}
        </span>
        <ChevronDown size={16} className={`text-[#A1A1AA] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[240px] bg-[#0D0F12] border border-white/10 rounded-lg shadow-xl overflow-hidden max-h-64 overflow-y-auto">
          {races.map((race) => (
            <button
              key={race.id}
              onClick={() => {
                onSelect(race.id);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-3 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors flex flex-col gap-1"
            >
              <span className="text-sm font-medium text-white">{race.id}</span>
              <span className="text-xs text-[#A1A1AA]">Race Data Available</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
