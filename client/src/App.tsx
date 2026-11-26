import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from './components/ui/Toast';
import { LandingPage } from './pages/LandingPage';
import { HowToPlayPage } from './pages/HowToPlayPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Lazy or direct loaded pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { PlayPage } from './pages/PlayPage';
import { SoloPage } from './pages/SoloPage';
import { LobbyPage } from './pages/LobbyPage';
import { RoomPage } from './pages/RoomPage';
import { TournamentsPage } from './pages/TournamentsPage';
import { TournamentDetailPage } from './pages/TournamentDetailPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { AchievementsPage } from './pages/AchievementsPage';
import { MatchHistoryPage } from './pages/MatchHistoryPage';

export const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/how-to-play" element={<HowToPlayPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected / Game routes */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/play" element={<PlayPage />} />
        <Route path="/solo" element={<SoloPage />} />
        <Route path="/lobby" element={<LobbyPage />} />
        <Route path="/room" element={<RoomPage />} />
        <Route path="/room/:code" element={<RoomPage />} />
        <Route path="/tournaments" element={<TournamentsPage />} />
        <Route path="/tournaments/:id" element={<TournamentDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/history" element={<MatchHistoryPage />} />

        {/* 404 fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <ToastContainer />
    </>
  );
};

export default App;
