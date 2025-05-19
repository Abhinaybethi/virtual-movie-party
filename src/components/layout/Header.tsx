import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Users, LogIn, LogOut, Plus } from 'lucide-react';
import { useAppStore } from '../../lib/store';

const Header: React.FC = () => {
  const { currentUser, logout } = useAppStore();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Film className="text-purple-500 h-7 w-7" />
            <span className="text-xl font-bold text-white">WatchTogether</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200">
              Home
            </Link>
            <Link to="/videos" className="text-gray-300 hover:text-white transition-colors duration-200">
              Browse
            </Link>
            <Link to="/rooms" className="text-gray-300 hover:text-white transition-colors duration-200">
              Rooms
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link 
                  to="/videos/upload" 
                  className="flex items-center space-x-1 text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-full transition-colors duration-200"
                >
                  <Plus className="h-4 w-4" />
                  <span>Upload</span>
                </Link>
                
                <Link 
                  to="/rooms/create" 
                  className="hidden md:flex items-center space-x-1 text-sm bg-pink-600 hover:bg-pink-700 text-white px-3 py-1.5 rounded-full transition-colors duration-200"
                >
                  <Users className="h-4 w-4" />
                  <span>Create Room</span>
                </Link>
                
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                    <img 
                      src={`https://avatars.dicebear.com/api/identicon/${currentUser.name}.svg`} 
                      alt={currentUser.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="hidden md:inline text-white">{currentUser.name}</span>
                </div>
                
                <button 
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors duration-200"
              >
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;