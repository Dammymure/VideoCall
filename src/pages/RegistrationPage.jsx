import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    gender: 'Male',
    lookingFor: '',
    month: '',
    day: '',
    year: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});

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
    
    if (!formData.lookingFor) newErrors.lookingFor = 'Please select who you are looking to meet';
    if (!formData.month) newErrors.month = 'Month is required';
    if (!formData.day) newErrors.day = 'Day is required';
    if (!formData.year) newErrors.year = 'Year is required';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';
    
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
        newErrors.year = 'You must be at least 18 years old';
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
    
    // Save registration data
    const userData = {
      gender: formData.gender,
      lookingFor: formData.lookingFor,
      age: calculateAge(parseInt(formData.day), parseInt(formData.month), parseInt(formData.year)),
      dateOfBirth: {
        day: parseInt(formData.day),
        month: parseInt(formData.month),
        year: parseInt(formData.year)
      },
      registeredAt: new Date().toISOString()
    };
    
    localStorage.setItem('userRegistered', 'true');
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('userOnboarded', 'true'); // Mark as onboarded too
    
    // Navigate to matchmaking
    navigate('/matchmaking');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 right-4 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold transition-colors"
      >
        Back
      </button>

      {/* Registration Form */}
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">Before You Start</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* What Best Describes You? */}
          <div>
            <div className="flex items-center mb-3">
              <span className="text-pink-500 text-lg mr-2">❓</span>
              <h3 className="text-lg font-semibold text-gray-800">What Best Describes You?</h3>
            </div>
            <div className="space-y-2">
              {['Male', 'Female', 'Other'].map((option) => (
                <label key={option} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={option}
                    checked={formData.gender === option}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-4 h-4 text-yellow-500 border-gray-300 focus:ring-yellow-500"
                  />
                  <span className="ml-3 text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Looking To Meet? */}
          <div>
            <div className="flex items-center mb-3">
              <span className="text-purple-500 text-lg mr-2">👥</span>
              <h3 className="text-lg font-semibold text-gray-800">Looking To Meet?</h3>
            </div>
            <div className="space-y-2">
              {['Everyone', 'Men', 'Women', 'Other'].map((option) => (
                <label key={option} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="lookingFor"
                    value={option}
                    checked={formData.lookingFor === option}
                    onChange={(e) => handleInputChange('lookingFor', e.target.value)}
                    className="w-4 h-4 text-yellow-500 border-gray-300 focus:ring-yellow-500"
                  />
                  <span className="ml-3 text-gray-700">{option}</span>
                </label>
              ))}
            </div>
            {errors.lookingFor && <p className="text-red-500 text-sm mt-1">{errors.lookingFor}</p>}
          </div>

          {/* Date of Birth */}
          <div>
            <div className="flex items-center mb-3">
              <span className="text-orange-500 text-lg mr-2">📅</span>
              <h3 className="text-lg font-semibold text-gray-800">Date of Birth</h3>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="MM"
                value={formData.month}
                onChange={(e) => handleInputChange('month', e.target.value)}
                maxLength="2"
                className={`w-16 p-2 border rounded text-center ${errors.month ? 'border-red-500' : 'border-gray-300'}`}
              />
              <span className="text-gray-500">/</span>
              <input
                type="text"
                placeholder="DD"
                value={formData.day}
                onChange={(e) => handleInputChange('day', e.target.value)}
                maxLength="2"
                className={`w-16 p-2 border rounded text-center ${errors.day ? 'border-red-500' : 'border-gray-300'}`}
              />
              <span className="text-gray-500">/</span>
              <input
                type="text"
                placeholder="YYYY"
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                maxLength="4"
                className={`w-20 p-2 border rounded text-center ${errors.year ? 'border-red-500' : 'border-gray-300'}`}
              />
              <span className="text-gray-400 text-lg">📅</span>
            </div>
            {(errors.month || errors.day || errors.year) && (
              <p className="text-red-500 text-sm mt-1">{errors.month || errors.day || errors.year}</p>
            )}
          </div>

          {/* Terms Agreement */}
          <div>
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500 mt-1"
              />
              <span className="ml-3 text-sm text-gray-700">
                I confirm that I am at least 18 years old and have read and agree to the{' '}
                <a href="#" className="text-orange-500 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-orange-500 hover:underline">Privacy Policy</a>
                <span className="text-red-500 ml-1">⚠️</span>
              </span>
            </label>
            {errors.agreeToTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeToTerms}</p>}
          </div>

          {/* Start Button */}
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-3 rounded-lg font-semibold text-lg transition-colors"
          >
            Start
          </button>
        </form>
      </div>
    </div>
  );
}
