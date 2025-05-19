import React from 'react';
import { useAppStore } from '../../lib/store';

const ViewerList: React.FC = () => {
  const { currentRoom } = useAppStore();
  
  if (!currentRoom) return null;
  
  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      <div className="bg-gray-800 p-3 border-b border-gray-700">
        <h3 className="text-white font-medium">Viewers ({currentRoom.viewers.length})</h3>
      </div>
      
      <div className="p-3">
        <div className="space-y-3">
          {currentRoom.viewers.map(viewer => (
            <div key={viewer.id} className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                <img 
                  src={`https://avatars.dicebear.com/api/identicon/${viewer.name}.svg`} 
                  alt={viewer.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-white">{viewer.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewerList;