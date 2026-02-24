import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import TeamSelectPage from './pages/TeamSelectPage';
import GamePage from './pages/GamePage';
import GameResultPage from './pages/GameResultPage';
import StatsPage from './pages/StatsPage';
import HistoryPage from './pages/HistoryPage';
import EditorPage from './pages/EditorPage';
import TeamFormPage from './pages/TeamFormPage';
import TeamEditorDetailPage from './pages/TeamEditorDetailPage';
import PlayerFormPage from './pages/PlayerFormPage';

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
            <Route path="/stats"                       element={<StatsPage />} />
            <Route path="/history"                     element={<HistoryPage />} />
            <Route path="/editor"                      element={<EditorPage />} />
            <Route path="/editor/teams/new"            element={<TeamFormPage />} />
            <Route path="/editor/teams/:id"            element={<TeamEditorDetailPage />} />
            <Route path="/editor/teams/:id/edit"       element={<TeamFormPage />} />
            <Route path="/editor/players/new"          element={<PlayerFormPage />} />
            <Route path="/editor/players/:id"          element={<PlayerFormPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
