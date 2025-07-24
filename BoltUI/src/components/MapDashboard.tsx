import React, { useState } from 'react';
import { MapPin, Calendar, AlertTriangle, TrendingUp, Users } from 'lucide-react';

interface MapEvent {
  id: string;
  title: string;
  location: string;
  type: 'traffic' | 'event' | 'news' | 'emergency';
  severity: 'low' | 'medium' | 'high';
  coordinates: { x: number; y: number };
  time: string;
  description: string;
}

const MapDashboard: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<MapEvent | null>(null);
  const [mapView, setMapView] = useState<'street' | 'satellite'>('street');

  const mockEvents: MapEvent[] = [
    {
      id: '1',
      title: 'Traffic Jam on MG Road',
      location: 'MG Road, Bangalore',
      type: 'traffic',
      severity: 'high',
      coordinates: { x: 45, y: 60 },
      time: '2 hours ago',
      description: 'Heavy traffic congestion due to ongoing construction work.'
    },
    {
      id: '2',
      title: 'Tech Conference at UB City',
      location: 'UB City Mall, Bangalore',
      type: 'event',
      severity: 'medium',
      coordinates: { x: 35, y: 40 },
      time: '4 hours ago',
      description: 'Annual tech conference with 500+ attendees.'
    },
    {
      id: '3',
      title: 'Flood Alert - Outer Ring Road',
      location: 'Outer Ring Road, Bangalore',
      type: 'emergency',
      severity: 'high',
      coordinates: { x: 70, y: 30 },
      time: '1 hour ago',
      description: 'Heavy rainfall causing waterlogging in the area.'
    },
    {
      id: '4',
      title: 'New Metro Station Opening',
      location: 'Whitefield, Bangalore',
      type: 'news',
      severity: 'low',
      coordinates: { x: 80, y: 70 },
      time: '6 hours ago',
      description: 'New metro station inaugurated to improve connectivity.'
    }
  ];

  const getMarkerColor = (type: string, severity: string) => {
    switch (type) {
      case 'traffic':
        return severity === 'high' ? 'bg-red-500' : 'bg-yellow-500';
      case 'event':
        return 'bg-blue-500';
      case 'news':
        return 'bg-green-500';
      case 'emergency':
        return 'bg-red-600';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'traffic':
        return '🚗';
      case 'event':
        return '🎉';
      case 'news':
        return '📰';
      case 'emergency':
        return '⚠️';
      default:
        return '📍';
    }
  };

  return (
    <div className="h-full flex">
      {/* Map Area */}
      <div className="flex-1 relative bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100">
        {/* Map Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-2">
            <button
              onClick={() => setMapView(mapView === 'street' ? 'satellite' : 'street')}
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 rounded-lg transition-all duration-200"
            >
              {mapView === 'street' ? 'Satellite' : 'Street'} View
            </button>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-2">
            <button className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 rounded-lg transition-all duration-200">
              + Zoom In
            </button>
            <button className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 rounded-lg transition-all duration-200">
              - Zoom Out
            </button>
          </div>
        </div>

        {/* Map Content */}
        <div className="w-full h-full relative overflow-hidden">
          {/* Simulated Map Background */}
          <div className={`w-full h-full ${
            mapView === 'street' 
              ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50' 
              : 'bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200'
          }`}>
            {/* City Grid Pattern */}
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-1 p-4 opacity-10">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="bg-gradient-to-br from-slate-400 to-slate-500 rounded-sm"></div>
              ))}
            </div>

            {/* Event Markers */}
            {mockEvents.map((event) => (
              <div
                key={event.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  left: `${event.coordinates.x}%`,
                  top: `${event.coordinates.y}%`
                }}
                onClick={() => setSelectedEvent(event)}
              >
                <div className={`
                  w-6 h-6 rounded-full ${getMarkerColor(event.type, event.severity)} 
                  flex items-center justify-center text-white text-xs font-bold
                  animate-pulse shadow-xl hover:scale-125 transition-all duration-200 border-2 border-white/50
                `}>
                  {getTypeIcon(event.type)}
                </div>
                {selectedEvent?.id === event.id && (
                  <div className="absolute top-8 left-0 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 p-4 w-64 z-20">
                    <h3 className="font-semibold text-slate-900 mb-2">{event.title}</h3>
                    <p className="text-sm text-slate-600 mb-2">{event.description}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center">
                        <MapPin size={12} className="mr-1" />
                        {event.location}
                      </span>
                      <span className="flex items-center">
                        <Calendar size={12} className="mr-1" />
                        {event.time}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
          <h4 className="font-semibold text-slate-900 mb-2">Legend</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full mr-2 shadow-sm"></div>
              <span>Emergency / High Traffic</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mr-2 shadow-sm"></div>
              <span>Events</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full mr-2 shadow-sm"></div>
              <span>News</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full mr-2 shadow-sm"></div>
              <span>Traffic</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Stats */}
      <div className="w-80 bg-gradient-to-b from-white via-slate-50 to-blue-50 border-l border-white/20 p-6">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">Live Statistics</h3>
        
        {/* Stats Cards */}
        <div className="space-y-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Active Events</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">23</p>
              </div>
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                <TrendingUp className="text-white" size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-50 to-rose-50 p-4 rounded-xl border border-red-100 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Traffic Alerts</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-red-700 to-rose-700 bg-clip-text text-transparent">7</p>
              </div>
              <div className="p-2 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg">
                <AlertTriangle className="text-white" size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-medium">Online Users</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">1,247</p>
              </div>
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                <Users className="text-white" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-3">Recent Activity</h4>
          <div className="space-y-3">
            {mockEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="border-l-4 border-gradient-to-b from-blue-400 to-indigo-400 bg-gradient-to-r from-blue-50/50 to-transparent pl-3 py-2 rounded-r-lg">
                <p className="text-sm font-medium text-slate-900">{event.title}</p>
                <p className="text-xs text-slate-500">{event.time} • {event.location}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapDashboard;