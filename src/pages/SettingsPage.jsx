import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    ageRange: [18, 50],
    gender: 'Any',
    country: 'All',
    interests: '',
    language: 'English',
    showOnlineOnly: true,
    showVerifiedOnly: false
  });

  useEffect(() => {
    // Check if user is registered
    const isRegistered = localStorage.getItem('userRegistered');
    if (!isRegistered) {
      navigate('/register');
      return;
    }
    
    // Load saved settings
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, [navigate]);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
  };

  const handleSaveSettings = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
    navigate('/');
  };

  const handleResetSettings = () => {
    const defaultSettings = {
      ageRange: [18, 50],
      gender: 'Any',
      country: 'All',
      interests: '',
      language: 'English',
      showOnlineOnly: true,
      showVerifiedOnly: false
    };
    setSettings(defaultSettings);
    localStorage.setItem('userSettings', JSON.stringify(defaultSettings));
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
          <h1 className="text-xl font-semibold text-gray-800">Settings & Filters</h1>
          <div></div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Age Range */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Age Range</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age: {settings.ageRange[0]} - {settings.ageRange[1]}
              </label>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">Min Age</label>
                  <input
                    type="range"
                    min="18"
                    max="50"
                    value={settings.ageRange[0]}
                    onChange={(e) => handleSettingChange('ageRange', [parseInt(e.target.value), settings.ageRange[1]])}
                    className="w-full"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">Max Age</label>
                  <input
                    type="range"
                    min="18"
                    max="50"
                    value={settings.ageRange[1]}
                    onChange={(e) => handleSettingChange('ageRange', [settings.ageRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gender Preference */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Gender Preference</h3>
          <div className="grid grid-cols-3 gap-3">
            {['Any', 'Male', 'Female'].map((gender) => (
              <button
                key={gender}
                onClick={() => handleSettingChange('gender', gender)}
                className={`p-3 border rounded-lg text-sm transition-colors ${
                  settings.gender === gender
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>

        {/* Country */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Country</h3>
          <select
            value={settings.country}
            onChange={(e) => handleSettingChange('country', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Countries</option>
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="ES">Spain</option>
            <option value="IT">Italy</option>
            <option value="JP">Japan</option>
            <option value="BR">Brazil</option>
            <option value="IN">India</option>
          </select>
        </div>

        {/* Interests */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Interests</h3>
          <input
            type="text"
            value={settings.interests}
            onChange={(e) => handleSettingChange('interests', e.target.value)}
            placeholder="Type your interests (e.g., music, gaming, travel)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Language */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Language</h3>
          <select
            value={settings.language}
            onChange={(e) => handleSettingChange('language', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Italian">Italian</option>
            <option value="Portuguese">Portuguese</option>
            <option value="Japanese">Japanese</option>
            <option value="Chinese">Chinese</option>
            <option value="Korean">Korean</option>
            <option value="Russian">Russian</option>
          </select>
        </div>

        {/* Additional Filters */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Filters</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Show Online Only</p>
                <p className="text-sm text-gray-600">Only match with users who are currently online</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showOnlineOnly}
                  onChange={(e) => handleSettingChange('showOnlineOnly', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Show Verified Only</p>
                <p className="text-sm text-gray-600">Only match with verified users</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showVerifiedOnly}
                  onChange={(e) => handleSettingChange('showVerifiedOnly', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleSaveSettings}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Save Settings
          </button>
          <button
            onClick={handleResetSettings}
            className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
          >
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
}
