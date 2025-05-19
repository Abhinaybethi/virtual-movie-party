import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  uploadedBy: string;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: Date;
}

export interface Room {
  id: string;
  name: string;
  videoId: string | null;
  createdBy: string;
  viewers: User[];
  messages: ChatMessage[];
  isPlaying: boolean;
  currentTime: number;
}

interface AppState {
  currentUser: User | null;
  videos: Video[];
  rooms: Room[];
  currentRoom: Room | null;
  
  // Auth actions
  login: (name: string) => void;
  logout: () => void;
  
  // Video actions
  addVideo: (video: Omit<Video, 'id' | 'createdAt' | 'uploadedBy'>) => void;
  getVideoById: (id: string) => Video | undefined;
  
  // Room actions
  createRoom: (name: string) => Room;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  sendMessage: (text: string) => void;
  
  // Playback actions
  setIsPlaying: (isPlaying: boolean) => void;
  updateCurrentTime: (time: number) => void;
  setCurrentVideo: (videoId: string) => void;
}

// Sample videos for demo purposes
const demoVideos: Video[] = [
  {
    id: '1',
    title: 'Big Buck Bunny',
    description: 'A short animated film about a day in the life of Big Buck Bunny',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.pexels.com/photos/33129/popcorn-movie-party-entertainment.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    uploadedBy: 'demo',
    createdAt: new Date()
  },
  {
    id: '2',
    title: 'Elephant Dream',
    description: 'The first Blender Open Movie from 2006',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    uploadedBy: 'demo',
    createdAt: new Date()
  },
  {
    id: '3',
    title: 'Sintel',
    description: 'Third Blender Open Movie from 2010',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    thumbnail: 'https://images.pexels.com/photos/7234255/pexels-photo-7234255.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    uploadedBy: 'demo',
    createdAt: new Date()
  }
];

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  videos: demoVideos,
  rooms: [],
  currentRoom: null,
  
  login: (name: string) => set({
    currentUser: {
      id: uuidv4(),
      name,
      avatar: `https://avatars.dicebear.com/api/identicon/${name}.svg`
    }
  }),
  
  logout: () => {
    if (get().currentRoom) {
      get().leaveRoom();
    }
    set({ currentUser: null });
  },
  
  addVideo: (video) => {
    const { currentUser } = get();
    if (!currentUser) return;
    
    const newVideo: Video = {
      id: uuidv4(),
      ...video,
      uploadedBy: currentUser.id,
      createdAt: new Date()
    };
    
    set(state => ({
      videos: [...state.videos, newVideo]
    }));
  },
  
  getVideoById: (id: string) => {
    return get().videos.find(video => video.id === id);
  },
  
  createRoom: (name: string) => {
    const { currentUser } = get();
    if (!currentUser) throw new Error('User must be logged in to create a room');
    
    const room: Room = {
      id: uuidv4(),
      name,
      videoId: null,
      createdBy: currentUser.id,
      viewers: [currentUser],
      messages: [],
      isPlaying: false,
      currentTime: 0
    };
    
    set(state => ({
      rooms: [...state.rooms, room],
      currentRoom: room
    }));
    
    return room;
  },
  
  joinRoom: (roomId: string) => {
    const { currentUser, rooms } = get();
    if (!currentUser) throw new Error('User must be logged in to join a room');
    
    const room = rooms.find(r => r.id === roomId);
    if (!room) throw new Error('Room not found');
    
    // Check if user is already in the room
    if (!room.viewers.some(v => v.id === currentUser.id)) {
      room.viewers.push(currentUser);
    }
    
    set({ currentRoom: room });
  },
  
  leaveRoom: () => {
    const { currentUser, currentRoom } = get();
    if (!currentUser || !currentRoom) return;
    
    const updatedViewers = currentRoom.viewers.filter(
      viewer => viewer.id !== currentUser.id
    );
    
    const updatedRooms = get().rooms.map(room => {
      if (room.id === currentRoom.id) {
        return { ...room, viewers: updatedViewers };
      }
      return room;
    });
    
    set({
      rooms: updatedRooms,
      currentRoom: null
    });
  },
  
  sendMessage: (text: string) => {
    const { currentUser, currentRoom } = get();
    if (!currentUser || !currentRoom) return;
    
    const newMessage: ChatMessage = {
      id: uuidv4(),
      userId: currentUser.id,
      username: currentUser.name,
      text,
      timestamp: new Date()
    };
    
    const updatedRoom = {
      ...currentRoom,
      messages: [...currentRoom.messages, newMessage]
    };
    
    const updatedRooms = get().rooms.map(room => {
      if (room.id === currentRoom.id) {
        return updatedRoom;
      }
      return room;
    });
    
    set({
      rooms: updatedRooms,
      currentRoom: updatedRoom
    });
  },
  
  setIsPlaying: (isPlaying: boolean) => {
    const { currentRoom } = get();
    if (!currentRoom) return;
    
    const updatedRoom = { ...currentRoom, isPlaying };
    
    const updatedRooms = get().rooms.map(room => {
      if (room.id === currentRoom.id) {
        return updatedRoom;
      }
      return room;
    });
    
    set({
      rooms: updatedRooms,
      currentRoom: updatedRoom
    });
  },
  
  updateCurrentTime: (time: number) => {
    const { currentRoom } = get();
    if (!currentRoom) return;
    
    const updatedRoom = { ...currentRoom, currentTime: time };
    
    const updatedRooms = get().rooms.map(room => {
      if (room.id === currentRoom.id) {
        return updatedRoom;
      }
      return room;
    });
    
    set({
      rooms: updatedRooms,
      currentRoom: updatedRoom
    });
  },
  
  setCurrentVideo: (videoId: string) => {
    const { currentRoom } = get();
    if (!currentRoom) return;
    
    const updatedRoom = {
      ...currentRoom,
      videoId,
      currentTime: 0,
      isPlaying: false
    };
    
    const updatedRooms = get().rooms.map(room => {
      if (room.id === currentRoom.id) {
        return updatedRoom;
      }
      return room;
    });
    
    set({
      rooms: updatedRooms,
      currentRoom: updatedRoom
    });
  }
}));