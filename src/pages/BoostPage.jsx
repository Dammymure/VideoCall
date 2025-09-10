import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const COIN_PACKAGES = [
  { amount: 4, price: '$2.99', minutes: 4 },
  { amount: 10, price: '$4.99', minutes: 10 },
  { amount: 15, price: '$9.99', minutes: 15 },
  { amount: 30, price: '$19.99', minutes: 30 }
];

export default function BoostPage() {
  const navigate = useNavigate();
  const [userCoins, setUserCoins] = useState(0);

  useEffect(() => {
    const isRegistered = localStorage.getItem('userRegistered');
    if (!isRegistered) {
      navigate('/register');
      return;
    }
    const coins = parseInt(localStorage.getItem('userCoins') || '0');
    setUserCoins(coins);
  }, [navigate]);

  const handleAddCoins = (amount) => {
    const newCoins = userCoins + amount;
    setUserCoins(newCoins);
    localStorage.setItem('userCoins', newCoins.toString());
    alert(`You bought ${amount} minutes!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header at the very top */}
      <div className="bg-white border-b border-gray-200 p-4 w-full flex items-center justify-between fixed top-0 left-0 right-0 z-10">
        <button
          onClick={() => navigate('/')}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Back
        </button>
        <h1 className="text-xl font-semibold text-gray-800">Buy Minutes</h1>
        <span className="text-sm text-gray-600">Minutes: {userCoins}</span>
      </div>

      {/* Add padding-top to avoid overlap with fixed header */}
      <div className="flex-1 w-full max-w-3xl flex justify-center items-center mt-32 mx-auto">
        <div className="grid grid-cols-4 gap-6 w-full">
          {COIN_PACKAGES.map((pkg, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center flex flex-col items-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{pkg.minutes}</div>
              <div className="text-sm text-gray-600 mb-2">minutes</div>
              <div className="text-lg font-semibold text-gray-800 mb-2">{pkg.price}</div>
              <button
                onClick={() => handleAddCoins(pkg.minutes)}
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
