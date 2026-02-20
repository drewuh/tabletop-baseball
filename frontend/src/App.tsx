import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TeamSelectPage from './pages/TeamSelectPage';
import GamePage from './pages/GamePage';
import GameResultPage from './pages/GameResultPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TeamSelectPage />} />
        <Route path="/game/:gameId" element={<GamePage />} />
        <Route path="/game/:gameId/result" element={<GameResultPage />} />
      </Routes>
    </BrowserRouter>
  );
}
