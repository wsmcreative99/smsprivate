const express = require('express');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MAX_LEN = 4444;      // batas panjang catatan
const MAX_NOTES = 500;     // batas catatan yang disimpan bersamaan
const TTL = { '1h': 3600e3, '24h': 86400e3 };
const ID_RE = /^[a-f0-9]{32}$/;

// id -> { text, expiresAt }  (in-memory, tanpa database)
const notes = new Map();

app.disable('x-powered-by');
app.use(express.json({ limit: '24kb' }));
app.use((req, res, next) => {
  res.set({
    'Cache-Control': 'no-store',
    'X-Robots-Tag': 'noindex',
    'Referrer-Policy': 'no-referrer',
  });
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

// 1. Buat catatan
app.post('/api/note', (req, res) => {
  const text = typeof req.body.text === 'string' ? req.body.text.trim() : '';
  if (!text || text.length > MAX_LEN) {
    return res.status(400).json({ error: 'Catatan kosong atau terlalu panjang.' });
  }
  if (notes.size >= MAX_NOTES) {
    return res.status(503).json({ error: 'Server sedang penuh. Coba lagi nanti.' });
  }
  const ttl = TTL[req.body.ttl] || TTL['24h'];
  const id = crypto.randomBytes(16).toString('hex');
  notes.set(id, { text, expiresAt: Date.now() + ttl });
  res.json({ id });
});

// 2. Baca catatan: ambil lalu langsung hapus (satu langkah)
app.post('/api/note/:id/read', (req, res) => {
  const { id } = req.params;
  const note = ID_RE.test(id) ? notes.get(id) : null;
  if (!note) return res.status(404).json({ error: 'Catatan sudah dihancurkan.' });
  notes.delete(id);
  if (Date.now() > note.expiresAt) {
    return res.status(404).json({ error: 'Catatan sudah kedaluwarsa.' });
  }
  res.json({ text: note.text });
});

// Halaman baca (file yang sama dengan halaman buat)
app.get('/n/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Bersihkan catatan kedaluwarsa tiap 10 menit
setInterval(() => {
  const now = Date.now();
  for (const [id, n] of notes) if (now > n.expiresAt) notes.delete(id);
}, 10 * 60e3).unref();

app.listen(PORT, () => console.log(`PrivateSMS jalan di http://localhost:${PORT}`));
