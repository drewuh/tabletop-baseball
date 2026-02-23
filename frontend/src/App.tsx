import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import TeamSelectPage from './pages/TeamSelectPage';
import GamePage from './pages/GamePage';
import GameResultPage from './pages/GameResultPage';
import StatsPage from './pages/StatsPage';
import HistoryPage from './pages/HistoryPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-950 flex flex-col">
        <NavBar />
        <div className="flex-1 flex flex-col">
          <Routes>
            <Route path="/"                    element={<TeamSelectPage />} />
            <Route path="/game/:gameId"        element={<GamePage />} />
            <Route path="/game/:gameId/result" element={<GameResultPage />} />
            <Route path="/stats"               element={<StatsPage />} />
            <Route path="/history"             element={<HistoryPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
