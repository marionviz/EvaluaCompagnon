import React from 'react';
import type { ChatMessage } from '../types';

interface ChatMessageProps {
  message: ChatMessage;
}

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  // Détection de questions métacognitives
  const hasMetacognitiveMarker = message.text.includes('❓');

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 fade-in`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-sm'
            : hasMetacognitiveMarker
            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-gray-900 rounded-bl-sm border-l-4 border-green-600'
            : 'bg-gray-100 text-gray-900 rounded-bl-sm'
        }`}
      >
        <div className="flex items-start gap-2">
          {!isUser && (
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-xs font-bold text-white">
              EC
            </div>
          )}
          <div className="flex-1">
            <div 
              className="whitespace-pre-wrap break-words"
              dangerouslySetInnerHTML={{
                __html: message.text
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
                  .replace(/❓/g, '<span class="inline-block mr-1">❓</span>')
              }}
            />
            {message.timestamp && (
              <div className="text-xs opacity-60 mt-1">
                {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessageComponent;
