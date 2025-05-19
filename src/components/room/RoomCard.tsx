import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Film } from 'lucide-react';
import { Room, useAppStore } from '../../lib/store';

interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const { getVideoById } = useAppStore();
  const video = room.videoId ? getVideoById(room.videoId) : null;
  
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-gray-800 transition-all duration-300 hover:shadow-purple-900/20 hover:scale-[1.02]">
      <div className="relative">
        {video ? (
          <img 
            src={video.thumbnail} 
            alt={video.title} 
            className="w-full aspect-video object-cover opacity-70"
          />
        ) : (
          <div className="w-full aspect-video bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center">
            <Film className="h-12 w-12 text-gray-700" />
          </div>
        )}
        
        <div className="absolute top-3 right-3 bg-gray-900/80 text-white px-2 py-1 rounded-full text-xs flex items-center">
          <Users className="h-3 w-3 mr-1" />
          <span>{room.viewers.length} watching</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 truncate">
          {room.name}
        </h3>
        
        {video && (
          <p className="text-gray-400 text-sm mb-3 truncate">
            Watching: {video.title}
          </p>
        )}
        
        <Link 
          to={`/rooms/${room.id}`}
          className="block text-center bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 font-medium transition-colors duration-200"
        >
          Join Room
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;