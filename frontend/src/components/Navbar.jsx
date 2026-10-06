import ApiStatus from './ApiStatus';

export default function Navbar() {
  return (
    <header className="h-16 border-b border-white/10 bg-[#08090B]/80 backdrop-blur flex items-center justify-between px-6 z-10">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">Horse Racing Intelligence</h2>
        <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-500 text-[10px] font-bold tracking-wider uppercase border border-yellow-500/20 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
          Demo Environment
        </span>
        <ApiStatus />
      </div>
      <div className="flex items-center gap-4 text-sm text-[#A1A1AA]">
        <span>AI-assisted race analysis & probability estimation.</span>
      </div>
    </header>
  );
}
