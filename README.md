# 🎵 ZEXBEAT AI — Setup Guide

## Yang Lo Butuhkan
- HP Android dengan Termux (dari F-Droid, bukan Play Store)
- Akun GitHub (gratis)
- Akun Railway (gratis) → railway.app
- Anthropic API Key → console.anthropic.com

---

## STEP 1 — Setup Termux

Buka Termux, jalankan satu per satu:

```bash
# Update packages
pkg update && pkg upgrade -y

# Install Git dan Node.js
pkg install git nodejs -y

# Cek versi (harus Node 18+)
node --version
git --version
```

---

## STEP 2 — Setup Git & GitHub

```bash
# Set identitas Git
git config --global user.name "NamaLo"
git config --global user.email "email@lo.com"
```

### Buat repo di GitHub:
1. Buka github.com di browser
2. Klik "New repository"
3. Nama repo: `zexbeat-ai`
4. Pilih **Public**
5. Klik "Create repository"

### Push project ke GitHub dari Termux:
```bash
# Masuk ke folder project
cd /path/ke/bandlab-beat-ai

# Init git dan push
git init
git add .
git commit -m "🎵 Initial ZEXBEAT AI"
git branch -M main
git remote add origin https://github.com/USERNAME/zexbeat-ai.git
git push -u origin main
```

> Saat diminta password GitHub, masukkan **Personal Access Token** (bukan password).
> Buat token di: GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic) → Generate new token → centang `repo` → Generate.

---

## STEP 3 — Deploy ke Railway

1. Buka **railway.app** di browser
2. Login dengan GitHub
3. Klik **"New Project"**
4. Pilih **"Deploy from GitHub repo"**
5. Pilih repo `zexbeat-ai`
6. Railway auto-detect Node.js dan deploy otomatis

### Set Environment Variable (PENTING!):
1. Di Railway dashboard, klik project lo
2. Klik tab **"Variables"**
3. Klik **"New Variable"**
4. Key: `ANTHROPIC_API_KEY`
5. Value: `sk-ant-xxxxx` (API key dari console.anthropic.com)
6. Klik **Add**

Railway akan auto-redeploy setelah variable ditambahkan.

---

## STEP 4 — Dapatkan URL

Setelah deploy berhasil:
1. Di Railway dashboard klik **"Settings"** → **"Domains"**
2. Klik **"Generate Domain"**
3. Lo dapat URL seperti: `https://zexbeat-ai-production.up.railway.app`

Buka URL itu di browser = app lo sudah live! 🔥

---

## CARA PAKAI

1. Buka URL Railway di browser HP
2. Pilih **Genre**
3. (Opsional) Isi referensi artis, BPM, Key, Mood
4. Klik **GENERATE BEAT**
5. Dapat:
   - **BEAT IDENTITY** — karakter beat
   - **BANDLAB SETTINGS** — angka spesifik (BPM, reverb, EQ, compressor, dll)
   - **INSTRUMEN & SOUNDS** — apa yang dipakai dan settingnya
   - **STRUKTUR BEAT** — timeline lengkap
   - **STEP-BY-STEP** — cara buat di BandLab Android
   - **MIXING TIPS** — cara mix profesional
   - **PRO TIPS** — rahasia produser

---

## UPDATE APP (kalau ada perubahan)

```bash
cd bandlab-beat-ai
git add .
git commit -m "update"
git push
```

Railway otomatis redeploy dari GitHub push! Gaperlu manual.

---

## TROUBLESHOOT

| Masalah | Solusi |
|---------|--------|
| Deploy gagal | Cek tab "Deployments" di Railway, baca error log |
| API error 401 | API key salah atau expired |
| API error 529 | Anthropic overloaded, coba lagi |
| App loading lama | Normal, Railway free tier cold start ~10 detik |

---

Made for **ZEXINFO** 🔥
