const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── AI Generate Endpoint ────────────────────────────────────────────────────
app.post('/api/generate', async (req, res) => {
  const { genre, reference, bpm, key, mood, extra } = req.body;

  const prompt = `You are a professional beat producer and BandLab Android expert.

Generate a complete, professional beat recipe for:
- Genre: ${genre}
- Reference artist/subgenre: ${reference || 'none specified'}
- BPM preference: ${bpm || 'auto based on genre'}
- Key/Scale: ${key || 'auto based on genre'}
- Mood/Vibe: ${mood || 'auto based on genre'}
- Additional notes: ${extra || 'none'}

Respond ONLY with a valid JSON object (no markdown, no backticks, no preamble) with this exact structure:
{
  "identity": "2-3 sentence description of this beat's character, sound, and feel. Make it vivid and specific.",
  "settings": [
    {"label": "BPM", "value": "140", "unit": ""},
    {"label": "Key", "value": "F# Minor", "unit": ""},
    {"label": "Time Signature", "value": "4/4", "unit": ""},
    {"label": "Master Volume", "value": "85", "unit": "%"},
    {"label": "Reverb (Global)", "value": "25", "unit": "%"},
    {"label": "Compressor Threshold", "value": "-18", "unit": "dB"},
    {"label": "Compressor Ratio", "value": "4:1", "unit": ""},
    {"label": "Bass EQ Boost", "value": "+4", "unit": "dB @ 80Hz"},
    {"label": "Hi-Cut Filter", "value": "16", "unit": "kHz"},
    {"label": "Low-Cut Filter", "value": "40", "unit": "Hz"},
    {"label": "Kick Level", "value": "90", "unit": "%"},
    {"label": "Snare Level", "value": "78", "unit": "%"}
  ],
  "instruments": [
    "DRUMS: Describe kick pattern and drum kit type for BandLab",
    "HI-HAT: Pattern, velocity, swing %",
    "BASS: Type (808, bass synth, etc.), note pattern, settings",
    "MELODY 1: Instrument name in BandLab, notes/chords to use",
    "MELODY 2 (optional): Second layer instrument",
    "PAD/TEXTURE: Atmospheric layer details",
    "SFX: Any special effects, risers, transitions"
  ],
  "structure": "Full beat structure with bar counts. Example:\n[Intro] 0:00–0:08 — Bars 1-4: just hi-hats + pad\n[Verse] 0:08–0:32 — Bars 5-16: full beat\n[Pre-Hook] 0:32–0:40 — Bars 17-20: build\n[Hook] 0:40–1:08 — Bars 21-34: full energy\n[Verse 2]...\n[Outro]",
  "steps": [
    "Step to do in BandLab Android — very specific",
    "Step 2...",
    "Step 3...",
    "Step 4...",
    "Step 5...",
    "Step 6...",
    "Step 7...",
    "Step 8...",
    "Step 9...",
    "Step 10..."
  ],
  "mixing": "Detailed mixing tips specific to this genre. Include specific BandLab mixer settings: which tracks to pan, reverb send amounts per instrument, sidechain if applicable, EQ cuts for each layer.",
  "protips": "3-4 professional tips to make this beat stand out. Genre-specific production secrets."
}

Make ALL values realistic, genre-accurate, and directly usable in BandLab Android. Be VERY specific with numbers.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const aiData = await response.json();

    if (aiData.error) {
      return res.status(500).json({ error: aiData.error.message });
    }

    const rawText = aiData.content[0].text;

    // Strip any accidental markdown fences
    const clean = rawText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    res.json(parsed);
  } catch (err) {
    console.error('Generate error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate beat' });
  }
});

// ─── Start ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🎵 ZEXBEAT AI running on port ${PORT}`);
});
