import { useState, useEffect } from 'react';
import RaceSelector from '../components/RaceSelector';
import PredictionTable from '../components/PredictionTable';
import HorseDrawer from '../components/HorseDrawer';
import { AlertCircle } from 'lucide-react';
import { getPredictions as fetchPredictions } from '../api/predictions';

export default function Predictions() {
  const [selectedRace, setSelectedRace] = useState(null);
  const [selectedHorse, setSelectedHorse] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchPredictions()
      .then(data => {
        if (mounted) {
          const resList = Array.isArray(data) ? data : [data];
          setPredictions(resList);
          const uniqueRaces = [...new Set(resList.map(item => item.race_ID))];
          if (uniqueRaces.length > 0 && !selectedRace) {
            setSelectedRace(uniqueRaces[0]);
          }
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        if (mounted) {
          setError(true);
          setLoading(false);
        }
      });
    
    return () => { mounted = false; };
  }, []);

  const horses = selectedRace ? predictions.filter(item => item.race_ID === selectedRace).sort((a,b) => b.value_edge - a.value_edge) : [];

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    fetchPredictions()
      .then(data => {
        const resList = Array.isArray(data) ? data : [data];
        setPredictions(resList);
        const uniqueRaces = [...new Set(resList.map(item => item.race_ID))];
        if (uniqueRaces.length > 0) {
          setSelectedRace(uniqueRaces[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  };

  const racesList = [...new Set(predictions.map(item => item.race_ID))].map(id => ({ id, time: '', track: '' }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Race Analysis</h1>
          <p className="text-[#A1A1AA] text-sm">Select a race to view AI predictions and value analysis.</p>
        </div>
        <RaceSelector onSelect={id => setSelectedRace(id)} selectedRace={selectedRace} races={racesList} />
      </div>

      {error ? (
        <div className="glass-card p-8 flex flex-col items-center justify-center text-center flex-1">
          <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-lg font-bold mb-2">Prediction Engine Offline</h2>
          <p className="text-[#A1A1AA] max-w-md mb-6">
            Unable to connect to the Horse Racing AI backend. Make sure the FastAPI server is running.
          </p>
          <div className="flex gap-4">
            <button onClick={handleRetry} className="px-6 py-2 bg-[#00FF9D] text-black hover:bg-[#00FF9D]/90 rounded-lg transition-colors font-bold shadow-[0_0_15px_rgba(0,255,157,0.2)]">
              Retry
            </button>
          </div>
        </div>
      ) : loading ? (
        <div className="glass-card flex-1 p-6 space-y-4">
          <div className="h-10 bg-white/5 rounded animate-pulse w-full mb-8"></div>
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-16 bg-white/5 rounded animate-pulse w-full"></div>
          ))}
        </div>
      ) : (
        <div className="glass-card flex-1 overflow-hidden flex flex-col">
          <PredictionTable horses={horses} onRowClick={setSelectedHorse} />
        </div>
      )}

      {selectedHorse && (
        <HorseDrawer horse={selectedHorse} onClose={() => setSelectedHorse(null)} />
      )}
    </div>
  );
}
