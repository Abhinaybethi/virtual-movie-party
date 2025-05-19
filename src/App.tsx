import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VideoDetail from './pages/VideoDetail';
import VideoUpload from './pages/VideoUpload';
import VideoBrowse from './pages/VideoBrowse';
import RoomBrowse from './pages/RoomBrowse';
import RoomCreate from './pages/RoomCreate';
import RoomDetail from './pages/RoomDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/videos" element={<VideoBrowse />} />
        <Route path="/videos/:id" element={<VideoDetail />} />
        <Route path="/videos/upload" element={<VideoUpload />} />
        
        <Route path="/rooms" element={<RoomBrowse />} />
        <Route path="/rooms/create" element={<RoomCreate />} />
        <Route path="/rooms/:id" element={<RoomDetail />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;