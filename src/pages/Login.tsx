import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAppStore } from '../lib/store';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { login, currentUser } = useAppStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    
    login(username);
    navigate('/');
  };
  
  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 shadow-lg">
          <div className="flex flex-col items-center mb-6">
            <Film className="text-purple-500 h-12 w-12" />
            <h1 className="text-2xl font-bold text-white mt-2">Welcome to WatchTogether</h1>
            <p className="text-gray-400 text-center mt-1">
              Enter a username to get started
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Input
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                fullWidth
                error={error}
              />
            </div>
            
            <Button type="submit" variant="primary" fullWidth>
              Continue
            </Button>
            
            <p className="text-gray-500 text-sm text-center mt-4">
              No account needed, just enter a username to get started.
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;