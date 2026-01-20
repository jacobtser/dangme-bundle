import React from 'react';
import './Pages.css';

const Videos = () => {
  const videoList = [
    { id: 1, title: 'Introduction to Thermodynamics', duration: '45 min', level: 'Beginner' },
    { id: 2, title: 'Fluid Mechanics Fundamentals', duration: '60 min', level: 'Intermediate' },
    { id: 3, title: 'Material Science: Metals & Alloys', duration: '50 min', level: 'Beginner' },
    { id: 4, title: 'Advanced CAD Modeling', duration: '75 min', level: 'Advanced' },
    { id: 5, title: 'Heat Transfer Mechanisms', duration: '55 min', level: 'Intermediate' },
    { id: 6, title: 'Machine Design Principles', duration: '65 min', level: 'Advanced' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Video Library</h1>
        <p>Browse our collection of mechanical engineering tutorials</p>
      </div>

      <div className="video-grid">
        {videoList.map(video => (
          <div key={video.id} className="video-card">
            <div className="video-thumbnail">
              <div className="video-play">▶</div>
            </div>
            <div className="video-content">
              <h3>{video.title}</h3>
              <div className="video-meta">
                <span className="video-duration">{video.duration}</span>
                <span className={`video-level ${video.level.toLowerCase()}`}>{video.level}</span>
              </div>
              <button className="watch-button">Watch Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Videos;