import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import VideoCard from './VideoCard';
import '../../../styles/components/video-list.css';

const VideoList = ({ category, limit = 12, showFilters = true }) => {
  const { user } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const videosPerPage = 12;

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [sortBy, setSortBy] = useState('newest');

  // Mock data - Replace with API call
  const mockVideos = [
    {
      id: '1',
      title: 'Introduction to CAD Design',
      description: 'Learn the fundamentals of Computer-Aided Design for mechanical engineering.',
      thumbnail: 'https://via.placeholder.com/320x180',
      duration: '45:22',
      level: 'beginner',
      category: 'cad',
      views: 1250,
      likes: 89,
      uploadDate: '2024-01-15',
      instructor: 'Dr. Sarah Johnson',
      premium: false,
      saved: false
    },
    {
      id: '2',
      title: 'Advanced Finite Element Analysis',
      description: 'Master FEA techniques for structural analysis and optimization.',
      thumbnail: 'https://via.placeholder.com/320x180',
      duration: '1:22:10',
      level: 'advanced',
      category: 'analysis',
      views: 842,
      likes: 65,
      uploadDate: '2024-01-10',
      instructor: 'Prof. Michael Chen',
      premium: true,
      saved: true
    },
    {
      id: '3',
      title: '3D Printing for Prototyping',
      description: 'Complete guide to 3D printing for mechanical prototypes.',
      thumbnail: 'https://via.placeholder.com/320x180',
      duration: '38:45',
      level: 'intermediate',
      category: 'manufacturing',
      views: 2100,
      likes: 142,
      uploadDate: '2024-01-05',
      instructor: 'Alex Rodriguez',
      premium: false,
      saved: false
    },
    // Add more mock videos...
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'cad', name: 'CAD Design' },
    { id: 'analysis', name: 'Analysis' },
    { id: 'manufacturing', name: 'Manufacturing' },
    { id: 'materials', name: 'Materials Science' },
    { id: 'thermodynamics', name: 'Thermodynamics' },
    { id: 'robotics', name: 'Robotics' }
  ];

  const levels = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' }
  ];

  const sortOptions = [
    { id: 'newest', name: 'Newest First' },
    { id: 'popular', name: 'Most Popular' },
    { id: 'duration', name: 'Duration' },
    { id: 'alphabetical', name: 'A to Z' }
  ];

  useEffect(() => {
    fetchVideos();
  }, [category]);

  useEffect(() => {
    applyFilters();
  }, [videos, searchTerm, selectedLevel, selectedCategory, sortBy]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setVideos(mockVideos);
      setFilteredVideos(mockVideos);
      setTotalPages(Math.ceil(mockVideos.length / videosPerPage));
    } catch (err) {
      setError('Failed to load videos. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...videos];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(video => video.level === selectedLevel);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(video => video.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.uploadDate) - new Date(a.uploadDate);
        case 'popular':
          return b.views - a.views;
        case 'duration':
          return parseDuration(b.duration) - parseDuration(a.duration);
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    // Pagination
    const startIndex = (currentPage - 1) * videosPerPage;
    const endIndex = startIndex + videosPerPage;
    const paginated = limit ? filtered.slice(0, limit) : filtered.slice(startIndex, endIndex);

    setFilteredVideos(paginated);
    setTotalPages(Math.ceil(filtered.length / videosPerPage));
  };

  const parseDuration = (duration) => {
    const parts = duration.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    } else if (parts.length === 3) {
      return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    }
    return 0;
  };

  const handleSaveVideo = async (videoId) => {
    try {
      // API call to save/unsave video
      setVideos(prev => prev.map(video =>
        video.id === videoId ? { ...video, saved: !video.saved } : video
      ));
    } catch (err) {
      console.error('Failed to save video:', err);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLevel('all');
    setSelectedCategory('all');
    setSortBy('newest');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner-large"></div>
        <p>Loading videos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="error-icon">⚠️</div>
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button onClick={fetchVideos} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="videos-page">
      <div className="videos-header">
        <h1>Mechanical Engineering Videos</h1>
        <p>Learn from industry experts with comprehensive video tutorials</p>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="video-filters">
          <div className="filter-row">
            <div className="filter-group">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`filter-button ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="search-box">
              <input
                type="text"
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="search-icon">🔍</div>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              {levels.map(level => (
                <button
                  key={level.id}
                  className={`filter-button ${selectedLevel === level.id ? 'active' : ''}`}
                  onClick={() => setSelectedLevel(level.id)}
                >
                  {level.name}
                </button>
              ))}
            </div>

            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>

            <button onClick={clearFilters} className="filter-button">
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Video Grid */}
      <div className="video-grid-container">
        {filteredVideos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎥</div>
            <h3>No videos found</h3>
            <p>Try adjusting your filters or search term</p>
            <button onClick={clearFilters} className="btn-primary">
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="video-grid">
              {filteredVideos.map(video => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onSave={handleSaveVideo}
                  user={user}
                />
              ))}
            </div>

            {/* Pagination */}
            {!limit && totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>

                <div className="pagination-numbers">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  className="pagination-button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VideoList;