import React, { useState, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import VideoPlayer from './VideoPlayer';

const APP_ID = process.env.REACT_APP_AGORA_APP_ID;
const TOKEN = process.env.REACT_APP_AGORA_TOKEN;
const CHANNEL = process.env.REACT_APP_AGORA_CHANNEL;

const client = AgoraRTC.createClient({
    mode: 'rtc',
    codec: 'vp8',
})

export default function VideoRoom() {
    const [users, setUsers] = useState ([])
    const [localTracks, setLocalTracks] = useState([])
    const [localUser, setLocalUser] = useState(null)

    const handleUserJoined = async (user, mediaType) =>{
        await client.subscribe(user, mediaType)

        if (mediaType === 'video') {
            setUsers((previousUsers) => [...previousUsers, user])
        }

        if (mediaType === 'audio') {
            user.audioTrack.play()
        }
    }
    const handleUserLeft = (user) =>{
        setUsers((previousUsers) => 
        previousUsers.filter((u) => u.uid !== user.uid)
        );
    };
 
    

    useEffect(() => {
        client.on('user-published', handleUserJoined)
        client.on('user-left', handleUserLeft)

        client
        .join(APP_ID, CHANNEL, TOKEN, null)
        .then((uid) =>
            Promise.all([
                AgoraRTC.createMicrophoneAndCameraTracks(), 
                uid
            ])
            )
            .then(([tracks, uid]) => {
                    const [audioTrack, videoTrack] = tracks;
                    setLocalTracks(tracks)
                    
                    // Create local user object
                    const localUserObj = {
                        uid,
                        audioTrack,
                        videoTrack,
                        isLocal: true
                    };
                    
                    setLocalUser(localUserObj);
                    client.publish(tracks);
                });

        return () => {
            for (let localTrack of localTracks) {
                localTrack.stop();
                localTrack.close();
            }

            client.off('user-published', handleUserJoined)
            client.off('user-left', handleUserLeft)
            client.unpublish(localTracks).then(() => client.leave())
        }
    }, [])

    return (
    <div className="relative w-full h-screen bg-gray-900">
        {/* Main video - Remote user */}
        {users.length > 0 && (
            <div className="w-full h-full">
                <VideoPlayer user={users[0]} isMainVideo={true} />
            </div>
        )}
        
        {/* Local user video - Small corner */}
        {localUser && (
            <div className="absolute bottom-4 right-4 w-48 h-36 rounded-lg overflow-hidden shadow-lg border-2 border-white">
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
    </div> ) 
}

