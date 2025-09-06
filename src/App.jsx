import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage';
import RegistrationPage from './pages/RegistrationPage';
import OnboardingPage from './pages/OnboardingPage';
import MatchmakingPage from './pages/MatchmakingPage';
import CallPage from './pages/CallPage';
import BoostPage from './pages/BoostPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/matchmaking" element={<MatchmakingPage />} />
          <Route path="/call" element={<CallPage />} />
          <Route path="/boost" element={<BoostPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
