import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    day: '',
    month: '',
    year: '',
    gender: ''
  });
  const [errors, setErrors] = useState({});
  const [isUnder18, setIsUnder18] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const calculateAge = (day, month, year) => {
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.day) newErrors.day = 'Day is required';
    if (!formData.month) newErrors.month = 'Month is required';
    if (!formData.year) newErrors.year = 'Year is required';
    if (!formData.gender) newErrors.gender = 'Please select your gender';
    
    // Validate date
    if (formData.day && formData.month && formData.year) {
      const day = parseInt(formData.day);
      const month = parseInt(formData.month);
      const year = parseInt(formData.year);
      
      if (day < 1 || day > 31) newErrors.day = 'Invalid day';
      if (month < 1 || month > 12) newErrors.month = 'Invalid month';
      if (year < 1900 || year > new Date().getFullYear()) newErrors.year = 'Invalid year';
      
      // Check if date is valid
      const date = new Date(year, month - 1, day);
      if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
        newErrors.day = 'Invalid date';
      }
      
      // Check age
      const age = calculateAge(day, month, year);
      if (age < 18) {
        setIsUnder18(true);
        return false;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Save to localStorage
    const userData = {
      ...formData,
      age: calculateAge(parseInt(formData.day), parseInt(formData.month), parseInt(formData.year)),
      onboardedAt: new Date().toISOString()
    };
    
    localStorage.setItem('userOnboarded', 'true');
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Set credentials/settings in localStorage
    localStorage.setItem('_gcl_ls', JSON.stringify({
      schema: "gcl",
      version: 1,
      gcl_ctr: {
          value: { value: 0, timeouts: 0, creationTimeMs: Date.now() },
          expires: Date.now() + 7776000000 // 90 days
      }
    }));
    localStorage.setItem('acknowledged', 'true');
    localStorage.setItem('fingerprint', 'febb78dd-628a-4e4f-a11b-8244446e77f7');
    localStorage.setItem('local_settings_cache', JSON.stringify({
      volume: { master: 100, output: 100 },
      autoRoll: { video: true, text: false },
      interests: { wait: 3, tags: [] },
      filters: { countries: ["us"], regions: [], sex: [], max_wait: 3 },
      autoMod: true,
      mobile: { swipeSensitivity: 0, swipeSkip: true },
      privacy: { hidden: false },
      profile: { sex: "m", looking_for: "a", dob: "1999-07-23" }
    }));
    localStorage.setItem('local_user_cache2', JSON.stringify({
      onboarded: true,
      created_at: Date.now(),
      id: 'febb78dd-628a-4e4f-a11b-8244446e77f7'
    }));
    localStorage.setItem('user-ip', '105.112.67.208');

    navigate('/matchmaking');
  };

  const handleBackToLanding = () => {
    navigate('/');
  };

  if (isUnder18) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Age Restriction</h2>
          <p className="text-gray-600 mb-6">
            Sorry, this service is only available for users who are 18 years or older.
          </p>
          <button
            onClick={handleBackToLanding}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            I understand
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to VideoCall</h2>
          <p className="text-gray-600">Please provide some basic information to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <select
                  value={formData.day}
                  onChange={(e) => handleInputChange('day', e.target.value)}
                  className={`w-full p-2 border rounded-md ${errors.day ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Day</option>
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                {errors.day && <p className="text-red-500 text-xs mt-1">{errors.day}</p>}
              </div>
              
              <div>
                <select
                  value={formData.month}
                  onChange={(e) => handleInputChange('month', e.target.value)}
                  className={`w-full p-2 border rounded-md ${errors.month ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Month</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
                {errors.month && <p className="text-red-500 text-xs mt-1">{errors.month}</p>}
              </div>
              
              <div>
                <select
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  className={`w-full p-2 border rounded-md ${errors.year ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Year</option>
                  {Array.from({ length: 100 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
                {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
              </div>
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Male', 'Female', 'Other', 'Prefer not to say'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleInputChange('gender', option)}
                  className={`p-3 border rounded-md text-sm transition-colors ${
                    formData.gender === option
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
          </div>

          {/* Age Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This service is only available for users who are 18 years or older.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition-colors font-medium"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
