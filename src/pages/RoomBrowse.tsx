import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { useAppStore, Room } from '../lib/store';
import RoomCard from '../components/room/RoomCard';

const RoomBrowse: React.FC = () => {
  const { rooms, currentUser } = useAppStore();
  
  const activeRooms = rooms.filter(room => room.viewers.length > 0);
  
  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Watch Rooms</h1>
        
        {currentUser && (
          <Link to="/rooms/create">
            <Button className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Create Room
            </Button>
          </Link>
        )}
      </div>
      
      {activeRooms.length === 0 ? (
        <div className="bg-gray-900 rounded-lg p-8 text-center border border-gray-800">
          <h2 className="text-xl font-semibold text-white mb-3">No active rooms</h2>
          <p className="text-gray-400 mb-6">
            Be the first to create a watch room and invite your friends!
          </p>
          
          {currentUser ? (
            <Link to="/rooms/create">
              <Button>Create a Room</Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button>Login to Create a Room</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeRooms.map((room: Room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default RoomBrowse;