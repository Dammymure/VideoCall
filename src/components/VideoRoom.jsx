import React, { useState, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import VideoPlayer from './VideoPlayer';
const APP_ID= '22dbdc7823c3432b8b5d8ff8acb6146d'
const TOKEN= '007eJxTYNgVYLbvuVbB7pNf9A8yO21pFvg0/ZvwwjPzmpdt8806qntEgcHIKCUpJdncwsg42djE2CjJIsk0xSItzSIxOcnM0MQsJVdyR0ZDICOD+YY+VkYGCATxORnKMlNS850Tc3IYGACPhyMh'
const CHANNEL = 'videoCall'

const client = AgoraRTC.createClient({
    mode: 'rtc',
    codec: 'vp8',
})

export default function VideoRoom() {
    const [users, setUsers] = useState ([])
    const [localTracks, setLocalTracks] = useState([])

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
                    setUsers(previousUsers => [...previousUsers, {
                        uid,
                        audioTrack,
                        videoTrack,
                    }]);
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
    <div style={{ display:'flex', justifyContent:'center'}}>
        <div
        style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 200px)'
        }}
        >
        {users.map((user) => (
            <VideoPlayer key={user.uid} user={user}/>
        ))}
        </div>        

    </div> ) 
}

