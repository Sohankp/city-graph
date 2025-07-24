import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Clock, MapPin } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'location' | 'event';
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your Bangalore News Assistant. I can help you find news, events, traffic updates, and more. What would you like to know?',
      sender: 'bot',
      timestamp: new Date(Date.now() - 60000),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('traffic') || message.includes('road')) {
      return 'Current traffic situation: MG Road has heavy congestion due to construction. ORR is experiencing moderate traffic. I recommend using Silk Board route for faster travel. Would you like specific route suggestions?';
    } else if (message.includes('weather')) {
      return 'Today\'s weather in Bangalore: Partly cloudy with a high of 26°C and low of 18°C. There\'s a 30% chance of rain in the evening. Perfect weather for outdoor activities!';
    } else if (message.includes('event') || message.includes('happening')) {
      return 'Upcoming events in Bangalore: Tech Summit at Palace Grounds (Jan 5-7), Food Festival in Lalbagh (Jan 10), Marathon registration open for Feb 15. Which type of events interest you most?';
    } else if (message.includes('metro') || message.includes('transport')) {
      return 'Bangalore Metro update: Purple Line is running on schedule. Green Line has minor delays due to maintenance. New metro station in Whitefield opens next month. Need specific route information?';
    } else if (message.includes('news')) {
      return 'Top news today: New IT park opens in Electronic City, Water supply disruption in Whitefield, Bangalore FC reaches AFC Cup finals. Would you like details on any specific story?';
    } else {
      return 'I can help you with traffic updates, weather information, local events, metro schedules, and breaking news in Bangalore. What specific information are you looking for?';
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { label: 'Traffic Update', action: 'What\'s the current traffic situation?' },
    { label: 'Weather Today', action: 'How\'s the weather today?' },
    { label: 'Upcoming Events', action: 'What events are happening this week?' },
    { label: 'Metro Status', action: 'How is the metro running today?' }
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Chat Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 p-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
            <Bot className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Bangalore News Assistant</h3>
            <p className="text-sm text-emerald-600 flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
              Online
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-white/20 p-4">
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => setInputMessage(action.action)}
              className="px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-sm hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 border border-blue-200/50 shadow-sm hover:shadow-md transform hover:scale-105"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
              message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
            }`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'user' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
                  : 'bg-gradient-to-r from-slate-300 to-slate-400'
              }`}>
                {message.sender === 'user' ? (
                  <User className="text-white" size={16} />
                ) : (
                  <Bot className="text-white" size={16} />
                )}
              </div>

              {/* Message Bubble */}
              <div className={`rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : 'bg-white/90 border border-white/20 text-slate-900'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-slate-500'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-end space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-slate-300 to-slate-400 rounded-full flex items-center justify-center shadow-md">
                <Bot className="text-white" size={16} />
              </div>
              <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-xl p-3 shadow-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-white/20 p-4 shadow-lg">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about traffic, weather, events, or news..."
              className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white/70 backdrop-blur-sm transition-all duration-200"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;