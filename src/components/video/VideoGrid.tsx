import React from 'react';
import VideoCard from './VideoCard';
import { Video } from '../../lib/store';

interface VideoGridProps {
  videos: Video[];
  showRoomButton?: boolean;
}

const VideoGrid: React.FC<VideoGridProps> = ({ videos, showRoomButton = true }) => {
  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-900 rounded-lg p-6">
        <p className="text-gray-400 mb-2">No videos found</p>
        <p className="text-gray-500 text-sm">Upload a video or check back later</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map(video => (
        <VideoCard 
          key={video.id} 
          video={video} 
          showRoomButton={showRoomButton}
        />
      ))}
    </div>
  );
};

export default VideoGrid;