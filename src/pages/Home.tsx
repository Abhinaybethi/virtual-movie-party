import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Users, Upload } from 'lucide-react';
import Layout from '../components/layout/Layout';
import VideoGrid from '../components/video/VideoGrid';
import { useAppStore } from '../lib/store';
import Button from '../components/ui/Button';

const Home: React.FC = () => {
  const { videos, currentUser } = useAppStore();
  const recentVideos = videos.slice(0, 4);
  
  return (
    <Layout>
      <section className="relative rounded-xl overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-pink-900/80 z-10"></div>
        <img 
          src="https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="relative z-20 py-16 px-6 md:py-24 md:px-12 flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Watch Movies Together, <span className="text-purple-400">Anywhere</span>
          </h1>
          <p className="text-gray-200 text-lg md:text-xl max-w-2xl mb-8">
            Upload, stream, and enjoy your favorite content with friends in real-time. 
            Synchronized playback makes it feel like you're in the same room.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/videos">
              <Button variant="primary" size="lg">
                Browse Videos
              </Button>
            </Link>
            
            {currentUser ? (
              <Link to="/rooms/create">
                <Button variant="secondary" size="lg">
                  Create Watch Room
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Recent Videos</h2>
          <Link to="/videos" className="text-purple-400 hover:text-purple-300 transition-colors">
            View All
          </Link>
        </div>
        
        <VideoGrid videos={recentVideos} />
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <Film className="h-10 w-10 text-purple-500 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Free Video Uploads
          </h3>
          <p className="text-gray-400">
            Upload your favorite videos and share them with friends. No subscription required.
          </p>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <Users className="h-10 w-10 text-pink-500 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Watch Together
          </h3>
          <p className="text-gray-400">
            Create watch rooms and invite friends to enjoy synchronized viewing experiences.
          </p>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <Upload className="h-10 w-10 text-purple-500 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Easy Deployment
          </h3>
          <p className="text-gray-400">
            Deploy your own instance of WatchTogether for complete control over your viewing experience.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Home;