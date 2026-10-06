import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Predictions from './pages/Predictions';
import Analytics from './pages/Analytics';
import PaperBetting from './pages/PaperBetting';
import Exchange from './pages/Exchange';
import Automation from './pages/Automation';
import VideoAnalyzerPage from './pages/VideoAnalyzerPage';
import DataExplorer from './pages/DataExplorer';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] flex flex-col font-sans">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/*" element={
          <div className="flex flex-1 h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col relative overflow-hidden">
              <Navbar />
              <main className="flex-1 overflow-y-auto p-6 relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/predictions" element={<Predictions />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/paper-betting" element={<PaperBetting />} />
                  <Route path="/exchange" element={<Exchange />} />
                  <Route path="/automation" element={<Automation />} />
                  <Route path="/video" element={<VideoAnalyzerPage />} />
                  <Route path="/data" element={<DataExplorer />} />
                </Routes>
              </main>
            </div>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;
