import React, { useState } from 'react';
import { Clock, Eye, Share2, Bookmark, ExternalLink } from 'lucide-react';

interface Story {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  views: number;
  category: string;
  imageUrl: string;
  isBookmarked: boolean;
}

const TopStories: React.FC = () => {
  const [bookmarkedStories, setBookmarkedStories] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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
      isBookmarked: false
    },
    {
      id: '4',
      title: 'New Startup Hub Opens in Koramangala',
      summary: 'A state-of-the-art startup incubation center opens in Koramangala, offering co-working spaces and mentorship programs for emerging entrepreneurs.',
      source: 'Startup News',
      publishedAt: '6 hours ago',
      views: 5670,
      category: 'Business',
      imageUrl: 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=800',
      isBookmarked: false
    },
    {
      id: '5',
      title: 'Bangalore FC Reaches AFC Cup Finals',
      summary: 'Local football club Bangalore FC secures their spot in the AFC Cup finals after a thrilling 2-1 victory against regional rivals.',
      source: 'Sports Tribune',
      publishedAt: '8 hours ago',
      views: 9240,
      category: 'Sports',
      imageUrl: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800',
      isBookmarked: false
    }
  ];

  const categories = ['all', 'Transportation', 'Technology', 'Weather', 'Business', 'Sports'];

  const filteredStories = selectedCategory === 'all' 
    ? mockStories 
    : mockStories.filter(story => story.category === selectedCategory);

  const toggleBookmark = (storyId: string) => {
    const newBookmarked = new Set(bookmarkedStories);
    if (newBookmarked.has(storyId)) {
      newBookmarked.delete(storyId);
    } else {
      newBookmarked.add(storyId);
    }
    setBookmarkedStories(newBookmarked);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 min-h-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent mb-2">
          Top Stories in Bangalore
        </h2>
        <p className="text-slate-600">Stay updated with the latest news and events happening in your city</p>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105'
                  : 'bg-white/70 backdrop-blur-sm text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 border border-white/20 shadow-sm hover:shadow-md'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStories.map((story) => (
          <div key={story.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl hover:transform hover:scale-105 transition-all duration-300">
            {/* Story Image */}
            <div className="relative">
              <img
                src={story.imageUrl}
                alt={story.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="absolute top-3 right-3">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm">
                  {story.category}
                </span>
              </div>
            </div>

            {/* Story Content */}
            <div className="p-5">
              <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2 hover:text-blue-700 transition-colors duration-200">
                {story.title}
              </h3>
              <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                {story.summary}
              </p>

              {/* Story Meta */}
              <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Clock size={12} className="mr-1" />
                    {story.publishedAt}
                  </span>
                  <span className="flex items-center">
                    <Eye size={12} className="mr-1" />
                    {story.views.toLocaleString()}
                  </span>
                </div>
                <span className="font-medium">{story.source}</span>
              </div>

              {/* Story Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleBookmark(story.id)}
                    className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                      bookmarkedStories.has(story.id) ? 'text-blue-600 bg-blue-50' : 'text-slate-400'
                    }`}
                  >
                    <Bookmark size={16} fill={bookmarkedStories.has(story.id) ? 'currentColor' : 'none'} />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 text-slate-400 hover:text-blue-600">
                    <Share2 size={16} />
                  </button>
                </div>
                <button className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-indigo-700 text-sm font-medium transition-all duration-200">
                  Read More
                  <ExternalLink size={14} className="ml-1" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-8">
        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
          Load More Stories
        </button>
      </div>
    </div>
  );
};

export default TopStories;