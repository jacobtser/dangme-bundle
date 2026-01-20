import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from '../../services/api';
import VideoCard from './VideoCard';


const VideoList = ({ category = 'all', showOnlyPremium = false }) => {
  const { user, isPremium } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalVideos, setTotalVideos] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [sortBy, setSortBy] = useState('newest');
  
  const observer = React.useRef();
  const lastVideoElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    setPage(1);
    setVideos([]);
    fetchVideos(1, true);
    fetchCategories();
  }, [selectedCategory, sortBy, showOnlyPremium]);

  useEffect(() => {
    fetchVideos(page, false);
  }, [page]);

  const fetchVideos = async (pageNum, reset) => {
    try {
      if (reset) setLoading(true);
      
      const response = await axios.get('/api/videos', {
        params: {
          category: selectedCategory,
          page: pageNum,
          limit: 12,
          sortBy,
          premiumOnly: showOnlyPremium,
          userId: user?._id
        }
      });

      if (reset) {
        setVideos(response.data.videos);
      } else {
        setVideos(prev => [...prev, ...response.data.videos]);
      }
      
      setHasMore(response.data.hasMore);
      setTotalVideos(response.data.total);
      setError(null);
    } catch (err) {
      setError('Failed to load videos');
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/videos/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    navigate(`${location.pathname}?category=${category}`);
  };

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
  };

  const handleVideoClick = (video) => {
    if (video.isPremium && !isPremium) {
      navigate('/premium', { state: { videoId: video._id } });
    } else {
      navigate(`/watch/${video._id}`);
    }
  };

  const renderVideoGrid = () => {
    if (videos.length === 0 && !loading) {
      return (
        <div className="empty-state">
          <div className="empty-icon">📺</div>
          <h3>No videos found</h3>
          <p>Try selecting a different category or check back later</p>
        </div>
      );
    }

    return (
      <div className="video-grid">
        {videos.map((video, index) => {
          if (videos.length === index + 1) {
            return (
              <div 
                ref={lastVideoElementRef}
                key={video._id}
                onClick={() => handleVideoClick(video)}
              >
                <VideoCard 
                  video={video}
                  isPremiumUser={isPremium}
                  user={user}
                />
              </div>
            );
          }
          return (
            <div 
              key={video._id}
              onClick={() => handleVideoClick(video)}
            >
              <VideoCard 
                video={video}
                isPremiumUser={isPremium}
                user={user}
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="video-list-container">
      {/* Filters */}
      <div className="video-filters">
        {/* Category Filter */}
        <div className="category-filter">
          <button
            className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('all')}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat._id}
              className={`category-btn ${selectedCategory === cat.slug ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort Filter */}
        <div className="sort-filter">
          <select 
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
            <option value="trending">Trending</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="video-stats-bar">
        <span className="total-videos">
          {totalVideos.toLocaleString()} videos
          {showOnlyPremium && ' (Premium Only)'}
        </span>
        <span className="category-indicator">
          Category: {selectedCategory === 'all' ? 'All Videos' : 
            categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
        </span>
      </div>

      {/* Video Grid */}
      {renderVideoGrid()}

      {/* Loading */}
      {loading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Loading videos...</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => fetchVideos(1, true)}>Try Again</button>
        </div>
      )}

      {/* Load More */}
      {!loading && hasMore && videos.length > 0 && (
        <div className="load-more">
          <button 
            onClick={() => setPage(prev => prev + 1)}
            className="load-more-btn"
          >
            Load More Videos
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoList;
