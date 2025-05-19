import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ImagePlus, Film, FileVideo, Cloud } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAppStore } from '../lib/store';

const VideoUpload: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadType, setUploadType] = useState<'local' | 'drive' | 'sample'>('local');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [driveUrl, setDriveUrl] = useState('');
  
  const { addVideo, currentUser } = useAppStore();
  const navigate = useNavigate();
  
  // Stock thumbnails from Pexels
  const thumbnailOptions = [
    'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/7234255/pexels-photo-7234255.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/33129/popcorn-movie-party-entertainment.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/1200450/pexels-photo-1200450.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/109669/pexels-photo-109669.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/3094799/pexels-photo-3094799.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  ];
  
  // Sample video options
  const videoOptions = [
    {
      label: 'Big Buck Bunny',
      value: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },
    {
      label: 'Elephant Dream',
      value: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    },
    {
      label: 'Sintel',
      value: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
    }
  ];
  
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (uploadType === 'local' && !videoFile) {
      newErrors.video = 'Please select a video file';
    }
    
    if (uploadType === 'drive' && !driveUrl) {
      newErrors.video = 'Please enter a Google Drive URL';
    }
    
    if (uploadType === 'sample' && !videoUrl) {
      newErrors.video = 'Please select a sample video';
    }
    
    if (!thumbnail) {
      newErrors.thumbnail = 'Please select a thumbnail';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5GB)
      if (file.size > 5 * 1024 * 1024 * 1024) {
        setErrors({ ...errors, video: 'File size must be less than 5GB' });
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('video/')) {
        setErrors({ ...errors, video: 'Please select a valid video file' });
        return;
      }
      
      setVideoFile(file);
      setErrors({ ...errors, video: '' });
    }
  };

  const handleDriveUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setDriveUrl(url);
    
    // Basic Google Drive URL validation
    if (url && !url.includes('drive.google.com')) {
      setErrors({ ...errors, video: 'Please enter a valid Google Drive URL' });
    } else {
      setErrors({ ...errors, video: '' });
    }
  };

  const simulateUploadProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress > 100) {
        progress = 100;
        clearInterval(interval);
      }
      setUploadProgress(Math.floor(progress));
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    simulateUploadProgress();
    
    try {
      let finalVideoUrl = '';
      
      switch (uploadType) {
        case 'local':
          if (videoFile) {
            // In a real app, we would upload to a storage service
            finalVideoUrl = URL.createObjectURL(videoFile);
          }
          break;
        
        case 'drive':
          // In a real app, we would process the Google Drive URL
          finalVideoUrl = driveUrl;
          break;
        
        case 'sample':
          finalVideoUrl = videoUrl;
          break;
      }
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      addVideo({
        title,
        description,
        url: finalVideoUrl,
        thumbnail
      });
      
      navigate('/videos');
    } catch (error) {
      console.error('Error uploading video:', error);
      setErrors({ ...errors, submit: 'Failed to upload video. Please try again.' });
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center mb-6">
            <Upload className="text-purple-500 h-6 w-6 mr-2" />
            <h1 className="text-2xl font-bold text-white">Upload Video</h1>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-300 mb-2 text-sm">Upload Method</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setUploadType('local')}
                  className={`
                    flex items-center justify-center p-4 rounded-lg border-2 
                    ${uploadType === 'local' ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700'}
                    hover:border-purple-500/50 transition-colors
                  `}
                >
                  <FileVideo className="h-6 w-6 mr-2" />
                  <span>Local File</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setUploadType('drive')}
                  className={`
                    flex items-center justify-center p-4 rounded-lg border-2 
                    ${uploadType === 'drive' ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700'}
                    hover:border-purple-500/50 transition-colors
                  `}
                >
                  <Cloud className="h-6 w-6 mr-2" />
                  <span>Google Drive</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setUploadType('sample')}
                  className={`
                    flex items-center justify-center p-4 rounded-lg border-2 
                    ${uploadType === 'sample' ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700'}
                    hover:border-purple-500/50 transition-colors
                  `}
                >
                  <Film className="h-6 w-6 mr-2" />
                  <span>Sample Video</span>
                </button>
              </div>
            </div>
            
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter video title"
                  fullWidth
                  error={errors.title}
                />
              </div>
              
              <div>
                {uploadType === 'local' && (
                  <div>
                    <label className="block text-gray-300 mb-1 text-sm">Video File</label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-purple-600 file:text-white
                        hover:file:bg-purple-700
                        file:cursor-pointer cursor-pointer"
                    />
                    {errors.video && (
                      <p className="text-red-500 text-xs mt-1">{errors.video}</p>
                    )}
                    {videoFile && (
                      <p className="text-sm text-gray-400 mt-2">
                        Selected: {videoFile.name}
                      </p>
                    )}
                  </div>
                )}
                
                {uploadType === 'drive' && (
                  <Input
                    label="Google Drive URL"
                    type="text"
                    value={driveUrl}
                    onChange={handleDriveUrlChange}
                    placeholder="Enter Google Drive share URL"
                    fullWidth
                    error={errors.video}
                  />
                )}
                
                {uploadType === 'sample' && (
                  <div>
                    <label className="block text-gray-300 mb-1 text-sm">Sample Video</label>
                    <select
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className={`
                        bg-gray-800 
                        text-white 
                        rounded-lg 
                        border 
                        ${errors.video ? 'border-red-500' : 'border-gray-700'} 
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
                      <option value="">-- Select a sample video --</option>
                      {videoOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.video && (
                      <p className="text-red-500 text-xs mt-1">{errors.video}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-300 mb-1 text-sm">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter video description"
                rows={4}
                className={`
                  bg-gray-800 
                  text-white 
                  rounded-lg 
                  border 
                  ${errors.description ? 'border-red-500' : 'border-gray-700'} 
                  px-4 
                  py-2 
                  w-full
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-purple-500 
                  transition-colors 
                  duration-200
                `}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-300 mb-2 text-sm">Thumbnail</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {thumbnailOptions.map((thumb, index) => (
                  <div 
                    key={index}
                    onClick={() => setThumbnail(thumb)}
                    className={`
                      relative 
                      aspect-video 
                      rounded-lg 
                      overflow-hidden 
                      cursor-pointer 
                      border-2 
                      ${thumbnail === thumb ? 'border-purple-500' : 'border-transparent'}
                      hover:opacity-90 
                      transition-all 
                      duration-200
                    `}
                  >
                    <img 
                      src={thumb} 
                      alt={`Thumbnail option ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {thumbnail === thumb && (
                      <div className="absolute inset-0 bg-purple-500/30 flex items-center justify-center">
                        <div className="bg-purple-500 rounded-full p-1">
                          <ImagePlus className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {errors.thumbnail && (
                <p className="text-red-500 text-xs mt-1">{errors.thumbnail}</p>
              )}
            </div>
            
            {isLoading && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-400">Uploading...</span>
                  <span className="text-sm text-gray-400">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
            
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg">
                <p className="text-red-500 text-sm">{errors.submit}</p>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/videos')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Uploading...' : 'Upload Video'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default VideoUpload;