import React, { useState } from 'react';
import './App.css';
import VideoRoom from './components/VideoRoom.jsx';

function App() {
  const [joined, setJoined] = useState(false);
  return (
    <div className="App App-header" >
      <h1>VideoCall App</h1>

      {!joined && (
        <button onClick={() => setJoined(true)}>
          Join Room
          </button>
      )}

      {joined && (
        <VideoRoom/>
      )}
    </div>
  );
}

export default App;
