/**
 * BRANDCONNECT — MODULAR PLATFORM ENGINE & PERSISTENT DATA STORE
 * Powers:
 *  1. 6 Modular AI Capabilities (AI Assistant, Search, Similarity Analysis, Class Recommendation, Document Understanding, Report Generation)
 *  2. 8 Configurable Professional Trademark & IP Services + Ordering Engine
 *  3. Human Expert Handover Workflow (AI Conversation / Search -> Consultation Lead)
 *  4. Customer Dashboard (Profile, Business, Portfolio, Search History, Orders, Cases, Documents, Consultations, Notifications)
 *  5. Role-Based Admin Panel (6 Roles + 13 Admin Modules + Activity Audit Logs)
 */

(function () {
  const STORAGE_KEY = 'brandconnect_platform_v2';

  // Complete 45 Nice Classification Reference (Classes 1–34 Goods, Classes 35–45 Services)
  const NICE_CLASSES_DB = [
    { num: '01', type: 'BARANG', cat: 'industri', title: 'Bahan Kimia Industri, Pertanian & Pupuk', keywords: ['kimia', 'pupuk', 'kompos', 'perekat', 'industri', 'pertanian', 'bahan pengawet'] },
    { num: '02', type: 'BARANG', cat: 'industri', title: 'Cat, Pernis, Pewarna & Tinta Cetak', keywords: ['cat', 'pernis', 'tinta', 'pewarna', 'anti karat', 'pelapis'] },
    { num: '03', type: 'BARANG', cat: 'kosmetik', title: 'Kosmetik, Skincare, Sabun & Parfum', keywords: ['kosmetik', 'skincare', 'serum', 'sabun', 'shampo', 'parfum', 'lotion', 'lipstik', 'sunscreen', 'wajah', 'kecantikan', 'pasta gigi', 'deterjen'] },
    { num: '04', type: 'BARANG', cat: 'industri', title: 'Minyak Industri, Pelumas, Lilin & Bahan Bakar', keywords: ['pelumas', 'oli', 'lilin', 'aromaterapi lilin', 'bahan bakar', 'briket'] },
    { num: '05', type: 'BARANG', cat: 'kesehatan', title: 'Farmasi, Obat Herbal, Jamu & Suplemen', keywords: ['obat', 'farmasi', 'herbal', 'jamu', 'vitamin', 'suplemen', 'madu herbal', 'salep', 'medis', 'kesehatan', 'makanan bayi', 'disinfektan'] },
    { num: '06', type: 'BARANG', cat: 'industri', title: 'Logam Umum, Bahan Bangunan Logam & Brankas', keywords: ['logam', 'besi', 'baja', 'aluminium', 'kunci logam', 'pipa logam'] },
    { num: '07', type: 'BARANG', cat: 'industri', title: 'Mesin Industri, Alat Pertanian & Motor Penggerak', keywords: ['mesin', 'pompa', 'generator', 'blender', 'mesin cuci', 'alat berat'] },
    { num: '08', type: 'BARANG', cat: 'rumah', title: 'Perkakas Tangan, Pisau, Sendok & Alat Cukur', keywords: ['pisau', 'gunting', 'sendok', 'garpu', 'alat cukur', 'perkakas'] },
    { num: '09', type: 'BARANG', cat: 'teknologi', title: 'Aplikasi Mobile, Software, Komputer & Elektronik', keywords: ['aplikasi', 'software', 'perangkat lunak', 'komputer', 'gadget', 'elektronik', 'kacamata', 'helm', 'baterai', 'kabel', 'pos', 'game'] },
    { num: '10', type: 'BARANG', cat: 'kesehatan', title: 'Alat Kesehatan, Medis, Bedah & Masker Medis', keywords: ['alat kesehatan', 'alkes', 'stetoskop', 'kursi roda', 'masker medis', 'botol susu bayi'] },
    { num: '11', type: 'BARANG', cat: 'rumah', title: 'Lampu, Pendingin (AC), Pemanas & Pemurni Air', keywords: ['lampu', 'ac', 'kulkas', 'kompor', 'oven', 'filter air', 'dispenser'] },
    { num: '12', type: 'BARANG', cat: 'industri', title: 'Kendaraan, Otomotif, Sepeda & Suku Cadang', keywords: ['mobil', 'motor', 'sepeda', 'ban', 'velg', 'otomotif', 'kendaraan'] },
    { num: '13', type: 'BARANG', cat: 'industri', title: 'Senjata Api, Amunisi & Kembang Api', keywords: ['kembang api', 'petasan', 'amunisi'] },
    { num: '14', type: 'BARANG', cat: 'fashion', title: 'Perhiasan, Logam Mulia, Emas & Jam Tangan', keywords: ['perhiasan', 'emas', 'perak', 'berlian', 'cincin', 'kalung', 'jam tangan', 'arloji'] },
    { num: '15', type: 'BARANG', cat: 'hiburan', title: 'Alat Musik (Gitar, Piano, Drum & Aksesoris)', keywords: ['alat musik', 'gitar', 'piano', 'drum', 'biola'] },
    { num: '16', type: 'BARANG', cat: 'rumah', title: 'Alat Tulis, Kertas, Buku, Percetakan & Kemasan Kertas', keywords: ['buku', 'kertas', 'alat tulis', 'pulpen', 'kardus', 'kemasan kertas', 'stiker', 'majalah'] },
    { num: '17', type: 'BARANG', cat: 'industri', title: 'Karet, Plastik Setengah Jadi & Bahan Isolasi', keywords: ['karet', 'selang', 'plastik industri', 'isolasi'] },
    { num: '18', type: 'BARANG', cat: 'fashion', title: 'Tas, Dompet, Koper, Barang Kulit & Payung', keywords: ['tas', 'dompet', 'ransel', 'koper', 'kulit', 'tote bag', 'payung'] },
    { num: '19', type: 'BARANG', cat: 'industri', title: 'Bahan Bangunan Non-Logam, Keramik, Semen & Kayu', keywords: ['semen', 'keramik', 'marmer', 'kayu bangunan', 'bata', 'aspal'] },
    { num: '20', type: 'BARANG', cat: 'rumah', title: 'Furnitur, Mebel, Kasur, Bantal & Dekorasi Kayu', keywords: ['furnitur', 'mebel', 'kursi', 'meja', 'lemari', 'kasur', 'bantal', 'springbed'] },
    { num: '21', type: 'BARANG', cat: 'rumah', title: 'Peralatan Dapur, Tumbler, Gelas, Piring & Alat Kebersihan', keywords: ['tumbler', 'botol minum', 'piring', 'gelas', 'cangkir', 'panci', 'wajan', 'sapu', 'sikat'] },
    { num: '22', type: 'BARANG', cat: 'industri', title: 'Tali, Jaring, Tenda, Terpal & Karung', keywords: ['tenda', 'terpal', 'tali', 'jaring', 'karung'] },
    { num: '23', type: 'BARANG', cat: 'fashion', title: 'Benang & Serat untuk Tekstil/Tenun', keywords: ['benang', 'benang jahit', 'benang rajut'] },
    { num: '24', type: 'BARANG', cat: 'fashion', title: 'Kain Tekstil, Batik Kain, Sprei, Handuk & Gorden', keywords: ['kain', 'tekstil', 'sprei', 'bedcover', 'handuk', 'gorden', 'selimut'] },
    { num: '25', type: 'BARANG', cat: 'fashion', title: 'Pakaian, Kaos, Kemeja, Hijab, Sepatu & Topi', keywords: ['pakaian', 'baju', 'kaos', 'kemeja', 'celana', 'jaket', 'hoodie', 'gamis', 'hijab', 'kerudung', 'sepatu', 'sandal', 'sneakers', 'topi', 'fashion', 'distro', 'batik'] },
    { num: '26', type: 'BARANG', cat: 'fashion', title: 'Renda, Bordir, Pita, Kancing & Bunga Buatan', keywords: ['kancing', 'resleting', 'pita', 'bordir', 'wig'] },
    { num: '27', type: 'BARANG', cat: 'rumah', title: 'Karpet, Sajadah, Tikar, Matras Yoga & Wallpaper', keywords: ['karpet', 'sajadah', 'tikar', 'matras', 'wallpaper'] },
    { num: '28', type: 'BARANG', cat: 'hiburan', title: 'Mainan, Boneka, Alat Olahraga & Alat Pancing', keywords: ['mainan', 'boneka', 'puzzle', 'alat olahraga', 'raket', 'bola', 'gym', 'pancing'] },
    { num: '29', type: 'BARANG', cat: 'makanan', title: 'Olahan Daging, Ikan, Frozen Food, Susu & Minyak Makan', keywords: ['frozen food', 'nugget', 'sosis', 'bakso', 'dimsum', 'daging', 'ikan', 'susu', 'keju', 'yoghurt', 'minyak goreng', 'keripik kentang', 'keripik buah', 'selai', 'telur'] },
    { num: '30', type: 'BARANG', cat: 'makanan', title: 'Kopi, Teh, Coklat, Roti, Kue, Snack, Beras & Bumbu', keywords: ['kopi', 'teh', 'coklat', 'kakao', 'roti', 'bakery', 'kue', 'biskuit', 'cookies', 'pastry', 'mie', 'pasta', 'beras', 'tepung', 'gula', 'madu', 'es krim', 'sambal', 'saus', 'kecap', 'bumbu', 'rempah', 'kerupuk', 'camilan', 'snack'] },
    { num: '31', type: 'BARANG', cat: 'makanan', title: 'Hasil Pertanian Segar, Buah, Sayur, Benih & Pakan Hewan', keywords: ['buah segar', 'sayur segar', 'bibit', 'tanaman', 'pakan kucing', 'pakan anjing', 'pet food', 'pakan ternak'] },
    { num: '32', type: 'BARANG', cat: 'makanan', title: 'Air Mineral, Jus Buah, Sirup & Minuman Non-Alkohol', keywords: ['air mineral', 'amdk', 'jus', 'minuman', 'sirup', 'soda', 'isotonik', 'minuman serbuk'] },
    { num: '33', type: 'BARANG', cat: 'makanan', title: 'Minuman Beralkohol (Kecuali Bir)', keywords: ['wine', 'anggur alkohol', 'minuman beralkohol'] },
    { num: '34', type: 'BARANG', cat: 'makanan', title: 'Tembakau, Rokok, Cerutu, Vape & Liquid Rokok Elektrik', keywords: ['rokok', 'tembakau', 'cerutu', 'vape', 'liquid vape', 'korek api'] },
    { num: '35', type: 'JASA', cat: 'jasa', title: 'Toko Retail, Toko Online, Marketplace, Periklanan & Bisnis', keywords: ['toko', 'retail', 'eceran', 'grosir', 'toko online', 'marketplace', 'e-commerce', 'periklanan', 'advertising', 'digital agency', 'marketing', 'konsultan bisnis', 'franchise', 'waralaba', 'minimarket', 'distro'] },
    { num: '36', type: 'JASA', cat: 'jasa', title: 'Keuangan, Perbankan, Asuransi, Investasi & Properti/Real Estate', keywords: ['keuangan', 'fintech', 'asuransi', 'properti', 'real estate', 'broker', 'investasi', 'sewa gedung'] },
    { num: '37', type: 'JASA', cat: 'jasa', title: 'Konstruksi Bangunan, Renovasi, Bengkel & Laundry', keywords: ['konstruksi', 'kontraktor', 'renovasi', 'bengkel', 'cuci mobil', 'laundry', 'servis ac'] },
    { num: '38', type: 'JASA', cat: 'teknologi', title: 'Telekomunikasi, Internet Provider (ISP) & Penyiaran', keywords: ['telekomunikasi', 'internet', 'isp', 'penyiaran', 'streaming'] },
    { num: '39', type: 'JASA', cat: 'jasa', title: 'Ekspedisi, Logistik, Kurir, Travel, Tour & Sewa Kendaraan', keywords: ['ekspedisi', 'logistik', 'kargo', 'kurir', 'pengiriman', 'travel', 'tour', 'umroh', 'rental mobil', 'pergudangan'] },
    { num: '40', type: 'JASA', cat: 'industri', title: 'Pengolahan Bahan, Konveksi Jahit, Sablon & Percetakan Custom', keywords: ['konveksi', 'maklon', 'sablon', 'roasting kopi jasa', 'daur ulang', 'pengolahan'] },
    { num: '41', type: 'JASA', cat: 'hiburan', title: 'Pendidikan, Kursus, Pelatihan, Seminar, Event Organizer & Hiburan', keywords: ['pendidikan', 'sekolah', 'kursus', 'bimbel', 'pelatihan', 'training', 'workshop', 'event organizer', 'eo', 'hiburan', 'studio foto', 'musik', 'olahraga', 'penerbitan'] },
    { num: '42', type: 'JASA', cat: 'teknologi', title: 'Layanan IT, Pembuatan Software/Web, Cloud SaaS & Desain', keywords: ['it', 'software house', 'web development', 'saas', 'cloud', 'ai', 'desain grafis', 'desain interior', 'arsitektur', 'uji laboratorium'] },
    { num: '43', type: 'JASA', cat: 'jasa', title: 'Restoran, Kafe, Coffee Shop, Katering, Hotel & Villa', keywords: ['restoran', 'rumah makan', 'kafe', 'cafe', 'coffee shop', 'kedai kopi', 'warkop', 'katering', 'catering', 'bakery cafe', 'cloud kitchen', 'hotel', 'villa', 'penginapan', 'bar'] },
    { num: '44', type: 'JASA', cat: 'kesehatan', title: 'Klinik Kesehatan, Rumah Sakit, Salon Kecantikan, Spa & Barbershop', keywords: ['klinik', 'rumah sakit', 'dokter', 'apotek', 'salon', 'barbershop', 'spa', 'klinik kecantikan', 'fisioterapi', 'pet shop grooming'] },
    { num: '45', type: 'JASA', cat: 'jasa', title: 'Layanan Hukum, Konsultan HAKI, Perizinan & Keamanan', keywords: ['hukum', 'konsultan haki', 'konsultan merek', 'pengacara', 'notaris', 'keamanan', 'security'] }
  ];

  const DEFAULT_STATE = {
    settings: {
      platformName: 'BRANDCONNECT',
      tagline: 'Search Smart. Protect Better.',
      positioning: 'AI-Powered Trademark & Brand Protection Platform',
      whatsappNumber: '6281234567890',
      supportEmail: 'hello@brandconnect.id',
      aiDisclaimer: 'Informasi dan analisis AI bersifat edukatif serta merupakan evaluasi pra-skrining awal berdasarkan ketentuan UU No. 20 Tahun 2016 tentang Merek dan Indikasi Geografis. Hasil ini bukan merupakan keputusan resmi DJKI. Penilaian hukum final dan verifikasi menyeluruh dilakukan oleh Konsultan Merek & Tim Legal BrandConnect.',
      currentAdminRole: 'Super Admin',
      ragEnabled: true
    },

    customerProfile: {
      id: 101,
      name: 'Nadia Kusuma',
      email: 'nadia@zenovabotanica.id',
      phone: '0812-8899-2026',
      role: 'customer',
      joinedAt: '2026-10-12'
    },

    businessProfile: {
      companyName: 'PT Zenova Botanica Indonesia',
      applicantType: 'umkm',
      industrySector: 'Kosmetik, Skincare & Wellness',
      npwpNumber: '92.418.772.1-012.000',
      nibNumber: '1209260048192',
      address: 'Jl. Senopati No. 48, Kebayoran Baru, Jakarta Selatan 12190'
    },

    teamMembers: [
      { id: 1, name: 'Hendra Wijaya', role: 'Super Admin', title: 'Managing Director' },
      { id: 2, name: 'Rina Kartika', role: 'Admin', title: 'Platform Operations Manager' },
      { id: 3, name: 'Dinda Permata', role: 'Customer Relations', title: 'Client Relations Specialist' },
      { id: 4, name: 'Arif Budiman, S.H.', role: 'Trademark Specialist', title: 'Senior Trademark Specialist' },
      { id: 5, name: 'Dr. Pratama Hukum, S.H., M.H.', role: 'Legal Counsel', title: 'Lead IP Legal Counsel' },
      { id: 6, name: 'Santi Rahayu', role: 'Document Officer', title: 'DJKI Formality & Document Officer' }
    ],

    services: [
      {
        id: 1,
        code: 'SRV-REG-01',
        slug: 'trademark-registration',
        name: 'Trademark Registration',
        nameId: 'Pendaftaran Merek Baru (DJKI)',
        category: 'Registration',
        basePrice: 3200000,
        umkmPrice: 1850000,
        duration: 'Pengajuan 1–3 Hari Kerja (Proses DJKI ±6–12 Bulan)',
        description: 'Layanan lengkap penelusuran kemiripan merek, pemetaan kelas Nice (1–45), verifikasi etiket merek, pengajuan resmi ke DJKI untuk mengamankan Tanggal Penerimaan (Filing Date), hingga pemantauan sertifikat terbit.',
        deliverables: ['Laporan Analisis Kemiripan Merek', 'Rekomendasi Kelas Merek Presisi', 'Bukti Permohonan Resmi DJKI (Filing Date)', 'Pemantauan Masa Publikasi BRM & Substantif'],
        active: true
      },
      {
        id: 2,
        code: 'SRV-REN-02',
        slug: 'trademark-renewal',
        name: 'Trademark Renewal',
        nameId: 'Perpanjangan Sertifikat Merek (10 Tahun)',
        category: 'Registration',
        basePrice: 3800000,
        umkmPrice: 2400000,
        duration: '3–7 Hari Kerja',
        description: 'Perpanjangan masa perlindungan hukum merek terdaftar untuk 10 tahun berikutnya (dapat diajukan dalam jangka waktu 6 bulan sebelum berakhir atau pada masa tenggang 6 bulan setelah berakhir).',
        deliverables: ['Audit Status Sertifikat Merek', 'Surat Pernyataan Penggunaan Merek', 'Bukti Perpanjangan Resmi DJKI (10 Tahun)'],
        active: true
      },
      {
        id: 3,
        code: 'SRV-ASN-03',
        slug: 'trademark-assignment',
        name: 'Trademark Assignment',
        nameId: 'Pengalihan Hak Atas Merek',
        category: 'Licensing & Rights',
        basePrice: 2900000,
        umkmPrice: 2900000,
        duration: '5–10 Hari Kerja',
        description: 'Pencatatan resmi pengalihan kepemilikan merek terdaftar (karena jual-beli brand, hibah, pewarisan, merger, atau pengalihan dari pribadi ke PT) agar sah secara hukum dan tercatat di Berita Resmi Merek.',
        deliverables: ['Draft Akta/Perjanjian Pengalihan Hak', 'Permohonan Pencatatan Pengalihan DJKI', 'Sertifikat/Catatan Pengalihan Resmi'],
        active: true
      },
      {
        id: 4,
        code: 'SRV-LIC-04',
        slug: 'trademark-licensing',
        name: 'Trademark Licensing',
        nameId: 'Perjanjian & Pencatatan Lisensi Merek',
        category: 'Licensing & Rights',
        basePrice: 3500000,
        umkmPrice: 3500000,
        duration: '5–10 Hari Kerja',
        description: 'Penyusunan kontrak lisensi penggunaan merek (untuk kemitraan, waralaba/franchise, distribusi eksklusif, atau royalti) beserta pencatatan resminya di DJKI agar mengikat pihak ketiga.',
        deliverables: ['Perjanjian Lisensi Merek Komprehensif', 'Bukti Pencatatan Lisensi Resmi DJKI', 'Klausul Perlindungan Mutu & Royalti'],
        active: true
      },
      {
        id: 5,
        code: 'SRV-OPP-05',
        slug: 'trademark-opposition',
        name: 'Trademark Opposition',
        nameId: 'Pengajuan Oposisi (Keberatan) Merek',
        category: 'Protection & Defense',
        basePrice: 4500000,
        umkmPrice: 4500000,
        duration: 'Dalam Masa Pengumuman BRM (2 Bulan)',
        description: 'Penyusunan dan pengajuan surat keberatan hukum (oposisi) resmi ke DJKI terhadap permohonan merek pihak ketiga yang meniru atau mendompleng merek Anda selama masa publikasi Berita Resmi Merek.',
        deliverables: ['Analisis Perbandingan Fonetik, Visual & Konseptual', 'Dokumen Uraian Keberatan Hukum (Pasal 21 UU Merek)', 'Tanda Terima Pengajuan Oposisi Resmi DJKI'],
        active: true
      },
      {
        id: 6,
        code: 'SRV-REF-06',
        slug: 'response-to-refusal',
        name: 'Response to Trademark Refusal',
        nameId: 'Tanggapan Usulan Penolakan Merek (Sanggahan)',
        category: 'Protection & Defense',
        basePrice: 3200000,
        umkmPrice: 2500000,
        duration: 'Maks. 30 Hari Kerja sejak Surat DJKI',
        description: 'Pendampingan hukum oleh Tim Legal & Spesialis Merek untuk menyusun surat sanggahan/tanggapan resmi apabila permohonan merek Anda menerima Surat Pemberitahuan Usulan Penolakan dari Pemeriksa DJKI.',
        deliverables: ['Bedah Alasan Penolakan Pemeriksa DJKI', 'Penyusunan Argumentasi Daya Pembeda & Bukti', 'Pengajuan Resmi Sanggahan ke DJKI'],
        active: true
      },
      {
        id: 7,
        code: 'SRV-COP-07',
        slug: 'copyright-registration',
        name: 'Copyright Registration',
        nameId: 'Pencatatan Hak Cipta Logo & Karya',
        category: 'IP & Copyright',
        basePrice: 1750000,
        umkmPrice: 1250000,
        duration: '1–3 Hari Kerja',
        description: 'Pencatatan resmi Hak Cipta (Surat Pencatatan Ciptaan) untuk melindungi karya seni logo, ilustrasi maskot, desain grafis kemasan, fotografi produk, maupun konten digital bisnis Anda.',
        deliverables: ['Verifikasi Orisinalitas & Deskripsi Ciptaan', 'Surat Pernyataan Kepemilikan Hak Cipta', 'Surat Pencatatan Ciptaan Resmi (e-HakCipta DJKI)'],
        active: true
      },
      {
        id: 8,
        code: 'SRV-CON-08',
        slug: 'legal-consultation',
        name: 'Legal Consultation and Assistance',
        nameId: 'Konsultasi & Pendampingan Hukum Merek',
        category: 'Advisory',
        basePrice: 750000,
        umkmPrice: 450000,
        duration: 'Sesi 60 Menit + Ringkasan Tertulis',
        description: 'Konsultasi strategis 1-on-1 bersama Trademark Specialist & Legal Counsel BrandConnect untuk audit portofolio merek, strategi multi-kelas, somasi pelanggaran merek, atau sengketa HAKI.',
        deliverables: ['Sesi Konsultasi Eksklusif 60 Menit', 'Written Legal Opinion / Rencana Strategi Merek', 'Rekomendasi Tindakan Hukum Terukur'],
        active: true
      }
    ],

    trademarkPortfolio: [
      {
        id: 1,
        trademarkName: 'ZENOVA BOTANICA',
        niceClasses: 'Kelas 03 (Kosmetik & Skincare)',
        applicationNo: 'DID2026041892',
        filingDate: '2026-10-18',
        status: 'Substantive Examination (Pemeriksaan Substantif)',
        protectionExpiry: '2036-10-18',
        monitored: true
      },
      {
        id: 2,
        trademarkName: 'ZENOVA DERMA LABS',
        niceClasses: 'Kelas 44 (Klinik Kecantikan & Spa)',
        applicationNo: 'JID2026052901',
        filingDate: '2026-11-02',
        status: 'BRM Publication (Masa Pengumuman 2 Bulan)',
        protectionExpiry: '2036-11-02',
        monitored: true
      }
    ],

    searchLogs: [
      {
        id: 501,
        referenceCode: 'BC-SRCH-20261115-01',
        timestamp: '2026-11-15 14:20 WIB',
        trademarkName: 'ZENOVA LIVING',
        searchMode: 'name',
        productCategory: 'Toko Retail & E-Commerce',
        recommendedClasses: 'Kelas 35',
        distinctivenessIndex: 89,
        riskLevel: 'low',
        verdict: 'DAYA PEMBEDA KUAT (POTENSI POSITIF)',
        phoneticStatus: 'Distingtif // Unik',
        visualStatus: 'Susunan Huruf Khas (Coined Word)',
        statuteStatus: 'Memenuhi Kriteria Pasal 20 UU Merek',
        aiInterpretation: 'Kata "ZENOVA" merupakan kata ciptaan (coined/fanciful mark) yang tidak memiliki arti deskriptif langsung terhadap jasa toko ritel (Kelas 35), sehingga memiliki daya pembeda tinggi menurut Pasal 20 UU No. 20 Tahun 2016.',
        professionalAssessment: 'Direkomendasikan untuk dilanjutkan ke tahap pengecekan silang database PDKI DJKI pada Kelas 35 dan Kelas 20 oleh Spesialis Merek.'
      }
    ],

    serviceOrders: [
      {
        id: 301,
        orderNumber: 'ORD-BC-2026-001',
        customerName: 'Nadia Kusuma',
        customerEmail: 'nadia@zenovabotanica.id',
        serviceCode: 'SRV-REG-01',
        serviceName: 'Trademark Registration (Pendaftaran Merek Baru)',
        trademarkName: 'ZENOVA BOTANICA',
        niceClasses: 'Kelas 03',
        applicantType: 'umkm',
        amount: 1850000,
        paymentStatus: 'paid',
        orderStatus: 'in_progress',
        createdAt: '2026-10-16'
      },
      {
        id: 302,
        orderNumber: 'ORD-BC-2026-002',
        customerName: 'Nadia Kusuma',
        customerEmail: 'nadia@zenovabotanica.id',
        serviceCode: 'SRV-REG-01',
        serviceName: 'Trademark Registration (Pendaftaran Merek Baru)',
        trademarkName: 'ZENOVA DERMA LABS',
        niceClasses: 'Kelas 44',
        applicantType: 'umkm',
        amount: 1850000,
        paymentStatus: 'paid',
        orderStatus: 'in_progress',
        createdAt: '2026-11-01'
      }
    ],

    trademarkCases: [
      {
        id: 401,
        caseNumber: 'CASE-BC-2026-01',
        orderNumber: 'ORD-BC-2026-001',
        customerName: 'Nadia Kusuma',
        trademarkName: 'ZENOVA BOTANICA',
        niceClasses: 'Kelas 03',
        djkiApplicationNo: 'DID2026041892',
        filingDate: '2026-10-18',
        stage: 'Substantive Examination',
        stageIndex: 5,
        specialist: 'Arif Budiman, S.H.',
        legalCounsel: 'Dr. Pratama Hukum, S.H., M.H.',
        docOfficer: 'Santi Rahayu',
        legalAssessment: 'Masa publikasi BRM 2 bulan telah dilewati tanpa adanya oposisi pihak ketiga. Saat ini berada pada tahap Pemeriksaan Substantif DJKI.',
        updatedAt: '2026-11-12'
      },
      {
        id: 402,
        caseNumber: 'CASE-BC-2026-02',
        orderNumber: 'ORD-BC-2026-002',
        customerName: 'Nadia Kusuma',
        trademarkName: 'ZENOVA DERMA LABS',
        niceClasses: 'Kelas 44',
        djkiApplicationNo: 'JID2026052901',
        filingDate: '2026-11-02',
        stage: 'BRM Publication (2 Months)',
        stageIndex: 4,
        specialist: 'Arif Budiman, S.H.',
        legalCounsel: 'Dr. Pratama Hukum, S.H., M.H.',
        docOfficer: 'Santi Rahayu',
        legalAssessment: 'Permohonan telah lulus pemeriksaan formalitas dan sedang diumumkan dalam Berita Resmi Merek (BRM) Seri-A.',
        updatedAt: '2026-11-14'
      }
    ],

    consultationLeads: [
      {
        id: 201,
        leadNumber: 'LEAD-BC-2026-01',
        customerName: 'Budi Santoso',
        customerEmail: 'budi@kopiarkana.id',
        customerPhone: '0811-2345-6789',
        trademarkName: 'ARKANA ROASTERY',
        productCategory: 'Biji Kopi Kemasan & Kedai Kopi',
        requestedService: 'Trademark Registration (Multi-Kelas 30 & 43)',
        searchResultsSummary: 'Indeks Daya Pembeda: 87% (Kuat). Rekomendasi Kelas 30 & Kelas 43.',
        aiAssessment: 'Kata "ARKANA" memiliki daya pembeda tinggi terhadap produk kopi, namun kata "ROASTERY" bersifat deskriptif umum pada industri kopi.',
        conversationSummary: 'Klien menanyakan apakah perlu mendaftarkan Kelas 30 dan Kelas 43 sekaligus untuk bisnis kedai kopi yang juga menjual biji kopi kemasan.',
        uploadedDocuments: ['etiket-arkana-roastery.png'],
        status: 'assigned',
        assignedTo: 'Arif Budiman, S.H.',
        specialistNotes: 'Telah dihubungi oleh Customer Relations. Dijadwalkan verifikasi PDKI untuk Kelas 30 & 43.',
        createdAt: '2026-11-15 16:40 WIB'
      }
    ],

    documents: [
      {
        id: 601,
        caseNumber: 'CASE-BC-2026-01',
        docType: 'Etiket Merek (Logo)',
        fileName: 'etiket-zenova-botanica-1024x1024.png',
        fileSize: '184 KB',
        dimensions: '1024×1024 px',
        status: 'Verified',
        officerNotes: 'Memenuhi standar resolusi dan kontras DJKI.',
        uploadedAt: '2026-10-16'
      },
      {
        id: 602,
        caseNumber: 'CASE-BC-2026-01',
        docType: 'Surat Rekomendasi UMKM',
        fileName: 'surat-rekomendasi-umkm-zenova.pdf',
        fileSize: '420 KB',
        dimensions: 'PDF Document',
        status: 'Verified',
        officerNotes: 'Surat UMKM valid dan aktif.',
        uploadedAt: '2026-10-16'
      },
      {
        id: 603,
        caseNumber: 'CASE-BC-2026-01',
        docType: 'Bukti Permohonan DJKI',
        fileName: 'bukti-permohonan-DID2026041892.pdf',
        fileSize: '310 KB',
        dimensions: 'Official DJKI Receipt',
        status: 'Verified',
        officerNotes: 'Tanggal Penerimaan resmi tercatat.',
        uploadedAt: '2026-10-18'
      }
    ],

    monitors: [
      {
        id: 701,
        trademarkName: 'ZENOVA BOTANICA',
        niceClasses: 'Kelas 03',
        watchTokens: 'ZENOVA, ZENNOVA, XENOVA',
        status: 'Active',
        lastBrmChecked: 'BRM Seri-A No. 48/XI/2026',
        alertStatus: 'Aman (0 Kemiripan Baru)',
        createdAt: '2026-10-18'
      },
      {
        id: 702,
        trademarkName: 'ZENOVA DERMA LABS',
        niceClasses: 'Kelas 44',
        watchTokens: 'ZENOVA DERMA, ZENOVA CLINIC',
        status: 'Active',
        lastBrmChecked: 'BRM Seri-A No. 48/XI/2026',
        alertStatus: 'Perhatian: 1 Kemiripan Fonetik Parsial Terdeteksi ("ZENO DERMA" - Kelas 44)',
        createdAt: '2026-11-02'
      }
    ],

    aiKnowledgeBase: [
      {
        id: 1,
        code: 'KB-UU20-PASAL20',
        category: 'UU Merek No. 20/2016',
        title: 'Pasal 20 — Alasan Absolut Merek Tidak Dapat Didaftarkan',
        reference: 'Pasal 20 UU No. 20 Tahun 2016',
        content: 'Merek tidak dapat didaftarkan jika: (a) bertentangan dengan ideologi negara, peraturan perundang-undangan, moralitas, agama, kesusilaan, atau ketertiban umum; (b) sama dengan, berkaitan dengan, atau hanya menyebut barang dan/atau jasa yang dimohonkan pendaftarannya (deskriptif); (c) memuat unsur yang dapat menyesatkan masyarakat tentang asal, kualitas, jenis, ukuran, macam, tujuan penggunaan; (d) tidak memiliki daya pembeda; dan/atau (e) merupakan nama umum dan/atau lambang milik umum.'
      },
      {
        id: 2,
        code: 'KB-UU20-PASAL21',
        category: 'UU Merek No. 20/2016',
        title: 'Pasal 21 — Penolakan karena Persamaan pada Pokoknya atau Keseluruhannya',
        reference: 'Pasal 21 Ayat (1)–(3) UU No. 20 Tahun 2016',
        content: 'Permohonan ditolak jika Merek tersebut mempunyai persamaan pada pokoknya atau keseluruhannya dengan: (a) Merek terdaftar milik pihak lain atau dimohonkan lebih dahulu oleh pihak lain untuk barang dan/atau jasa sejenis; (b) Merek terkenal milik pihak lain untuk barang dan/atau jasa sejenis maupun tidak sejenis; (c) Indikasi Geografis terdaftar; atau diajukan oleh Pemohon yang beriktikad tidak baik.'
      },
      {
        id: 3,
        code: 'KB-DJKI-FIRSTTOFILE',
        category: 'Prosedur DJKI',
        title: 'Prinsip First-to-File & Pentingnya Tanggal Penerimaan (Filing Date)',
        reference: 'Pasal 3 & Pasal 13 UU No. 20 Tahun 2016',
        content: 'Hak atas Merek diperoleh setelah Merek tersebut terdaftar. Indonesia menganut sistem konstitutif (First-to-File), di mana pihak yang pertama kali mengajukan permohonan resmi ke DJKI dan mendapatkan Tanggal Penerimaan (Filing Date) memperoleh prioritas perlindungan hukum.'
      },
      {
        id: 4,
        code: 'KB-DJKI-BRMOPOSISI',
        category: 'Proteksi & Monitoring',
        title: 'Masa Pengumuman Berita Resmi Merek (2 Bulan) & Hak Oposisi',
        reference: 'Pasal 14 & Pasal 16 UU No. 20 Tahun 2016',
        content: 'DJKI mengumumkan permohonan merek dalam Berita Resmi Merek (BRM) selama 2 (dua) bulan. Dalam jangka waktu pengumuman tersebut, setiap pihak yang berkepentingan dapat mengajukan keberatan (oposisi) secara tertulis kepada Menteri disertai alasan dan bukti bahwa merek yang dimohonkan tersebut tidak dapat didaftarkan atau harus ditolak.'
      },
      {
        id: 5,
        code: 'KB-DJKI-SANGGAHAN',
        category: 'Proteksi & Monitoring',
        title: 'Tanggapan Atas Usulan Penolakan Substantif (30 Hari Kerja)',
        reference: 'Pasal 24 UU No. 20 Tahun 2016',
        content: 'Apabila Pemeriksa memutuskan permohonan tidak dapat didaftarkan atau ditolak, pemohon atau kuasanya diberikan waktu paling lama 30 (tiga puluh) hari terhitung sejak tanggal pengiriman surat pemberitahuan untuk menyampaikan tanggapan/sanggahan tertulis.'
      }
    ],

    aiConversations: [
      {
        id: 801,
        sessionCode: 'AI-CONV-2026-01',
        customerName: 'Nadia Kusuma',
        trademarkContext: 'ZENOVA LIVING',
        messages: [
          { sender: 'user', text: 'Halo, saya ingin tahu apakah merek ZENOVA LIVING untuk toko parfum & home fragrance perlu daftar di Kelas 3 atau Kelas 35?', time: '14:15' },
          { sender: 'ai', text: 'Berdasarkan klasifikasi Nice (Kelas 1–45): jika Anda memproduksi produk parfum dan pengharum ruangan dengan merek ZENOVA LIVING, maka produk barangnya wajib didaftarkan di **Kelas 03**. Namun jika Anda juga membuka toko ritel/online store bernama ZENOVA LIVING yang menjual berbagai produk, layanan tokonya dilindungi di **Kelas 35**. Untuk perlindungan menyeluruh, pendaftaran di Kelas 03 dan Kelas 35 sangat disarankan.', time: '14:15' }
        ],
        summary: 'Klien menanyakan perbedaan perlindungan Kelas 03 (Produk Parfum) dan Kelas 35 (Jasa Toko Ritel) untuk merek ZENOVA LIVING.',
        status: 'active_ai',
        updatedAt: '2026-11-15 14:16 WIB'
      }
    ],

    notifications: [
      {
        id: 901,
        title: 'Peringatan Monitoring BRM: Kemiripan Parsial Terdeteksi',
        message: 'Radar Monitoring mendeteksi permohonan baru "ZENO DERMA" di Kelas 44 pada BRM Seri-A No. 48/XI/2026. Masa pengumuman oposisi tersisa 42 hari.',
        type: 'warning',
        read: false,
        date: '2026-11-15'
      },
      {
        id: 902,
        title: 'Update Kasus: ZENOVA BOTANICA (DID2026041892)',
        message: 'Permohonan merek Anda telah melewati masa pengumuman 2 bulan tanpa oposisi dan kini memasuki tahap Pemeriksaan Substantif.',
        type: 'success',
        read: false,
        date: '2026-11-12'
      }
    ],

    activityLogs: [
      { id: 1001, actor: 'Arif Budiman, S.H.', role: 'Trademark Specialist', action: 'CASE_STAGE_UPDATE', ref: 'CASE-BC-2026-01', desc: 'Memperbarui status kasus ZENOVA BOTANICA ke tahap Substantive Examination.', time: '2026-11-12 10:15 WIB' },
      { id: 1002, actor: 'Santi Rahayu', role: 'Document Officer', action: 'DOC_VERIFIED', ref: 'CASE-BC-2026-01', desc: 'Memverifikasi dokumen Etiket Merek & Surat Rekomendasi UMKM.', time: '2026-10-17 09:30 WIB' },
      { id: 1003, actor: 'Dinda Permata', role: 'Customer Relations', action: 'LEAD_ASSIGNED', ref: 'LEAD-BC-2026-01', desc: 'Menugaskan lead konsultasi ARKANA ROASTERY kepada Arif Budiman, S.H.', time: '2026-11-15 16:45 WIB' }
    ]
  };

  // Load or initialize state
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return Object.assign({}, DEFAULT_STATE, parsed);
      }
    } catch (e) {
      console.warn('Storage read fallback:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  let state = loadState();

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      window.dispatchEvent(new CustomEvent('bc:state-updated', { detail: state }));
    } catch (e) {
      console.warn('Storage write fallback:', e);
    }
  }

  function logActivity(actor, role, action, ref, desc) {
    const now = new Date();
    const timeStr = now.toISOString().slice(0, 16).replace('T', ' ') + ' WIB';
    state.activityLogs.unshift({
      id: Date.now(),
      actor,
      role,
      action,
      ref,
      desc,
      time: timeStr
    });
    saveState();
  }

  function formatIDR(num) {
    return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
  }

  // =========================================================================
  // AI INTELLIGENCE ENGINE (6 MODULAR CAPABILITIES)
  // =========================================================================

  // 1B. REAL HTML5 CANVAS COMPUTER VISION LOGO ANALYZER & VISUAL SIMILARITY ENGINE
  const VISUAL_FIGURATIVE_DB = [
    {
      id: 'VIS-REF-01',
      name: 'ZENOVA BOTANICA (Emblem Daun & Lingkaran)',
      appNo: 'DID2026041892',
      niceClass: 'Kelas 03 & 44 (Kosmetik & Skincare)',
      viennaCode: '05.03.11 / 26.01',
      viennaTitle: 'Unsur Daun/Botani dalam Lingkaran',
      rgbPalette: [[49, 91, 76], [212, 163, 89], [246, 243, 236]],
      hexPalette: ['#315B4C', '#D4A359', '#F6F3EC'],
      dHashBits: '0011110001100110110110111101101111011011011001100011110000011000',
      symmetryH: 86,
      symmetryV: 78,
      radialScore: 82,
      edgeComplexity: 64,
      svgPreview: `<svg viewBox="0 0 64 64" width="48" height="48"><circle cx="32" cy="32" r="28" fill="#F6F3EC" stroke="#315B4C" stroke-width="3"/><path d="M32 14 C42 22, 44 38, 32 50 C20 38, 22 22, 32 14 Z" fill="#315B4C"/><path d="M32 18 L32 46" stroke="#D4A359" stroke-width="2"/></svg>`
    },
    {
      id: 'VIS-REF-02',
      name: 'ARKANA ROASTERY (Lencana Lingkaran Kopi)',
      appNo: 'DID2025088310',
      niceClass: 'Kelas 30 & 43 (Kopi & Kedai Kopi)',
      viennaCode: '26.01.18 / 05.07',
      viennaTitle: 'Lencana Lingkaran Konsentris & Biji Kopi',
      rgbPalette: [[42, 34, 29], [186, 122, 58], [242, 235, 225]],
      hexPalette: ['#2A221D', '#BA7A3A', '#F2EBE1'],
      dHashBits: '0011110001111110111001111101101111011011111001110111111000111100',
      symmetryH: 88,
      symmetryV: 84,
      radialScore: 88,
      edgeComplexity: 72,
      svgPreview: `<svg viewBox="0 0 64 64" width="48" height="48"><circle cx="32" cy="32" r="27" fill="#2A221D" stroke="#BA7A3A" stroke-width="2.5" stroke-dasharray="4 2"/><ellipse cx="32" cy="32" rx="11" ry="15" fill="#BA7A3A"/><path d="M32 17 Q27 32 32 47" stroke="#2A221D" stroke-width="2.5" fill="none"/></svg>`
    },
    {
      id: 'VIS-REF-03',
      name: 'NUSANTARA HERITAGE (Perisai Geometris Emas)',
      appNo: 'IDM000948211',
      niceClass: 'Kelas 25 & 35 (Pakaian, Batik & Retail)',
      viennaCode: '24.01.05 / 26.04',
      viennaTitle: 'Perisai / Crest Geometris Simetris',
      rgbPalette: [[26, 26, 26], [201, 148, 51], [250, 248, 245]],
      hexPalette: ['#1A1A1A', '#C99433', '#FAF8F5'],
      dHashBits: '0111111001000010010110100101101000111100000110000001100000000000',
      symmetryH: 92,
      symmetryV: 62,
      radialScore: 74,
      edgeComplexity: 68,
      svgPreview: `<svg viewBox="0 0 64 64" width="48" height="48"><path d="M14 12 H50 V32 C50 45 32 54 32 54 C32 54 14 45 14 32 Z" fill="#1A1A1A" stroke="#C99433" stroke-width="3"/><polygon points="32,20 39,32 32,44 25,32" fill="#C99433"/></svg>`
    },
    {
      id: 'VIS-REF-04',
      name: 'AURA DERMA CLINIC (Monogram Minimalis Modern)',
      appNo: 'JID2026052901',
      niceClass: 'Kelas 03 & 44 (Skincare & Klinik Kecantikan)',
      viennaCode: '27.05.17 / 26.04',
      viennaTitle: 'Monogram Huruf Bergaya & Bingkai Persegi',
      rgbPalette: [[35, 65, 58], [215, 195, 178], [255, 255, 255]],
      hexPalette: ['#23413A', '#D7C3B2', '#FFFFFF'],
      dHashBits: '1111111110000001101111011010010110111101101001011000000111111111',
      symmetryH: 79,
      symmetryV: 71,
      radialScore: 60,
      edgeComplexity: 52,
      svgPreview: `<svg viewBox="0 0 64 64" width="48" height="48"><rect x="10" y="10" width="44" height="44" rx="6" fill="#FFFFFF" stroke="#23413A" stroke-width="3"/><path d="M22 44 L32 20 L42 44 M26 36 H38" stroke="#23413A" stroke-width="3.2" fill="none"/></svg>`
    },
    {
      id: 'VIS-REF-05',
      name: 'MERAH DELIMA BISTRO (Simbol Kuliner Merah-Kuning)',
      appNo: 'DID2025019482',
      niceClass: 'Kelas 29, 30 & 43 (Makanan, Restoran & Katering)',
      viennaCode: '01.15.05 / 26.01',
      viennaTitle: 'Unsur Api/Mahkota Hangat dalam Lingkaran',
      rgbPalette: [[198, 40, 40], [245, 176, 35], [255, 250, 240]],
      hexPalette: ['#C62828', '#F5B023', '#FFFAF0'],
      dHashBits: '0001100000111100011111101111111111011011011111100011110000000000',
      symmetryH: 83,
      symmetryV: 68,
      radialScore: 84,
      edgeComplexity: 75,
      svgPreview: `<svg viewBox="0 0 64 64" width="48" height="48"><circle cx="32" cy="32" r="26" fill="#C62828"/><path d="M32 14 C38 24 44 28 40 40 C37 46 27 46 24 40 C20 28 26 24 32 14 Z" fill="#F5B023"/></svg>`
    },
    {
      id: 'VIS-REF-06',
      name: 'NEXACLOUD TECH (Heksagon Biru Teknologi)',
      appNo: 'DID2026011209',
      niceClass: 'Kelas 09 & 42 (Aplikasi, Software & SaaS)',
      viennaCode: '26.05.08 / 26.11',
      viennaTitle: 'Poligon Heksagon & Garis Koneksi Digital',
      rgbPalette: [[21, 76, 153], [56, 161, 219], [244, 248, 252]],
      hexPalette: ['#154C99', '#38A1DB', '#F4F8FC'],
      dHashBits: '0001100001111110110000111101101111011011110000110111111000011000',
      symmetryH: 87,
      symmetryV: 85,
      radialScore: 79,
      edgeComplexity: 66,
      svgPreview: `<svg viewBox="0 0 64 64" width="48" height="48"><polygon points="32,8 52,20 52,44 32,56 12,44 12,20" fill="#154C99"/><circle cx="32" cy="32" r="9" fill="#38A1DB"/></svg>`
    }
  ];

  function classifyColorNameId(r, g, b) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (l > 235) return 'Putih';
    if (l < 35) return 'Hitam';
    if (max - min < 22) return l > 150 ? 'Abu-abu Muda (Silver)' : 'Abu-abu Tua';
    if (r >= g && r >= b) {
      if (g > 160 && b < 100) return 'Kuning / Emas';
      if (g > 90 && b < 80) return 'Oranye / Jingga';
      return 'Merah';
    }
    if (g >= r && g >= b) {
      return l < 100 ? 'Hijau Tua' : 'Hijau';
    }
    if (b >= r && b >= g) {
      if (r > 110) return 'Ungu';
      return l < 100 ? 'Biru Tua (Navy)' : 'Biru';
    }
    return 'Coklat / Kombinasi';
  }

  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join('').toUpperCase();
  }

  function calcHammingSimPct(bitsA, bitsB) {
    if (!bitsA || !bitsB || bitsA.length !== 64 || bitsB.length !== 64) return 55;
    let same = 0;
    for (let i = 0; i < 64; i++) {
      if (bitsA[i] === bitsB[i]) same++;
    }
    return Math.round((same / 64) * 100);
  }

  function calcColorPaletteSimPct(colorsA, rgbListB) {
    if (!colorsA || !colorsA.length || !rgbListB || !rgbListB.length) return 50;
    let totalScore = 0;
    colorsA.forEach((ca) => {
      let minDist = 442; // max Euclidean distance in RGB is sqrt(3 * 255^2) = 441.67
      rgbListB.forEach((rb) => {
        const dr = (ca.r || 0) - rb[0];
        const dg = (ca.g || 0) - rb[1];
        const db = (ca.b || 0) - rb[2];
        const dist = Math.sqrt(dr * dr + dg * dg + db * db);
        if (dist < minDist) minDist = dist;
      });
      const sim = Math.max(0, 100 - (minDist / 441.67) * 100);
      totalScore += sim;
    });
    return Math.round(totalScore / colorsA.length);
  }

  function inferViennaClassification(symmetryH, symmetryV, radialScore, edgeComplexityPct, dominantColors) {
    const primaryColor = dominantColors[0]?.nameId || '';
    if ( primaryColor.includes('Hijau') && radialScore >= 65 ) {
      return { code: '05.03.11 / 26.01', title: 'Unsur Flora/Botani & Lingkaran Emblem (Klasifikasi Vienna Kelas 05 & 26)' };
    }
    if ( radialScore >= 78 && symmetryH >= 75 ) {
      return { code: '26.01.18', title: 'Lingkaran Konsentris / Lencana Seal Simetris (Klasifikasi Vienna Kelas 26.01)' };
    }
    if ( symmetryH >= 80 && radialScore < 78 ) {
      return { code: '24.01.05 / 26.04', title: 'Perisai Geometris / Bingkai Segiempat Simetris (Klasifikasi Vienna Kelas 24 & 26)' };
    }
    if ( edgeComplexityPct < 58 ) {
      return { code: '27.05.01', title: 'Tipografi Huruf Bergaya / Monogram Minimalis (Klasifikasi Vienna Kelas 27.05)' };
    }
    return { code: '26.11.01 / 27.05', title: 'Kombinasi Ilustrasi Grafis & Unsur Huruf (Klasifikasi Vienna Kelas 26 & 27)' };
  }

  function analyzeLogoPixels(imgObj, fileName, sizeKB) {
    const width = imgObj.naturalWidth || imgObj.width || 500;
    const height = imgObj.naturalHeight || imgObj.height || 500;
    const aspectRatio = (width / height).toFixed(2);
    const isSquare = Math.abs(width / height - 1) <= 0.15;
    const resolutionOk = width >= 400 && height >= 400;

    // 1. 64x64 Canvas for Color Histogram, Alpha/Background, Symmetry, & Edge Complexity
    const canvas = document.createElement('canvas');
    const S = 64;
    canvas.width = S;
    canvas.height = S;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imgObj, 0, 0, S, S);
    const data = ctx.getImageData(0, 0, S, S).data;
    const previewDataUrl = canvas.toDataURL('image/png');

    let transparentPixels = 0;
    let whiteBgPixels = 0;
    const colorBuckets = {};
    const gray = new Float32Array(S * S);
    let centerMass = 0;
    let cornerMass = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      const pxIdx = i / 4;
      const x = pxIdx % S;
      const y = Math.floor(pxIdx / S);

      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      gray[pxIdx] = lum;

      // Foreground weight for radial distribution
      const isFg = a >= 128 && lum < 238;
      const distCenter = Math.sqrt((x - 31.5) * (x - 31.5) + (y - 31.5) * (y - 31.5));
      if (isFg) {
        if (distCenter <= 22) centerMass++;
        else if (distCenter > 30) cornerMass++;
      }

      if (a < 128) {
        transparentPixels++;
        continue;
      }
      if (r > 240 && g > 240 && b > 240) {
        whiteBgPixels++;
      }

      // Quantize RGB into 32-step buckets (prioritize non-white foreground colors)
      const qr = Math.round(r / 32) * 32;
      const qg = Math.round(g / 32) * 32;
      const qb = Math.round(b / 32) * 32;
      const key = `${qr},${qg},${qb}`;
      if (!colorBuckets[key]) {
        colorBuckets[key] = { count: 0, rSum: 0, gSum: 0, bSum: 0, isNearWhite: r > 235 && g > 235 && b > 235 };
      }
      colorBuckets[key].count++;
      colorBuckets[key].rSum += r;
      colorBuckets[key].gSum += g;
      colorBuckets[key].bSum += b;
    }

    // Compute Horizontal & Vertical Mirror Symmetry from 64x64 luminance matrix
    let diffH = 0;
    let diffV = 0;
    let pairs = 0;
    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S / 2; x++) {
        diffH += Math.abs(gray[y * S + x] - gray[y * S + (S - 1 - x)]);
        diffV += Math.abs(gray[x * S + y] - gray[(S - 1 - x) * S + y]);
        pairs++;
      }
    }
    const symmetryH = Math.min(98, Math.max(35, Math.round(100 - (diffH / pairs / 255) * 130)));
    const symmetryV = Math.min(98, Math.max(35, Math.round(100 - (diffV / pairs / 255) * 130)));
    const radialScore = Math.min(96, Math.max(40, Math.round((centerMass / Math.max(1, centerMass + cornerMass * 1.4)) * 105)));

    // Compute Edge Density (Gradient Magnitude)
    let edgePixels = 0;
    for (let y = 1; y < S - 1; y++) {
      for (let x = 1; x < S - 1; x++) {
        const idx = y * S + x;
        const gx = Math.abs(gray[idx + 1] - gray[idx - 1]);
        const gy = Math.abs(gray[idx + S] - gray[idx - S]);
        if (gx + gy > 38) edgePixels++;
      }
    }
    const edgeComplexityPct = Math.min(98, Math.max(18, Math.round((edgePixels / (S * S)) * 280)));

    // Sort dominant colors (put foreground colors ahead of pure white background if foreground exists)
    const allBuckets = Object.values(colorBuckets).sort((a, b) => {
      if (a.isNearWhite !== b.isNearWhite) return a.isNearWhite ? 1 : -1;
      return b.count - a.count;
    });
    const sortedColors = allBuckets.slice(0, 4).map((b) => {
      const r = Math.round(b.rSum / b.count);
      const g = Math.round(b.gSum / b.count);
      const bl = Math.round(b.bSum / b.count);
      const hex = rgbToHex(r, g, bl);
      const nameId = classifyColorNameId(r, g, bl);
      const pct = Math.round((b.count / (S * S)) * 100);
      return { r, g, b: bl, hex, nameId, pct };
    });

    // 2. 9x8 Canvas for Real 64-bit Perceptual dHash
    const hc = document.createElement('canvas');
    hc.width = 9;
    hc.height = 8;
    const hctx = hc.getContext('2d');
    hctx.drawImage(imgObj, 0, 0, 9, 8);
    const hdata = hctx.getImageData(0, 0, 9, 8).data;
    let bits = '';
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const i1 = (y * 9 + x) * 4;
        const i2 = (y * 9 + (x + 1)) * 4;
        const l1 = 0.299 * hdata[i1] + 0.587 * hdata[i1 + 1] + 0.114 * hdata[i1 + 2];
        const l2 = 0.299 * hdata[i2] + 0.587 * hdata[i2 + 1] + 0.114 * hdata[i2 + 2];
        bits += l1 < l2 ? '1' : '0';
      }
    }
    let dHashHex = '';
    for (let i = 0; i < 64; i += 4) {
      dHashHex += parseInt(bits.slice(i, i + 4), 2).toString(16);
    }

    const vienna = inferViennaClassification(symmetryH, symmetryV, radialScore, edgeComplexityPct, sortedColors);

    // 3. Compute Multi-Factor Visual Similarity against Reference Figurative Trademarks
    const visualMatches = VISUAL_FIGURATIVE_DB.map((ref) => {
      const dHashSim = calcHammingSimPct(bits, ref.dHashBits);
      const geomSim = Math.round(
        100 -
          (Math.abs(symmetryH - ref.symmetryH) * 0.35 +
            Math.abs(radialScore - ref.radialScore) * 0.4 +
            Math.abs(edgeComplexityPct - ref.edgeComplexity) * 0.25)
      );
      const shapeSim = Math.min(97, Math.max(25, Math.round(dHashSim * 0.55 + geomSim * 0.45)));
      const colorSim = calcColorPaletteSimPct(sortedColors.slice(0, 3), ref.rgbPalette);
      const viennaBonus = vienna.code.split('/')[0].trim().slice(0, 5) === ref.viennaCode.slice(0, 5) ? 8 : 0;
      const totalVisualSim = Math.min(96, Math.max(22, Math.round(shapeSim * 0.52 + colorSim * 0.42 + viennaBonus)));

      let riskBadge = 'Aman / Berbeda';
      let riskColor = '#2E6B4E';
      let note = 'Struktur siluet dan komposisi warna cukup berbeda, risiko konflik visual rendah.';
      if (totalVisualSim >= 72) {
        riskBadge = 'Kemiripan Visual Tinggi';
        riskColor = '#B91C1C';
        note = 'Kemiripan komposisi warna & geometri bentuk cukup dekat (perhatikan Pasal 21 UU Merek jika berada di kelas barang/jasa yang sama).';
      } else if (totalVisualSim >= 56) {
        riskBadge = 'Kemiripan Parsial (Sedang)';
        riskColor = '#B45309';
        note = 'Terdapat kemiripan unsur warna atau pola siluet dasar; pastikan elemen kata/tipografi merek Anda tampil dominan sebagai pembeda.';
      }

      return {
        id: ref.id,
        name: ref.name,
        appNo: ref.appNo,
        niceClass: ref.niceClass,
        viennaCode: ref.viennaCode,
        viennaTitle: ref.viennaTitle,
        hexPalette: ref.hexPalette,
        svgPreview: ref.svgPreview,
        shapeSim,
        colorSim,
        totalVisualSim,
        riskBadge,
        riskColor,
        note
      };
    }).sort((a, b) => b.totalVisualSim - a.totalVisualSim);

    const topMatch = visualMatches[0];
    const maxVisualSimilarity = topMatch ? topMatch.totalVisualSim : 35;

    const totalPx = S * S;
    const hasTransparentBg = transparentPixels / totalPx > 0.12;
    const hasCleanWhiteBg = whiteBgPixels / totalPx > 0.2;
    const bgVerdict = hasTransparentBg
      ? 'Transparan (PNG Alpha) — Disarankan latar putih saat ekspor etiket DJKI'
      : hasCleanWhiteBg
      ? 'Latar Belakang Putih Bersih (Sesuai Standar Etiket DJKI)'
      : 'Latar Belakang Berwarna Penuh';

    const uniqueColorNames = [...new Set(sortedColors.map((c) => `${c.nameId} (${c.hex})`))];
    const djkiColorDescription = `Unsur warna pada etiket merek terdiri dari: ${uniqueColorNames.join(', ')}.`;

    return {
      name: fileName,
      sizeKB,
      width,
      height,
      aspectRatio,
      isSquare,
      resolutionOk,
      edgeComplexityPct,
      symmetryH,
      symmetryV,
      radialScore,
      viennaCode: vienna.code,
      viennaTitle: vienna.title,
      dominantColors: sortedColors,
      dHash: dHashHex.toUpperCase(),
      dHashBits: bits,
      previewDataUrl,
      bgVerdict,
      djkiColorDescription,
      maxVisualSimilarity,
      visualMatches: visualMatches.slice(0, 3)
    };
  }

  // 1C. DIRECT 1-ON-1 TWO-LOGO VISUAL SIMILARITY COMPARATOR (Logo Anda vs Logo Pembanding/Kompetitor)
  function compareTwoLogos(logoA, logoB) {
    if (!logoA || !logoB) return null;
    const dHashSim = calcHammingSimPct(logoA.dHashBits, logoB.dHashBits);
    const geomSim = Math.round(
      100 -
        (Math.abs((logoA.symmetryH || 70) - (logoB.symmetryH || 70)) * 0.35 +
          Math.abs((logoA.radialScore || 70) - (logoB.radialScore || 70)) * 0.4 +
          Math.abs((logoA.edgeComplexityPct || 60) - (logoB.edgeComplexityPct || 60)) * 0.25)
    );
    const shapeSim = Math.min(99, Math.max(15, Math.round(dHashSim * 0.6 + geomSim * 0.4)));

    const rgbB = (logoB.dominantColors || []).map((c) => [c.r || 0, c.g || 0, c.b || 0]);
    const colorSim = calcColorPaletteSimPct((logoA.dominantColors || []).slice(0, 3), rgbB);

    const sameVienna = (logoA.viennaCode || '').slice(0, 5) === (logoB.viennaCode || '').slice(0, 5);
    const totalSim = Math.min(99, Math.max(12, Math.round(shapeSim * 0.55 + colorSim * 0.4 + (sameVienna ? 5 : 0))));

    let verdict = 'BERBEDA SECARA VISUAL (AMAN DARI PERSAMAAN POKOK LUKISAN)';
    let legalNote = 'Berdasarkan perbandingan piksel langsung, struktur siluet (dHash) dan komposisi warna kedua logo memiliki perbedaan yang jelas. Risiko dinilai memiliki "persamaan pada pokoknya" (Pasal 21 UU Merek) dari sisi visual tergolong rendah.';
    let badgeColor = '#2E6B4E';

    if (totalSim >= 75) {
      verdict = 'PERINGATAN: KEMIRIPAN VISUAL TINGGI (RAWAN KONFLIK PASAL 21)';
      legalNote = 'Kedua gambar logo memiliki kemiripan struktur bentuk/siluet dan komposisi warna yang sangat dekat. Berdasarkan Penjelasan Pasal 21 Ayat (1) UU No. 20 Tahun 2016, kemiripan bentuk, cara penempatan, dan kombinasi warna pada barang/jasa sejenis berisiko tinggi ditolak atau digugat oposisi.';
      badgeColor = '#B91C1C';
    } else if (totalSim >= 55) {
      verdict = 'PERHATIAN: KEMIRIPAN VISUAL PARSIAL (SEDANG)';
      legalNote = 'Terdapat kemiripan pada sebagian unsur warna atau proporsi geometri dasar. Disarankan membedakan kontras warna utama atau memperkuat elemen kata (wordmark) agar kesan keseluruhan (overall impression) tidak membingungkan konsumen.';
      badgeColor = '#B45309';
    }

    return {
      totalSim,
      shapeSim,
      colorSim,
      dHashSim,
      sameVienna,
      verdict,
      legalNote,
      badgeColor
    };
  }
  function recommendClasses(productDesc) {
    if (!productDesc || !productDesc.trim()) {
      return [NICE_CLASSES_DB[34], NICE_CLASSES_DB[29], NICE_CLASSES_DB[24]];
    }
    const q = productDesc.toLowerCase();
    const scored = NICE_CLASSES_DB.map((cls) => {
      let score = 0;
      if (cls.title.toLowerCase().includes(q)) score += 5;
      cls.keywords.forEach((kw) => {
        if (q.includes(kw)) score += 4;
        else if (kw.includes(q) && q.length >= 3) score += 2;
      });
      return { cls, score };
    }).filter((item) => item.score > 0);

    scored.sort((a, b) => b.score - a.score);
    if (scored.length === 0) {
      return [NICE_CLASSES_DB[34]]; // Default Class 35
    }
    return scored.slice(0, 4).map((s) => s.cls);
  }

  // 2. Trademark Similarity & Distinctiveness Analysis (Name + Visual Logo + Competitor Logo)
  function analyzeTrademark(query, mode, productCategory, chosenClass, logoMeta, compLogoMeta) {
    const cleaned = (query || (logoMeta ? logoMeta.name.replace(/\.[^.]+$/, '') : 'MEREK BARU')).trim();
    const lower = cleaned.toLowerCase();
    const refCode = 'BC-SRCH-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + String(Math.floor(100 + Math.random() * 900));
    const nowStr = new Date().toISOString().slice(0, 16).replace('T', ' ') + ' WIB';

    const recClasses = chosenClass
      ? [chosenClass]
      : recommendClasses(productCategory || cleaned).map((c) => `Kelas ${c.num} (${c.title})`);

    const highConflictTokens = [
      'gojek', 'tokopedia', 'shopee', 'lazada', 'grab', 'indomie', 'aqua', 'bca', 'mandiri',
      'telkomsel', 'pertamina', 'erigo', 'kopi kenangan', 'janji jiwa', 'chatime', 'starbucks',
      'unilever', 'nestle', 'djarum', 'sampoerna', 'wardah', 'somethinc', 'scarlett', 'ms glow'
    ];
    const genericTokens = [
      'kopi', 'coffee', 'teh', 'tea', 'susu', 'baju', 'kaos', 'tas', 'sepatu', 'roti',
      'air', 'water', 'sabun', 'shampoo', 'cream', 'skincare', 'restoran', 'cafe',
      'toko', 'shop', 'store', 'enak', 'murah', 'segar', 'super', 'best', 'original', 'indonesia', 'jakarta'
    ];

    // Check internal portfolio & watchlists for exact/partial collision in our verified local DB
    const internalCollision = state.trademarkPortfolio.find((p) =>
      p.trademarkName.toLowerCase().includes(lower) || lower.includes(p.trademarkName.toLowerCase().split(' ')[0])
    );

    const isAppNumber = mode === 'number' || /^(did|jid|ipt|d00|j00|idm|w00)/i.test(cleaned);

    let distinctivenessIndex = 88;
    let riskLevel = 'low';
    let verdict = 'DAYA PEMBEDA KUAT (POTENSI POSITIF)';
    let phoneticStatus = 'Distingtif // Unik';
    let phoneticDetail = 'Struktur bunyi pengucapan memiliki karakter pembeda yang jelas.';
    let visualStatus = logoMeta
      ? `Kemiripan Visual Maks: ${logoMeta.maxVisualSimilarity || 45}% · Vienna ${logoMeta.viennaCode || '26.01'}`
      : 'Susunan Huruf Khas';
    let visualDetail = logoMeta
      ? `dHash: ${logoMeta.dHash || 'OK'} · Simetri H:${logoMeta.symmetryH || 80}% · ${logoMeta.djkiColorDescription || ''}`
      : 'Komposisi ejaan tidak bersifat deskriptif murni.';
    let statuteStatus = 'Memenuhi Kriteria Pasal 20';
    let statuteDetail = 'Bukan merupakan kata umum/milik publik yang dilarang secara absolut.';
    let aiInterpretation = '';
    let professionalAssessment = '';

    if (isAppNumber) {
      let prefixDesc = 'Permohonan Merek DJKI';
      if (/^did/i.test(cleaned)) prefixDesc = 'Merek Dagang Elektronik (DID)';
      else if (/^jid/i.test(cleaned)) prefixDesc = 'Merek Jasa Elektronik (JID)';
      else if (/^idm/i.test(cleaned)) prefixDesc = 'Sertifikat Merek Terdaftar (IDM)';

      const matchedCase = state.trademarkCases.find((c) => (c.djkiApplicationNo || '').toLowerCase() === lower);

      distinctivenessIndex = 100;
      riskLevel = 'low';
      verdict = matchedCase ? `TERDATA: ${matchedCase.stage.toUpperCase()}` : 'FORMAT NOMOR PERMOHONAN VALID';
      phoneticStatus = prefixDesc;
      phoneticDetail = matchedCase
        ? `Merek: ${matchedCase.trademarkName} (${matchedCase.niceClasses})`
        : 'Kode awalan sesuai sistem penomoran administrasi DJKI.';
      visualStatus = matchedCase ? `Filing Date: ${matchedCase.filingDate}` : 'Siap Diverifikasi PDKI';
      statuteStatus = 'Pengecekan Status Berkas';
      aiInterpretation = matchedCase
        ? `Nomor permohonan ${cleaned.toUpperCase()} tercatat aktif di portofolio BrandConnect atas nama merek "${matchedCase.trademarkName}" pada tahap ${matchedCase.stage}.`
        : `Nomor permohonan ${cleaned.toUpperCase()} teridentifikasi sebagai format ${prefixDesc}. Penarikan riwayat status pemeriksaan terkini dari pangkalan data resmi DJKI (PDKI) memerlukan verifikasi spesialis.`;
      professionalAssessment = matchedCase
        ? matchedCase.legalAssessment
        : 'Tim Spesialis Merek BrandConnect dapat memeriksa tahapan Formalitas, Publikasi BRM, atau Substantif untuk nomor permohonan ini.';
    } else {
      const words = lower.split(/\s+/).filter(Boolean);
      const matchedFamous = highConflictTokens.find((t) => lower.includes(t));
      const isAllGeneric = words.length > 0 && words.every((w) => genericTokens.includes(w));
      const hasGeneric = words.some((w) => genericTokens.includes(w));

      if (matchedFamous) {
        distinctivenessIndex = 22;
        riskLevel = 'high';
        verdict = 'PERINGATAN RISIKO TINGGI (INDIKASI KEMIRIPAN MEREK TERKENAL)';
        phoneticStatus = 'Kemiripan Fonetik Kuat';
        phoneticDetail = `Mengandung unsur bunyi/kata yang menyerupai merek terkenal "${matchedFamous.toUpperCase()}".`;
        visualStatus = 'Rawan Konflik Pasal 21';
        visualDetail = 'Berisiko dinilai memiliki persamaan pada pokoknya atau keseluruhannya.';
        statuteStatus = 'Berpotensi Ditolak (Pasal 21)';
        statuteDetail = 'Pasal 21 Ayat (1) huruf b UU Merek melindungi merek terkenal dari kemiripan.';
        aiInterpretation = `Nama "${cleaned.toUpperCase()}" memiliki kemiripan fonetik/ejaan dengan merek terkenal "${matchedFamous.toUpperCase()}". Berdasarkan Pasal 21 UU No. 20 Tahun 2016, permohonan merek yang memiliki persamaan pada pokoknya dengan merek terkenal berisiko tinggi mengalami Usulan Penolakan.`;
        professionalAssessment = 'Sangat disarankan untuk memodifikasi atau mengganti unsur kata utama sebelum mengajukan pendaftaran guna menghindari penolakan substantif dan potensi oposisi.';
      } else if (internalCollision) {
        distinctivenessIndex = 38;
        riskLevel = 'high';
        verdict = 'TERDETEKSI KEMIRIPAN DI DATABASE PEMANTAUAN';
        phoneticStatus = 'Kemiripan Parsial/Pokok';
        phoneticDetail = `Mirip dengan entitas terdata "${internalCollision.trademarkName}" (${internalCollision.niceClasses}).`;
        visualStatus = 'Perlu Bedah Kelas';
        statuteStatus = 'Periksa Pasal 21 Ayat (1)';
        aiInterpretation = `Ditemukan kemiripan unsur kata dengan merek "${internalCollision.trademarkName}" yang tercatat pada ${internalCollision.niceClasses}. Jika diajukan pada kelas barang/jasa sejenis, terdapat risiko persamaan pada pokoknya.`;
        professionalAssessment = 'Diperlukan analisis pembeda kelas (Nice Classification) dan penambahan elemen kata/lukisan pembeda oleh Spesialis Merek.';
      } else if (isAllGeneric) {
        distinctivenessIndex = 34;
        riskLevel = 'high';
        verdict = 'DAYA PEMBEDA RENDAH (BERSIFAT UMUM / DESKRIPTIF)';
        phoneticStatus = 'Kata Umum / Generik';
        phoneticDetail = 'Hanya menyebutkan jenis barang, sifat, atau keterangan langsung produk.';
        visualStatus = 'Kurang Unsur Pembeda';
        visualDetail = 'Kata milik umum tidak dapat dimonopoli secara eksklusif oleh satu pihak.';
        statuteStatus = 'Risiko Pasal 20 Huruf b & e';
        statuteDetail = 'Pasal 20 menolak tanda yang tidak memiliki daya pembeda atau hanya menyebut barangnya.';
        aiInterpretation = `Nama "${cleaned.toUpperCase()}" terdiri dari kata yang bersifat umum/deskriptif. Menurut Pasal 20 UU Merek No. 20 Tahun 2016, tanda yang hanya menyebut jenis barang/jasa yang dimohonkan atau tidak memiliki daya pembeda tidak dapat didaftarkan.`;
        professionalAssessment = 'Tambahkan kata ciptaan yang unik (coined word) serta desain logo/etiket yang khas agar memenuhi syarat daya pembeda.';
      } else if (hasGeneric) {
        distinctivenessIndex = 74;
        riskLevel = 'moderate';
        verdict = 'POTENSI MENENGAH (KOMBINASI KATA UMUM & PEMBEDA)';
        phoneticStatus = 'Cukup Distingtif';
        phoneticDetail = 'Mengandung unsur kata umum yang didampingi oleh kata pembeda.';
        visualStatus = 'Disarankan Kombinasi Logo';
        statuteStatus = 'Perhatikan Klaim Eksklusif';
        statuteDetail = 'Unsur kata umum di dalamnya tetap tidak dilindungi secara terpisah.';
        aiInterpretation = `Merek "${cleaned.toUpperCase()}" menggabungkan unsur kata deskriptif dengan kata pembeda. Secara hukum, perlindungan merek akan bertumpu pada keunikan kata pembedanya, sedangkan kata umumnya tidak dapat diklaim secara monopoli.`;
        professionalAssessment = 'Dapat diajukan dengan memperkuat desain etiket merek (Merek Kata & Lukisan) serta melakukan pengecekan silang database PDKI pada kelas target.';
      } else {
        distinctivenessIndex = 89;
        riskLevel = 'low';
        verdict = 'DAYA PEMBEDA KUAT (POTENSI POSITIF)';
        aiInterpretation = `Merek "${cleaned.toUpperCase()}" memiliki karakteristik kata yang unik/distingtif dan tidak melanggar larangan absolut Pasal 20 UU No. 20 Tahun 2016. Struktur fonetik dan ejaannya sangat baik untuk dijadikan identitas merek eksklusif.`;
        professionalAssessment = 'Langkah selanjutnya adalah memastikan tidak ada merek identik yang sudah terdaftar lebih dulu di pangkalan data resmi DJKI (PDKI) pada kelas barang/jasa yang sama melalui verifikasi Spesialis Merek BrandConnect.';
      }

      if (logoMeta && logoMeta.visualMatches && logoMeta.visualMatches.length > 0) {
        const topVis = logoMeta.visualMatches[0];
        visualStatus = `Kemiripan Visual Maks: ${topVis.totalVisualSim}% (Vienna ${logoMeta.viennaCode})`;
        visualDetail = `Kandidat terdekat: ${topVis.name} (Bentuk ${topVis.shapeSim}% · Warna ${topVis.colorSim}%).`;
        aiInterpretation += ` [Analisis Kemiripan Visual Logo]: Logo "${logoMeta.name}" terklasifikasi pada WIPO Vienna ${logoMeta.viennaCode} (${logoMeta.viennaTitle}) dengan tingkat kemiripan visual tertinggi sebesar ${topVis.totalVisualSim}% terhadap pola "${topVis.name}".`;

        if (compLogoMeta) {
          const cmp = compareTwoLogos(logoMeta, compLogoMeta);
          if (cmp) {
            aiInterpretation += ` [Perbandingan 1-on-1 dengan Logo Pembanding "${compLogoMeta.name}"]: Skor kemiripan visual total ${cmp.totalSim}% (Siluet/dHash ${cmp.shapeSim}%, Spektrum Warna ${cmp.colorSim}% — ${cmp.verdict}).`;
            if (cmp.totalSim >= 75 && riskLevel === 'low') {
              riskLevel = 'moderate';
              distinctivenessIndex = Math.min(distinctivenessIndex, 58);
              verdict = 'PERHATIAN: INDIKASI KEMIRIPAN VISUAL LOGO PEMBANDING (PASAL 21)';
            }
          }
        }
      }
    }

    const record = {
      id: Date.now(),
      referenceCode: refCode,
      timestamp: nowStr,
      trademarkName: cleaned.toUpperCase(),
      searchMode: mode || (logoMeta ? 'logo' : 'name'),
      productCategory: productCategory || 'Umum',
      recommendedClasses: recClasses.join(', '),
      distinctivenessIndex,
      riskLevel,
      verdict,
      phoneticStatus,
      phoneticDetail,
      visualStatus,
      visualDetail,
      statuteStatus,
      statuteDetail,
      aiInterpretation,
      professionalAssessment,
      logoMeta: logoMeta || null,
      compLogoMeta: compLogoMeta || null
    };

    state.searchLogs.unshift(record);
    saveState();
    return record;
  }

  // 3. AI Assistant RAG Response Engine
  function generateAiAssistantReply(userMessage, trademarkContext) {
    const q = (userMessage || '').toLowerCase();
    let reply = '';

    if (q.includes('kelas') || q.includes('nice') || q.includes('kopi') || q.includes('skincare') || q.includes('baju') || q.includes('toko') || q.includes('restoran')) {
      const recs = recommendClasses(userMessage);
      const listStr = recs.map((c) => `• **Kelas ${c.num} (${c.type})**: ${c.title}`).join('\n');
      reply = `Berdasarkan standar **Klasifikasi Nice (Kelas 1–45)** yang digunakan DJKI, berikut adalah rekomendasi kelas yang relevan dengan pertanyaan Anda:\n\n${listStr}\n\n*Catatan Hukum:* Perlindungan merek hanya berlaku pada kelas yang didaftarkan. Anda dapat mengklik tombol **Handover ke Spesialis** di bawah agar Konsultan Merek kami memvalidasi cakupan kelas Anda.`;
    } else if (q.includes('ditolak') || q.includes('penolakan') || q.includes('sanggahan') || q.includes('pasal 20') || q.includes('pasal 21')) {
      reply = `Mengacu pada **UU No. 20 Tahun 2016 tentang Merek dan Indikasi Geografis**:\n1. **Pasal 20 (Alasan Absolut)**: Merek ditolak jika tidak memiliki daya pembeda, merupakan nama umum, atau hanya mendeskripsikan jenis produk.\n2. **Pasal 21 (Alasan Relatif)**: Merek ditolak jika memiliki *persamaan pada pokoknya atau keseluruhannya* dengan merek terdaftar lebih dulu atau merek terkenal.\n\nJika Anda menerima **Surat Usulan Penolakan** dari DJKI, Anda memiliki waktu **maksimal 30 hari kerja** (Pasal 24) untuk mengajukan **Tanggapan/Sanggahan Resmi**. Tim Legal Counsel BrandConnect dapat menyusun surat sanggahan untuk Anda.`;
    } else if (q.includes('oposisi') || q.includes('brm') || q.includes('meniru') || q.includes('monitoring')) {
      reply = `Berdasarkan **Pasal 14 & Pasal 16 UU Merek No. 20/2016**, setiap permohonan merek diumumkan dalam **Berita Resmi Merek (BRM)** selama **2 (dua) bulan**. Apabila ada pihak lain yang mendaftarkan merek mirip dengan milik Anda, Anda berhak mengajukan **Surat Keberatan (Oposisi)** sebelum masa 2 bulan tersebut habis.`;
    } else if (q.includes('biaya') || q.includes('harga') || q.includes('umkm') || q.includes('tarif')) {
      const regSrv = state.services[0];
      reply = `Di BrandConnect, biaya layanan transparan dan mendukung tarif khusus UMKM:\n• **Pendaftaran Merek Baru (Jalur UMKM)**: ${formatIDR(regSrv.umkmPrice)}\n• **Pendaftaran Merek Baru (Jalur Umum / PT)**: ${formatIDR(regSrv.basePrice)}\n• **Tanggapan Penolakan / Sanggahan**: Mulai ${formatIDR(state.services[5].umkmPrice)}\n• **Perpanjangan Merek 10 Tahun**: Mulai ${formatIDR(state.services[1].umkmPrice)}\n\nIngin kami bantu hitungkan estimasi resmi sesuai jumlah kelas merek Anda? Klik tombol **Teruskan ke Spesialis Merek**.`;
    } else if (q.includes('lama') || q.includes('proses') || q.includes('berapa bulan') || q.includes('sertifikat')) {
      reply = `Alur resmi pendaftaran merek di DJKI (UU No. 20/2016):\n1. **Pengajuan & Terbit Bukti Permohonan (Filing Date)**: 1–3 hari kerja setelah dokumen lengkap.\n2. **Pemeriksaan Formalitas**: ±15 hari kerja.\n3. **Masa Pengumuman Berita Resmi Merek (BRM)**: 2 bulan.\n4. **Pemeriksaan Substantif & Penerbitan Sertifikat**: ±150 hari kerja (total keseluruhan umumnya 6–12 bulan di DJKI).`;
    } else {
      reply = `Terima kasih atas pertanyaan Anda mengenai perlindungan merek${trademarkContext ? ' **' + trademarkContext + '**' : ''}. Berdasarkan **UU No. 20 Tahun 2016 (Prinsip First-to-File)**, langkah terpenting adalah:\n1. Memastikan nama merek memiliki daya pembeda (Pasal 20) dan tidak mirip merek terdaftar (Pasal 21).\n2. Menentukan kelas barang/jasa (Nice Classification 1–45) yang tepat.\n3. Mengamankan Tanggal Penerimaan (*Filing Date*) sedini mungkin.\n\nAnda dapat mengklik tombol **"Handover ke Spesialis Merek"** di bawah untuk meneruskan ringkasan percakapan ini langsung kepada Konsultan Merek BrandConnect.`;
    }

    return reply;
  }

  // 4. Create Service Order & Case
  function createServiceOrder(payload) {
    const srv = state.services.find((s) => s.code === payload.serviceCode) || state.services[0];
    const isUmkm = payload.applicantType === 'umkm';
    const amount = isUmkm && srv.umkmPrice ? srv.umkmPrice : srv.basePrice;
    const ordNum = 'ORD-BC-2026-' + String(state.serviceOrders.length + 1).padStart(3, '0');
    const caseNum = 'CASE-BC-2026-' + String(state.trademarkCases.length + 1).padStart(2, '0');
    const today = new Date().toISOString().slice(0, 10);

    const newOrder = {
      id: Date.now(),
      orderNumber: ordNum,
      customerName: payload.customerName || state.customerProfile.name,
      customerEmail: payload.customerEmail || state.customerProfile.email,
      customerPhone: payload.customerPhone || state.customerProfile.phone,
      serviceCode: srv.code,
      serviceName: `${srv.name} (${srv.nameId})`,
      trademarkName: (payload.trademarkName || 'MEREK BARU').toUpperCase(),
      niceClasses: payload.niceClasses || 'Kelas 35',
      applicantType: payload.applicantType || 'umkm',
      amount,
      paymentStatus: 'unpaid',
      orderStatus: 'pending_review',
      notes: payload.notes || '',
      createdAt: today
    };

    const newCase = {
      id: Date.now() + 1,
      caseNumber: caseNum,
      orderNumber: ordNum,
      customerName: newOrder.customerName,
      trademarkName: newOrder.trademarkName,
      niceClasses: newOrder.niceClasses,
      djkiApplicationNo: 'MENUNGGU PENGAJUAN',
      filingDate: today,
      stage: 'Document Verification',
      stageIndex: 1,
      specialist: 'Arif Budiman, S.H.',
      legalCounsel: 'Dr. Pratama Hukum, S.H., M.H.',
      docOfficer: 'Santi Rahayu',
      legalAssessment: 'Order layanan baru diterima. Menunggu verifikasi dokumen persyaratan dan pengecekan final PDKI oleh Spesialis Merek.',
      updatedAt: today
    };

    state.serviceOrders.unshift(newOrder);
    state.trademarkCases.unshift(newCase);
    state.trademarkPortfolio.unshift({
      id: Date.now() + 2,
      trademarkName: newOrder.trademarkName,
      niceClasses: newOrder.niceClasses,
      applicationNo: 'PROSES PENGAJUAN (' + caseNum + ')',
      filingDate: today,
      status: 'Document Verification (Verifikasi Berkas)',
      protectionExpiry: 'Menunggu Sertifikat',
      monitored: true
    });

    state.notifications.unshift({
      id: Date.now() + 3,
      title: `Order Layanan Dibuat: ${ordNum}`,
      message: `Pesanan layanan ${srv.nameId} untuk merek "${newOrder.trademarkName}" (${newOrder.niceClasses}) telah masuk ke sistem dan membuat berkas kasus ${caseNum}.`,
      type: 'success',
      read: false,
      date: today
    });

    logActivity(newOrder.customerName, 'Customer', 'SERVICE_ORDER_CREATED', ordNum, `Membuat pesanan layanan ${srv.name} untuk merek ${newOrder.trademarkName}.`);
    saveState();
    return { order: newOrder, trademarkCase: newCase };
  }

  // 5. Human Expert Handover (Convert AI Search / Conversation into Consultation Lead)
  function createHandoverLead(payload) {
    const leadNum = 'LEAD-BC-2026-' + String(state.consultationLeads.length + 1).padStart(2, '0');
    const nowStr = new Date().toISOString().slice(0, 16).replace('T', ' ') + ' WIB';
    const latestSearch = state.searchLogs[0];

    const newLead = {
      id: Date.now(),
      leadNumber: leadNum,
      customerName: payload.customerName || state.customerProfile.name,
      customerEmail: payload.customerEmail || state.customerProfile.email,
      customerPhone: payload.customerPhone || state.customerProfile.phone,
      trademarkName: (payload.trademarkName || latestSearch?.trademarkName || 'BELUM DITENTUKAN').toUpperCase(),
      productCategory: payload.productCategory || latestSearch?.productCategory || 'Umum',
      requestedService: payload.requestedService || 'Trademark Registration (Pendaftaran Merek Baru)',
      searchResultsSummary: payload.searchResultsSummary || (latestSearch ? `${latestSearch.referenceCode} — Indeks: ${latestSearch.distinctivenessIndex}% (${latestSearch.verdict})` : 'Belum ada riwayat pencarian'),
      aiAssessment: payload.aiAssessment || (latestSearch ? latestSearch.aiInterpretation : 'Menunggu evaluasi spesialis'),
      conversationSummary: payload.conversationSummary || 'Permintaan konsultasi & handover langsung dari platform.',
      uploadedDocuments: payload.uploadedDocuments || (latestSearch?.logoMeta ? [latestSearch.logoMeta.name] : []),
      status: 'new',
      assignedTo: 'Arif Budiman, S.H. (Trademark Specialist)',
      specialistNotes: 'Lead baru dari sistem Handover AI. Menunggu review awal Spesialis Merek.',
      createdAt: nowStr
    };

    state.consultationLeads.unshift(newLead);
    state.notifications.unshift({
      id: Date.now() + 1,
      title: `Handover Konsultasi Terkirim (${leadNum})`,
      message: `Data merek "${newLead.trademarkName}", hasil analisis AI, dan ringkasan konsultasi telah diteruskan ke Tim Spesialis Merek BrandConnect.`,
      type: 'info',
      read: false,
      date: nowStr.slice(0, 10)
    });

    logActivity(newLead.customerName, 'Customer / AI Handover', 'HANDOVER_LEAD_CREATED', leadNum, `Meneruskan data merek ${newLead.trademarkName} & ringkasan AI ke Spesialis Merek.`);
    saveState();
    return newLead;
  }

  // =========================================================================
  // GLOBAL UI MODALS (AI REPORT MODAL, SERVICE ORDER MODAL, FLOATING AI ASSISTANT)
  // =========================================================================
  function injectGlobalWidgets() {
    if (document.getElementById('bc-global-widgets-root')) return;

    const root = document.createElement('div');
    root.id = 'bc-global-widgets-root';
    root.innerHTML = `
      <!-- 1. FLOATING AI TRADEMARK ASSISTANT BUTTON & DRAWER -->
      <div id="bc-ai-assistant-widget" style="position:fixed;bottom:24px;right:24px;z-index:990;font-family:var(--font-body);">
        <button type="button" id="bc-ai-fab" style="display:flex;align-items:center;gap:0.65rem;padding:0.85rem 1.25rem;background:var(--charcoal);color:var(--ivory);border:1.5px solid var(--green);border-radius:6px;box-shadow:0 16px 36px rgba(28,29,27,0.22);cursor:pointer;font-family:var(--font-heading);font-weight:700;font-size:0.85rem;">
          <span style="width:8px;height:8px;border-radius:50%;background:#5CD4A5;box-shadow:0 0 0 3px rgba(92,212,165,0.25);"></span>
          <span>AI Trademark Assistant</span>
        </button>

        <div id="bc-ai-chat-panel" hidden style="position:fixed;bottom:84px;right:24px;width:390px;max-width:calc(100vw - 32px);background:var(--ivory);border:1.5px solid var(--charcoal);border-radius:6px;box-shadow:0 24px 64px rgba(28,29,27,0.24);display:none;flex-direction:column;overflow:hidden;z-index:995;">
          <div style="background:var(--charcoal);color:var(--ivory);padding:1rem 1.15rem;display:flex;justify-content:space-between;align-items:center;">
            <div>
              <span style="font-family:var(--font-mono);font-size:0.62rem;color:#5CD4A5;letter-spacing:0.12em;display:block;">RAG KNOWLEDGE // UU MEREK &amp; NICE 1–45</span>
              <strong style="font-family:var(--font-heading);font-size:0.95rem;">BrandConnect AI Assistant</strong>
            </div>
            <button type="button" id="bc-ai-chat-close" style="background:none;border:none;color:var(--ivory);font-size:1.1rem;cursor:pointer;">✕</button>
          </div>

          <div id="bc-ai-chat-messages" style="padding:1rem;height:290px;overflow-y:auto;display:flex;flex-direction:column;gap:0.75rem;background:var(--ivory-elevated);font-size:0.84rem;line-height:1.55;">
            <div style="background:#FFF;border:1px solid var(--border-sketch-strong);padding:0.75rem 0.9rem;border-radius:4px;">
              <strong style="color:var(--green);display:block;font-size:0.74rem;font-family:var(--font-mono);margin-bottom:0.25rem;">AI TRADEMARK ASSISTANT</strong>
              Halo! Saya asisten pintar BrandConnect. Tanyakan seputar <strong>ketersediaan merek, rekomendasi kelas (1–45), alasan penolakan Pasal 20 &amp; 21, oposisi BRM, atau biaya pendaftaran</strong>. Anda juga bisa meneruskan chat ini ke Spesialis Merek kami kapan saja.
            </div>
          </div>

          <div style="padding:0.5rem 0.85rem;background:rgba(49,91,76,0.08);border-top:1px solid var(--border-sketch);display:flex;justify-content:space-between;align-items:center;gap:0.5rem;">
            <span style="font-size:0.72rem;color:var(--charcoal);font-weight:500;">Butuh validasi hukum Konsultan?</span>
            <button type="button" id="bc-ai-handover-trigger" style="background:var(--green);color:var(--ivory);border:none;border-radius:3px;padding:0.35rem 0.7rem;font-family:var(--font-heading);font-size:0.72rem;font-weight:700;cursor:pointer;">
              Handover ke Spesialis →
            </button>
          </div>

          <form id="bc-ai-chat-form" style="display:flex;border-top:1px solid var(--border-sketch-strong);background:#FFF;">
            <input type="text" id="bc-ai-chat-input" placeholder="Tulis pertanyaan merek Anda..." required style="flex:1;border:none;padding:0.8rem 0.9rem;font-size:0.85rem;outline:none;font-family:var(--font-body);" />
            <button type="submit" style="background:var(--charcoal);color:var(--ivory);border:none;padding:0 1.1rem;font-family:var(--font-heading);font-weight:700;font-size:0.8rem;cursor:pointer;">Kirim</button>
          </form>
        </div>
      </div>

      <!-- 2. GLOBAL AI REPORT MODAL (PRINTABLE / DOWNLOADABLE) -->
      <div class="modal-backdrop" id="bc-report-modal" aria-hidden="true" role="dialog" aria-modal="true">
        <div class="modal-container" style="max-width:780px;">
          <div class="modal-header">
            <div>
              <span class="eyebrow" id="bc-rep-ref">OFFICIAL AI PRE-SCREENING REPORT</span>
              <h2 class="modal-title" id="bc-rep-title">Laporan Analisis Merek</h2>
            </div>
            <button type="button" class="modal-close" data-bc-close-modal aria-label="Tutup">✕</button>
          </div>
          <div id="bc-rep-body" style="padding:1.5rem;max-height:70vh;overflow-y:auto;font-size:0.88rem;line-height:1.65;"></div>
          <div style="padding:1rem 1.5rem;border-top:1px solid var(--border-sketch-strong);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;background:var(--ivory-elevated);">
            <button type="button" class="btn btn-secondary btn-sm" id="bc-rep-print-btn">🖨️ Cetak / Simpan PDF</button>
            <div style="display:flex;gap:0.65rem;">
              <button type="button" class="btn btn-secondary btn-sm" id="bc-rep-handover-btn">Konsultasikan Laporan Ini</button>
              <button type="button" class="btn btn-primary btn-sm" id="bc-rep-order-btn">Daftar Merek Ini Sekarang →</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. GLOBAL SERVICE ORDER MODAL (ALL 8 SERVICES) -->
      <div class="modal-backdrop" id="bc-order-modal" aria-hidden="true" role="dialog" aria-modal="true">
        <div class="modal-container" style="max-width:640px;">
          <div class="modal-header">
            <div>
              <span class="eyebrow">PEMESANAN LAYANAN PROFESIONAL // BRANDCONNECT</span>
              <h2 class="modal-title">Order Layanan <span class="serif-italic">Merek &amp; HAKI.</span></h2>
            </div>
            <button type="button" class="modal-close" data-bc-close-modal aria-label="Tutup">✕</button>
          </div>
          <form id="bc-global-order-form" class="consultation-form">
            <div class="form-row-split">
              <div class="form-group">
                <label>NAMA PEMOHON / KLIEN *</label>
                <input type="text" id="bc-ord-name" required />
              </div>
              <div class="form-group">
                <label>EMAIL &amp; WHATSAPP *</label>
                <input type="text" id="bc-ord-contact" required />
              </div>
            </div>
            <div class="form-row-split">
              <div class="form-group">
                <label>PILIH LAYANAN PROFESIONAL *</label>
                <select id="bc-ord-service"></select>
              </div>
              <div class="form-group">
                <label>KATEGORI PEMOHON *</label>
                <select id="bc-ord-applicant">
                  <option value="umkm">Jalur UMKM (Binaan / Rekomendasi Dinas)</option>
                  <option value="perorangan">Jalur Umum — Perorangan</option>
                  <option value="badan_usaha">Jalur Umum — Badan Usaha (PT / CV)</option>
                </select>
              </div>
            </div>
            <div class="form-row-split">
              <div class="form-group">
                <label>NAMA MEREK / OBJEK HAKI *</label>
                <input type="text" id="bc-ord-trademark" required placeholder="Contoh: ZENOVA LIVING" />
              </div>
              <div class="form-group">
                <label>KELAS MEREK (NICE 1–45) *</label>
                <input type="text" id="bc-ord-class" required placeholder="Contoh: Kelas 35" />
              </div>
            </div>
            <div class="form-group">
              <label>CATATAN / DETAIL PRODUK &amp; DOKUMEN</label>
              <textarea id="bc-ord-notes" rows="3" placeholder="Jelaskan secara singkat produk/jasa atau nomor permohonan terkait..."></textarea>
            </div>
            <div style="padding:0.9rem 1.1rem;background:var(--ivory-subtle);border:1px solid var(--border-sketch-strong);border-radius:4px;display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
              <div>
                <span style="font-family:var(--font-mono);font-size:0.68rem;color:var(--pencil);display:block;">ESTIMASI BIAYA LAYANAN TERKONFIGURASI:</span>
                <strong id="bc-ord-price-display" style="font-family:var(--font-heading);font-size:1.25rem;color:var(--green);">Rp 1.850.000</strong>
              </div>
              <span id="bc-ord-duration-display" style="font-family:var(--font-mono);font-size:0.72rem;color:var(--charcoal);">1–3 Hari Kerja</span>
            </div>
            <div class="form-footer">
              <p class="form-privacy-note">Order ini otomatis membuat berkas kasus di Customer Dashboard &amp; Admin Panel.</p>
              <button type="submit" class="btn btn-primary"><span>Buat Pesanan Layanan</span><span class="btn-arrow">→</span></button>
            </div>
          </form>
          <div id="bc-ord-success" hidden style="padding:2rem;text-align:center;">
            <span class="success-badge" id="bc-ord-success-badge">ORDER BERHASIL DIBUAT</span>
            <h3 style="margin:0.85rem 0 0.5rem;font-family:var(--font-heading);">Pesanan &amp; Berkas Kasus Telah Aktif!</h3>
            <p id="bc-ord-success-msg" style="font-size:0.9rem;color:var(--pencil);margin-bottom:1.5rem;"></p>
            <div style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap;">
              <a href="dashboard.html" class="btn btn-primary">Lihat di Customer Dashboard →</a>
              <button type="button" class="btn btn-secondary" data-bc-close-modal>Tutup</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. HUMAN EXPERT HANDOVER MODAL (SECTION F) -->
      <div class="modal-backdrop" id="bc-handover-modal" aria-hidden="true" role="dialog" aria-modal="true">
        <div class="modal-container" style="max-width:620px;">
          <div class="modal-header">
            <div>
              <span class="eyebrow">HUMAN EXPERT HANDOVER // TRANSFER KE SPESIALIS</span>
              <h2 class="modal-title">Konsultasi Spesialis <span class="serif-italic">Merek.</span></h2>
            </div>
            <button type="button" class="modal-close" data-bc-close-modal aria-label="Tutup">✕</button>
          </div>
          <form id="bc-handover-form" class="consultation-form">
            <div class="tm-honest-status-banner" style="margin-bottom:1rem;">
              <strong>Transfer Konteks Otomatis:</strong> Sistem menyertakan hasil pencarian merek terakhir, penilaian pra-skrining AI, serta ringkasan percakapan Anda agar Spesialis Merek BrandConnect dapat langsung menindaklanjuti tanpa Anda harus mengulang dari awal.
            </div>
            <div class="form-row-split">
              <div class="form-group">
                <label>NAMA LENGKAP *</label>
                <input type="text" id="bc-ho-name" required />
              </div>
              <div class="form-group">
                <label>WHATSAPP / EMAIL *</label>
                <input type="text" id="bc-ho-phone" required />
              </div>
            </div>
            <div class="form-row-split">
              <div class="form-group">
                <label>NAMA MEREK *</label>
                <input type="text" id="bc-ho-trademark" required />
              </div>
              <div class="form-group">
                <label>KATEGORI PRODUK / JASA *</label>
                <input type="text" id="bc-ho-category" required placeholder="Contoh: Kopi Kemasan / Skincare" />
              </div>
            </div>
            <div class="form-group">
              <label>LAYANAN YANG DIMINATI</label>
              <select id="bc-ho-service"></select>
            </div>
            <div class="form-group">
              <label>RINGKASAN HASIL AI &amp; PERTANYAAN ANDA</label>
              <textarea id="bc-ho-summary" rows="3"></textarea>
            </div>
            <div class="form-footer">
              <p class="form-privacy-note">Langsung masuk ke modul Lead Management tim internal BrandConnect.</p>
              <button type="submit" class="btn btn-primary"><span>Kirim ke Spesialis Merek</span><span class="btn-arrow">→</span></button>
            </div>
          </form>
          <div id="bc-ho-success" hidden style="padding:2rem;text-align:center;">
            <span class="success-badge" id="bc-ho-success-badge">LEAD HANDOVER TERKIRIM</span>
            <h3 style="margin:0.85rem 0 0.5rem;font-family:var(--font-heading);">Data &amp; Analisis AI Berhasil Diteruskan!</h3>
            <p id="bc-ho-success-msg" style="font-size:0.9rem;color:var(--pencil);margin-bottom:1.5rem;"></p>
            <div style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap;">
              <a href="dashboard.html#consultations" class="btn btn-primary">Pantau di Dashboard Pelanggan →</a>
              <a href="admin.html#leads" class="btn btn-secondary">Lihat di Admin CRM →</a>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(root);

    // Populate service selects
    const ordSelect = document.getElementById('bc-ord-service');
    const hoSelect = document.getElementById('bc-ho-service');
    const updateOrderPricePreview = () => {
      if (!ordSelect) return;
      const srv = state.services.find((s) => s.code === ordSelect.value) || state.services[0];
      const appType = document.getElementById('bc-ord-applicant')?.value || 'umkm';
      const price = appType === 'umkm' && srv.umkmPrice ? srv.umkmPrice : srv.basePrice;
      const priceEl = document.getElementById('bc-ord-price-display');
      const durEl = document.getElementById('bc-ord-duration-display');
      if (priceEl) priceEl.textContent = formatIDR(price);
      if (durEl) durEl.textContent = srv.duration;
    };

    if (ordSelect) {
      ordSelect.innerHTML = state.services.map((s) => `<option value="${s.code}">${s.nameId}</option>`).join('');
      ordSelect.addEventListener('change', updateOrderPricePreview);
      document.getElementById('bc-ord-applicant')?.addEventListener('change', updateOrderPricePreview);
    }
    if (hoSelect) {
      hoSelect.innerHTML = state.services.map((s) => `<option value="${s.nameId}">${s.nameId}</option>`).join('');
    }

    // Close modal buttons
    document.querySelectorAll('[data-bc-close-modal]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-backdrop.active').forEach((m) => {
          m.classList.remove('active');
          m.setAttribute('aria-hidden', 'true');
        });
        document.body.style.overflow = '';
      });
    });

    // Floating AI Chat toggle
    const fab = document.getElementById('bc-ai-fab');
    const chatPanel = document.getElementById('bc-ai-chat-panel');
    const chatClose = document.getElementById('bc-ai-chat-close');
    const chatForm = document.getElementById('bc-ai-chat-form');
    const chatInput = document.getElementById('bc-ai-chat-input');
    const chatMessages = document.getElementById('bc-ai-chat-messages');
    const handoverTrigger = document.getElementById('bc-ai-handover-trigger');

    if (fab && chatPanel) {
      fab.addEventListener('click', () => {
        const isHidden = chatPanel.style.display === 'none' || chatPanel.hidden;
        chatPanel.hidden = !isHidden;
        chatPanel.style.display = isHidden ? 'flex' : 'none';
        if (isHidden && chatInput) chatInput.focus();
      });
    }
    if (chatClose && chatPanel) {
      chatClose.addEventListener('click', () => {
        chatPanel.hidden = true;
        chatPanel.style.display = 'none';
      });
    }

    if (chatForm && chatInput && chatMessages) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;
        chatInput.value = '';

        // Append user bubble
        const uDiv = document.createElement('div');
        uDiv.style.cssText = 'background:var(--charcoal);color:var(--ivory);padding:0.65rem 0.85rem;border-radius:4px;align-self:flex-end;max-width:85%;';
        uDiv.textContent = text;
        chatMessages.appendChild(uDiv);

        const latestBrand = state.searchLogs[0]?.trademarkName || '';
        const aiReply = generateAiAssistantReply(text, latestBrand);

        // Save to AI Conversations store
        if (!state.aiConversations[0]) {
          state.aiConversations.unshift({
            id: Date.now(),
            sessionCode: 'AI-CONV-' + Date.now().toString().slice(-5),
            customerName: state.customerProfile.name,
            trademarkContext: latestBrand || 'Umum',
            messages: [],
            summary: '',
            status: 'active_ai',
            updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' ') + ' WIB'
          });
        }
        state.aiConversations[0].messages.push({ sender: 'user', text });
        state.aiConversations[0].messages.push({ sender: 'ai', text: aiReply });
        state.aiConversations[0].summary = `Pertanyaan terakhir: "${text}"`;
        saveState();

        // Append AI bubble
        const aDiv = document.createElement('div');
        aDiv.style.cssText = 'background:#FFF;border:1px solid var(--border-sketch-strong);padding:0.75rem 0.9rem;border-radius:4px;align-self:flex-start;max-width:92%;';
        aDiv.innerHTML = `<strong style="color:var(--green);display:block;font-size:0.7rem;font-family:var(--font-mono);margin-bottom:0.25rem;">AI TRADEMARK ASSISTANT</strong>` +
          aiReply.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
        chatMessages.appendChild(aDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      });
    }

    if (handoverTrigger) {
      handoverTrigger.addEventListener('click', () => {
        if (chatPanel) {
          chatPanel.hidden = true;
          chatPanel.style.display = 'none';
        }
        openHandoverModal();
      });
    }

    // Order form submission
    const orderForm = document.getElementById('bc-global-order-form');
    if (orderForm) {
      orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const res = createServiceOrder({
          customerName: document.getElementById('bc-ord-name').value,
          customerEmail: state.customerProfile.email,
          customerPhone: document.getElementById('bc-ord-contact').value,
          serviceCode: document.getElementById('bc-ord-service').value,
          applicantType: document.getElementById('bc-ord-applicant').value,
          trademarkName: document.getElementById('bc-ord-trademark').value,
          niceClasses: document.getElementById('bc-ord-class').value,
          notes: document.getElementById('bc-ord-notes').value
        });
        orderForm.hidden = true;
        const succ = document.getElementById('bc-ord-success');
        if (succ) {
          succ.hidden = false;
          document.getElementById('bc-ord-success-badge').textContent = `${res.order.orderNumber} // ${res.trademarkCase.caseNumber}`;
          document.getElementById('bc-ord-success-msg').textContent = `Pesanan layanan "${res.order.serviceName}" untuk merek "${res.order.trademarkName}" (${res.order.niceClasses}) sebesar ${formatIDR(res.order.amount)} telah berhasil dicatat.`;
        }
      });
    }

    // Handover form submission
    const hoForm = document.getElementById('bc-handover-form');
    if (hoForm) {
      hoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const lead = createHandoverLead({
          customerName: document.getElementById('bc-ho-name').value,
          customerPhone: document.getElementById('bc-ho-phone').value,
          trademarkName: document.getElementById('bc-ho-trademark').value,
          productCategory: document.getElementById('bc-ho-category').value,
          requestedService: document.getElementById('bc-ho-service').value,
          conversationSummary: document.getElementById('bc-ho-summary').value
        });
        hoForm.hidden = true;
        const succ = document.getElementById('bc-ho-success');
        if (succ) {
          succ.hidden = false;
          document.getElementById('bc-ho-success-badge').textContent = `HANDOVER BERHASIL // ${lead.leadNumber}`;
          document.getElementById('bc-ho-success-msg').textContent = `Permintaan konsultasi merek "${lead.trademarkName}" beserta riwayat analisis AI telah ditugaskan ke ${lead.assignedTo}.`;
        }
      });
    }
  }

  function openOrderModal(serviceCode, prefillTrademark, prefillClass) {
    injectGlobalWidgets();
    const modal = document.getElementById('bc-order-modal');
    const form = document.getElementById('bc-global-order-form');
    const succ = document.getElementById('bc-ord-success');
    if (!modal) return;
    if (form) form.hidden = false;
    if (succ) succ.hidden = true;

    document.getElementById('bc-ord-name').value = state.customerProfile.name;
    document.getElementById('bc-ord-contact').value = `${state.customerProfile.phone} / ${state.customerProfile.email}`;
    const latest = state.searchLogs[0];
    document.getElementById('bc-ord-trademark').value = prefillTrademark || latest?.trademarkName || '';
    document.getElementById('bc-ord-class').value = prefillClass || latest?.recommendedClasses || 'Kelas 35';

    const srvSelect = document.getElementById('bc-ord-service');
    if (srvSelect && serviceCode) {
      srvSelect.value = serviceCode;
      srvSelect.dispatchEvent(new Event('change'));
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function openHandoverModal(customTrademark, customSummary) {
    injectGlobalWidgets();
    const modal = document.getElementById('bc-handover-modal');
    const form = document.getElementById('bc-handover-form');
    const succ = document.getElementById('bc-ho-success');
    if (!modal) return;
    if (form) form.hidden = false;
    if (succ) succ.hidden = true;

    const latest = state.searchLogs[0];
    const lastConv = state.aiConversations[0];
    document.getElementById('bc-ho-name').value = state.customerProfile.name;
    document.getElementById('bc-ho-phone').value = `${state.customerProfile.phone} / ${state.customerProfile.email}`;
    document.getElementById('bc-ho-trademark').value = customTrademark || latest?.trademarkName || '';
    document.getElementById('bc-ho-category').value = latest?.productCategory || state.businessProfile.industrySector || '';
    document.getElementById('bc-ho-summary').value = customSummary ||
      (latest ? `[Hasil AI ${latest.referenceCode}]: Indeks Daya Pembeda ${latest.distinctivenessIndex}% (${latest.verdict}). ${latest.aiInterpretation}` : '') +
      (lastConv?.summary ? `\n[Ringkasan Chat AI]: ${lastConv.summary}` : '');

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function renderVisualSimilarityHtml(logoMeta, compLogoMeta) {
    if (!logoMeta) return '';
    const swatches = (logoMeta.dominantColors || [])
      .map(
        (c) =>
          `<span style="display:inline-flex;align-items:center;gap:5px;background:#FFF;border:1px solid rgba(26,26,26,0.2);padding:2px 7px;border-radius:3px;font-size:0.74rem;margin-right:6px;margin-bottom:4px;"><span style="width:12px;height:12px;border-radius:2px;background:${c.hex};border:1px solid #222;display:inline-block;"></span><strong>${c.nameId}</strong> <code>${c.hex}</code> (${c.pct}%)</span>`
      )
      .join('');

    const matchesHtml = (logoMeta.visualMatches || [])
      .map(
        (m) => `
        <div style="border:1px solid var(--border-sketch-strong);border-radius:5px;padding:0.85rem;background:#FFFFFF;display:flex;flex-direction:column;gap:0.45rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:0.6rem;">
            <div style="display:flex;align-items:center;gap:0.6rem;">
              <div style="flex-shrink:0;width:48px;height:48px;border:1px solid rgba(26,26,26,0.15);border-radius:4px;display:flex;align-items:center;justify-content:center;background:var(--ivory);">${m.svgPreview}</div>
              <div>
                <div style="font-family:var(--font-heading);font-weight:800;font-size:0.84rem;color:var(--charcoal);">${m.name}</div>
                <div style="font-family:var(--font-mono);font-size:0.68rem;color:var(--pencil);">No: ${m.appNo} · ${m.niceClass}</div>
              </div>
            </div>
            <div style="text-align:right;flex-shrink:0;">
              <div style="font-family:var(--font-heading);font-size:1.15rem;font-weight:800;color:${m.riskColor};">${m.totalVisualSim}%</div>
              <span style="font-family:var(--font-mono);font-size:0.64rem;padding:2px 6px;border-radius:3px;background:${m.riskColor};color:#FFF;font-weight:600;">${m.riskBadge}</span>
            </div>
          </div>
          <div style="width:100%;height:6px;background:#E5E0D5;border-radius:3px;overflow:hidden;">
            <div style="width:${m.totalVisualSim}%;height:100%;background:${m.riskColor};"></div>
          </div>
          <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:0.4rem;font-family:var(--font-mono);font-size:0.69rem;color:var(--charcoal);background:var(--ivory-subtle);padding:4px 8px;border-radius:3px;">
            <span>Bentuk &amp; dHash: <strong>${m.shapeSim}%</strong></span>
            <span>Komposisi Warna: <strong>${m.colorSim}%</strong></span>
            <span>Vienna: <strong>${m.viennaCode}</strong></span>
          </div>
          <div style="font-size:0.75rem;color:var(--pencil);line-height:1.45;">${m.note}</div>
        </div>
      `
      )
      .join('');

    let headToHeadHtml = '';
    if (compLogoMeta) {
      const cmp = compareTwoLogos(logoMeta, compLogoMeta);
      if (cmp) {
        headToHeadHtml = `
          <div style="margin-top:1rem;padding:1rem;border:2px solid ${cmp.badgeColor};border-radius:6px;background:#FFF9F5;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;margin-bottom:0.75rem;">
              <div>
                <span style="font-family:var(--font-mono);font-size:0.68rem;font-weight:700;color:${cmp.badgeColor};letter-spacing:0.08em;">HASIL PERBANDINGAN VISUAL 1-ON-1 (LOGO ANDA VS LOGO PEMBANDING)</span>
                <h4 style="font-family:var(--font-heading);font-size:1rem;font-weight:800;color:var(--charcoal);margin-top:2px;">${cmp.verdict}</h4>
              </div>
              <div style="text-align:right;">
                <span style="font-family:var(--font-heading);font-size:1.6rem;font-weight:800;color:${cmp.badgeColor};">${cmp.totalSim}%</span>
                <div style="font-family:var(--font-mono);font-size:0.68rem;color:var(--pencil);">Kemiripan Visual Total</div>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0.75rem;margin-bottom:0.75rem;">
              <div style="display:flex;align-items:center;gap:0.65rem;background:#FFF;padding:0.6rem;border:1px solid rgba(26,26,26,0.15);border-radius:4px;">
                ${logoMeta.previewDataUrl ? `<img src="${logoMeta.previewDataUrl}" alt="Logo Anda" style="width:48px;height:48px;object-fit:contain;border:1px solid #DDD;border-radius:4px;background:#FFF;" />` : ''}
                <div>
                  <strong style="font-size:0.78rem;display:block;">Logo Anda: ${logoMeta.name}</strong>
                  <span style="font-family:var(--font-mono);font-size:0.68rem;color:var(--pencil);">dHash: ${logoMeta.dHash} · Simetri: ${logoMeta.symmetryH}%</span>
                </div>
              </div>
              <div style="display:flex;align-items:center;gap:0.65rem;background:#FFF;padding:0.6rem;border:1px solid rgba(26,26,26,0.15);border-radius:4px;">
                ${compLogoMeta.previewDataUrl ? `<img src="${compLogoMeta.previewDataUrl}" alt="Logo Pembanding" style="width:48px;height:48px;object-fit:contain;border:1px solid #DDD;border-radius:4px;background:#FFF;" />` : ''}
                <div>
                  <strong style="font-size:0.78rem;display:block;">Logo Pembanding: ${compLogoMeta.name}</strong>
                  <span style="font-family:var(--font-mono);font-size:0.68rem;color:var(--pencil);">dHash: ${compLogoMeta.dHash} · Simetri: ${compLogoMeta.symmetryH}%</span>
                </div>
              </div>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:1rem;font-family:var(--font-mono);font-size:0.74rem;background:#FFF;padding:0.55rem 0.85rem;border-radius:4px;border:1px solid rgba(26,26,26,0.12);margin-bottom:0.55rem;">
              <span>• Kemiripan Bentuk &amp; Siluet: <strong>${cmp.shapeSim}%</strong></span>
              <span>• Kemiripan Bit dHash: <strong>${cmp.dHashSim}%</strong></span>
              <span>• Kemiripan Spektrum Warna: <strong>${cmp.colorSim}%</strong></span>
              <span>• Kategori Vienna Sama: <strong>${cmp.sameVienna ? 'Ya (Sejenis)' : 'Tidak (Berbeda)'}</strong></span>
            </div>
            <p style="font-size:0.8rem;color:var(--charcoal);line-height:1.5;margin:0;">${cmp.legalNote}</p>
          </div>
        `;
      }
    }

    return `
      <div style="margin-top:1.15rem;padding:1.15rem;border:1.5px solid var(--green);border-radius:6px;background:#FAF8F3;text-align:left;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:0.75rem;border-bottom:1px dashed var(--border-sketch-strong);padding-bottom:0.75rem;margin-bottom:0.85rem;">
          <div style="display:flex;align-items:center;gap:0.75rem;">
            ${logoMeta.previewDataUrl ? `<img src="${logoMeta.previewDataUrl}" alt="Uploaded Logo" style="width:54px;height:54px;object-fit:contain;background:#FFF;border:1.5px solid var(--charcoal);border-radius:4px;padding:3px;" />` : ''}
            <div>
              <span style="font-family:var(--font-mono);font-size:0.68rem;font-weight:700;color:var(--green);letter-spacing:0.08em;">AI COMPUTER VISION // ANALISIS KEMIRIPAN VISUAL &amp; KLASIFIKASI VIENNA</span>
              <h4 style="font-family:var(--font-heading);font-size:1rem;font-weight:800;color:var(--charcoal);margin:2px 0;">${logoMeta.name} (${logoMeta.width}×${logoMeta.height} px · ${logoMeta.sizeKB} KB)</h4>
              <span style="font-family:var(--font-mono);font-size:0.72rem;color:var(--pencil);">Klasifikasi Unsur Lukisan WIPO Vienna: <strong>${logoMeta.viennaCode}</strong> — ${logoMeta.viennaTitle}</span>
            </div>
          </div>
          <div style="text-align:right;">
            <span style="font-family:var(--font-mono);font-size:0.68rem;color:var(--pencil);display:block;">KEMIRIPAN VISUAL TERTINGGI</span>
            <strong style="font-family:var(--font-heading);font-size:1.35rem;color:${logoMeta.maxVisualSimilarity >= 72 ? '#B91C1C' : logoMeta.maxVisualSimilarity >= 56 ? '#B45309' : 'var(--green)'};">${logoMeta.maxVisualSimilarity}%</strong>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(175px,1fr));gap:0.65rem;margin-bottom:0.85rem;font-size:0.76rem;">
          <div style="background:#FFF;padding:0.55rem 0.75rem;border-radius:4px;border:1px solid rgba(26,26,26,0.12);">
            <span style="font-family:var(--font-mono);font-size:0.66rem;color:var(--pencil);display:block;">SIDIK JARI 64-BIT (dHash)</span>
            <code style="font-weight:700;color:var(--charcoal);">${logoMeta.dHash}</code>
          </div>
          <div style="background:#FFF;padding:0.55rem 0.75rem;border-radius:4px;border:1px solid rgba(26,26,26,0.12);">
            <span style="font-family:var(--font-mono);font-size:0.66rem;color:var(--pencil);display:block;">SIMETRI GEOMETRI PIKSEL</span>
            <strong>H: ${logoMeta.symmetryH}% · V: ${logoMeta.symmetryV}% · Radial: ${logoMeta.radialScore}%</strong>
          </div>
          <div style="background:#FFF;padding:0.55rem 0.75rem;border-radius:4px;border:1px solid rgba(26,26,26,0.12);">
            <span style="font-family:var(--font-mono);font-size:0.66rem;color:var(--pencil);display:block;">KOMPLEKSITAS TEPI &amp; RASIO</span>
            <strong>${logoMeta.edgeComplexityPct}% (${logoMeta.isSquare ? '1:1 Persegi Ideal' : 'Rasio ' + logoMeta.aspectRatio})</strong>
          </div>
          <div style="background:#FFF;padding:0.55rem 0.75rem;border-radius:4px;border:1px solid rgba(26,26,26,0.12);">
            <span style="font-family:var(--font-mono);font-size:0.66rem;color:var(--pencil);display:block;">AUDIT LATAR ETIKET DJKI</span>
            <strong>${logoMeta.bgVerdict}</strong>
          </div>
        </div>

        <div style="margin-bottom:0.85rem;">
          <div style="font-family:var(--font-mono);font-size:0.68rem;font-weight:700;color:var(--charcoal);margin-bottom:0.35rem;">PALET WARNA TERDETEKSI &amp; AUTO-DRAFT URAIAN WARNA FORMULIR DJKI:</div>
          <div>${swatches}</div>
          <div style="margin-top:0.35rem;font-size:0.78rem;color:var(--green);font-weight:600;background:#FFF;padding:0.45rem 0.7rem;border-radius:4px;border-left:3px solid var(--green);">
            "${logoMeta.djkiColorDescription}"
          </div>
        </div>

        <div>
          <div style="font-family:var(--font-mono);font-size:0.7rem;font-weight:700;color:var(--charcoal);margin-bottom:0.5rem;">
            MATRIKS KEMIRIPAN VISUAL TERHADAP POLA MEREK LUKISAN TERDAFTAR (TOP 3 VISUAL MATCHES — PASAL 21 UU MEREK):
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:0.75rem;">
            ${matchesHtml}
          </div>
        </div>

        ${headToHeadHtml}
      </div>
    `;
  }

  function openReportModal(searchLogId) {
    injectGlobalWidgets();
    const log = searchLogId
      ? state.searchLogs.find((l) => String(l.id) === String(searchLogId) || l.referenceCode === searchLogId)
      : state.searchLogs[0];
    if (!log) return;

    const modal = document.getElementById('bc-report-modal');
    const refEl = document.getElementById('bc-rep-ref');
    const titleEl = document.getElementById('bc-rep-title');
    const bodyEl = document.getElementById('bc-rep-body');
    if (!modal || !bodyEl) return;

    if (refEl) refEl.textContent = `LAPORAN PRA-SKRINING AI // REF: ${log.referenceCode}`;
    if (titleEl) titleEl.textContent = `Analisis Merek: ${log.trademarkName}`;

    bodyEl.innerHTML = `
      <div style="border:1.5px solid var(--charcoal);border-radius:4px;padding:1.25rem;background:#FFF;margin-bottom:1.25rem;">
        <div style="display:flex;justify-content:space-between;border-bottom:1px dashed var(--border-sketch-strong);padding-bottom:0.75rem;margin-bottom:1rem;flex-wrap:wrap;gap:0.5rem;">
          <div>
            <span style="font-family:var(--font-mono);font-size:0.72rem;color:var(--pencil);">OBJEK ANALISIS MEREK:</span>
            <h3 style="font-family:var(--font-heading);font-size:1.35rem;font-weight:800;">${log.trademarkName}</h3>
          </div>
          <div style="text-align:right;">
            <span style="font-family:var(--font-mono);font-size:0.72rem;color:var(--green);font-weight:700;">INDEKS DAYA PEMBEDA: ${log.distinctivenessIndex}%</span>
            <div style="font-family:var(--font-heading);font-size:0.82rem;font-weight:700;">${log.verdict}</div>
          </div>
        </div>

        <h4 style="font-family:var(--font-mono);font-size:0.72rem;letter-spacing:0.1em;color:var(--green);margin-bottom:0.4rem;">1. HASIL PENELUSURAN &amp; PARAMETER (SEARCH RESULTS)</h4>
        <p style="margin-bottom:0.9rem;">
          • <strong>Metode Pencarian:</strong> ${log.searchMode.toUpperCase()} &nbsp;|&nbsp; <strong>Waktu:</strong> ${log.timestamp}<br/>
          • <strong>Rekomendasi Kelas (Nice Classification):</strong> ${log.recommendedClasses}<br/>
          • <strong>Evaluasi Fonetik:</strong> ${log.phoneticStatus} &nbsp;|&nbsp; <strong>Evaluasi Visual:</strong> ${log.visualStatus}<br/>
          • <strong>Kepatuhan UU Merek:</strong> ${log.statuteStatus}
          ${log.logoMeta && log.logoMeta.djkiColorDescription ? `<br/>• <strong>Klasifikasi Figuratif Vienna:</strong> ${log.logoMeta.viennaCode} (${log.logoMeta.viennaTitle})<br/>• <strong>Sidik Jari Visual (dHash 64-bit):</strong> <code>${log.logoMeta.dHash}</code> &nbsp;|&nbsp; <strong>Kemiripan Visual Tertinggi:</strong> ${log.logoMeta.maxVisualSimilarity}%<br/>• <strong>Draf Uraian Warna Etiket DJKI:</strong> ${log.logoMeta.djkiColorDescription}` : ''}
        </p>

        ${log.logoMeta ? renderVisualSimilarityHtml(log.logoMeta, log.compLogoMeta) : ''}

        <h4 style="font-family:var(--font-mono);font-size:0.72rem;letter-spacing:0.1em;color:var(--green);margin-top:1rem;margin-bottom:0.4rem;">2. INTERPRETASI PRA-SKRINING AI (AI INTERPRETATION)</h4>
        <p style="margin-bottom:0.9rem;background:var(--ivory);padding:0.75rem;border-radius:4px;border-left:3px solid var(--green);">
          ${log.aiInterpretation}
        </p>

        <h4 style="font-family:var(--font-mono);font-size:0.72rem;letter-spacing:0.1em;color:var(--charcoal);margin-bottom:0.4rem;">3. REKOMENDASI &amp; PENILAIAN HUKUM PROFESIONAL (PROFESSIONAL LEGAL ASSESSMENT)</h4>
        <p style="margin-bottom:0.5rem;background:var(--ivory-subtle);padding:0.75rem;border-radius:4px;border-left:3px solid var(--charcoal);">
          ${log.professionalAssessment}
        </p>
      </div>
      <div style="font-size:0.75rem;color:var(--pencil);line-height:1.5;">
        <strong>Disclaimer Resmi:</strong> ${state.settings.aiDisclaimer}
      </div>
    `;

    document.getElementById('bc-rep-print-btn').onclick = () => window.print();
    document.getElementById('bc-rep-handover-btn').onclick = () => {
      modal.classList.remove('active');
      openHandoverModal(log.trademarkName);
    };
    document.getElementById('bc-rep-order-btn').onclick = () => {
      modal.classList.remove('active');
      openOrderModal('SRV-REG-01', log.trademarkName, log.recommendedClasses);
    };

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  document.addEventListener('DOMContentLoaded', () => {
    injectGlobalWidgets();
  });

  window.BCStore = {
    getState: () => state,
    saveState,
    logActivity,
    formatIDR,
    NICE_CLASSES_DB,
    VISUAL_FIGURATIVE_DB,
    analyzeLogoPixels,
    compareTwoLogos,
    renderVisualSimilarityHtml,
    recommendClasses,
    analyzeTrademark,
    generateAiAssistantReply,
    createServiceOrder,
    createHandoverLead,
    openOrderModal,
    openHandoverModal,
    openReportModal,
    resetDemoData: () => {
      localStorage.removeItem(STORAGE_KEY);
      state = loadState();
      window.location.reload();
    }
  };
})();
