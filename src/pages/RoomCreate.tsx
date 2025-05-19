import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Film } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAppStore, Video } from '../lib/store';

const RoomCreate: React.FC = () => {
  const [roomName, setRoomName] = useState('');
  const [selectedVideoId, setSelectedVideoId] = useState('');
  const [error, setError] = useState('');
  
  const { videos, createRoom, currentUser } = useAppStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
    
    // Check if videoId is provided in URL
    const videoId = searchParams.get('videoId');
    if (videoId) {
      setSelectedVideoId(videoId);
      
      // Set a default room name based on the video
      const video = videos.find(v => v.id === videoId);
      if (video) {
        setRoomName(`${video.title} Room`);
      }
    }
  }, [currentUser, navigate, searchParams, videos]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roomName.trim()) {
      setError('Room name is required');
      return;
    }
    
    if (!selectedVideoId) {
      setError('Please select a video');
      return;
    }
    
    const room = createRoom(roomName);
    room.videoId = selectedVideoId;
    
    navigate(`/rooms/${room.id}`);
  };
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 shadow-lg">
          <div className="flex items-center mb-6">
            <Film className="text-purple-500 h-6 w-6 mr-2" />
            <h1 className="text-2xl font-bold text-white">Create Watch Room</h1>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Input
                label="Room Name"
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter room name"
                fullWidth
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-300 mb-1 text-sm">Select Video</label>
              <select
                value={selectedVideoId}
                onChange={(e) => setSelectedVideoId(e.target.value)}
                className={`
                  bg-gray-800 
                  text-white 
                  rounded-lg 
                  border 
                  ${error && !selectedVideoId ? 'border-red-500' : 'border-gray-700'} 
                  px-4 
                  py-2 
                  w-full
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-purple-500 
                  transition-colors 
                  duration-200
                `}
              >
                <option value="">-- Select a video --</option>
                {videos.map((video: Video) => (
                  <option key={video.id} value={video.id}>
                    {video.title}
                  </option>
                ))}
              </select>
              {error && !selectedVideoId && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/rooms')}
              >
                Cancel
              </Button>
              <Button type="submit">
                Create Room
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default RoomCreate;