import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player/lazy';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from '../../services/api';


const VideoPlayer = () =>> {
  const { videoId } = useParams();
  const { user, isPremium } = useAuth();
  const navigate = useNavigate();
  
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showControls, setShowControls] = useState(true);
  const [relatedVideos, setRelatedVideos] = useState([]);
  
  const playerRef = useRef(null);
  const controlsTimeout = useRef(null);

  useEffect(() => {
    fetchVideo();
    fetchRelatedVideos();
    
    // Auto-hide controls after 3 seconds
    const handleMouseMove = () =>> {
      setShowControls(true);
      clearTimeout(controlsTimeout.current);
      controlsTimeout.current = setTimeout(() => {
        if (playing) setShowControls(false);
      }, 3000);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(controlsTimeout.current);
    };
  }, [videoId]);

  const fetchVideo = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/videos/${videoId}`);
      
      // Check if video is premium and user has access
      if (response.data.isPremium && !isPremium) {
        navigate('/premium', { state: { videoId } });
        return;
      }
      
      setVideo(response.data);
      setError(null);
      
      // Log video view
      if (user) {
        await axios.post(`/api/videos/${videoId}/view`);
      }
    } catch (err) {
      setError('Failed to load video');
      console.error('Error fetching video:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedVideos = async () => {
    try {
      const response = await axios.get(`/api/videos/${videoId}/related`);
      setRelatedVideos(response.data);
    } catch (err) {
      console.error('Error fetching related videos:', err);
    }
  };

  const handlePlayPause = () =>> {
    setPlaying(!playing);
  };

  const handleVolumeChange = (e) =>> {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  const handleSeek = (e) =>> {
    const newPlayed = parseFloat(e.target.value);
    setPlayed(newPlayed);
    playerRef.current.seekTo(newPlayed);
  };

  const handleProgress = (state) =>> {
    setPlayed(state.played);
  };

  const handleDuration = (duration) =>> {
    setDuration(duration);
  };

  const handlePlaybackRate = (rate) =>> {
    setPlaybackRate(rate);
  };

  const handleFullscreen = () =>> {
    const playerContainer = document.querySelector('.video-player-container');
    if (!document.fullscreenElement) {
      playerContainer.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (seconds) =>> {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds();
    
    if (hh > 0) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
    }
    return `${mm}:${ss.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="video-player-loading">
        <div className="spinner"></div>
        <p>Loading video...</p>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="video-player-error">
        <h3>Error loading video</h3>
        <p>{error || 'Video not found'}</p>
        <button onClick={() => navigate('/videos')}>Back to Videos</button>
      </div>
    );
  }

  return (
    <div className="video-player-container">
      <div className="video-player-main">
        {/* Video Player */}
        <div className="video-wrapper">
          <ReactPlayer
            ref={playerRef}
            url={video.videoUrl}
            width="100%"
            height="100%"
            playing={playing}
            volume={volume}
            muted={muted}
            playbackRate={playbackRate}
            onProgress={handleProgress}
            onDuration={handleDuration}
            config={{
              youtube: {
                playerVars: {
                  controls: 0,
                  modestbranding: 1,
                  rel: 0
                }
              }
            }}
          />
          
          {/* Custom Controls */}
          {showControls && (
            <div className="video-controls">
              {/* Progress Bar */}
              <div className="progress-bar-container">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={played}
                  onChange={handleSeek}
                  className="progress-bar"
                />
                <div className="time-display">
                  <span>{formatTime(duration * played)}</span>
                  <span>/</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="control-buttons">
                <div className="left-controls">
                  <button onClick={handlePlayPause} className="control-btn">
                    {playing ? '⏸️' : '▶️'}
                  </button>
                  <div className="volume-control">
                    <button onClick={() => setMuted(!muted)} className="control-btn">
                      {muted || volume === 0 ? '🔇' : '🔊'}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="volume-slider"
                    />
                  </div>
                  <div className="playback-rate">
                    <select
                      value={playbackRate}
                      onChange={(e) => handlePlaybackRate(parseFloat(e.target.value))}
                      className="playback-select"
                    >
                      <option value="0.5">0.5x</option>
                      <option value="0.75">0.75x</option>
                      <option value="1">1x</option>
                      <option value="1.25">1.25x</option>
                      <option value="1.5">1.5x</option>
                      <option value="2">2x</option>
                    </select>
                  </div>
                </div>

                <div className="right-controls">
                  <button onClick={handleFullscreen} className="control-btn">
                    ⛶
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="video-info">
          <h1 className="video-title">{video.title}</h1>
          
          <div className="video-meta">
            <span className="video-views">{video.views?.toLocaleString()} views</span>
            <span className="video-date">
              {new Date(video.publishedAt).toLocaleDateString()}
            </span>
            {video.isPremium && (
              <span className="premium-tag">PREMIUM</span>
            )}
          </div>

          <div className="video-description">
            <p>{video.description}</p>
          </div>

          <div className="video-actions">
            <button className="action-btn like-btn">
              👍 {video.likes || 0}
            </button>
            <button className="action-btn dislike-btn">
              👎 {video.dislikes || 0}
            </button>
            <button className="action-btn share-btn">
              📤 Share
            </button>
            <button className="action-btn save-btn">
              💾 Save
            </button>
          </div>
        </div>
      </div>

      {/* Related Videos Sidebar */}
      <div className="related-videos">
        <h3>Related Videos</h3>
        {relatedVideos.map((relatedVideo) => (
          <div 
            key={relatedVideo._id} 
            className="related-video-item"
            onClick={() => navigate(`/watch/${relatedVideo._id}`)}
          >
            <div className="related-thumbnail">
              <img src={relatedVideo.thumbnail} alt={relatedVideo.title} />
              <span className="duration">{relatedVideo.duration}</span>
            </div>
            <div className="related-info">
              <h4>{relatedVideo.title}</h4>
              <p className="channel-name">{relatedVideo.channel?.name}</p>
              <p className="video-stats">
                {relatedVideo.views?.toLocaleString()} views • {relatedVideo.publishedAt}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoPlayer;
