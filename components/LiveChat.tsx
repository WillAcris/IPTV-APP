import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';

interface LiveChatProps {
  channelName: string;
}

// Usar a API do backend (funciona tanto em dev quanto em produção)
const API_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:3000/api' 
  : '/api';

export const LiveChat: React.FC<LiveChatProps> = ({ channelName }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Carregar username do localStorage
  useEffect(() => {
    const savedUsername = localStorage.getItem('chat-username');
    if (savedUsername) {
      setUsername(savedUsername);
      setIsUsernameSet(true);
    }
  }, []);

  // Buscar mensagens do canal
  useEffect(() => {
    if (!isUsernameSet) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(`${API_URL}/messages/${encodeURIComponent(channelName)}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
      }
    };

    fetchMessages();

    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [channelName, isUsernameSet]);

  const handleSetUsername = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === '') return;
    localStorage.setItem('chat-username', username.trim());
    setIsUsernameSet(true);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    try {
      await fetch(`${API_URL}/messages/${encodeURIComponent(channelName)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: username,
          text: newMessage.trim(),
        }),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  // Se username não está definido, mostrar formulário
  if (!isUsernameSet) {
    return (
      <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg shadow-inner flex flex-col p-6 h-full items-center justify-center">
        <h2 className="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-300">
          Entre no Chat
        </h2>
        <form onSubmit={handleSetUsername} className="w-full max-w-sm">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Digite seu nome..."
            className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md p-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
            aria-label="Username input"
            maxLength={20}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition-colors duration-200"
            aria-label="Enter chat"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg shadow-inner flex flex-col h-full">
      <div className="p-3 border-b border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-blue-600 dark:text-blue-300">
          Chat ao Vivo
        </h2>
      </div>
      
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 text-sm">
            Nenhuma mensagem ainda.<br/>Seja o primeiro a conversar!
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={`${msg.id}-${index}`} className={`flex flex-col ${msg.author === username ? 'items-end' : 'items-start'}`}>
              <div className={`rounded-lg px-2.5 py-1.5 max-w-[85%] ${
                  msg.author === username
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-300'
                }`}>
                <div className="font-semibold text-xs">
                  {msg.author}
                </div>
                <p className="text-xs break-words">{msg.text}</p>
                <div className="text-[10px] text-right opacity-70 mt-0.5">
                  {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-2.5 border-t border-gray-200 dark:border-slate-700">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Mensagem..."
            className="flex-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md px-2.5 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
            aria-label="Chat message input"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-xs"
            aria-label="Send message"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};
```