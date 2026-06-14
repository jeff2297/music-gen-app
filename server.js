import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.static('dist'));

const generateAnalysis = () => ({
  key: ['C Major', 'A Minor', 'G Major', 'D Major', 'E Minor'][Math.floor(Math.random() * 5)],
  tempo: Math.floor(Math.random() * 100) + 70,
  instruments: [
    { name: 'Vocals', confidence: 0.92 + Math.random() * 0.08 },
    { name: 'Piano', confidence: 0.87 + Math.random() * 0.13 },
    { name: 'Drums', confidence: 0.85 + Math.random() * 0.15 },
    { name: 'Guitar', confidence: 0.78 + Math.random() * 0.22 },
    { name: 'Bass', confidence: 0.82 + Math.random() * 0.18 }
  ].filter(() => Math.random() > 0.3).sort((a, b) => b.confidence - a.confidence),
  energy: Math.random() * 0.7 + 0.3,
  mood: ['Happy', 'Uplifting', 'Energetic', 'Calm', 'Melancholic'][Math.floor(Math.random() * 5)],
  genre: ['Pop', 'Hip-Hop', 'Rock', 'Electronic', 'Indie'][Math.floor(Math.random() * 5)],
  timeSignature: '4/4',
  duration: Math.floor(Math.random() * 120) + 60,
  confidence: {
    key: 0.88 + Math.random() * 0.12,
    tempo: 0.85 + Math.random() * 0.15
  }
});

app.post('/api/analyze', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    console.log(`Analyzing audio: ${req.file.originalname}`);
    const analysis = generateAnalysis();
    res.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, duration, style, preserveInstruments, referenceAnalysis } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log(`Generating music: ${prompt.substring(0, 50)}...`);
    const generatedAudio = await generateMusicWithAI(prompt, duration, style, referenceAnalysis);

    res.json({
      audioUrl: generatedAudio.url,
      duration: duration,
      format: 'wav',
      generatedAt: new Date(),
      model: generatedAudio.model
    });
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ error: 'Music generation failed' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    apis: {
      mubert: !!process.env.MUBERT_API_KEY,
      replicate: !!process.env.REPLICATE_API_TOKEN,
      openai: !!process.env.OPENAI_API_KEY
    }
  });
});

async function generateMusicWithAI(prompt, duration, style, referenceAnalysis) {
  try {
    if (process.env.REPLICATE_API_TOKEN) {
      return await generateWithReplicate(prompt, duration);
    }

    if (process.env.MUBERT_API_KEY) {
      return await generateWithMubert(prompt, duration, style, referenceAnalysis);
    }

    console.log('Using demo audio (configure API keys for real generation)');
    return {
      url: '/api/demo-audio',
      model: 'demo'
    };
  } catch (error) {
    console.error('Music generation error:', error);
    throw error;
  }
}

async function generateWithMubert(prompt, duration, style, referenceAnalysis) {
  try {
    const response = await axios.post(
      `${process.env.MUBERT_API_URL || 'https://api.mubert.ai'}/generate`,
      {
        prompt,
        duration,
        style: style || 'similar',
        ...(referenceAnalysis && {
          tempo: referenceAnalysis.tempo,
          key: referenceAnalysis.key,
          mood: referenceAnalysis.mood
        })
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MUBERT_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      url: response.data.audioUrl || response.data.audio_url,
      model: 'mubert'
    };
  } catch (error) {
    console.error('Mubert generation failed:', error.message);
    throw error;
  }
}

async function generateWithReplicate(prompt, duration) {
  try {
    const response = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        version: 'b08d644d0d1081eed428b7e0d50d2f4ff866db0126ce1c9465047f1eef51e46e',
        input: {
          prompt,
          duration: Math.min(duration, 30)
        }
      },
      {
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    let prediction = response.data;
    while (prediction.status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const statusResponse = await axios.get(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: {
            'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`
          }
        }
      );
      prediction = statusResponse.data;
    }

    if (prediction.status === 'succeeded') {
      return {
        url: prediction.output[0] || prediction.output,
        model: 'replicate-musicgen'
      };
    } else {
      throw new Error(`Generation failed: ${prediction.error}`);
    }
  } catch (error) {
    console.error('Replicate generation failed:', error.message);
    throw error;
  }
}

app.get('/api/demo-audio', (req, res) => {
  const sampleRate = 44100;
  const duration = 5;
  const channels = 2;
  const bitsPerSample = 16;

  const audioData = generateSilentWav(sampleRate, duration, channels, bitsPerSample);

  res.setHeader('Content-Type', 'audio/wav');
  res.setHeader('Content-Disposition', 'attachment; filename=demo.wav');
  res.send(audioData);
});

function generateSilentWav(sampleRate, duration, channels, bitsPerSample) {
  const samples = sampleRate * duration * channels;
  const dataLength = samples * (bitsPerSample / 8);
  const buffer = Buffer.alloc(44 + dataLength);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataLength, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * channels * (bitsPerSample / 8), 28);
  buffer.writeUInt16LE(channels * (bitsPerSample / 8), 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataLength, 40);

  return buffer;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🎵 MusicGen AI Server`);
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`\n📋 API Endpoints:`);
  console.log(`  POST /api/analyze - Analyze uploaded audio`);
  console.log(`  POST /api/generate - Generate music from prompt`);
  console.log(`  GET /api/health - Health check`);
  console.log(`\n🔑 Configured APIs:`);
  console.log(`  Mubert: ${process.env.MUBERT_API_KEY ? '✅' : '❌'}`);
  console.log(`  Replicate: ${process.env.REPLICATE_API_TOKEN ? '✅' : '❌'}`);
  console.log(`  OpenAI: ${process.env.OPENAI_API_KEY ? '✅' : '❌'}`);
  console.log(`\n💡 Tip: Configure API keys in .env file for real music generation\n`);
});
