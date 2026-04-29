const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/generate', async (req, res) => {
  const { genre, reference, bpm, key, mood, extra } = req.body;

  const prompt = `Kamu adalah produser beat profesional dan ahli BandLab Android.
WAJIB: Tulis SEMUA output dalam Bahasa Indonesia. Hanya istilah teknis musik yang boleh dalam bahasa Inggris (BPM, EQ, reverb, nama chord, nama instrumen di BandLab).

Buat resep beat lengkap dan profesional untuk:
- Genre: ${genre}
- Referensi artis/subgenre: ${reference || 'tidak ditentukan'}
- Preferensi BPM: ${bpm || 'otomatis sesuai genre'}
- Key/Scale: ${key || 'otomatis sesuai genre'}
- Mood/Vibe: ${mood || 'otomatis sesuai genre'}
- Catatan tambahan: ${extra || 'tidak ada'}

KONTEKS PENTING: User menggunakan BandLab Android dengan FITUR TEMPLATE. Semua langkah harus menjelaskan cara memilih template, mengedit sounds, dan mengatur section Intro/Verse/Hook/Outro di fitur Arrange BandLab Android.

Balas HANYA dengan JSON object yang valid (tanpa markdown, tanpa backtick, tanpa teks lain):
{
  "identity": "2-3 kalimat deskripsi karakter beat ini dalam Bahasa Indonesia. Jelaskan vibes, sound, dan feel-nya.",
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
    "DRUMS: nama drum kit di BandLab yang cocok + penjelasan pattern kick dan snare",
    "HI-HAT: pattern, velocity berapa %, swing berapa %",
    "BASS: jenis bass di BandLab + pola not + settingnya",
    "MELODY 1: nama instrumen di BandLab + not/chord + cara mainnya",
    "MELODY 2: layer kedua instrumen + pola + fungsinya dalam beat",
    "PAD/TEXTURE: instrumen atmosfer + cara settingnya",
    "SFX: efek transisi, riser, atau suara tambahan"
  ],
  "volume_per_section": [
    {
      "instrument": "Kick",
      "intro": "-8 dB",
      "verse": "-5 dB",
      "prehook": "-3 dB",
      "hook": "0 dB",
      "outro": "-8 dB",
      "note": "Naikan bertahap biar makin hype pas hook"
    },
    {
      "instrument": "Snare",
      "intro": "mute",
      "verse": "-6 dB",
      "prehook": "-4 dB",
      "hook": "-2 dB",
      "outro": "-6 dB",
      "note": "Di intro dikosongkan biar ada efek build"
    },
    {
      "instrument": "Hi-Hat",
      "intro": "-10 dB",
      "verse": "-7 dB",
      "prehook": "-5 dB",
      "hook": "-4 dB",
      "outro": "-10 dB",
      "note": "Tambah open hat di pre-hook buat tension"
    },
    {
      "instrument": "Bass 808",
      "intro": "-12 dB",
      "verse": "-6 dB",
      "prehook": "-5 dB",
      "hook": "-2 dB",
      "outro": "-12 dB",
      "note": "Bass paling keras di hook, jadi tulang punggung beat"
    },
    {
      "instrument": "Melody 1",
      "intro": "-8 dB",
      "verse": "-9 dB",
      "prehook": "-7 dB",
      "hook": "-5 dB",
      "outro": "-8 dB",
      "note": "Sedikit lebih pelan dari drum biar tidak bentrok"
    },
    {
      "instrument": "Melody 2",
      "intro": "mute",
      "verse": "mute",
      "prehook": "-10 dB",
      "hook": "-7 dB",
      "outro": "mute",
      "note": "Masuk mulai pre-hook sebagai layer tambahan"
    },
    {
      "instrument": "Pad/Texture",
      "intro": "-6 dB",
      "verse": "-12 dB",
      "prehook": "-10 dB",
      "hook": "-14 dB",
      "outro": "-6 dB",
      "note": "Paling keras di intro dan outro untuk atmosfer"
    }
  ],
  "structure": "Struktur beat lengkap dalam Bahasa Indonesia dengan hitungan bar:\\n[Intro] 0:00-0:08 - Bar 1-4: penjelasan\\n[Verse] 0:08-0:32 - Bar 5-16: penjelasan\\n[Pre-Hook] 0:32-0:40 - Bar 17-20: penjelasan\\n[Hook] 0:40-1:08 - Bar 21-34: penjelasan\\n[Verse 2] 1:08-1:32 - penjelasan\\n[Bridge] 1:32-1:48 - penjelasan\\n[Outro] 1:48-2:00 - penjelasan",
  "steps": [
    "Buka BandLab Android, tap tombol + lalu pilih Templates, cari template yang cocok untuk genre ini",
    "Langkah 2: cara ganti BPM template ke angka yang benar",
    "Langkah 3: cara ganti drum kit di template",
    "Langkah 4: cara edit pattern drum di Beat Maker",
    "Langkah 5: cara ganti atau tambah instrumen melody",
    "Langkah 6: cara tambah bass 808",
    "Langkah 7: cara buat section Intro di fitur Arrange BandLab",
    "Langkah 8: cara buat Verse dan Hook yang berbeda di Arrange",
    "Langkah 9: cara setting volume per track sesuai tabel di atas di setiap section",
    "Langkah 10: cara setting mixer - pan, reverb per track",
    "Langkah 11: cara tambah efek dan finalisasi beat",
    "Langkah 12: cara save dan export beat"
  ],
  "mixing": "Tips mixing dalam Bahasa Indonesia khusus genre ini. Sebutkan track mana di-pan berapa %, reverb send berapa % tiap instrumen, cara sidechain, EQ cut dan boost spesifik. Semua angka spesifik.",
  "protips": "3-4 tips profesional dalam Bahasa Indonesia untuk membuat beat ini outstanding. Rahasia produser spesifik genre ini."
}

Semua nilai volume_per_section harus realistis dan akurat untuk genre tersebut. Angka dB harus masuk akal secara teknis mixing. Sesuaikan nilai dengan genre yang diminta.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 3000,
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content: 'Kamu adalah produser beat profesional ahli BandLab Android. Selalu balas dengan JSON valid saja, tanpa markdown, tanpa backtick, tanpa teks tambahan. Semua output dalam Bahasa Indonesia.'
          },
          { role: 'user', content: prompt }
        ]
      })
    });

    const aiData = await response.json();
    if (aiData.error) return res.status(500).json({ error: aiData.error.message });

    const rawText = aiData.choices[0].message.content;
    const clean = rawText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    res.json(parsed);
  } catch (err) {
    console.error('Generate error:', err);
    res.status(500).json({ error: err.message || 'Gagal generate beat' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🎵 ZEXBEAT AI running on port ${PORT}`));
