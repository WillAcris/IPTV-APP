import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';
import { io, Socket } from "socket.io-client";

interface LiveChatProps {
  channelName: string;
}

const SOCKET_SERVER_URL = 'http://localhost:4000';

export const LiveChat: React.FC<LiveChatProps> = ({ channelName }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL);
    setMessages([]);
    socketRef.current.on('load_history', (history: ChatMessage[]) => {
      setMessages(history);
    });

    socketRef.current.on('receive_message', (message: ChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [channelName]); 


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !socketRef.current) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      author: 'Você',
      text: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    socketRef.current.emit('send_message', userMessage);
    
    setNewMessage('');
  };

  return (
    <div className="mt-6 lg:mt-0 bg-gray-50 dark:bg-slate-800/50 rounded-lg shadow-inner flex flex-col max-h-[calc(100vh-450px)] lg:max-h-[calc(100vh-120px)] lg:h-full">
      <h2 className="text-xl font-semibold p-4 text-blue-600 dark:text-blue-300 border-b border-gray-200 dark:border-slate-700">
        Chat ao Vivo para {channelName}
      </h2>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={`${msg.id}-${index}`} className={`flex flex-col ${msg.author === 'Você' ? 'items-end' : 'items-start'}`}>
            <div className={`rounded-lg px-3 py-2 max-w-xs lg:max-w-full ${
                msg.author === 'Você'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-300'
              }`}>
              <div className="font-bold text-sm">
                {msg.author}
              </div>
              <p className="text-sm break-words">{msg.text}</p>
              <div className="text-xs text-right opacity-70 mt-1">
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-slate-700 flex flex-shrink-0">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-l-md p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          aria-label="Chat message input"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white font-bold py-2 px-3 lg:px-4 rounded-r-md hover:bg-blue-700 transition-colors duration-200 text-sm"
          aria-label="Send message"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};