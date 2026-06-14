# 🎵 MusicGen AI - Music Generation & Analysis App

A professional AI music generation application with advanced audio analysis and instrument detection. Similar to SUNO but with your own customization and control.

## ✨ Features

### 🎵 Audio Upload & Analysis
- **Multi-format support**: MP3, WAV, M4A, FLAC, OGG
- **Automatic key detection**: Identify the musical key
- **Tempo analysis**: Precise BPM detection
- **Instrument identification**: Detect 50+ instruments with confidence scores
- **Energy & mood detection**: Emotional tone analysis
- **Genre classification**: Automatic genre detection

### 🎹 AI Music Generation
- **Prompt-based generation**: Describe the music you want
- **Reference-based generation**: Use analyzed tracks as reference
- **Multiple generation styles**:
  - Similar: Keep the same vibe and energy
  - Remix: Fresh take with new elements
  - Cover: Reimagined with different instruments
- **Adjustable duration**: 15-120 seconds
- **Instrument control**: Preserve or change detected instruments

### 🎨 Professional UI/UX
- **iOS-inspired design**: Clean, minimal aesthetic
- **White/Black color scheme**: Professional appearance
- **Responsive layout**: Works on desktop and mobile
- **Real-time feedback**: Live analysis and generation status
- **Smooth animations**: Polished user experience

## 🛠 Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **CSS3** - Advanced styling

### Backend
- **Node.js + Express** - Server framework
- **Multer** - File upload handling
- **Axios** - HTTP client
- **CORS** - Cross-origin support

### AI/Audio
- **Meta MusicGen** - Open-source music generation
- **Replicate API** - Easy ML model integration
- **Mubert API** - Professional music generation

## 🚀 Quick Start

### Prerequisites
```bash
Node.js 16+ installed
npm or yarn package manager
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/jeff2297/music-gen-app.git
cd music-gen-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env
```

### Development

**Terminal 1 - Frontend (Vite)**
```bash
npm run dev
# Opens http://localhost:5173
```

**Terminal 2 - Backend (Express)**
```bash
npm run server
# Runs on http://localhost:3000
```

### Production Build

```bash
npm run build
NODE_ENV=production npm start
```

## 🔑 API Keys Setup

### Replicate (Recommended - Easy Setup)

1. Go to https://replicate.com
2. Sign up (free tier available)
3. Get your API token from settings
4. Add to `.env`:
```env
REPLICATE_API_TOKEN=your_token_here
```

### Mubert API

1. Visit https://mubert.com/developers
2. Create account and register app
3. Get API key from dashboard
4. Add to `.env`:
```env
MUBERT_API_KEY=your_key_here
```

## 📁 Project Structure

```
music-gen-app/
├── src/
│   ├── components/
│   │   ├── UploadSection.jsx
│   │   ├── AnalysisResults.jsx
│   │   └── GenerationPanel.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── server.js
├── vite.config.js
├── package.json
└── README.md
```

## 🎯 Usage Guide

### Step 1: Upload Audio
1. Click the upload area or drag & drop a file
2. Supported formats: MP3, WAV, M4A, FLAC, OGG
3. Wait for analysis to complete

### Step 2: Review Analysis
- See detected instruments with confidence scores
- Check identified key and tempo
- Review mood and energy level

### Step 3: Generate Music
1. Enter a detailed prompt describing the music
2. Adjust duration (15-120 seconds)
3. Choose generation style
4. Click "Generate Music"

### Step 4: Download
1. Play the generated audio preview
2. Click download to save as WAV file

## 💡 Prompt Tips

✅ **Good Prompts:**
- "Upbeat pop song with catchy hook, modern production, 120 BPM, female vocals"
- "Chill lofi hip-hop beat with jazzy piano chords, soft drums, 90 BPM"

## 🐛 Troubleshooting

### "Analysis failed"
- Check file format (MP3, WAV, M4A, FLAC, OGG)
- Ensure file size < 100MB
- Try a different audio file

### "Generation failed"
- Verify API keys in `.env` are correct
- Check internet connection
- Try a shorter duration (< 30 seconds)

## 📝 License

MIT License

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
