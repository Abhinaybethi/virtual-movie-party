import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward, SkipBack, Settings } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  isPlaying: boolean;
  currentTime: number;
  onPlayPause: (isPlaying: boolean) => void;
  onTimeUpdate: (time: number) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  isPlaying,
  currentTime,
  onPlayPause,
  onTimeUpdate
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isUserSeeking, setIsUserSeeking] = useState(false);
  const [localCurrentTime, setLocalCurrentTime] = useState(currentTime);
  const [isBuffering, setIsBuffering] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [quality, setQuality] = useState<string>('auto');
  const controlsTimeoutRef = useRef<number>();
  
  useEffect(() => {
    if (videoRef.current) {
      if (Math.abs(videoRef.current.currentTime - currentTime) > 1 && !isUserSeeking) {
        videoRef.current.currentTime = currentTime;
      }
      
      if (isPlaying && videoRef.current.paused) {
        videoRef.current.play().catch(() => {
          onPlayPause(false);
        });
      } else if (!isPlaying && !videoRef.current.paused) {
        videoRef.current.pause();
      }
      
      videoRef.current.playbackRate = playbackRate;
    }
  }, [isPlaying, currentTime, isUserSeeking, onPlayPause, playbackRate]);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const onLoadedMetadata = () => {
      setDuration(video.duration);
    };
    
    const onTimeUpdateEvent = () => {
      if (!isUserSeeking) {
        setLocalCurrentTime(video.currentTime);
        onTimeUpdate(video.currentTime);
      }
    };
    
    const onEnded = () => {
      onPlayPause(false);
      onTimeUpdate(0);
    };
    
    const onWaiting = () => {
      setIsBuffering(true);
    };
    
    const onPlaying = () => {
      setIsBuffering(false);
    };
    
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('timeupdate', onTimeUpdateEvent);
    video.addEventListener('ended', onEnded);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('playing', onPlaying);
    
    // Preload video data
    video.preload = 'auto';
    
    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('timeupdate', onTimeUpdateEvent);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('playing', onPlaying);
    };
  }, [isUserSeeking, onPlayPause, onTimeUpdate]);
  
  useEffect(() => {
    // Auto-hide controls after 3 seconds of inactivity
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        window.clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = window.setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeoutRef.current) {
        window.clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);
  
  const togglePlay = () => {
    onPlayPause(!isPlaying);
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setLocalCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };
  
  const toggleFullScreen = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };
  
  const skip = (amount: number) => {
    if (videoRef.current) {
      const newTime = Math.min(Math.max(0, videoRef.current.currentTime + amount), duration);
      videoRef.current.currentTime = newTime;
      onTimeUpdate(newTime);
    }
  };
  
  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };
  
  return (
    <div 
      className="relative rounded-lg overflow-hidden bg-black group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full aspect-video cursor-pointer"
        onClick={togglePlay}
      />
      
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      )}
      
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-2 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center mb-2">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={localCurrentTime}
            onChange={handleSeek}
            onMouseDown={() => setIsUserSeeking(true)}
            onMouseUp={() => {
              setIsUserSeeking(false);
              onTimeUpdate(localCurrentTime);
            }}
            onTouchStart={() => setIsUserSeeking(true)}
            onTouchEnd={() => {
              setIsUserSeeking(false);
              onTimeUpdate(localCurrentTime);
            }}
            className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
            style={{
              backgroundImage: `linear-gradient(to right, #EC4899 0%, #EC4899 ${(localCurrentTime / (duration || 1)) * 100}%, #4B5563 ${(localCurrentTime / (duration || 1)) * 100}%, #4B5563 100%)`
            }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => skip(-10)}
              className="text-white hover:text-purple-400 transition-colors"
              title="Rewind 10 seconds"
            >
              <SkipBack className="h-4 w-4" />
            </button>
            
            <button 
              onClick={togglePlay}
              className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full transition-colors"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </button>
            
            <button 
              onClick={() => skip(10)}
              className="text-white hover:text-purple-400 transition-colors"
              title="Forward 10 seconds"
            >
              <SkipForward className="h-4 w-4" />
            </button>
            
            <div className="text-white text-sm">
              {formatTime(localCurrentTime)} / {formatTime(duration)}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleMute}
                className="text-white hover:text-purple-400 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
              />
            </div>
            
            <div className="relative group">
              <button 
                className="text-white hover:text-purple-400 transition-colors"
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </button>
              
              <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
                <div className="bg-gray-800 rounded-lg shadow-lg p-2 min-w-[120px]">
                  <div className="mb-2">
                    <p className="text-xs text-gray-400 mb-1">Playback Speed</p>
                    <div className="grid grid-cols-3 gap-1">
                      {[0.5, 1, 1.5, 2].map(rate => (
                        <button
                          key={rate}
                          onClick={() => handlePlaybackRateChange(rate)}
                          className={`
                            text-xs px-2 py-1 rounded
                            ${playbackRate === rate ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'}
                          `}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Quality</p>
                    <select
                      value={quality}
                      onChange={(e) => setQuality(e.target.value)}
                      className="bg-gray-700 text-white text-xs rounded px-2 py-1 w-full"
                    >
                      <option value="auto">Auto</option>
                      <option value="1080p">1080p</option>
                      <option value="720p">720p</option>
                      <option value="480p">480p</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={toggleFullScreen}
              className="text-white hover:text-purple-400 transition-colors"
            >
              <Maximize className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;