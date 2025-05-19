import React from 'react';
import { Play, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Video } from '../../lib/store';

interface VideoCardProps {
  video: Video;
  showRoomButton?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, showRoomButton = true }) => {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-purple-900/30 hover:scale-[1.02]">
      <div className="relative">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full aspect-video object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <Link 
            to={`/videos/${video.id}`}
            className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full transition-colors duration-200"
          >
            <Play className="h-6 w-6" />
          </Link>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-1 truncate">
          {video.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {video.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-xs">
            {new Date(video.createdAt).toLocaleDateString()}
          </span>
          
          {showRoomButton && (
            <Link 
              to={`/rooms/create?videoId=${video.id}`}
              className="flex items-center space-x-1 text-xs bg-pink-600 hover:bg-pink-700 text-white px-2 py-1 rounded-full transition-colors duration-200"
            >
              <Users className="h-3 w-3" />
              <span>Watch Together</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;