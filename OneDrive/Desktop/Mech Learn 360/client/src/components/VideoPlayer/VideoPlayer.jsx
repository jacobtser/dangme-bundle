import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { AuthContext } from '../../context/AuthContext';
import PremiumGate from '../PremiumGate/PremiumGate';
import '../../../styles/components/video-player.css';

const VideoPlayer = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const playerRef = useRef(null);
  
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Video player states
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [fullscreen, setFullscreen] = useState(false);
  
  // UI states
  const [showControls, setShowControls] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showChapters, setShowChapters] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Mock video data - Replace with API call
  const mockVideo = {
    id: videoId || '1',
    title: 'Advanced Finite Element Analysis',
    description: 'Master FEA techniques for structural analysis and optimization. This comprehensive tutorial covers meshing, boundary conditions, and result interpretation.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://via.placeholder.com/1280x720',
    duration: '1:22:10',
    level: 'advanced',
    category: 'analysis',
    views: 842,
    likes: 65,
    uploadDate: '2024-01-10',
    instructor: {
      name: 'Prof. Michael Chen',
      avatar: 'MC',
      title: 'Senior Structural Analyst',
      company: 'TechCorp Industries'
    },
    premium: true,
    chapters: [
      { time: '0:00', title: 'Introduction to FEA', duration: '5:30' },
      { time: '5:30', title: 'Meshing Techniques', duration: '15:20' },
      { time: '20:50', title: 'Applying Boundary Conditions', duration: '12:45' },
      { time: '33:35', title: 'Material Properties', duration: '10:15' },
      { time: '43:50', title: 'Solving and Convergence', duration: '18:30' },
      { time: '62:20', title: 'Result Interpretation', duration: '20:00' }
    ],
    relatedVideos: [
      { id: '2', title: 'Introduction to CAD Design', duration: '45:22', thumbnail: 'https://via.placeholder.com/320x180' },
      { id: '3', title: '3D Printing for Prototyping', duration: '38:45', thumbnail: 'https://via.placeholder.com/320x180' },
      { id: '4', title: 'Thermal Analysis Basics', duration: '52:10', thumbnail: 'https://via.placeholder.com/320x180' }
    ]
  };

  const mockComments = [
    {
      id: 1,
      author: 'Sarah Johnson',
      avatar: 'SJ',
      time: '2 days ago',
      content: 'Excellent explanation of meshing techniques! The practical examples were very helpful.',
      likes: 12,
      liked: false,
      replies: []
    },
    {
      id: 2,
      author: 'Alex Rodriguez',
      avatar: 'AR',
      time: '3 days ago',
      content: 'Could you provide more details about convergence criteria?',
      likes: 5,
      liked: true,
      replies: [
        {
          id: 21,
          author: 'Prof. Michael Chen',
          avatar: 'MC',
          time: '2 days ago',
          content: 'Sure! I\'ll cover convergence criteria in more detail in the next video. Stay tuned!',
          likes: 3
        }
      ]
    }
  ];

  useEffect(() => {
    fetchVideo();
    startControlTimeout();
  }, [videoId]);

  const fetchVideo = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setVideo(mockVideo);
      setLiked(mockVideo.liked || false);
      setSaved(mockVideo.saved || false);
      setComments(mockComments);
    } catch (err) {
      setError('Failed to load video. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startControlTimeout = () => {
    setTimeout(() => {
      if (playing) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
    setShowControls(true);
    startControlTimeout();
  };

  const handleSeekChange = (e) => {
    const value = parseFloat(e.target.value);
    setPlayed(value);
    if (playerRef.current) {
      playerRef.current.seekTo(value);
    }
  };

  const handleProgress = (state) => {
    if (!seeking) {
      setPlayed(state.played);
    }
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds();
    
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
    }
    return `${mm}:${ss.toString().padStart(2, '0')}`;
  };

  const handleLike = async () => {
    try {
      // API call to like/unlike
      setLiked(!liked);
      setVideo(prev => ({
        ...prev,
        likes: prev.likes + (liked ? -1 : 1)
      }));
    } catch (err) {
      console.error('Failed to like video:', err);
    }
  };

  const handleSave = async () => {
    try {
      // API call to save/unsave
      setSaved(!saved);
    } catch (err) {
      console.error('Failed to save video:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      // API call to post comment
      const newCommentObj = {
        id: Date.now(),
        author: user?.name || 'Anonymous',
        avatar: user?.name?.charAt(0) || 'A',
        time: 'Just now',
        content: newComment.trim(),
        likes: 0,
        liked: false,
        replies: []
      };

      setComments([newCommentObj, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  const handleChapterClick = (timeString) => {
    const [minutes, seconds] = timeString.split(':').map(Number);
    const timeInSeconds = minutes * 60 + seconds;
    const fraction = timeInSeconds / duration;
    
    setPlayed(fraction);
    if (playerRef.current) {
      playerRef.current.seekTo(fraction);
    }
    setPlaying(true);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner-large"></div>
        <p>Loading video...</p>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="error-state">
        <div className="error-icon">⚠️</div>
        <h3>Video not found</h3>
        <p>{error || 'The requested video could not be loaded.'}</p>
        <button onClick={() => navigate('/videos')} className="btn-primary">
          Browse Videos
        </button>
      </div>
    );
  }

  // Check if user has access to premium content
  const hasAccess = !video.premium || (user?.subscription?.active);

  return (
    <div className="video-player-container">
      <PremiumGate requiredLevel={video.premium ? 'premium' : 'free'}>
        <div className="video-player-wrapper">
          {/* Video Player */}
          <div 
            className="video-player"
            onMouseMove={() => setShowControls(true)}
            onMouseLeave={() => {
              if (playing) {
                setTimeout(() => setShowControls(false), 2000);
              }
            }}
          >
            <ReactPlayer
              ref={playerRef}
              url={video.videoUrl}
              playing={playing}
              volume={volume}
              playbackRate={playbackRate}
              width="100%"
              height="auto"
              onProgress={handleProgress}
              onDuration={handleDuration}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              config={{
                file: {
                  attributes: {
                    crossOrigin: 'anonymous'
                  }
                }
              }}
            />

            {/* Custom Controls */}
            {showControls && (
              <div className="video-controls">
                <div className="controls-top">
                  <h3 className="video-title">{video.title}</h3>
                  <div className="controls-actions">
                    <button className="control-button" onClick={() => setFullscreen(!fullscreen)}>
                      {fullscreen ? '⛶' : '⛶'}
                    </button>
                  </div>
                </div>

                <div className="controls-bottom">
                  <button className="play-pause" onClick={handlePlayPause}>
                    {playing ? '❚❚' : '▶'}
                  </button>

                  <div className="progress-container">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.001"
                      value={played}
                      onChange={handleSeekChange}
                      onMouseDown={() => setSeeking(true)}
                      onMouseUp={() => setSeeking(false)}
                      className="progress-bar"
                    />
                  </div>

                  <div className="progress-time">
                    {formatTime(played * duration)} / {formatTime(duration)}
                  </div>

                  <div className="volume-control">
                    <button className="control-button" onClick={() => setVolume(volume === 0 ? 0.8 : 0)}>
                      {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="volume-slider"
                    />
                  </div>

                  <button className="fullscreen-button control-button" onClick={() => setFullscreen(!fullscreen)}>
                    {fullscreen ? '⛶' : '⛶'}
                  </button>
                </div>
              </div>
            )}

            {/* Premium Overlay */}
            {!hasAccess && (
              <div className="premium-overlay">
                <div className="premium-icon">⭐</div>
                <h3>Premium Content</h3>
                <p>Upgrade to premium to watch this video and access exclusive content</p>
                <button className="btn-primary" onClick={() => navigate('/premium')}>
                  Upgrade Now
                </button>
              </div>
            )}
          </div>

          {/* Video Information */}
          <div className="video-info">
            <div className="video-header">
              <h1>{video.title}</h1>
              <div className="video-actions-header">
                <button 
                  className={`action-button ${liked ? 'like active' : 'like'}`}
                  onClick={handleLike}
                >
                  {liked ? '❤️' : '🤍'} {video.likes + (liked ? 1 : 0)}
                </button>
                <button 
                  className={`action-button ${saved ? 'save active' : 'save'}`}
                  onClick={handleSave}
                >
                  {saved ? '📌' : '📍'} {saved ? 'Saved' : 'Save'}
                </button>
                <button className="action-button">
                  📤 Share
                </button>
              </div>
            </div>

            <div className="video-meta-info">
              <div className="meta-item">
                <strong>Instructor:</strong> {video.instructor.name}
              </div>
              <div className="meta-item">
                <strong>Level:</strong> 
                <span className={`video-level ${video.level}`}>
                  {video.level.charAt(0).toUpperCase() + video.level.slice(1)}
                </span>
              </div>
              <div className="meta-item">
                <strong>Duration:</strong> {video.duration}
              </div>
              <div className="meta-item">
                <strong>Views:</strong> {video.views.toLocaleString()}
              </div>
              <div className="meta-item">
                <strong>Uploaded:</strong> {new Date(video.uploadDate).toLocaleDateString()}
              </div>
            </div>

            <div className="video-description-full">
              <h3>Description</h3>
              <p>{video.description}</p>
              
              <h4>About the Instructor</h4>
              <p>
                <strong>{video.instructor.name}</strong> - {video.instructor.title} at {video.instructor.company}. 
                With over 15 years of experience in structural analysis and finite element methods.
              </p>
            </div>

            {/* Chapters */}
            {video.chapters && (
              <div className="video-chapters">
                <div className="chapters-header">
                  <h3>Chapters</h3>
                  <button 
                    className="action-button"
                    onClick={() => setShowChapters(!showChapters)}
                  >
                    {showChapters ? 'Hide' : 'Show'} Chapters
                  </button>
                </div>
                
                {showChapters && (
                  <div className="chapters-list">
                    {video.chapters.map((chapter, index) => (
                      <div 
                        key={index}
                        className="chapter-item"
                        onClick={() => handleChapterClick(chapter.time)}
                      >
                        <div className="chapter-number">{index + 1}</div>
                        <div className="chapter-info">
                          <div className="chapter-title">{chapter.title}</div>
                          <div className="chapter-duration">{chapter.duration}</div>
                        </div>
                        <div className="chapter-play">▶</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Comments */}
            <div className="comments-section">
              <div className="comments-header">
                <h3>Comments</h3>
                <span className="comments-count">{comments.length}</span>
              </div>

              <form onSubmit={handleCommentSubmit} className="comment-form">
                <textarea
                  className="comment-input"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows="3"
                />
                <button type="submit" className="comment-submit">
                  Post Comment
                </button>
              </form>

              <div className="comments-list">
                {comments.map(comment => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                      <div className="comment-avatar">{comment.avatar}</div>
                      <div className="comment-author">
                        <h4>{comment.author}</h4>
                        <span className="comment-time">{comment.time}</span>
                      </div>
                      <div className="comment-actions">
                        <button 
                          className={`comment-action ${comment.liked ? 'liked' : ''}`}
                          onClick={() => {
                            // Handle like comment
                          }}
                        >
                          ❤️ {comment.likes}
                        </button>
                        <button className="comment-action">
                          Reply
                        </button>
                      </div>
                    </div>
                    <div className="comment-content">
                      {comment.content}
                    </div>
                    
                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="comment-replies">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="comment-item">
                            <div className="comment-header">
                              <div className="comment-avatar">{reply.avatar}</div>
                              <div className="comment-author">
                                <h4>{reply.author}</h4>
                                <span className="comment-time">{reply.time}</span>
                              </div>
                            </div>
                            <div className="comment-content">
                              {reply.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Videos */}
        {video.relatedVideos && video.relatedVideos.length > 0 && (
          <div className="related-videos">
            <h3 className="related-header">Related Videos</h3>
            <div className="related-grid">
              {video.relatedVideos.map(related => (
                <div 
                  key={related.id}
                  className="video-card"
                  onClick={() => navigate(`/video/${related.id}`)}
                >
                  <div className="video-thumbnail">
                    <img src={related.thumbnail} alt={related.title} />
                    <div className="video-duration">{related.duration}</div>
                  </div>
                  <div className="video-content">
                    <h3>{related.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </PremiumGate>
    </div>
  );
};

export default VideoPlayer;