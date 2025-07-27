import React, { useState } from 'react';
import { Calendar, MapPin, Tag, Clock, Search, Filter, X } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  publishedAt: string;
  tags: string[];
  severity: 'low' | 'medium' | 'high';
  type: 'news' | 'event' | 'alert';
}

const FilteredNews: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const mockNews: NewsItem[] = [
    {
      id: '1',
      title: 'Water Supply Disruption in Whitefield',
      description: 'BWSSB announces 12-hour water supply disruption due to pipeline maintenance work in Whitefield area.',
      category: 'Infrastructure',
      location: 'Whitefield',
      publishedAt: '2025-01-03T10:00:00Z',
      tags: ['water', 'maintenance', 'disruption'],
      severity: 'medium',
      type: 'alert'
    },
    {
      id: '2',
      title: 'Annual Tech Summit at Palace Grounds',
      description: 'Three-day technology summit featuring AI, blockchain, and cloud computing experts from around the world.',
      category: 'Technology',
      location: 'Palace Grounds',
      publishedAt: '2025-01-02T14:30:00Z',
      tags: ['tech', 'summit', 'AI', 'blockchain'],
      severity: 'low',
      type: 'event'
    },
    {
      id: '3',
      title: 'Traffic Advisory: MG Road Closure',
      description: 'MG Road will be closed from 6 AM to 10 AM tomorrow for metro construction work. Alternative routes suggested.',
      category: 'Transportation',
      location: 'MG Road',
      publishedAt: '2025-01-02T16:45:00Z',
      tags: ['traffic', 'closure', 'metro', 'construction'],
      severity: 'high',
      type: 'alert'
    },
    {
      id: '4',
      title: 'New IT Park Opens in Electronic City',
      description: 'State-of-the-art IT park with sustainable design opens in Electronic City Phase 2, creating 5000 new jobs.',
      category: 'Business',
      location: 'Electronic City',
      publishedAt: '2025-01-01T09:15:00Z',
      tags: ['IT', 'jobs', 'opening', 'sustainable'],
      severity: 'low',
      type: 'news'
    },
    {
      id: '5',
      title: 'Bangalore Marathon 2025 Registration Open',
      description: 'Registration for the annual Bangalore Marathon is now open. Event scheduled for February 15, 2025.',
      category: 'Sports',
      location: 'City Wide',
      publishedAt: '2025-01-01T12:00:00Z',
      tags: ['marathon', 'sports', 'registration', 'fitness'],
      severity: 'low',
      type: 'event'
    }
  ];

  const categories = ['All', 'Infrastructure', 'Technology', 'Transportation', 'Business', 'Sports', 'Weather'];
  const severityLevels = ['low', 'medium', 'high'];
  const dateRanges = ['all', 'today', 'week', 'month'];

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

  const toggleSeverity = (severity: string) => {
    setSelectedSeverity(prev => 
      prev.includes(severity) 
        ? prev.filter(s => s !== severity)
        : [...prev, severity]
    );
  };

  const filteredNews = mockNews.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         news.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         news.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(news.category);
    const matchesSeverity = selectedSeverity.length === 0 || selectedSeverity.includes(news.severity);
    
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert': return '⚠️';
      case 'event': return '📅';
      case 'news': return '📰';
      default: return '📄';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 min-h-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent mb-2">
          Filter News & Events
        </h2>
        <p className="text-slate-600">Find specific news and events based on your interests and location</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search news, events, locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200"
            />
          </div>
          
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Filter size={18} className="mr-2" />
            Filters {(selectedCategories.length + selectedSeverity.length > 0) && 
              `(${selectedCategories.length + selectedSeverity.length})`}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-200/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Categories */}
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={category === 'All' ? selectedCategories.length === 0 : selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                      />
                      <span className="ml-2 text-sm text-slate-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Severity */}
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Severity</h4>
                <div className="space-y-2">
                  {severityLevels.map((severity) => (
                    <label key={severity} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedSeverity.includes(severity)}
                        onChange={() => toggleSeverity(severity)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                      />
                      <span className="ml-2 text-sm text-slate-700 capitalize">{severity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Date Range</h4>
                <select
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedCategories.length > 0 || selectedSeverity.length > 0) && (
              <div className="mt-4">
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedSeverity([]);
                    setSearchTerm('');
                  }}
                  className="flex items-center text-sm text-slate-600 hover:text-slate-800 transition-colors duration-200"
                >
                  <X size={16} className="mr-1" />
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-slate-600">
        Showing {filteredNews.length} of {mockNews.length} results
      </div>

      {/* News Items */}
      <div className="space-y-4">
        {filteredNews.map((news) => (
          <div key={news.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-lg">{getTypeIcon(news.type)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(news.severity)}`}>
                    {news.severity.toUpperCase()}
                  </span>
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-xs font-medium border border-blue-200">
                    {news.category}
                  </span>
                </div>

                {/* Title and Description */}
                <h3 className="text-lg font-semibold text-slate-900 mb-2 hover:text-blue-700 transition-colors duration-200">{news.title}</h3>
                <p className="text-slate-600 mb-4">{news.description}</p>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center text-sm text-slate-500 space-x-4">
                  <span className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    {news.location}
                  </span>
                  <span className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    {formatDate(news.publishedAt)}
                  </span>
                </div>

                {/* Tags */}
                {news.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {news.tags.map((tag) => (
                      <span key={tag} className="flex items-center px-2 py-1 bg-gradient-to-r from-slate-100 to-slate-50 text-slate-600 rounded-lg text-xs border border-slate-200 hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200">
                        <Tag size={12} className="mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            <Search size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No results found</h3>
          <p className="text-slate-600">Try adjusting your search terms or filters</p>
        </div>
      )}
    </div>
  );
};

export default FilteredNews;