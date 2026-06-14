import React, { useRef, useState } from 'react';

export default function UploadSection({ onFileUpload, isAnalyzing, uploadedFile }) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (isValidAudioFile(file)) {
        onFileUpload(file);
      } else {
        alert('Please upload a valid audio file (MP3, WAV, M4A, FLAC, OGG)');
      }
    }
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (isValidAudioFile(file)) {
        onFileUpload(file);
      }
    }
  };

  const isValidAudioFile = (file) => {
    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/flac', 'audio/ogg'];
    const validExtensions = ['.mp3', '.wav', '.m4a', '.flac', '.ogg'];
    const hasValidType = validTypes.includes(file.type);
    const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    return hasValidType || hasValidExt;
  };

  const getFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="upload-container">
      <h2>📤 Upload Your Music</h2>
      <p className="upload-subtitle">Drag & drop your audio file or click to select</p>
      
      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''} ${isAnalyzing ? 'analyzing' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isAnalyzing && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleChange}
          className="upload-input"
          disabled={isAnalyzing}
        />
        
        {!isAnalyzing ? (
          <>
            <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            <p className="upload-text">Drop your audio file here</p>
            <p className="upload-hint">MP3, WAV, M4A, FLAC, OGG (Max 100MB)</p>
          </>
        ) : (
          <>
            <div className="spinner"></div>
            <p className="upload-text">Analyzing your music...</p>
            <p className="upload-hint">Detecting instruments, key, and tempo</p>
          </>
        )}
      </div>

      {uploadedFile && !isAnalyzing && (
        <div className="uploaded-file-info">
          <div className="file-icon">🎵</div>
          <div className="file-details">
            <p className="file-name">{uploadedFile.name}</p>
            <p className="file-size">{getFileSize(uploadedFile.size)}</p>
          </div>
          <button 
            className="btn-clear"
            onClick={() => fileInputRef.current?.click()}
          >
            Change
          </button>
        </div>
      )}

      <div className="supported-formats">
        <h4>✨ Supported Formats</h4>
        <ul>
          <li><strong>MP3</strong> - Most common audio format</li>
          <li><strong>WAV</strong> - Uncompressed high quality</li>
          <li><strong>M4A</strong> - iTunes/Apple audio</li>
          <li><strong>FLAC</strong> - Lossless compression</li>
          <li><strong>OGG</strong> - Open source format</li>
        </ul>
      </div>
    </div>
  );
}
