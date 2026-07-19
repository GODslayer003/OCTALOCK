import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import SoloRankings from './pages/SoloRankings';
import ClubRankings from './pages/ClubRankings';
import HallOfChampions from './pages/HallOfChampions';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminPlayers from './pages/AdminPlayers';
import AdminClubs from './pages/AdminClubs';
import AdminMatches from './pages/AdminMatches';
import AdminSeasons from './pages/AdminSeasons';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes under MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="solo-cup" element={<SoloRankings />} />
          <Route path="club-cup" element={<ClubRankings />} />
          <Route path="hall-of-champions" element={<HallOfChampions />} />
          <Route path="admin/login" element={<AdminLogin />} />
        </Route>

        {/* Admin routes under AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="players" element={<AdminPlayers />} />
          <Route path="clubs" element={<AdminClubs />} />
          <Route path="matches" element={<AdminMatches />} />
          <Route path="seasons" element={<AdminSeasons />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
