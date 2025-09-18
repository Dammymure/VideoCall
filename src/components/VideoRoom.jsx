import React, { useState, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

const APP_ID = process.env.REACT_APP_AGORA_APP_ID;

const client = AgoraRTC.createClient({
    mode: 'rtc',
    codec: 'vp8',
});

export default function VideoRoom({ onEnd }) {
    const [users, setUsers] = useState([]);
    const [localTracks, setLocalTracks] = useState([]);
    const [localUser, setLocalUser] = useState(null);

    const handleUserJoined = async (user, mediaType) => {
        console.log('User joined:', user, 'Media type:', mediaType);
        await client.subscribe(user, mediaType);
        setUsers((prev) => {
            const exists = prev.some((u) => u.uid === user.uid);
            if (!exists) {
                console.log('Adding user to list:', user);
                return [...prev, user];
            }
            return prev.map((u) => (u.uid === user.uid ? user : u));
        });
        if (mediaType === 'audio') {
            user.audioTrack && user.audioTrack.play();
        }
        if (mediaType === 'video' && user.videoTrack) {
            console.log('Playing remote video into #remote-video');
            try {
                user.videoTrack.play('remote-video');
            } catch (e) {
                console.warn('Failed to play remote video immediately, will rely on render ref.');
            }
        }
    };

    const handleUserUnpublished = (user, mediaType) => {
        console.log('User unpublished:', user.uid, mediaType);
        if (mediaType === 'video' || mediaType === 'audio') {
            setUsers((prev) => prev.map((u) => (u.uid === user.uid ? user : u)));
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
        client.on('user-unpublished', handleUserUnpublished);

        // Basic Agora join with token from environment
        const TOKEN = process.env.REACT_APP_AGORA_TOKEN;
        
        AgoraRTC.createMicrophoneAndCameraTracks()
            .then(([audioTrack, videoTrack]) => {
                setLocalTracks([audioTrack, videoTrack]);
                return client.join(APP_ID, 'videoCall', TOKEN, null).then((uid) => {
                    setLocalUser({ uid, audioTrack, videoTrack, isLocal: true });
                    return client.publish([audioTrack, videoTrack]);
                });
            })
            .catch((err) => {
                console.error('Join failed, your Agora project requires tokens. Error:', err);
                alert('This Agora project requires token authentication. Please configure your project for "App ID only" or add a token.');
            });

        return () => {
            client.off('user-published', handleUserJoined);
            client.off('user-left', handleUserLeft);
            client.off('user-unpublished', handleUserUnpublished);
        };
    }, []);

    return (
        <div className="relative w-full h-full bg-black">
            {/* Remote video */}
            <div className="w-full h-full">
                <div id="remote-video" className="w-full h-full bg-gray-800" />
            </div>
            
            {/* Debug info */}
            <div className="absolute top-4 left-4 text-white text-sm">
                Users: {users.length} | Local: {localUser ? 'Yes' : 'No'}
            </div>

            {/* Local video */}
            {localUser && localUser.videoTrack && (
                <div className="absolute bottom-4 right-4 w-48 h-36 border-2 border-white">
                    <div ref={(ref) => {
                        if (ref && localUser.videoTrack) {
                            localUser.videoTrack.play(ref);
                        }
                    }} className="w-full h-full" />
                </div>
            )}

            {/* Controls */}
            <div className="absolute bottom-4 left-4">
                <button onClick={leaveCall} className="bg-red-600 text-white px-4 py-2 rounded">
                    Leave
                </button>
            </div>
        </div>
    );
}

