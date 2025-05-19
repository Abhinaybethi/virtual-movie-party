import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Calendar, ArrowLeft } from 'lucide-react';
import Layout from '../components/layout/Layout';
import VideoPlayer from '../components/video/VideoPlayer';
import Button from '../components/ui/Button';
import { useAppStore } from '../lib/store';

const VideoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getVideoById, currentUser, createRoom } = useAppStore();
  const video = id ? getVideoById(id) : undefined;
  
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  
  if (!video) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-xl text-white mb-4">Video not found</h2>
          <Button onClick={() => navigate('/videos')}>
            Back to Videos
          </Button>
        </div>
      </Layout>
    );
  }
  
  const handleCreateRoom = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    const room = createRoom(`${video.title} Room`);
    room.videoId = video.id;
    navigate(`/rooms/${room.id}`);
  };
  
  return (
    <Layout>
      <div className="mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/videos')}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Videos
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VideoPlayer
            src={video.url}
            isPlaying={isPlaying}
            currentTime={currentTime}
            onPlayPause={setIsPlaying}
            onTimeUpdate={setCurrentTime}
          />
          
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-white mb-2">{video.title}</h1>
            <p className="text-gray-400 mb-4">{video.description}</p>
            
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <div className="flex items-center mr-4">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{new Date(video.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <Button 
              variant="secondary" 
              onClick={handleCreateRoom}
              className="flex items-center"
            >
              <Users className="h-4 w-4 mr-2" />
              Watch with Friends
            </Button>
          </div>
        </div>
        
        <div>
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
            <h3 className="text-lg font-semibold text-white mb-4">How to Watch Together</h3>
            
            <ol className="space-y-2 text-gray-400">
              <li className="flex items-start">
                <span className="bg-purple-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                <span>Click "Watch with Friends" to create a new room</span>
              </li>
              <li className="flex items-start">
                <span className="bg-purple-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                <span>Share the room link with your friends</span>
              </li>
              <li className="flex items-start">
                <span className="bg-purple-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                <span>Chat in real-time while enjoying synchronized playback</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VideoDetail;