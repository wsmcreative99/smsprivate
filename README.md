# PrivateSMS

Catatan rahasia yang hancur setelah dibaca. Tulis pesan, bagikan link-nya, dan begitu dibuka satu kali, catatan terhapus permanen dari server.

## Fitur

- Catatan hancur otomatis saat dibaca (ambil dan hapus dalam satu langkah di server)
- Link acak 32 karakter yang tidak bisa ditebak
- Hangus otomatis dalam 24 jam jika tidak dibuka
- Tombol "Tampilkan catatan" supaya bot preview (WhatsApp, Telegram, dll.) tidak menghabiskan catatan
- Tampilan glassmorphism, responsif untuk HP dan desktop
- Ringan: tanpa database, hanya Node.js dan Express

## Cara kerja

1. Pengguna menulis catatan, server menyimpannya di memori dengan ID acak, lalu mengembalikan link `/n/ID`.
2. Penerima membuka link dan menekan **Tampilkan catatan**.
3. Server mengirim isi catatan dan menghapusnya pada saat yang sama.
4. Membuka link yang sama lagi menampilkan "Catatan ini sudah tidak ada".

## Struktur proyek

```
privatesms/
├─ server.js
├─ package.json
└─ public/
   └─ index.html
```

## Batasan

- Maksimal 4.444 karakter per catatan
- Maksimal 500 catatan tersimpan bersamaan
- Catatan disimpan di memori server, bukan database. Catatan yang belum dibuka akan hilang jika server restart, deploy ulang, atau tertidur
- Belum ada pembatasan jumlah pembuatan catatan per IP

## Jalankan di komputer sendiri

Butuh Node.js (versi LTS).

```bash
npm install
npm start
```

Buka `http://localhost:3000`.

## Deploy di Render

1. Upload proyek ini ke repo GitHub (`server.js` dan `package.json` harus ada di root repo).
2. Di [render.com](https://render.com), pilih **New → Web Service**, lalu pilih repo ini.
3. Isi pengaturan:
   - Runtime: **Node**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: **Free**
4. Klik **Deploy** dan tunggu sampai statusnya Live.

Port dibaca otomatis dari environment variable `PORT`, jadi tidak perlu diatur manual.

Instance gratis Render bisa tertidur saat sepi. Untuk mengurangi kemungkinan itu, pasang monitor gratis seperti UptimeRobot yang membuka URL-mu tiap 5 menit.

## Lisensi

MIT
