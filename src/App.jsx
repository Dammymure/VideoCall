import React, { useState } from 'react';
import './App.css';
import VideoRoom from './components/VideoRoom.jsx';

function App() {
  const [joined, setJoined] = useState(false);
  return (
    <div className="bg-pink-500 h-screen flex flex-col items-center justify-center relative overflow-hidden gap-4">
      {/* Floating Hearts Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="heart heart-1">💖</div>
        <div className="heart heart-2">💕</div>
        <div className="heart heart-3">💗</div>
        <div className="heart heart-4">💝</div>
        <div className="heart heart-5">💘</div>
        <div className="heart heart-6">💓</div>
        <div className="heart heart-7">💞</div>
        <div className="heart heart-8">💟</div>
        <div className="heart heart-9">💖</div>
        <div className="heart heart-10">💕</div>
        <div className="heart heart-11">💗</div>
        <div className="heart heart-12">💝</div>
        <div className="heart heart-13">💘</div>
        <div className="heart heart-14">💓</div>
        <div className="heart heart-15">💞</div>
        <div className="heart heart-16">💟</div>
        <div className="heart heart-17">💖</div>
        <div className="heart heart-18">💕</div>
        <div className="heart heart-19">💗</div>
        <div className="heart heart-20">💝</div>
      </div>

      {!joined && (
        <>
          <h1 className='text-2xl relative z-10'>VideoCall App</h1>
          <button className='bg-black text-white text-2xl p-3 rounded-full relative z-10 hover:bg-gray-800 transition-colors' onClick={() => setJoined(true)}>
            Start Call
          </button>
        </>
      )}

      {joined && (
        <div className="absolute inset-0 z-10">
          <VideoRoom onEnd={() => setJoined(false)} />
        </div>
      )}
    </div>
  );
}

export default App;
