import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MatchmakingService from '../services/MatchmakingService';

export default function MatchmakingPage() {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [userStatus, setUserStatus] = useState({ coins: 0, hasBoost: false, canFilter: false });
  const [preferences, setPreferences] = useState({
    ageRange: [20, 30],
    gender: 'Any'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    MatchmakingService.setCurrentUser(userData);
    setUserStatus(MatchmakingService.getUserStatus());
  }, []);

  const handleStartRandomMatch = async () => {
    setIsSearching(true);
    
    try {
      const result = await MatchmakingService.findMatch();
      
      if (result.success) {
        // Store match data and navigate to call
        localStorage.setItem('currentMatch', JSON.stringify(result.match));
        navigate('/call');
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
      const result = await MatchmakingService.findMatch(preferences);
      
      if (result.success) {
        // Store match data and navigate to call
        localStorage.setItem('currentMatch', JSON.stringify(result.match));
        navigate('/call');
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Error finding match. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handlePurchaseBoost = () => {
    if (MatchmakingService.purchaseBoost()) {
      setUserStatus(MatchmakingService.getUserStatus());
      alert('Boost purchased! You now have unlimited filtering for 24 hours.');
    } else {
      alert('Not enough coins! You need 50 coins to purchase a boost.');
    }
  };

  const handleAddCoins = () => {
    MatchmakingService.addCoins(100); // Give 100 coins for demo
    setUserStatus(MatchmakingService.getUserStatus());
    alert('Added 100 coins!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Find Your Match</h2>
          <p className="text-gray-600">Connect with random people or use filters</p>
        </div>

        {/* User Status */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Coins: <span className="font-semibold text-yellow-600">{userStatus.coins}</span></p>
              <p className="text-sm text-gray-600">Boost: <span className={`font-semibold ${userStatus.hasBoost ? 'text-green-600' : 'text-gray-400'}`}>
                {userStatus.hasBoost ? 'Active' : 'Inactive'}
              </span></p>
            </div>
            <div className="space-x-2">
              <button
                onClick={handleAddCoins}
                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
              >
                +100 Coins
              </button>
              {!userStatus.hasBoost && (
                <button
                  onClick={handlePurchaseBoost}
                  className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
                >
                  Boost (50 coins)
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Random Match Button */}
        <button
          onClick={handleStartRandomMatch}
          disabled={isSearching}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium mb-4 disabled:opacity-50"
        >
          {isSearching ? 'Finding Match...' : '🎲 Random Match'}
        </button>

        {/* Filtered Match Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          disabled={!userStatus.canFilter}
          className={`w-full py-3 rounded-lg transition-colors font-medium mb-4 ${
            userStatus.canFilter 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {userStatus.canFilter ? '🎯 Filtered Match' : '🎯 Filtered Match (10 coins)'}
        </button>

        {/* Filters Panel */}
        {showFilters && userStatus.canFilter && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-gray-800 mb-3">Match Preferences</h3>
            
            {/* Age Range */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age Range: {preferences.ageRange[0]} - {preferences.ageRange[1]}
              </label>
              <div className="flex space-x-2">
                <input
                  type="range"
                  min="18"
                  max="50"
                  value={preferences.ageRange[0]}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    ageRange: [parseInt(e.target.value), prev.ageRange[1]]
                  }))}
                  className="flex-1"
                />
                <input
                  type="range"
                  min="18"
                  max="50"
                  value={preferences.ageRange[1]}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    ageRange: [prev.ageRange[0], parseInt(e.target.value)]
                  }))}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Gender */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                value={preferences.gender}
                onChange={(e) => setPreferences(prev => ({ ...prev, gender: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="Any">Any</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <button
              onClick={handleStartFilteredMatch}
              disabled={isSearching}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
            >
              {isSearching ? 'Finding Match...' : 'Find Filtered Match'}
            </button>
          </div>
        )}

        {/* Back Button */}
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
  );
}
