import React from 'react';
import { Link } from 'react-router-dom';
import { Upload } from 'lucide-react';
import Layout from '../components/layout/Layout';
import VideoGrid from '../components/video/VideoGrid';
import Button from '../components/ui/Button';
import { useAppStore } from '../lib/store';

const VideoBrowse: React.FC = () => {
  const { videos, currentUser } = useAppStore();
  
  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Browse Videos</h1>
        
        {currentUser && (
          <Link to="/videos/upload">
            <Button className="flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Upload Video
            </Button>
          </Link>
        )}
      </div>
      
      <VideoGrid videos={videos} />
    </Layout>
  );
};

export default VideoBrowse;