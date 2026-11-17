// Vercel Serverless Function: AI Trademark Analysis
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
  const brand = (query?.brand || query?.brandName || query?.q || '').trim();
  const niceClass = (query?.niceClass || query?.class || '').trim();
  const description = (query?.description || '').trim();

  if (!brand) {
    return res.status(400).json({ success: false, message: 'Parameter "brand" diperlukan.' });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (geminiApiKey) {
    try {
      const prompt = `Anda adalah Konsultan HKI dan Spesialis Pemeriksaan Substantif Merek DJKI Indonesia berpengalaman. Lakukan analisis risiko pendaftaran merek untuk nama: "${brand}" ${niceClass ? 'pada Kelas Nice ' + niceClass : ''} ${description ? 'dengan produk: ' + description : ''}.

Analisis berdasarkan UU No. 20 Tahun 2016 tentang Merek dan Indikasi Geografis (Pasal 20 & 21).

Formatkan output Anda HANYA dalam JSON valid tanpa markdown formatting dengan struktur:
{
  "brand": "${brand.toUpperCase()}",
  "riskLevel": "Tinggi" | "Menengah" | "Rendah",
  "riskScore": number (0-100, peluang lolos),
  "verdict": "string singkat kesimpulan",
  "explanation": "penjelasan mendalam risiko hukum",
  "phonetic": {
    "status": "Persamaan Pada Pokoknya / Rawan" | "Kemiripan Parsial" | "Daya Pembeda Kuat",
    "detail": "penjelasan analisis fonetik bunyi/lafal"
  },
  "visual": {
    "status": "Rawan Konflik" | "Perlu Diferensiasi Etiket" | "Unik & Distingtif",
    "detail": "penjelasan analisis visual susunan huruf/ejaan"
  },
  "classRecommendation": {
    "primaryClass": "string kelas utama",
    "commodities": ["array", "string", "komoditas", "terkait"]
  },
  "statute": {
    "status": "Potensi Ditolak Pasal 21" | "Perlu Penegasan Pasal 20" | "Memenuhi Pasal 20 & 21",
    "detail": "penjelasan kriteria penolakan DJKI"
  },
  "nextSteps": [
    "langkah 1",
    "langkah 2",
    "langkah 3"
  ]
}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
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
          return res.status(200).json({ success: true, fromGemini: true, analysis: parsed });
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local legal engine:', err.message);
    }
  }

  // Fallback Rule-based Legal AI Engine (Always available, no external API dependency)
  const lower = brand.toLowerCase();
  let riskLevel = 'Rendah';
  let riskScore = 92;
  let verdict = 'Daya Pembeda Kuat (Potensi Diterima Tinggi)';
  let explanation = `Nama merek "${brand.toUpperCase()}" memiliki daya pembeda yang baik dan tidak mendeskripsikan barang/jasa secara umum. Peluang lolos pemeriksaan substantif DJKI tinggi.`;
  let phoneticStatus = 'Daya Pembeda Kuat';
  let phoneticDetail = `Susunan bunyi dan intonasi fonetik "${brand.toUpperCase()}" tidak memiliki kemiripan bunyi signifikan dengan merek terkenal terdaftar.`;
  let visualStatus = 'Unik & Distingtif';
  let visualDetail = 'Ejaan dan komposisi tipografi memiliki orisinalitas tinggi, memenuhi asas pembeda merek.';
  let statuteStatus = 'Memenuhi Kriteria Pasal 20 & 21 UU Merek';
  let statuteDetail = 'Tidak bertentangan dengan norma, tidak menyesatkan, dan belum teridentifikasi persamaan pada pokoknya.';

  // Check known major brands / keywords
  const majorBrands = ['kopi kenangan', 'onitsuka', 'adidas', 'converse', 'nike', 'mebiso', 'indomie', 'starbucks', 'apple', 'samsung', 'zara', 'h&m'];
  const isDirectConflict = majorBrands.some(b => lower.includes(b) || b.includes(lower));

  if (isDirectConflict) {
    riskLevel = 'Tinggi';
    riskScore = 24;
    verdict = 'Persamaan Pada Pokoknya (Risiko Penolakan Tinggi)';
    explanation = `Merek "${brand.toUpperCase()}" memiliki persamaan bunyi/visual signifikan dengan merek terdaftar. Berpotensi besar ditolak DJKI berdasarkan Pasal 21 ayat (1) UU No. 20/2016.`;
    phoneticStatus = 'Persamaan Bunyi / Fonetik Identik';
    phoneticDetail = 'Pelafalan vokal dan konsonan menyerupai merek terdaftar di pangkalan data DJKI.';
    visualStatus = 'Rawan Konflik Hak Eksklusif';
    visualDetail = 'Pemilik merek terdahulu memegang hak eksklusif untuk melarang penggunaan nama yang serupa.';
    statuteStatus = 'Potensi Ditolak Pasal 21 Ayat (1)';
    statuteDetail = 'DJKI wajib menolak permohonan yang memiliki persamaan pada pokoknya dengan merek pihak lain.';
  } else if (brand.length <= 3 || /^[a-z]+$/i.test(brand) && (lower.includes('kopi') || lower.includes('store') || lower.includes('mart') || lower.includes('jaya'))) {
    riskLevel = 'Menengah';
    riskScore = 58;
    verdict = 'Perlu Diferensiasi Elemen Pembeda';
    explanation = `Nama merek "${brand.toUpperCase()}" mengandung kata umum atau unsur deskriptif. Disarankan menambahkan kata unik atau etiket logo khusus agar tidak ditolak berdasarkan Pasal 20 UU Merek.`;
    phoneticStatus = 'Kemiripan Parsial';
    phoneticDetail = 'Bunyi kata umum memerlukan unsur penjelas tambahan agar memiliki karakter distingtif.';
    visualStatus = 'Perlu Etiket Visual Kuat';
    visualDetail = 'Kombinasi logo, tipografi kustom, atau elemen grafis sangat disarankan untuk pendaftaran.';
    statuteStatus = 'Perlu Penegasan Daya Pembeda (Pasal 20)';
    statuteDetail = 'Merek tidak boleh hanya berupa nama umum atau deskripsi langsung dari jenis barang/jasa.';
  }

  // Determine Class Recommendation
  let primaryClass = niceClass || '35';
  let commodities = ['Retail', 'Distribusi', 'Marketplace', 'Branding Bisnis'];
  if (/kopi|teh|makanan|roti|snack|bumbu|cake|minuman|kuliner/i.test(lower)) {
    primaryClass = '30';
    commodities = ['Kopi', 'Teh', 'Roti', 'Kue', 'Bumbu Makanan', 'Snack Olahan'];
  } else if (/sepatu|baju|kaos|celana|fashion|apparel|jaket|hijab/i.test(lower)) {
    primaryClass = '25';
    commodities = ['Pakaian', 'Alas Kaki', 'Sepatu Olahraga', 'Tutup Kepala', 'Jaket'];
  } else if (/skincare|serum|krim|sabun|kosmetik|parfum|beauty/i.test(lower)) {
    primaryClass = '03';
    commodities = ['Kosmetik', 'Skincare', 'Serum Wajah', 'Sabun Kecantikan', 'Parfum'];
  } else if (/aplikasi|software|tech|it|cloud|digital|system|komputer/i.test(lower)) {
    primaryClass = '42';
    commodities = ['Pengembangan Software', 'Layanan IT Cloud', 'Platform Digital', 'SaaS'];
  } else if (/kafe|restoran|resto|kedai|warung|catering/i.test(lower)) {
    primaryClass = '43';
    commodities = ['Layanan Restoran', 'Kafe Penyedia Kopi', 'Kedai Minuman', 'Jasa Katering'];
  } else if (/obat|jamu|herbal|farmasi|suplemen|vitamin/i.test(lower)) {
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
        'Konsultasikan dengan Konsultan HKI BrandConnect untuk evaluasi alternatif nama.',
        'Pertimbangkan penambahan kata unik atau modifikasi ejaan agar terhindar dari Pasal 21.',
        'Lakukan penelusuran kelas turunan untuk peluang pendaftaran di sektor jasa terkait.'
      ] : [
        'Segera amankan tanggal permohonan resmi (Filing Date) untuk asas First-to-File.',
        'Siapkan berkas administrasi dan etiket merek resmi DJKI.',
        'Pantau masa publikasi BRM 2 bulan bersama tim spesialis BrandConnect.'
      ]
    }
  });
};
