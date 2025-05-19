import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useAppStore, ChatMessage } from '../../lib/store';

const ChatPanel: React.FC = () => {
  const { currentRoom, sendMessage, currentUser } = useAppStore();
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim() && currentUser) {
      sendMessage(messageText);
      setMessageText('');
    }
  };
  
  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentRoom?.messages]);
  
  if (!currentRoom || !currentUser) return null;
  
  const formatMessageTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      <div className="bg-gray-800 p-3 border-b border-gray-700">
        <h3 className="text-white font-medium">Live Chat</h3>
      </div>
      
      <div className="flex-grow overflow-y-auto p-3 space-y-3">
        {currentRoom.messages.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No messages yet. Start the conversation!
          </div>
        ) : (
          currentRoom.messages.map((msg: ChatMessage) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.userId === currentUser.id ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[80%] px-3 py-2 rounded-lg ${
                  msg.userId === currentUser.id 
                    ? 'bg-purple-600 text-white rounded-tr-none' 
                    : 'bg-gray-800 text-gray-200 rounded-tl-none'
                }`}
              >
                {msg.userId !== currentUser.id && (
                  <div className="text-xs font-medium text-purple-400 mb-1">
                    {msg.username}
                  </div>
                )}
                <p className="text-sm">{msg.text}</p>
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {formatMessageTime(msg.timestamp)}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form 
        onSubmit={handleSubmit}
        className="border-t border-gray-800 p-3"
      >
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow bg-gray-800 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button 
            type="submit"
            disabled={!messageText.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPanel;