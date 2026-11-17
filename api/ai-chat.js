// Vercel Serverless Function: AI Trademark Assistant Chat
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  let payload = req.method === 'POST' ? req.body : req.query;
  if (typeof payload === 'string') {
    try { payload = JSON.parse(payload); } catch (e) { payload = {}; }
  }
  const message = (payload?.message || payload?.q || '').trim();
  const brandContext = (payload?.brand || payload?.trademarkContext || '').trim();

  if (!message) {
    return res.status(400).json({ success: false, message: 'Pesan kosong.' });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (geminiApiKey) {
    try {
      const prompt = `Anda adalah BrandConnect AI Assistant, asisten kecerdasan buatan resmi untuk platform perlindungan merek dan HAKI BrandConnect di Indonesia. 
Anda menguasai secara mendalam:
1. UU No. 20 Tahun 2016 tentang Merek dan Indikasi Geografis (Pasal 20 kriteria absolut & Pasal 21 kriteria penolakan relatif).
2. Klasifikasi Nice edisi terbaru (Kelas 1 s/d 45 barang dan jasa).
3. Prosedur pendaftaran DJKI, masa pengumuman Berita Resmi Merek (BRM 2 bulan), sanggahan/oposisi, dan sertifikasi.
4. Asas First-to-File di Indonesia.

${brandContext ? `Merek yang sedang dibahas pengguna saat ini: "${brandContext}".` : ''}
Pertanyaan pengguna: "${message}"

Berikan jawaban yang ramah, profesional, ringkas, akurat secara hukum, dan beri rekomendasi taktis. Gunakan format markdown bersih dengan poin-poin jika diperlukan. Akhiri dengan ajakan ramah jika ingin berkonsultasi lebih lanjut dengan tim Konsultan HKI BrandConnect.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 800
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return res.status(200).json({ success: true, fromGemini: true, reply: text });
        }
      }
    } catch (err) {
      console.warn('Gemini chat call failed, falling back to local assistant:', err.message);
    }
  }

  // Fallback intelligent response logic
  const q = message.toLowerCase();
  let reply = '';

  if (q.includes('kelas') || q.includes('nice') || q.includes('kategori')) {
    reply = `Berdasarkan standar **Klasifikasi Nice (Kelas 1–45)** DJKI:
• **Barang Dagangan (Kelas 1–34)**: Contohnya Kelas 03 (Kosmetik/Skincare), Kelas 25 (Fashion/Pakaian), Kelas 30 (Kopi/Makanan).
• **Layanan Jasa (Kelas 35–45)**: Contohnya Kelas 35 (Retail/Toko Online), Kelas 42 (IT & Software), Kelas 43 (Kafe & Restoran).

${brandContext ? `Untuk merek **${brandContext}**, kami sarankan memeriksa kelas utama produk sekaligus kelas jasa retail (Kelas 35) agar perlindungannya menyeluruh.` : 'Ceritakan produk atau jasa Anda, dan saya bantu rekomendasikan nomor kelas yang tepat!'}`;
  } else if (q.includes('tolak') || q.includes('pasal 20') || q.includes('pasal 21') || q.includes('sanggahan')) {
    reply = `Alasan penolakan merek diatur dalam **UU Merek No. 20 Tahun 2016**:
1. **Pasal 20 (Alasan Mutlak)**: Merek ditolak jika tidak memiliki daya pembeda, merupakan kata generik/umum, atau hanya menyebutkan nama barang (misal: "Kopi Nikmat" untuk kopi).
2. **Pasal 21 (Alasan Relatif)**: Merek ditolak jika memiliki **persamaan pada pokoknya atau keseluruhannya** dengan merek terdaftar lain dalam kelas sejenis.

Jika Anda menerima Surat Usulan Penolakan, Anda berhak mengajukan **Surat Tanggapan/Sanggahan Resmi dalam waktu 30 hari kerja**. Konsultan HKI BrandConnect siap mendampingi Anda.`;
  } else if (q.includes('biaya') || q.includes('harga') || q.includes('tarif')) {
    reply = `Biaya pendaftaran merek resmi mencakup PNBP DJKI dan jasa pendampingan konsultan:
• **Pendaftaran Merek Jalur UMKM**: Tarif PNBP resmi disubsidi pemerintah (wajib melampirkan Surat Keterangan UMKM).
• **Pendaftaran Merek Jalur Umum/PT**: Tarif resmi pendaftaran badan usaha.

Seluruh biaya di BrandConnect transparan tanpa biaya tersembunyi, mencakup pengecekan pra-analisis, penyiapan etiket, pengajuan e-filing, dan pemantauan BRM.`;
  } else {
    reply = `Terima kasih atas pertanyaan Anda${brandContext ? ' mengenai merek **' + brandContext + '**' : ''}. Di Indonesia, perlindungan merek menganut sistem **First-to-File** (siapa cepat mendaftar, dia yang memegang hak eksklusif).

Apakah Anda ingin memeriksa ketersediaan nama merek, menentukan kelas pendaftaran yang tepat, atau ingin langsung didampingi oleh Konsultan HKI resmi BrandConnect?`;
  }

  return res.status(200).json({ success: true, fromGemini: false, reply });
};
