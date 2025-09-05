import React, {useRef, useEffect} from 'react'

export default function VideoPlayer({ user, isMainVideo = false }) {
    const ref = useRef()
    
    useEffect(() => {
        user.videoTrack.play(ref.current)
    }, [])
    
  return (
    <div className="relative w-full h-full">
        <div
            ref={ref}
            className={`w-full h-full object-cover ${
                isMainVideo ? 'bg-gray-800' : 'bg-gray-700'
            }`}
        />
        
        {/* User label */}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            {user.isLocal ? 'You' : `User ${user.uid}`}
        </div>
    </div>
  )
}
