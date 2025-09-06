import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoRoom from '../components/VideoRoom';
import MatchmakingService from '../services/MatchmakingService';

export default function CallPage() {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [userStatus, setUserStatus] = useState({ coins: 0, hasBoost: false, canFilter: false });
  const [showMatchmaking, setShowMatchmaking] = useState(true);
  const [currentMatch, setCurrentMatch] = useState(null);

  useEffect(() => {
    // Check if user is registered
    const isRegistered = localStorage.getItem('userRegistered');
    if (!isRegistered) {
      navigate('/register');
      return;
    }

    // Get user data and status
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    MatchmakingService.setCurrentUser(userData);
    setUserStatus(MatchmakingService.getUserStatus());

    // Check if there's already a match
    const existingMatch = localStorage.getItem('currentMatch');
    if (existingMatch) {
      setCurrentMatch(JSON.parse(existingMatch));
      setShowMatchmaking(false);
    }
  }, [navigate]);

  const handleStartRandomMatch = async () => {
    setIsSearching(true);
    
    try {
      const result = await MatchmakingService.findMatch();
      
      if (result.success) {
        setCurrentMatch(result.match);
        setShowMatchmaking(false);
        localStorage.setItem('currentMatch', JSON.stringify(result.match));
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Error finding match. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleStartFilteredMatch = async () => {
    setIsSearching(true);
    
    try {
      // Get user settings for filtering
      const userSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
      const preferences = {
        ageRange: userSettings.ageRange || [18, 50],
        gender: userSettings.gender || 'Any'
      };
      
      const result = await MatchmakingService.findMatch(preferences);
      
      if (result.success) {
        setCurrentMatch(result.match);
        setShowMatchmaking(false);
        localStorage.setItem('currentMatch', JSON.stringify(result.match));
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Error finding match. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleEndCall = () => {
    localStorage.removeItem('currentMatch');
    setCurrentMatch(null);
    setShowMatchmaking(true);
    navigate('/');
  };

  const handleNewMatch = () => {
    localStorage.removeItem('currentMatch');
    setCurrentMatch(null);
    setShowMatchmaking(true);
  };

  if (showMatchmaking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
        {/* Top Bar */}
        <div className="flex justify-between items-center p-4 bg-black bg-opacity-20">
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm">9,592+ online</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/boost')}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold flex items-center space-x-1 transition-colors"
            >
              <span>⚡</span>
              <span>Boost</span>
            </button>
            
            <button
              onClick={() => navigate('/settings')}
              className="text-white hover:text-gray-300 p-2"
            >
              ⚙️
            </button>
          </div>
        </div>

        {/* Matchmaking Interface */}
        <div className="flex items-center justify-center h-screen px-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Find Your Match</h2>
            
            {/* User Status */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Coins: <span className="font-semibold text-yellow-600">{userStatus.coins}</span></p>
                  <p className="text-sm text-gray-600">Boost: <span className={`font-semibold ${userStatus.hasBoost ? 'text-green-600' : 'text-gray-400'}`}>
                    {userStatus.hasBoost ? 'Active' : 'Inactive'}
                  </span></p>
                </div>
                <button
                  onClick={() => {
                    MatchmakingService.addCoins(100);
                    setUserStatus(MatchmakingService.getUserStatus());
                  }}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                >
                  +100 Coins
                </button>
              </div>
            </div>

            {/* Match Options */}
            <button
              onClick={handleStartRandomMatch}
              disabled={isSearching}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium mb-4 disabled:opacity-50"
            >
              {isSearching ? 'Finding Match...' : '🎲 Random Match'}
            </button>

            <button
              onClick={handleStartFilteredMatch}
              disabled={!userStatus.canFilter || isSearching}
              className={`w-full py-3 rounded-lg transition-colors font-medium mb-4 ${
                userStatus.canFilter 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {userStatus.canFilter ? '🎯 Filtered Match' : '🎯 Filtered Match (10 coins)'}
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to Home
            </button>

            {/* Search Animation */}
            {isSearching && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Finding Your Match</h3>
                  <p className="text-gray-600">Please wait while we connect you with someone...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Video Call Interface
  return (
    <div className="h-screen bg-black">
      {/* Top Bar for Video Call */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-3 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center space-x-4">
          <span className="text-white text-sm">Connected with {currentMatch?.name}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/boost')}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded-lg font-semibold flex items-center space-x-1 transition-colors text-sm"
          >
            <span>⚡</span>
            <span>Boost</span>
          </button>
          
          <button
            onClick={() => navigate('/settings')}
            className="text-white hover:text-gray-300 p-2"
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Video Room */}
      <VideoRoom onEnd={handleEndCall} />

      {/* Bottom Controls */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex items-center justify-between">
        <button
          onClick={handleNewMatch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg"
        >
          New Match
        </button>
        {/* <button
          onClick={handleEndCall}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-lg"
        >
          End Call
        </button> */}
      </div>
    </div>
  );
}
