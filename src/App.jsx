import React, { useState } from 'react';
import UploadSection from './components/UploadSection';
import AnalysisResults from './components/AnalysisResults';
import GenerationPanel from './components/GenerationPanel';
import './App.css';

export default function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedTrack, setGeneratedTrack] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (file) => {
    setUploadedFile(file);
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('audio', file);
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('Analysis failed');
      
      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Analysis error:', error);
      setError('Failed to analyze audio file. Please try another file.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateMusic = async (prompt) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          reference: analysis,
          fileId: uploadedFile?.name
        })
      });
      
      if (!response.ok) throw new Error('Generation failed');
      
      const data = await response.json();
      setGeneratedTrack(data);
    } catch (error) {
      console.error('Generation error:', error);
      setError('Failed to generate music. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>🎵 MusicGen AI</h1>
          <p>Create music like SUNO • Analyze instruments • Generate with AI</p>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <main className="app-main">
        <div className="content-grid">
          <section className="section upload-section">
            <UploadSection 
              onFileUpload={handleFileUpload}
              isAnalyzing={isAnalyzing}
              uploadedFile={uploadedFile}
            />
          </section>

          {analysis && (
            <section className="section analysis-section">
              <AnalysisResults analysis={analysis} />
            </section>
          )}

          {analysis && (
            <section className="section generation-section">
              <GenerationPanel 
                onGenerate={handleGenerateMusic}
                isGenerating={isGenerating}
                analysis={analysis}
              />
            </section>
          )}

          {generatedTrack && (
            <section className="section results-section">
              <div className="generated-track">
                <h3>✨ Generated Music</h3>
                <audio controls className="audio-player">
                  <source src={generatedTrack.audioUrl} type="audio/wav" />
                  Your browser does not support the audio element.
                </audio>
                <div className="track-info">
                  <div className="info-item">
                    <span className="info-label">Duration:</span>
                    <span className="info-value">{generatedTrack.duration}s</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Format:</span>
                    <span className="info-value">{generatedTrack.format.toUpperCase()}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Sample Rate:</span>
                    <span className="info-value">44.1 kHz</span>
                  </div>
                </div>
                <div className="track-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => downloadTrack(generatedTrack)}
                  >
                    ⬇️ Download Track
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setGeneratedTrack(null)}
                  >
                    Generate Again
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>🎵 MusicGen AI • Powered by AI Music Generation & Analysis</p>
        <p className="footer-note">Upload MP3, WAV, M4A, FLAC, or OGG files</p>
      </footer>
    </div>
  );
}

function downloadTrack(track) {
  const link = document.createElement('a');
  link.href = track.audioUrl;
  link.download = `musicgen-${Date.now()}.${track.format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
