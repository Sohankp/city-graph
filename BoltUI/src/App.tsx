import React, { useState, useEffect } from 'react';
import { MapPin, Filter, MessageCircle, Upload, Search, Menu, X, TrendingUp, AlertTriangle, Users, Clock, Eye, Share2, Bookmark, ExternalLink, Send, Bot, User, Calendar, Tag, Image, AlertCircle, CheckCircle, Camera, Video, FileImage, Trash2, Edit3, Award, Settings, Bell, Shield, LogOut } from 'lucide-react';
import UserProfile from './components/UserProfile';

interface MapEvent {
  id: string;
  title: string;
  location: string;
  type: 'traffic' | 'event' | 'news' | 'emergency';
  severity: 'low' | 'medium' | 'high';
  sentiment: 'positive' | 'neutral' | 'negative';
  coordinates: { x: number; y: number };
  time: string;
  description: string;
  views?: number;
  category?: string;
  tags?: string[];
}

interface Story {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  views: number;
  category: string;
  imageUrl: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  isBookmarked: boolean;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

function App() {
  const [selectedEvent, setSelectedEvent] = useState<MapEvent | null>(null);
  const [activePanel, setActivePanel] = useState<'stories' | 'filter' | 'chat' | 'upload' | null>('stories');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your Bangalore News Assistant. I can help you find news, events, traffic updates, and more. What would you like to know?',
      sender: 'bot',
      timestamp: new Date(Date.now() - 60000)
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [bookmarkedStories, setBookmarkedStories] = useState<Set<string>>(new Set());
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const mockEvents: MapEvent[] = [
    {
      id: '1',
      title: 'Traffic Jam on MG Road',
      location: 'MG Road, Bangalore',
      type: 'traffic',
      severity: 'high',
      sentiment: 'negative',
      coordinates: { x: 45, y: 60 },
      time: '2 hours ago',
      description: 'Heavy traffic congestion due to ongoing construction work.',
      category: 'Transportation',
      tags: ['traffic', 'construction', 'delay']
    },
    {
      id: '2',
      title: 'Tech Conference at UB City',
      location: 'UB City Mall, Bangalore',
      type: 'event',
      severity: 'medium',
      sentiment: 'positive',
      coordinates: { x: 35, y: 40 },
      time: '4 hours ago',
      description: 'Annual tech conference with 500+ attendees.',
      category: 'Technology',
      tags: ['tech', 'conference', 'networking']
    },
    {
      id: '3',
      title: 'Flood Alert - Outer Ring Road',
      location: 'Outer Ring Road, Bangalore',
      type: 'emergency',
      severity: 'high',
      sentiment: 'negative',
      coordinates: { x: 70, y: 30 },
      time: '1 hour ago',
      description: 'Heavy rainfall causing waterlogging in the area.',
      category: 'Weather',
      tags: ['flood', 'rain', 'emergency']
    },
    {
      id: '4',
      title: 'New Metro Station Opening',
      location: 'Whitefield, Bangalore',
      type: 'news',
      severity: 'low',
      sentiment: 'positive',
      coordinates: { x: 80, y: 70 },
      time: '6 hours ago',
      description: 'New metro station inaugurated to improve connectivity.',
      category: 'Transportation',
      tags: ['metro', 'opening', 'connectivity']
    },
    {
      id: '5',
      title: 'Food Festival at Lalbagh',
      location: 'Lalbagh Botanical Garden',
      type: 'event',
      severity: 'low',
      sentiment: 'positive',
      coordinates: { x: 25, y: 55 },
      time: '3 hours ago',
      description: 'Weekend food festival featuring local cuisines.',
      category: 'Culture',
      tags: ['food', 'festival', 'weekend']
    }
  ];

  const mockStories: Story[] = [
    {
      id: '1',
      title: 'Bangalore Metro Phase 3 Construction Begins',
      summary: 'The much-awaited Phase 3 of Bangalore Metro has officially commenced with groundbreaking ceremony at multiple locations across the city.',
      source: 'Bangalore Mirror',
      publishedAt: '2 hours ago',
      views: 15420,
      category: 'Transportation',
      imageUrl: 'https://images.pexels.com/photos/4515956/pexels-photo-4515956.jpeg?auto=compress&cs=tinysrgb&w=800',
      sentiment: 'positive',
      isBookmarked: false
    },
    {
      id: '2',
      title: 'Tech Giants Expand Operations in Electronic City',
      summary: 'Major technology companies announce significant expansion plans in Electronic City, promising to create over 10,000 new jobs in the next two years.',
      source: 'Tech Today',
      publishedAt: '4 hours ago',
      views: 8930,
      category: 'Technology',
      imageUrl: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800',
      sentiment: 'positive',
      isBookmarked: false
    },
    {
      id: '3',
      title: 'Bangalore Weather Alert: Heavy Rains Expected',
      summary: 'Meteorological department issues yellow alert for Bangalore as heavy monsoon rains are expected to hit the city over the next 48 hours.',
      source: 'Weather Central',
      publishedAt: '1 hour ago',
      views: 12350,
      category: 'Weather',
      imageUrl: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800',
      sentiment: 'neutral',
      isBookmarked: false
    }
  ];

  const categories = ['All', 'Transportation', 'Technology', 'Weather', 'Business', 'Sports', 'Culture'];

  const getMarkerColor = (type: string, severity: string, sentiment: string) => {
    if (sentiment === 'positive') return 'bg-gradient-to-r from-emerald-500 to-teal-500';
    if (sentiment === 'negative') return 'bg-gradient-to-r from-red-500 to-rose-500';
    if (severity === 'high') return 'bg-gradient-to-r from-orange-500 to-red-500';
    return 'bg-gradient-to-r from-blue-500 to-indigo-500';
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-emerald-600 bg-emerald-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'traffic': return '🚗';
      case 'event': return '🎉';
      case 'news': return '📰';
      case 'emergency': return '⚠️';
      default: return '📍';
    }
  };

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(event.category || '');
    return matchesSearch && matchesCategory;
  });

  const filteredStories = mockStories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(story.category);
    return matchesSearch && matchesCategory;
  });

  const toggleCategory = (category: string) => {
    if (category === 'All') {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(prev => 
        prev.includes(category) 
          ? prev.filter(c => c !== category)
          : [...prev, category]
      );
    }
  };

  const toggleBookmark = (storyId: string) => {
    const newBookmarked = new Set(bookmarkedStories);
    if (newBookmarked.has(storyId)) {
      newBookmarked.delete(storyId);
    } else {
      newBookmarked.add(storyId);
    }
    setBookmarkedStories(newBookmarked);
  };

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('traffic') || message.includes('road')) {
      return 'Current traffic situation: MG Road has heavy congestion due to construction. ORR is experiencing moderate traffic. I recommend using Silk Board route for faster travel. Would you like specific route suggestions?';
    } else if (message.includes('weather')) {
      return 'Today\'s weather in Bangalore: Partly cloudy with a high of 26°C and low of 18°C. There\'s a 30% chance of rain in the evening. Perfect weather for outdoor activities!';
    } else if (message.includes('event') || message.includes('happening')) {
      return 'Upcoming events in Bangalore: Tech Summit at Palace Grounds (Jan 5-7), Food Festival in Lalbagh (Jan 10), Marathon registration open for Feb 15. Which type of events interest you most?';
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
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const renderStories = () => (
    <div className="space-y-4">
      {filteredStories.map((story) => (
        <div key={story.id} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="flex">
            <img src={story.imageUrl} alt={story.title} className="w-24 h-24 object-cover" />
            <div className="flex-1 p-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(story.sentiment)}`}>
                  {story.sentiment}
                </span>
                <span className="px-2 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-xs font-medium">
                  {story.category}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2">{story.title}</h3>
              <p className="text-sm text-slate-600 mb-2 line-clamp-2">{story.summary}</p>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center">
                  <Eye size={12} className="mr-1" />
                  {story.views.toLocaleString()}
                </span>
                <span>{story.publishedAt}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFilter = () => (
    <div className="space-y-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
        <h4 className="font-semibold text-slate-900 mb-3">Filter by Category</h4>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                category === 'All' ? (selectedCategories.length === 0 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'bg-white/70 text-slate-700 border border-slate-200') :
                selectedCategories.includes(category)
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : 'bg-white/70 text-slate-700 border border-slate-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">{getTypeIcon(event.type)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(event.sentiment)}`}>
                    {event.sentiment}
                  </span>
                  <span className="px-2 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-xs font-medium">
                    {event.category}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{event.title}</h3>
                <p className="text-sm text-slate-600 mb-2">{event.description}</p>
                <div className="flex items-center text-xs text-slate-500 space-x-3">
                  <span className="flex items-center">
                    <MapPin size={12} className="mr-1" />
                    {event.location}
                  </span>
                  <span className="flex items-center">
                    <Clock size={12} className="mr-1" />
                    {event.time}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-end space-x-2 max-w-xs ${
              message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'user' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
                  : 'bg-gradient-to-r from-slate-400 to-slate-500'
              }`}>
                {message.sender === 'user' ? (
                  <User className="text-white" size={12} />
                ) : (
                  <Bot className="text-white" size={12} />
                )}
              </div>
              <div className={`rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : 'bg-white/90 border border-white/20 text-slate-900'
              }`}>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask about traffic, weather, events..."
          className="flex-1 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim()}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 transition-all duration-200"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );

  const renderUpload = () => (
    <div className="space-y-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
        <h4 className="font-semibold text-slate-900 mb-3">Upload Event</h4>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Event title"
            className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
          />
          <textarea
            placeholder="Event description"
            rows={3}
            className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
          />
          <select className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm">
            <option value="">Select category</option>
            {categories.slice(1).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Location"
            className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
          />
          
          {/* Media Upload Section */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">
              Upload Images/Videos
            </label>
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
                dragActive 
                  ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50' 
                  : 'border-slate-300 bg-white/50 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50'
              }`}
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(false);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(false);
                
                const files = Array.from(e.dataTransfer.files).filter(file => 
                  file.type.startsWith('image/') || file.type.startsWith('video/')
                );
                setUploadFiles(prev => [...prev, ...files].slice(0, 5));
              }}
            >
              <div className="flex items-center justify-center mb-3">
                <Camera className="text-blue-500 mr-2" size={24} />
                <Video className="text-indigo-500" size={24} />
              </div>
              <p className="text-slate-600 mb-2">Drag and drop images or videos here</p>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []).filter(file => 
                    file.type.startsWith('image/') || file.type.startsWith('video/')
                  );
                  setUploadFiles(prev => [...prev, ...files].slice(0, 5));
                }}
                className="hidden"
                id="media-upload"
              />
              <label
                htmlFor="media-upload"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 cursor-pointer inline-block shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Choose Files
              </label>
              <p className="text-xs text-slate-500 mt-2">Max 5 files, 10MB each</p>
            </div>

            {/* File Preview */}
            {uploadFiles.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {uploadFiles.map((file, index) => (
                  <div key={index} className="relative bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-3 border border-slate-200">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {file.type.startsWith('image/') ? (
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                            <FileImage className="text-blue-600" size={20} />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                            <Video className="text-purple-600" size={20} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                        <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button
                        onClick={() => setUploadFiles(prev => prev.filter((_, i) => i !== index))}
                        className="flex-shrink-0 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center">
            <Upload size={16} className="mr-2" />
            Submit Event
          </button>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => <UserProfile />;

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Main Map Area */}
      <div className="flex-1 relative">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 hover:bg-white transition-all duration-200"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <MapPin className="text-white" size={16} />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                  Bangalore Live Dashboard
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search news and events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Map Content */}
        <div className="w-full h-full pt-20 relative overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 relative">
            {/* Realistic Map Background with Roads and Areas */}
            <div className="absolute inset-0">
              {/* Major Roads */}
              <div className="absolute top-1/2 left-0 right-0 h-2 bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 opacity-60 transform -rotate-12"></div>
              <div className="absolute top-1/3 left-0 right-0 h-1 bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 opacity-50 transform rotate-6"></div>
              <div className="absolute top-2/3 left-0 right-0 h-1 bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 opacity-50 transform -rotate-3"></div>
              
              {/* City Areas */}
              <div className="absolute top-1/4 left-1/4 w-32 h-24 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-xl opacity-70">
                <div className="p-2 text-xs font-medium text-blue-800">Electronic City</div>
              </div>
              <div className="absolute top-1/2 right-1/4 w-28 h-20 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-xl opacity-70">
                <div className="p-2 text-xs font-medium text-emerald-800">Whitefield</div>
              </div>
              <div className="absolute bottom-1/3 left-1/3 w-24 h-18 bg-gradient-to-br from-amber-200/30 to-yellow-200/30 rounded-xl opacity-70">
                <div className="p-2 text-xs font-medium text-amber-800">Koramangala</div>
              </div>
              <div className="absolute top-1/3 left-1/2 w-20 h-16 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-xl opacity-70">
                <div className="p-2 text-xs font-medium text-purple-800">MG Road</div>
              </div>
              
              {/* Parks and Green Areas */}
              <div className="absolute bottom-1/4 right-1/3 w-16 h-16 bg-gradient-to-br from-green-300/40 to-emerald-300/40 rounded-full opacity-80">
                <div className="p-1 text-xs font-medium text-green-800 text-center mt-2">Lalbagh</div>
              </div>
              <div className="absolute top-1/5 right-1/5 w-12 h-12 bg-gradient-to-br from-green-300/40 to-emerald-300/40 rounded-full opacity-80">
                <div className="p-1 text-xs font-medium text-green-800 text-center mt-1">Cubbon</div>
              </div>
            </div>

            {/* Event Markers */}
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  left: `${event.coordinates.x}%`,
                  top: `${event.coordinates.y}%`
                }}
                onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
              >
                <div className={`
                  w-8 h-8 rounded-full ${getMarkerColor(event.type, event.severity, event.sentiment)} 
                  flex items-center justify-center text-white text-sm font-bold
                  shadow-xl hover:scale-125 transition-all duration-200 border-2 border-white/50
                  ${selectedEvent?.id === event.id ? 'animate-pulse scale-125' : 'animate-pulse'}
                `}>
                  {getTypeIcon(event.type)}
                </div>
                {selectedEvent?.id === event.id && (
                  <div className="absolute top-10 left-0 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 p-4 w-72 z-30">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(event.sentiment)}`}>
                        {event.sentiment}
                      </span>
                      <span className="px-2 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-xs font-medium">
                        {event.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{event.title}</h3>
                    <p className="text-sm text-slate-600 mb-3">{event.description}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center">
                        <MapPin size={12} className="mr-1" />
                        {event.location}
                      </span>
                      <span className="flex items-center">
                        <Clock size={12} className="mr-1" />
                        {event.time}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats Overlay */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {filteredEvents.filter(e => e.sentiment === 'positive').length}
              </div>
              <div className="text-xs text-emerald-600">Positive</div>
            </div>
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent">
                {filteredEvents.filter(e => e.sentiment === 'neutral').length}
              </div>
              <div className="text-xs text-slate-600">Neutral</div>
            </div>
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                {filteredEvents.filter(e => e.sentiment === 'negative').length}
              </div>
              <div className="text-xs text-red-600">Negative</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-96 bg-gradient-to-b from-white via-slate-50 to-blue-50 shadow-2xl backdrop-blur-sm border-l border-white/20 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-200/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Dashboard
              </h2>
            </div>
            <div className="flex space-x-1 bg-slate-100 rounded-xl p-1">
              {[
                { id: 'stories', name: 'Stories', icon: Search },
                { id: 'filter', name: 'Filter', icon: Filter },
                { id: 'chat', name: 'Chat', icon: MessageCircle },
                { id: 'upload', name: 'Upload', icon: Upload },
                { id: 'profile', name: 'Profile', icon: User }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActivePanel(activePanel === tab.id ? null : tab.id as any)}
                    className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activePanel === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'text-slate-600 hover:bg-white hover:text-blue-600'
                    }`}
                  >
                    <Icon size={16} className="mr-1" />
                    {tab.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activePanel === 'stories' && renderStories()}
            {activePanel === 'filter' && renderFilter()}
            {activePanel === 'chat' && renderChat()}
            {activePanel === 'upload' && renderUpload()}
            {activePanel === 'profile' && renderProfile()}
            {!activePanel && (
              <div className="text-center text-slate-500 mt-8">
                <MapPin size={48} className="mx-auto mb-4 text-slate-300" />
                <p>Select a tab above to view content</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;