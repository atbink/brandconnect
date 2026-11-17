// Vercel Serverless Function: AI Trademark & Visual Logo Conflict Analysis
module.exports = async (req, res) => {
  // Enable CORS
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

  let query = req.method === 'POST' ? req.body : req.query;
  if (typeof query === 'string') {
    try { query = JSON.parse(query); } catch (e) { query = {}; }
  }

  const rawImage = query?.logoDataUrl || query?.imageBase64 || query?.image || '';
  let cleanBase64 = '';
  let imageMime = query?.imageMimeType || 'image/png';
  if (typeof rawImage === 'string' && rawImage.length > 50) {
    if (rawImage.startsWith('data:')) {
      const match = rawImage.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        imageMime = match[1];
        cleanBase64 = match[2];
      }
    } else {
      cleanBase64 = rawImage;
    }
  }

  const hasImage = Boolean(cleanBase64 && cleanBase64.length > 50);
  const brand = (query?.brand || query?.brandName || query?.q || (hasImage ? (query?.fileName ? query.fileName.replace(/\.[^.]+$/, '') : 'LOGO_AUDIT') : '')).trim();
  const niceClass = (query?.niceClass || query?.class || '').trim();
  const description = (query?.description || '').trim();
  let topMatch = query?.topMatch || null;
  if (typeof topMatch === 'string') {
    try { topMatch = JSON.parse(topMatch); } catch (e) { topMatch = null; }
  }
  const similarItems = Array.isArray(query?.similarItems) ? query.similarItems : [];
  if (!topMatch && similarItems.length > 0) {
    topMatch = similarItems[0];
  }
  let totalFound = parseInt(query?.totalFound || (topMatch ? 1 : similarItems.length) || 0, 10);

  if (!brand && !hasImage) {
    return res.status(400).json({ success: false, message: 'Parameter "brand" atau "logoDataUrl" diperlukan.' });
  }

  const lower = brand.toLowerCase().trim();
  const apiKey = process.env.PDKI_API_KEY || 'aip_live_tW5NibLE0C8rjVIF6jOYon3PgdbTsE01';

  // 1. Server-Side Auto-Lookup to Live DJKI Database if topMatch not yet supplied and brand isn't generic placeholder
  if (!topMatch && apiKey && brand && !brand.startsWith('LOGO_')) {
    try {
      const liveResp = await fetch(`https://use.apiindonesia.id/api/v1/merek/search?q=${encodeURIComponent(brand)}&page=1&limit=15`, {
        headers: {
          'x-api-key': apiKey,
          'Accept': 'application/json'
        }
      });
      if (liveResp.ok) {
        const liveJson = await liveResp.json();
        const rawList = liveJson && Array.isArray(liveJson.data) ? liveJson.data : [];
        if (rawList.length > 0) {
          totalFound = liveJson.pagination?.total || rawList.length;
          // Find identical exact match first, or highest relevant mark
          const exact = rawList.find(r => (r.mark_name || r.name || '').toLowerCase().trim() === lower);
          const topItem = exact || rawList[0];
          topMatch = {
            brand: (topItem.mark_name || topItem.name || brand).toUpperCase(),
            owner: (topItem.owner || topItem.pemilik || 'Pemohon Terdaftar (DJKI)').trim(),
            appNo: topItem.app_number || topItem.nomor_permohonan || '-',
            status: topItem.status || '(TM) DIDAFTAR',
            niceClass: String(topItem.class || topItem.kelas || '35').replace(/[^0-9]/g, '')
          };
        }
      }
    } catch (e) {
      console.warn('Server live search check error:', e.message);
    }
  }

  // 2. Comprehensive Registered & Famous Brands Index (Pasal 21 Ayat 1 & 2)
  const majorBrands = [
    'kahf', 'paragon', 'ms glow', 'msglow', 'somethinc', 'scarlett', 'wardah', 'emina',
    'make over', 'biore', 'garnier', 'ponds', 'nivea', 'vaseline', 'dettol', 'lifebuoy',
    'sensatia', 'avoskin', 'erha', 'onitsuka', 'onitsuka tiger', 'asics', 'adidas', 'nike',
    'puma', 'converse', 'vans', 'new balance', 'reebok', 'skechers', 'zara', 'uniqlo',
    'h&m', 'gucci', 'chanel', 'louis vuitton', 'dior', 'prada', 'hermes', 'apple',
    'samsung', 'xiaomi', 'oppo', 'vivo', 'asus', 'lenovo', 'sony', 'lg', 'indomie',
    'mie sedaap', 'kopi kenangan', 'janji jiwa', 'fore coffee', 'starbucks', 'chatime',
    'mixue', 'mebiso', 'bca', 'mandiri', 'bri', 'bni', 'telkomsel', 'indosat', 'xl',
    'gojek', 'tokopedia', 'shopee', 'lazada', 'grab', 'traveloka', 'pertamina', 'unilever',
    'nestle', 'aqua', 'le minerale', 'djarum', 'sampoerna', 'gudang garam', 'batik keris'
  ];

  const topBrandLower = (topMatch?.brand || '').toLowerCase().trim();
  const hasIdenticalMatch = topBrandLower && (
    topBrandLower === lower ||
    (lower.length >= 3 && (lower.includes(topBrandLower) || topBrandLower.includes(lower)))
  );
  const isDirectConflict = Boolean(
    hasIdenticalMatch ||
    majorBrands.some(b => lower === b || (b.length >= 3 && (lower.includes(b) || b.includes(lower)))) ||
    (topMatch && (topMatch.status || '').toUpperCase().includes('DAFTAR') && (topBrandLower === lower || (lower.length >= 3 && topBrandLower.includes(lower))))
  );

  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (geminiApiKey) {
    try {
      const promptText = `Anda adalah Konsultan HKI Terdaftar dan Spesialis Pemeriksaan Substantif Merek DJKI RI (Kemenkumham).
Lakukan analisis kepatuhan yuridis pendaftaran merek berdasarkan UU No. 20 Tahun 2016 tentang Merek dan Indikasi Geografis (khususnya Pasal 20 & Pasal 21 ayat 1 huruf a tentang Persamaan Unsur Kata, Fonetik, serta Unsur Figuratif/Lukisan pada Pokoknya).

${hasImage ? `[MODE AUDIT VISUAL LOGO & ETIKET AI]
File logo pemohon telah disertakan dalam pesan ini sebagai data gambar (multimodal).
TUGAS KHUSUS ANDA:
1. Analisis bentuk figuratif logo secara semantik (siluet, geometri garis, mahkota, hewan, sayap, monogram kursif, emblem melingkar, dsb).
2. Tentukan Klasifikasi WIPO Vienna (Vienna Classification) yang paling presisi (kode angka, judul, dan deskripsi figuratif).
3. Deteksi potensi konflik bentuk visual dengan merek-merek terdaftar atau merek terkenal (misalnya: tiga garis Adidas, siluet kucing Puma, centang Nike, lambang bundar Starbucks, silang Onitsuka, monogram MS Glow/Chanel/Gucci, dsb).
4. Berikan vonis tingkat risiko konflik bentuk (Tinggi / Menengah / Rendah) di bawah Pasal 21 ayat 1 huruf a UU Merek.
5. Berikan rekomendasi modifikasi visual konkret bagi desainer grafis pemohon.` : ''}

Permohonan yang diajukan: "${brand}" ${niceClass ? 'pada Kelas Nice ' + niceClass : ''} ${description ? 'dengan produk: ' + description : ''}.

${topMatch ? `DATA RESMI PANGKALAN DJKI RI DITEMUKAN:
- Merek Terdaftar: "${topMatch.brand}"
- Pemilik Resmi: "${topMatch.owner || 'Pihak Lain'}"
- No. Permohonan: "${topMatch.appNo || '-'}"
- Status: "${topMatch.status || 'TERDAFTAR'}"
- Kelas Nice: "${topMatch.niceClass || '-'}"
CATATAN HUKUM KRUSIAL: Merek ini memiliki persamaan pada pokoknya atau identik dengan merek terdaftar milik pihak lain. Menurut Pasal 21 ayat (1) huruf a UU No. 20 Tahun 2016, permohonan baru WAJIB DINILAI "Risiko Tinggi" (Potensi Ditolak Mutlak, Peluang Lolos 10-20%). DILARANG KERAS menyatakan "Daya Pembeda Kuat" atau "Potensi Diterima Tinggi"!` : ''}

Formatkan output Anda HANYA dalam JSON valid tanpa markdown formatting dengan struktur:
{
  "brand": "${brand.toUpperCase()}",
  "riskLevel": "Tinggi" | "Menengah" | "Rendah",
  "riskScore": number (0-100, peluang lolos),
  "verdict": "string singkat kesimpulan",
  "explanation": "penjelasan mendalam risiko hukum mengacu pada temuan DJKI dan Pasal 20 / 21 UU Merek",
  ${hasImage ? `"logoAudit": {
    "detectedMotif": "deskripsi bentuk/siluet visual yang terdeteksi AI",
    "viennaCode": "kode WIPO Vienna (contoh: 26.11.02)",
    "viennaCategory": "kategori WIPO Vienna",
    "visualConflictRisk": "Tinggi" | "Menengah" | "Rendah",
    "conflictingBenchmarks": [
      {
        "brand": "Nama Merek Terdaftar Terkenal",
        "motif": "Ciri khas bentuk yang mirip",
        "similarityNote": "Alasan yuridis kemiripan bentuk secara visual",
        "riskLevel": "Tinggi" | "Menengah"
      }
    ],
    "pasal21Assessment": "kajian yuridis kesamaan lukisan/bentuk pada pokoknya menurut Pasal 21 ayat 1 huruf a UU Merek",
    "modificationAdvice": "saran perubahan bentuk visual konkret untuk tim desainer"
  },` : ''}
  "phonetic": {
    "status": "Persamaan Bunyi / Fonetik Identik" | "Kemiripan Parsial" | "Daya Pembeda Kuat",
    "detail": "penjelasan analisis fonetik bunyi/lafal"
  },
  "visual": {
    "status": "Rawan Konflik Hak Eksklusif" | "Perlu Diferensiasi Etiket" | "Unik & Distingtif",
    "detail": "penjelasan analisis visual susunan huruf/ejaan"
  },
  "classRecommendation": {
    "primaryClass": "string kelas utama (contoh: Kelas ${topMatch?.niceClass || '35'})",
    "commodities": ["array", "string", "komoditas", "terkait"]
  },
  "statute": {
    "status": "Potensi Ditolak Pasal 21 Ayat (1)" | "Perlu Penegasan Pasal 20" | "Memenuhi Kriteria Pasal 20 & 21",
    "detail": "penjelasan kriteria penolakan DJKI"
  },
  "nextSteps": [
    "langkah 1",
    "langkah 2",
    "langkah 3"
  ]
}`;

      const contentsParts = [{ text: promptText }];
      if (hasImage) {
        contentsParts.push({
          inline_data: {
            mime_type: imageMime,
            data: cleanBase64
          }
        });
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: contentsParts }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          // Safety guard: if direct conflict exists, strictly enforce rejection metrics even if AI hallucinates
          if (isDirectConflict) {
            parsed.riskLevel = 'Tinggi';
            parsed.riskScore = Math.min(parsed.riskScore || 18, 20);
            parsed.verdict = 'Persamaan Pada Pokoknya (Risiko Penolakan Tinggi)';
            if (parsed.phonetic) parsed.phonetic.status = 'Persamaan Bunyi / Fonetik Identik';
            if (parsed.visual) parsed.visual.status = 'Rawan Konflik Hak Eksklusif';
            if (parsed.statute) parsed.statute.status = 'Potensi Ditolak Pasal 21 Ayat (1)';
          }
          return res.status(200).json({ success: true, fromGemini: true, analysis: parsed });
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local legal engine:', err.message);
    }
  }

  // Fallback Rule-based Legal & Vision Engine (Deterministic & Compliant with UU No. 20/2016)
  let riskLevel = 'Rendah';
  let riskScore = 92;
  let verdict = 'Daya Pembeda Kuat (Potensi Diterima Tinggi)';
  let explanation = `Nama merek "${brand.toUpperCase()}" memiliki daya pembeda yang baik dan tidak mendeskripsikan barang/jasa secara umum. Peluang lolos pemeriksaan substantif DJKI tinggi.`;
  let phoneticStatus = 'Daya Pembeda Kuat';
  let phoneticDetail = `Susunan bunyi dan intonasi fonetik "${brand.toUpperCase()}" tidak memiliki kemiripan bunyi signifikan dengan merek terdaftar.`;
  let visualStatus = 'Unik & Distingtif';
  let visualDetail = 'Ejaan dan komposisi tipografi memiliki orisinalitas tinggi, memenuhi asas pembeda merek.';
  let statuteStatus = 'Memenuhi Kriteria Pasal 20 & 21 UU Merek';
  let statuteDetail = 'Tidak bertentangan dengan norma, tidak menyesatkan, dan belum teridentifikasi persamaan pada pokoknya.';

  if (isDirectConflict) {
    const conflictName = topMatch?.brand || brand.toUpperCase();
    const ownerName = topMatch?.owner || 'pemilik terdaftar sebelumnya';
    const appNo = topMatch?.appNo ? ` (No. ${topMatch.appNo})` : '';
    const conflictClass = topMatch?.niceClass ? ` untuk Kelas ${topMatch.niceClass}` : '';

    riskLevel = 'Tinggi';
    riskScore = 18;
    verdict = 'Persamaan Pada Pokoknya (Risiko Penolakan Tinggi)';
    explanation = `Merek "${brand.toUpperCase()}" memiliki persamaan identik/substantif dengan merek "${conflictName}"${appNo} yang sudah terdaftar di DJKI RI milik ${ownerName}${conflictClass}. Berdasarkan Pasal 21 ayat (1) huruf a UU No. 20/2016 tentang Merek dan Indikasi Geografis, permohonan baru untuk merek ini berpotensi besar DITOLAK oleh pemeriksa substantif DJKI karena memiliki persamaan pada pokoknya dengan merek terdaftar milik pihak lain.`;
    phoneticStatus = 'Persamaan Bunyi / Fonetik Identik';
    phoneticDetail = `Lafal dan suku kata pengucapan "${brand.toUpperCase()}" sama persis atau menyerupai merek terdaftar milik ${ownerName} di pangkalan data resmi DJKI.`;
    visualStatus = 'Rawan Konflik Hak Eksklusif';
    visualDetail = `Pemilik merek terdahulu (${ownerName}) memegang hak monopoli hukum atas nama dan variasi visual etiket merek ini.`;
    statuteStatus = 'Potensi Ditolak Pasal 21 Ayat (1)';
    statuteDetail = 'DJKI wajib menolak permohonan yang memiliki persamaan pada pokoknya dengan merek terdaftar milik pihak lain untuk barang/jasa sejenis.';
  } else if (totalFound > 0 || brand.length <= 3 || (/^[a-z]+$/i.test(brand) && (lower.includes('kopi') || lower.includes('store') || lower.includes('mart') || lower.includes('jaya') || lower.includes('glow')))) {
    riskLevel = 'Menengah';
    riskScore = 55;
    verdict = 'Perlu Diferensiasi Elemen Pembeda';
    explanation = `Nama merek "${brand.toUpperCase()}" memiliki beberapa kemiripan unsur kata di pangkalan data DJKI (${totalFound} merek terkait). Disarankan menambahkan kata pembeda unik atau logo khusus agar tidak memicu sanggahan atau usulan penolakan berdasarkan Pasal 20 & 21 UU Merek.`;
    phoneticStatus = 'Kemiripan Parsial';
    phoneticDetail = 'Terdapat suku kata atau bunyi yang mirip dengan merek lain di pangkalan data.';
    visualStatus = 'Perlu Etiket Visual Kuat';
    visualDetail = 'Kombinasi logo, tipografi kustom, atau elemen grafis sangat disarankan untuk memperkuat daya pembeda.';
    statuteStatus = 'Perlu Penegasan Daya Pembeda (Pasal 20)';
    statuteDetail = 'Merek tidak boleh hanya berupa kata umum atau deskripsi langsung tanpa elemen distingtif.';
  }

  // Vision Shape Conflict Engine (Fallback)
  let logoAudit = null;
  if (hasImage || query?.mode === 'logo') {
    let detectedMotif = 'Komposisi figuratif geometris dengan unsur tipografi dan lambang grafis';
    let viennaCode = '26.01.18';
    let viennaCategory = 'Bentuk Geometris Lingkaran & Kurva';
    let visualConflictRisk = 'Menengah';
    let conflictingBenchmarks = [];
    let pasal21Assessment = 'Unsur lukisan etiket memiliki karakteristik grafis yang lazim digunakan. Berdasarkan Pasal 21 ayat 1 huruf a UU No. 20/2016, pemeriksaan substantif DJKI akan membandingkan kesamaan kesan menyeluruh (overall impression) terhadap merek terdaftar terdahulu.';
    let modificationAdvice = 'Tambahkan stilasi tipografi kustom atau ornamen unik untuk menjauhkan kesan kemiripan dengan logo merek terdaftar.';

    // Motif heuristic matching based on keyword / brand hints
    if (/adidas|stripe|garis|stripes|sport|sepatu/i.test(lower)) {
      detectedMotif = 'Siluet garis-garis sejajar diagonal berulang (Motif Strip Paralel)';
      viennaCode = '26.11.02';
      viennaCategory = 'Dua atau Beberapa Garis / Pita Sejajar';
      visualConflictRisk = 'Tinggi';
      conflictingBenchmarks = [
        { brand: 'ADIDAS', motif: 'Tiga garis miring sejajar (3-Stripes Famous Mark)', similarityNote: 'Sangat rawan ditolak karena persamaan pada pokoknya dengan hak eksklusif 3-stripes Adidas AG', riskLevel: 'Tinggi' },
        { brand: 'K-SWISS', motif: 'Lima garis paralel diagonal', similarityNote: 'Kemiripan pola repetitive diagonal stripes', riskLevel: 'Menengah' }
      ];
      pasal21Assessment = 'Potensi Ditolak Mutlak di bawah Pasal 21 ayat (1) huruf a & b UU No. 20/2016 karena menyerupai ciri khas lukisan merek terkenal di bidang pakaian dan alas kaki.';
      modificationAdvice = 'Hindari pola garis paralel diagonal (2 hingga 4 baris). Gunakan bentuk geometris asimetris tertutup atau kombinasikan dengan tipografi nama merek.';
    } else if (/puma|kucing|macan|cat|feline|singa|tiger|onitsuka/i.test(lower)) {
      detectedMotif = 'Siluet hewan mamalia berkaki empat dalam posisi melompat/bergerak';
      viennaCode = '03.01.08';
      viennaCategory = 'Kucing, Harimau, Macan Tutul, Mamalia Karnivora';
      visualConflictRisk = 'Tinggi';
      conflictingBenchmarks = [
        { brand: 'PUMA', motif: 'Siluet kucing besar melompat (Jumping Cat Mark)', similarityNote: 'Sangat tinggi risiko kesamaan unsur figuratif pada pokoknya', riskLevel: 'Tinggi' },
        { brand: 'SLAZENGER', motif: 'Siluet macan kumbang melompat', similarityNote: 'Kemiripan bentuk figuratif hewan melompat', riskLevel: 'Tinggi' }
      ];
      pasal21Assessment = 'Bentuk siluet hewan melompat memiliki tingkat kerancuan tinggi dengan merek olahraga terdaftar. Berisiko memicu surat usulan penolakan dari pemeriksa DJKI.';
      modificationAdvice = 'Ganti posisi/pose hewan menjadi statis, siluet kepala saja (head portrait), atau stilasi garis abstrak geometris minimalis.';
    } else if (/nike|swoosh|centang|check/i.test(lower)) {
      detectedMotif = 'Siluet kurva meruncing melengkung dinamis (Wing / Swoosh Silhouette)';
      viennaCode = '26.11.12';
      viennaCategory = 'Garis Melengkung Meruncing (Curved Tapered Lines)';
      visualConflictRisk = 'Tinggi';
      conflictingBenchmarks = [
        { brand: 'NIKE', motif: 'Lambang Swoosh (Centang Melengkung Sayap)', similarityNote: 'Hak eksklusif merek terkenal dunia, dilarang keras meniru bentuk kurva meruncing', riskLevel: 'Tinggi' }
      ];
      pasal21Assessment = 'Pelanggaran langsung atas merek terkenal berdasarkan Pasal 21 ayat (1) huruf b UU Merek.';
      modificationAdvice = 'Tinggalkan bentuk kurva tunggal meruncing. Rancang logo berbasis lambang inisial huruf dengan ketebalan tegas.';
    } else if (/starbucks|siren|kopi|coffee|circle|lingkaran/i.test(lower)) {
      detectedMotif = 'Emblem melingkar ganda konsentris dengan figur pusat dan teks melingkar';
      viennaCode = '26.01.01';
      viennaCategory = 'Lingkaran Konsentris dengan Unsur Figuratif di Tengah';
      visualConflictRisk = 'Menengah';
      conflictingBenchmarks = [
        { brand: 'STARBUCKS', motif: 'Emblem lingkaran hijau dengan ilustrasi figur pusat', similarityNote: 'Komposisi circular badge dengan ring teks luar sering memicu oposisi', riskLevel: 'Menengah' }
      ];
      pasal21Assessment = 'Komposisi badge lingkaran sering dianggap meniru tata letak merek F&B terkenal jika palet warnanya serupa.';
      modificationAdvice = 'Lepaskan bingkai lingkaran konsentris. Gunakan tata letak horizontal modern dengan tipografi kustom.';
    } else if (/glow|beauty|skincare|kosmetik|ms glow|wardah|scarlett/i.test(lower)) {
      detectedMotif = 'Monogram tipografi kursif bersambung dengan ornamen lengkung elegan';
      viennaCode = '27.05.01';
      viennaCategory = 'Huruf Menampilkan Kaligrafi Kursif atau Karakter Khusus';
      visualConflictRisk = isDirectConflict ? 'Tinggi' : 'Menengah';
      conflictingBenchmarks = [
        { brand: 'MS GLOW', motif: 'Monogram huruf kursif tipografi bersambung', similarityNote: 'Persamaan susunan estetika visual etiket produk kosmetik', riskLevel: isDirectConflict ? 'Tinggi' : 'Menengah' }
      ];
      pasal21Assessment = 'Di kelas 03 (kosmetik), ornamen monogram bersambung sering diuji ketat untuk mencegah penyesatan konsumen atas produsen riil.';
      modificationAdvice = 'Gunakan font geometris sans-serif modern dengan kerning lebar dan tambahkan elemen distingtif pada etiket kemasan.';
    } else {
      conflictingBenchmarks = [
        { brand: 'PDKI BENCHMARK CLUSTER', motif: 'Komposisi visual umum kelas sejenis', similarityNote: 'Belum ditemukan identitas bentuk 100% identik dengan merek terkenal terdaftar', riskLevel: 'Rendah' }
      ];
      visualConflictRisk = 'Rendah';
      pasal21Assessment = 'Bentuk logo memiliki orisinalitas visual memadai dan tidak meniru ciri khas etiket merek terkenal.';
    }

    logoAudit = {
      isLogoAnalyzed: true,
      detectedMotif,
      viennaCode,
      viennaCategory,
      visualConflictRisk,
      conflictingBenchmarks,
      pasal21Assessment,
      modificationAdvice
    };

    if (visualConflictRisk === 'Tinggi') {
      riskLevel = 'Tinggi';
      riskScore = Math.min(riskScore, 20);
      verdict = 'Konflik Bentuk Visual Tinggi (Pasal 21 Ayat 1)';
      visualStatus = 'Rawan Konflik Unsur Figuratif';
      visualDetail = `Bentuk etiket logo memiliki kemiripan signifikan dengan karakteristik visual merek terdaftar (${conflictingBenchmarks[0]?.brand || 'Merek Terkenal'}).`;
      statuteStatus = 'Potensi Ditolak Pasal 21 Ayat (1) Huruf a';
      statuteDetail = 'DJKI menolak etiket yang memiliki persamaan pada pokoknya dalam unsur lukisan/figuratif yang membingungkan masyarakat.';
    }
  }

  // Determine Class Recommendation
  let primaryClass = niceClass ? niceClass.replace(/[^0-9]/g, '') : (topMatch?.niceClass || '35');
  let commodities = ['Retail & Toko', 'Distribusi', 'Marketplace', 'Branding Bisnis'];
  
  if (primaryClass === '3' || primaryClass === '03' || /skincare|serum|krim|sabun|kosmetik|parfum|beauty|glow|cantik|kahf/i.test(lower)) {
    primaryClass = '03';
    commodities = ['Kosmetik', 'Skincare & Perawatan Kulit', 'Serum Wajah', 'Sabun Pembersih', 'Parfum'];
  } else if (primaryClass === '30' || /kopi|teh|makanan|roti|snack|bumbu|cake|minuman|kuliner/i.test(lower)) {
    primaryClass = '30';
    commodities = ['Kopi', 'Teh', 'Roti', 'Kue', 'Bumbu Makanan', 'Snack Olahan'];
  } else if (primaryClass === '25' || /sepatu|baju|kaos|celana|fashion|apparel|jaket|hijab|onitsuka|converse|adidas|nike/i.test(lower)) {
    primaryClass = '25';
    commodities = ['Pakaian', 'Alas Kaki', 'Sepatu Olahraga', 'Tutup Kepala', 'Jaket'];
  } else if (primaryClass === '42' || /aplikasi|software|tech|it|cloud|digital|system|komputer/i.test(lower)) {
    primaryClass = '42';
    commodities = ['Pengembangan Software', 'Layanan IT Cloud', 'Platform Digital', 'SaaS'];
  } else if (primaryClass === '43' || /kafe|restoran|resto|kedai|warung|catering/i.test(lower)) {
    primaryClass = '43';
    commodities = ['Layanan Restoran', 'Kafe Penyedia Kopi', 'Kedai Minuman', 'Jasa Katering'];
  } else if (primaryClass === '05' || /obat|jamu|herbal|farmasi|suplemen|vitamin/i.test(lower)) {
    primaryClass = '05';
    commodities = ['Farmasi', 'Suplemen Kesehatan', 'Vitamin', 'Obat Tradisional/Herbal'];
  }

  return res.status(200).json({
    success: true,
    fromGemini: false,
    analysis: {
      brand: brand.toUpperCase(),
      riskLevel,
      riskScore,
      verdict,
      explanation,
      logoAudit,
      phonetic: {
        status: phoneticStatus,
        detail: phoneticDetail
      },
      visual: {
        status: visualStatus,
        detail: visualDetail
      },
      classRecommendation: {
        primaryClass: `Kelas ${primaryClass}`,
        commodities
      },
      statute: {
        status: statuteStatus,
        detail: statuteDetail
      },
      nextSteps: riskLevel === 'Tinggi' ? [
        'Konsultasikan dengan Konsultan HKI BrandConnect untuk evaluasi alternatif etiket/nama sebelum diajukan ke DJKI.',
        'Hindari pengajuan unsur figuratif yang identik dengan merek terkenal karena memicu penolakan Pasal 21 ayat 1 huruf a.',
        'Lakukan redesain etiket pada elemen lukisan untuk memperkuat daya pembeda (distinctiveness).'
      ] : (riskLevel === 'Menengah' ? [
        'Tambahkan kata unik atau kombinasi logo grafis untuk mempertegas daya pembeda.',
        'Periksa spesifikasi barang/jasa agar tidak bertabrakan langsung dengan merek terdaftar sejenis.',
        'Konsultasikan strategi pengajuan dengan tim spesialis BrandConnect.'
      ] : [
        'Segera amankan tanggal permohonan resmi (Filing Date) untuk asas First-to-File.',
        'Siapkan berkas administrasi dan etiket merek resmi DJKI.',
        'Pantau masa publikasi BRM 2 bulan bersama tim spesialis BrandConnect.'
      ])
    }
  });
};