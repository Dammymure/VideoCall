import React, { useState, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import VideoPlayer from './VideoPlayer';

// Get user settings and selected country from localStorage
const userSettings = JSON.parse(localStorage.getItem('local_settings_cache') || '{}');
const selectedCountries = userSettings.filters?.countries || ['us'];
const CHANNEL = `call_${selectedCountries[0]}`; // Use first selected country or fallback

const APP_ID = process.env.REACT_APP_AGORA_APP_ID;
const TOKEN = process.env.REACT_APP_AGORA_TOKEN;

const client = AgoraRTC.createClient({
    mode: 'rtc',
    codec: 'vp8',
});

export default function VideoRoom({ onEnd }) {
    const [users, setUsers] = useState([]);
    const [localTracks, setLocalTracks] = useState([]);
    const [localUser, setLocalUser] = useState(null);

    const handleUserJoined = async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        setUsers((prev) => {
            const exists = prev.some((u) => u.uid === user.uid);
            if (!exists) return [...prev, user];
            return prev;
        });
        if (mediaType === 'audio') {
            user.audioTrack && user.audioTrack.play();
        }
    };

    const handleUserLeft = (user) => {
        setUsers((prev) => prev.filter((u) => u.uid !== user.uid));
    };

    const leaveCall = async () => {
        for (let track of localTracks) {
            track.stop();
            track.close();
        }
        await client.unpublish(localTracks);
        await client.leave();
        setUsers([]);
        setLocalTracks([]);
        setLocalUser(null);
        onEnd && onEnd();
    };

    useEffect(() => {
        client.on('user-published', handleUserJoined);
        client.on('user-left', handleUserLeft);

        // Request camera and mic access before joining
        AgoraRTC.createMicrophoneAndCameraTracks()
            .then(([audioTrack, videoTrack]) => {
                setLocalTracks([audioTrack, videoTrack]);
                return client.join(APP_ID, CHANNEL, TOKEN, null).then((uid) => {
                    const localUserObj = {
                        uid,
                        audioTrack,
                        videoTrack,
                        isLocal: true,
                    };
                    setLocalUser(localUserObj);
                    client.publish([audioTrack, videoTrack]);
                });
            })
            .catch((err) => {
                alert('Camera and microphone access is required for video calls.');
                console.error('Permission error:', err);
            });

        return () => {
            client.off('user-published', handleUserJoined);
            client.off('user-left', handleUserLeft);
        };
    }, []);

    return (
        <div className="relative w-full h-full bg-black overflow-hidden">
            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-3 bg-gradient-to-b from-black/60 to-transparent">
                <button aria-label="Menu" className="text-white text-2xl" onClick={() => {}}>
                    ☰
                </button>
            </div>

            {/* Main video - Remote user */}
            {users.length > 0 && (
                <div className="w-full h-full">
                    <VideoPlayer user={users[0]} isMainVideo={true} />
                </div>
            )}

            {/* Local user video - Small corner */}
            {localUser && (
                <div className="absolute bottom-24 right-4 w-48 h-36 rounded-lg overflow-hidden shadow-lg border-2 border-white z-20">
                    <VideoPlayer user={localUser} isMainVideo={false} />
                </div>
            )}

            {/* Waiting for other user */}
            {users.length === 0 && (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center text-white">
                        <div className="text-2xl mb-4">📞</div>
                        <h2 className="text-xl mb-2">Waiting for someone to join...</h2>
                        <p className="text-gray-300">Share this room with a friend!</p>
                    </div>
                </div>
            )}

            {/* Bottom controls */}
            <div className="absolute bottom-4 left-0 right-0 z-20 flex items-center justify-center">
                <button onClick={leaveCall} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full shadow-lg">
                    End Call
                </button>
            </div>
        </div>
    );
}

// Example: Set credentials/settings in localStorage (run once, e.g. during onboarding)
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

