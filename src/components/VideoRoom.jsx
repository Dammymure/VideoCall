import React, { useState, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import VideoPlayer from './VideoPlayer';

const APP_ID = process.env.REACT_APP_AGORA_APP_ID;

const client = AgoraRTC.createClient({
    mode: 'rtc',
    codec: 'vp8',
});

export default function VideoRoom({ onEnd, channelName }) {
    const [users, setUsers] = useState([]);
    const [localTracks, setLocalTracks] = useState([]);
    const [localUser, setLocalUser] = useState(null);
    const [joinError, setJoinError] = useState(null);

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
        if (!APP_ID) {
            const msg = 'Missing REACT_APP_AGORA_APP_ID. Set it in your environment.';
            setJoinError(msg);
            console.error(msg);
            return () => {
                client.off('user-published', handleUserJoined);
                client.off('user-left', handleUserLeft);
            };
        }

        const effectiveChannel = channelName && channelName.trim().length > 0 ? channelName : 'call_general';

        // Derive a deterministic uid for the browser session
        const localUid = (() => {
            try {
                const existing = localStorage.getItem('agora_uid');
                if (existing) return parseInt(existing, 10) || 0;
                const uid = Math.floor(Math.random() * 1e9);
                localStorage.setItem('agora_uid', String(uid));
                return uid;
            } catch {
                return 0;
            }
        })();

        // Fetch a server-minted token
        const fetchToken = async () => {
            const params = new URLSearchParams({ channel: effectiveChannel, uid: String(localUid), role: 'publisher', expireSeconds: '3600' });
            const base = window.location.origin;
            const response = await fetch(`${base}/api/agora-token?${params.toString()}`);
            const contentType = response.headers.get('content-type') || '';
            if (!response.ok) {
                const txt = await response.text();
                throw new Error(`Token API error: ${response.status} ${txt.slice(0, 200)}`);
            }
            if (!contentType.includes('application/json')) {
                const txt = await response.text();
                throw new Error(`Token API returned non-JSON (${contentType}): ${txt.slice(0, 200)}`);
            }
            const data = await response.json();
            if (!data.token || !data.appId) {
                throw new Error('Token API returned invalid payload');
            }
            return data;
        };

        const startWithTracks = async (token, appId) => {
            const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
            setLocalTracks([audioTrack, videoTrack]);
            const uid = await client.join(appId, effectiveChannel, token, localUid);
            const localUserObj = { uid, audioTrack, videoTrack, isLocal: true };
            setLocalUser(localUserObj);
            await client.publish([audioTrack, videoTrack]);
        };

        const start = async () => {
            try {
                const { token, appId } = await fetchToken();
                await startWithTracks(token, appId);
            } catch (err) {
                const reason = (err && err.message) ? err.message : 'Unknown error';
                const msg = `Unable to fetch token or join: ${reason}`;
                setJoinError(msg);
                console.error('Join error:', err);
            }
        };

        start();

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
                {joinError && (
                    <div className="text-red-400 text-sm truncate max-w-[60%]" title={joinError}>
                        {joinError}
                    </div>
                )}
            </div>

            {/* Main video - Remote user */}
            {users.length > 0 && (
                <div className="w-full h-full">
                    <VideoPlayer user={users[0]} isMainVideo={true} />
                </div>
            )}

            {/* Local user video - Small corner (always visible) */}
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

