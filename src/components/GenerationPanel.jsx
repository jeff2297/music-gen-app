import React, { useState } from 'react';

export default function GenerationPanel({ onGenerate, isGenerating, analysis }) {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(30);
  const [style, setStyle] = useState('similar');
  const [preserveInstruments, setPreserveInstruments] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate({
        prompt: prompt.trim(),
        duration,
        style,
        preserveInstruments,
        referenceAnalysis: analysis
      });
    }
  };

  const suggestedPrompts = [
    "Upbeat pop track with catchy melodies and modern production",
    "Chill lofi hip-hop beat with jazz chords and smooth vibes",
    "Energetic electronic dance music with powerful drops",
    "Melancholic piano ballad with string orchestration",
    "Rock anthem with heavy guitars and driving drums"
  ];

  const handleSuggestedPrompt = (suggestedPrompt) => {
    setPrompt(suggestedPrompt);
  };

  return (
    <div className="generation-container">
      <h2>✨ Generate New Music</h2>
      <p className="generation-subtitle">
        Create music similar to your uploaded track
      </p>

      <form onSubmit={handleSubmit} className="generation-form">
        <div className="form-group">
          <label htmlFor="prompt">Music Description</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the music you want to create. Be specific about instruments, mood, tempo, and style..."
            className="prompt-input"
            rows="5"
            disabled={isGenerating}
          />
          <p className="form-hint">
            💡 Tip: Be specific! Mention instruments, mood, tempo, and genre for best results.
          </p>
        </div>

        <div className="suggested-prompts">
          <p className="suggested-label">Quick suggestions:</p>
          <div className="prompt-buttons">
            {suggestedPrompts.map((p, i) => (
              <button
                key={i}
                type="button"
                className="prompt-btn"
                onClick={() => handleSuggestedPrompt(p)}
                disabled={isGenerating}
              >
                {p.substring(0, 40)}...
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="duration">Duration (seconds)</label>
          <div className="duration-control">
            <input
              type="range"
              id="duration"
              min="15"
              max="120"
              step="5"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="duration-slider"
              disabled={isGenerating}
            />
            <span className="duration-value">{duration}s</span>
          </div>
          <div className="duration-presets">
            {[15, 30, 60, 120].map(d => (
              <button
                key={d}
                type="button"
                className={`preset-btn ${duration === d ? 'active' : ''}`}
                onClick={() => setDuration(d)}
                disabled={isGenerating}
              >
                {d}s
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Generation Style</label>
          <div className="style-options">
            <label className="radio-label">
              <input
                type="radio"
                value="similar"
                checked={style === 'similar'}
                onChange={(e) => setStyle(e.target.value)}
                disabled={isGenerating}
              />
              <span className="radio-text">Similar to Original</span>
              <span className="radio-desc">Keep the same vibe and energy</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="remix"
                checked={style === 'remix'}
                onChange={(e) => setStyle(e.target.value)}
                disabled={isGenerating}
              />
              <span className="radio-text">Remix Style</span>
              <span className="radio-desc">Fresh take with new elements</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="cover"
                checked={style === 'cover'}
                onChange={(e) => setStyle(e.target.value)}
                disabled={isGenerating}
              />
              <span className="radio-text">Cover Version</span>
              <span className="radio-desc">Reimagined with different instruments</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={preserveInstruments}
              onChange={(e) => setPreserveInstruments(e.target.checked)}
              disabled={isGenerating}
            />
            <span>Preserve detected instruments from original</span>
          </label>
        </div>

        <button 
          type="submit"
          className="btn btn-primary btn-large"
          disabled={isGenerating || !prompt.trim()}
        >
          {isGenerating ? (
            <>
              <span className="spinner-small"></span>
              Generating Music...
            </>
          ) : (
            <>🎵 Generate Music</>
          )}
        </button>
      </form>

      <div className="generation-tips">
        <h4>💡 Tips for Best Results</h4>
        <ul>
          <li>✓ Specify instruments (piano, guitar, drums, synth, etc.)</li>
          <li>✓ Describe the mood (upbeat, melancholic, energetic, calm)</li>
          <li>✓ Mention tempo (slow, medium, fast or specific BPM)</li>
          <li>✓ Include genre or music style reference</li>
          <li>✓ Add vocal preferences (male, female, harmonies)</li>
          <li>✓ Mention production style (lo-fi, polished, ambient, etc.)</li>
        </ul>
      </div>
    </div>
  );
}
