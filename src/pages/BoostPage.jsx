import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MatchmakingService from '../services/MatchmakingService';

export default function BoostPage() {
  const navigate = useNavigate();
  const [userCoins, setUserCoins] = useState(0);
  const [userBoost, setUserBoost] = useState(false);

  useEffect(() => {
    // Check if user is registered
    const isRegistered = localStorage.getItem('userRegistered');
    if (!isRegistered) {
      navigate('/register');
      return;
    }
    
    const coins = parseInt(localStorage.getItem('userCoins') || '0');
    const boost = localStorage.getItem('userBoost') === 'true';
    setUserCoins(coins);
    setUserBoost(boost);
  }, [navigate]);

  const boostOptions = [
    {
      id: 'basic',
      name: 'Basic Boost',
      price: 50,
      duration: '24 hours',
      features: ['Unlimited filtering', 'Priority matching', 'Skip waiting time'],
      icon: '⚡',
      color: 'bg-yellow-400'
    },
    {
      id: 'premium',
      name: 'Premium Boost',
      price: 100,
      duration: '7 days',
      features: ['All Basic features', 'Advanced filters', 'Profile visibility boost', 'Exclusive matches'],
      icon: '🔥',
      color: 'bg-orange-500'
    },
    {
      id: 'vip',
      name: 'VIP Boost',
      price: 200,
      duration: '30 days',
      features: ['All Premium features', 'VIP badge', 'Instant matches', 'Custom preferences', 'Priority support'],
      icon: '👑',
      color: 'bg-purple-600'
    }
  ];

  const handlePurchaseBoost = (boostType) => {
    const boost = boostOptions.find(b => b.id === boostType);
    if (!boost) return;

    if (userCoins >= boost.price) {
      // Deduct coins
      const newCoins = userCoins - boost.price;
      setUserCoins(newCoins);
      localStorage.setItem('userCoins', newCoins.toString());
      
      // Activate boost
      setUserBoost(true);
      localStorage.setItem('userBoost', 'true');
      localStorage.setItem('boostType', boostType);
      localStorage.setItem('boostExpiry', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());
      
      alert(`${boost.name} activated! You now have unlimited filtering for ${boost.duration}.`);
    } else {
      alert(`Not enough coins! You need ${boost.price} coins to purchase ${boost.name}.`);
    }
  };

  const handleAddCoins = (amount) => {
    const newCoins = userCoins + amount;
    setUserCoins(newCoins);
    localStorage.setItem('userCoins', newCoins.toString());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Boost Options</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Coins: {userCoins}</span>
            <button
              onClick={() => handleAddCoins(100)}
              className="bg-yellow-400 text-black px-3 py-1 rounded text-sm hover:bg-yellow-500"
            >
              +100
            </button>
          </div>
        </div>
      </div>

      {/* Current Status */}
      {userBoost && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 m-4">
          <div className="flex items-center">
            <span className="text-green-400 text-xl mr-2">✅</span>
            <div>
              <p className="text-green-800 font-semibold">Boost Active!</p>
              <p className="text-green-600 text-sm">You have unlimited filtering and priority matching.</p>
            </div>
          </div>
        </div>
      )}

      {/* Boost Options */}
      <div className="p-4 space-y-4">
        {boostOptions.map((boost) => (
          <div key={boost.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 ${boost.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                  {boost.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{boost.name}</h3>
                  <p className="text-sm text-gray-600">{boost.duration}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-800">{boost.price}</p>
                <p className="text-sm text-gray-600">coins</p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">Features:</h4>
              <ul className="space-y-1">
                {boost.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handlePurchaseBoost(boost.id)}
              disabled={userCoins < boost.price || userBoost}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                userCoins >= boost.price && !userBoost
                  ? `${boost.color} text-white hover:opacity-90`
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {userCoins >= boost.price 
                ? (userBoost ? 'Already Active' : `Purchase for ${boost.price} coins`)
                : `Need ${boost.price - userCoins} more coins`
              }
            </button>
          </div>
        ))}
      </div>

      {/* Coin Packages */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Buy More Coins</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { amount: 50, price: '$2.99', bonus: '' },
            { amount: 100, price: '$4.99', bonus: '+10 bonus' },
            { amount: 250, price: '$9.99', bonus: '+50 bonus' },
            { amount: 500, price: '$19.99', bonus: '+150 bonus' }
          ].map((coinPackage, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">{coinPackage.amount}</div>
              <div className="text-sm text-gray-600 mb-1">coins</div>
              <div className="text-lg font-semibold text-gray-800 mb-1">{coinPackage.price}</div>
              {coinPackage.bonus && (
                <div className="text-xs text-green-600 font-semibold">{coinPackage.bonus}</div>
              )}
              <button
                onClick={() => handleAddCoins(coinPackage.amount)}
                className="w-full mt-3 bg-yellow-400 text-black py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
