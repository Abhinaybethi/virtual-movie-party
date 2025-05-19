import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Share2 } from 'lucide-react';
import Layout from '../components/layout/Layout';
import VideoPlayer from '../components/video/VideoPlayer';
import ChatPanel from '../components/room/ChatPanel';
import ViewerList from '../components/room/ViewerList';
import Button from '../components/ui/Button';
import { useAppStore } from '../lib/store';

const RoomDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { 
    rooms, 
    currentUser, 
    joinRoom, 
    leaveRoom, 
    currentRoom,
    getVideoById,
    setIsPlaying,
    updateCurrentTime
  } = useAppStore();
  
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const copyRoomLink = useCallback(() => {
    try {
      const roomUrl = `${window.location.origin}/rooms/${currentRoom?.id}`;
      navigator.clipboard.writeText(roomUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy room link:', err);
    }
  }, [currentRoom?.id]);

  // Join the room when component mounts
  useEffect(() => {
    if (!id || !currentUser) {
      if (!currentUser) navigate('/login');
      return;
    }
    
    setIsLoading(true);
    
    // Check if room exists
    const roomExists = rooms.some(room => room.id === id);
    if (!roomExists) {
      navigate('/rooms');
      return;
    }
    
    const isInRoom = currentRoom?.id === id;
    if (!isInRoom) {
      joinRoom(id);
    }
    
    setIsLoading(false);
    
    // Return cleanup function without dependencies that might change
    return () => {
      if (currentRoom?.id === id) {
        leaveRoom();
      }
    };
  }, [id, currentUser, joinRoom, navigate, rooms]); // Removed currentRoom?.id from dependencies

  // Rest of your component remains the same...
  if (isLoading || !currentUser) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-xl text-white mb-4">Loading room...</p>
        </div>
      </Layout>
    );
  }
  
  if (!currentRoom) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-xl text-white mb-4">Room not found</p>
          <Button onClick={() => navigate('/rooms')}>
            Back to Rooms
          </Button>
        </div>
      </Layout>
    );
  }
  
  const video = currentRoom.videoId ? getVideoById(currentRoom.videoId) : null;
  
  if (!video) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-xl text-white mb-4">No video selected for this room</p>
          <Button onClick={() => navigate('/rooms')}>
            Back to Rooms
          </Button>
        </div>
      </Layout>
    );
  }
  
  const handlePlayPause = (isPlaying: boolean) => {
    setIsPlaying(isPlaying);
  };
  
  const handleTimeUpdate = (time: number) => {
    updateCurrentTime(time);
  };
  
  return (
    <Layout>
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">{currentRoom.name}</h1>
          <p className="text-gray-400 text-sm">
            Watching: {video.title}
          </p>
        </div>
        
        <Button 
          onClick={copyRoomLink}
          variant={copied ? 'primary' : 'outline'}
          size="sm"
          className="mt-2 md:mt-0 flex items-center"
        >
          {copied ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4 mr-2" />
              <span>Share Room</span>
            </>
          )}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VideoPlayer
            src={video.url}
            isPlaying={currentRoom.isPlaying}
            currentTime={currentRoom.currentTime}
            onPlayPause={handlePlayPause}
            onTimeUpdate={handleTimeUpdate}
          />
        </div>
        
        <div className="flex flex-col h-[400px]">
          <ChatPanel />
        </div>
      </div>
      
      <div className="mt-6">
        <ViewerList />
      </div>
    </Layout>
  );
};

export default RoomDetail;