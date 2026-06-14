import React from 'react';

export default function AnalysisResults({ analysis }) {
  const {
    key,
    tempo,
    instruments,
    energy,
    mood,
    duration,
    confidence,
    genre,
    timeSignature
  } = analysis;

  const getMoodEmoji = (mood) => {
    const emojiMap = {
      'Happy': '😊',
      'Sad': '😔',
      'Energetic': '⚡',
      'Calm': '😌',
      'Melancholic': '💭',
      'Uplifting': '🚀',
      'Dark': '🌑',
      'Playful': '🎮'
    };
    return emojiMap[mood] || '🎵';
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="analysis-container">
      <h2>🔍 Analysis Results</h2>

      <div className="analysis-grid">
        <div className="analysis-card">
          <div className="card-label">Musical Key</div>
          <div className="card-value">{key}</div>
          <div className="card-confidence">
            {(confidence.key * 100).toFixed(0)}% confident
          </div>
        </div>

        <div className="analysis-card">
          <div className="card-label">Tempo (BPM)</div>
          <div className="card-value">{tempo}</div>
          <div className="card-confidence">
            {(confidence.tempo * 100).toFixed(0)}% confident
          </div>
        </div>

        <div className="analysis-card">
          <div className="card-label">Energy Level</div>
          <div className="card-value">{(energy * 100).toFixed(0)}%</div>
          <div className="energy-bar">
            <div 
              className="energy-fill" 
              style={{ width: `${energy * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="analysis-card">
          <div className="card-label">Mood</div>
          <div className="card-value">{getMoodEmoji(mood)} {mood}</div>
          <div className="card-confidence">Detected</div>
        </div>
      </div>

      {genre && (
        <div className="metadata-row">
          <div className="metadata-item">
            <span className="metadata-label">Genre</span>
            <span className="metadata-value">{genre}</span>
          </div>
          {timeSignature && (
            <div className="metadata-item">
              <span className="metadata-label">Time Signature</span>
              <span className="metadata-value">{timeSignature}</span>
            </div>
          )}
          <div className="metadata-item">
            <span className="metadata-label">Duration</span>
            <span className="metadata-value">{formatDuration(duration)}</span>
          </div>
        </div>
      )}

      <div className="instruments-section">
        <h3>🎸 Detected Instruments</h3>
        <div className="instruments-list">
          {instruments && instruments.length > 0 ? (
            instruments.map((instrument, index) => (
              <div key={index} className="instrument-item">
                <div className="instrument-header">
                  <div className="instrument-name">{instrument.name}</div>
                  <div className="confidence-text">
                    {(instrument.confidence * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="confidence-bar">
                  <div 
                    className="confidence-fill"
                    style={{ width: `${instrument.confidence * 100}%` }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-instruments">No instruments detected</p>
          )}
        </div>
      </div>

      <div className="analysis-footer">
        <p>💡 Use these insights to create similar music with AI generation</p>
      </div>
    </div>
  );
}
