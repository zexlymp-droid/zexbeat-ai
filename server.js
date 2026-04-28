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

KONTEKS PENTING: User menggunakan BandLab Android dengan FITUR TEMPLATE yang sudah ada. Semua langkah harus menjelaskan cara:
1. Memilih template yang tepat di BandLab
2. Mengedit dan mengganti sounds dalam template tersebut
3. Mengatur bagian Intro, Verse, Hook, Outro menggunakan fitur Arrange di BandLab
4. Mengubah pattern yang ada di template sesuai genre yang diminta
Jelaskan setiap langkah dengan sangat detail dan mudah dipahami pemula.

Balas HANYA dengan JSON object yang valid (tanpa markdown, tanpa backtick, tanpa teks lain) dengan struktur persis seperti ini:
{
  "identity": "2-3 kalimat deskripsi karakter beat ini dalam Bahasa Indonesia. Jelaskan vibes, sound, dan feel-nya dengan vivid dan spesifik.",
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
  "structure": "Struktur beat lengkap dalam Bahasa Indonesia dengan hitungan bar:\\n[Intro] 0:00-0:08 - Bar 1-4: penjelasan isi bagian ini\\n[Verse] 0:08-0:32 - Bar 5-16: penjelasan\\n[Pre-Hook] 0:32-0:40 - Bar 17-20: penjelasan\\n[Hook] 0:40-1:08 - Bar 21-34: penjelasan\\n[Verse 2] 1:08-1:32 - penjelasan\\n[Bridge] 1:32-1:48 - penjelasan\\n[Outro] 1:48-2:00 - penjelasan",
  "steps": [
    "Buka BandLab Android, tap tombol + lalu pilih Templates, cari template yang cocok untuk genre ini",
    "Langkah 2: cara ganti BPM template ke angka yang benar",
    "Langkah 3: cara ganti drum kit di template",
    "Langkah 4: cara edit pattern drum di Beat Maker",
    "Langkah 5: cara ganti atau tambah instrumen melody",
    "Langkah 6: cara tambah bass 808",
    "Langkah 7: cara buat section Intro di fitur Arrange BandLab",
    "Langkah 8: cara buat Verse dan Hook yang berbeda di Arrange",
    "Langkah 9: cara setting mixer - level, pan, reverb per track",
    "Langkah 10: cara tambah efek dan finalisasi beat",
    "Langkah 11: tips spesifik genre ini",
    "Langkah 12: cara save dan export beat"
  ],
  "mixing": "Tips mixing dalam Bahasa Indonesia khusus genre ini. Sebutkan track mana yang di-pan berapa %, reverb send berapa % tiap instrumen, cara sidechain, EQ cut dan boost spesifik. Semua angka harus spesifik.",
  "protips": "3-4 tips profesional dalam Bahasa Indonesia untuk membuat beat ini outstanding. Rahasia produser spesifik genre ini."
}

Semua nilai harus realistis, akurat untuk genre tersebut, dan bisa langsung dipraktekkan di BandLab Android. Sangat spesifik dengan angka.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 2500,
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

    if (aiData.error) {
      return res.status(500).json({ error: aiData.error.message });
    }

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
app.listen(PORT, () => {
  console.log(`🎵 ZEXBEAT AI running on port ${PORT}`);
});
