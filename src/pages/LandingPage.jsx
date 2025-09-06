import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleVideoCall = () => {
    // Check if user is registered first
    const isRegistered = localStorage.getItem('userRegistered');
    if (!isRegistered) {
      navigate('/register');
      return;
    }
    
    // Go directly to video call after registration
    navigate('/call');
  };

  const handleTextChat = () => {
    // For now, redirect to video call (you can create text chat later)
    handleVideoCall();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">9,592+ online</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/boost')}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold flex items-center space-x-1 transition-colors"
          >
            <span>⚡</span>
            <span>Boost</span>
          </button>
          
          <button className="text-gray-600 hover:text-gray-800 p-2">
            ☀️
          </button>
          
          <button
            onClick={() => navigate('/settings')}
            className="text-gray-600 hover:text-gray-800 p-2"
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mr-3">
              <span className="text-2xl">⚡</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              VideoCall
            </h1>
          </div>
          
          <p className="text-lg text-gray-600 mb-8">
            Talk to Strangers on the Best Video Chat Platform
          </p>

          {/* Interest Input */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Type your interests..."
              className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
            <button className="ml-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg flex items-center space-x-1 transition-colors">
              <span>🌍</span>
              <span>Countries: ALL</span>
            </button>
          </div>

          {/* Chat Options */}
          <div className="flex items-center justify-center space-x-8">
            <button
              onClick={handleTextChat}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Text Chat
            </button>
            
            <span className="text-gray-600 font-semibold">OR</span>
            
            <button
              onClick={handleVideoCall}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Video Chat
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-6 text-sm text-gray-600">
          <a href="#" className="hover:text-gray-800">Discord</a>
          <a href="#" className="hover:text-gray-800">Rules</a>
          <a href="#" className="hover:text-gray-800">Support</a>
          <a href="#" className="hover:text-gray-800">Terms</a>
        </div>
      </div>
    </div>
  );
}
