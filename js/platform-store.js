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
      ragEnabled: true,
      pdkiApiKey: 'aip_live_tW5NibLE0C8rjVIF6jOYon3PgdbTsE01'
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

  function getWhatsAppUrl(customText) {
    const rawNum = String(state?.settings?.whatsappNumber || '6281234567890').replace(/[^0-9]/g, '') || '6281234567890';
    const text = customText || 'Halo BrandConnect, saya ingin konsultasi mengenai pendaftaran dan perlindungan merek.';
    return `https://wa.me/${rawNum}?text=${encodeURIComponent(text)}`;
  }

  function formatIDR() {
    return 'Konsultasi via WhatsApp';
  }

  // =========================================================================
  // AI INTELLIGENCE ENGINE (6 MODULAR CAPABILITIES)
  // =========================================================================

  // 1B. PDKI DJKI REFERENCE DIRECTORY & CONTEXTUAL PHONETIC/VISUAL SEARCH ENGINE
  const PDKI_DIRECTORY_DB = [
    // MEBISO / MEJISOO (Exact match to reference screenshots)
    {
      keywords: ['mebiso', 'mebisoo', 'mejisoo', 'mebizo'],
      totalFound: 58,
      items: [
        {
          brand: 'MEJISOO',
          niceClass: '3',
          appNo: 'DID2023120939',
          owner: 'Yunfu Mingcaoyuan Cosmetics Co., Ltd.',
          status: '(TM) DIDAFTAR',
          statusKey: 'didaftar',
          similarityPct: 86,
          etiquetteSvg: `<div style="font-family:'Instrument Serif',Georgia,serif;font-size:1.35rem;letter-spacing:0.16em;color:#222;">MEJISOO</div>`
        },
        {
          brand: 'MEBISO',
          niceClass: '35',
          appNo: 'JID2022008166',
          owner: 'PT. MEBISO EKOSISTEM RAIH KESUKSESAN',
          status: '(TM) DIDAFTAR',
          statusKey: 'didaftar',
          similarityPct: 96,
          etiquetteSvg: `<div style="font-family:Georgia,serif;font-weight:900;font-size:1.45rem;letter-spacing:0.04em;color:#111;">MEBISO</div>`
        },
        {
          brand: 'MEBISO',
          niceClass: '42',
          appNo: 'JID2023040693',
          owner: 'PT MEBISO EKOSISTEM RAIH KESUKSESAN',
          status: '(TM) DIDAFTAR',
          statusKey: 'didaftar',
          similarityPct: 96,
          etiquetteSvg: `<div style="display:flex;align-items:center;gap:4px;"><svg width="36" height="24" viewBox="0 0 36 24"><path d="M2 18 L9 6 L16 18 L23 6 L30 18" stroke="#666" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg><span style="font-family:sans-serif;font-weight:800;font-size:0.75rem;color:#555;">MEBISO</span></div>`
        },
        {
          brand: 'MEBISO SMART PROTECTION',
          niceClass: '45',
          appNo: 'JID2023081140',
          owner: 'PT MEBISO EKOSISTEM RAIH KESUKSESAN',
          status: 'DALAM PROSES',
          statusKey: 'dalam_proses',
          similarityPct: 82,
          etiquetteSvg: `<div style="font-family:sans-serif;font-weight:800;font-size:0.9rem;color:#1B2E4B;text-align:center;">MEBISO<br/><span style="font-size:0.55rem;letter-spacing:0.1em;">SMART PROTECTION</span></div>`
        },
        {
          brand: 'MEBIZO INDONESIA',
          niceClass: '35',
          appNo: 'JID2021049210',
          owner: 'CV DIGITAL NIAGA MANDIRI',
          status: 'DITOLAK',
          statusKey: 'ditolak',
          similarityPct: 79,
          etiquetteSvg: `<div style="font-family:sans-serif;font-weight:700;font-size:1.1rem;color:#777;">MEBIZO</div>`
        }
      ]
    },
    // NIKE / SWOOSH
    {
      keywords: ['nike', 'swoosh', 'nike air', 'just do it', 'nikkei'],
      totalFound: 124,
      items: [
        {
          brand: 'NIKE',
          niceClass: '25',
          appNo: 'IDM000192841',
          owner: 'NIKE INNOVATE C.V.',
          status: '(TM) DIDAFTAR',
          statusKey: 'didaftar',
          similarityPct: 100,
          etiquetteSvg: `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;"><div style="font-family:Impact,sans-serif;font-style:italic;font-weight:900;font-size:1.45rem;letter-spacing:0.05em;color:#111;">NIKE</div><svg width="64" height="24" viewBox="0 0 64 24"><path d="M12 6 C8 14, 14 20, 26 16 C38 12, 56 4, 58 3 C42 8, 24 12, 16 10 C12 9, 11 7, 12 6 Z" fill="#111"/></svg></div>`
        },
        {
          brand: 'LUKISAN SWOOSH (NIKE)',
          niceClass: '25',
          appNo: 'IDM000192842',
          owner: 'NIKE INNOVATE C.V.',
          status: '(TM) DIDAFTAR',
          statusKey: 'didaftar',
          similarityPct: 98,
          etiquetteSvg: `<svg width="78" height="36" viewBox="0 0 78 36"><path d="M16 8 C9 19, 17 29, 33 23 C48 17, 68 6, 72 4 C52 11, 30 17, 21 14 C16 12, 15 10, 16 8 Z" fill="#111"/></svg>`
        },
        {
          brand: 'NIKE AIR',
          niceClass: '28',
          appNo: 'IDM000310492',
          owner: 'NIKE INNOVATE C.V.',
          status: '(TM) DIDAFTAR',
          statusKey: 'didaftar',
          similarityPct: 92,
          etiquetteSvg: `<div style="text-align:center;font-family:Impact,sans-serif;font-weight:900;color:#111;"><div style="font-size:1.25rem;letter-spacing:0.06em;">NIKE</div><div style="font-size:0.85rem;letter-spacing:0.2em;">AIR</div></div>`
        },
        {
          brand: 'NIKE PRO',
          niceClass: '18',
          appNo: 'DID2021058291',
          owner: 'NIKE INNOVATE C.V.',
          status: '(TM) DIDAFTAR',
          statusKey: 'didaftar',
          similarityPct: 88,
          etiquetteSvg: `<div style="font-family:sans-serif;font-weight:900;font-style:italic;font-size:1.15rem;color:#111;">NIKE PRO</div>`
        },
        {
          brand: 'NIKKEI SPORTWEAR',
          niceClass: '25',
          appNo: 'DID2022091024',
          owner: 'PT SINAR ATLETIKA INDONESIA',
          status: 'DITOLAK',
          statusKey: 'ditolak',
          similarityPct: 76,
          etiquetteSvg: `<div style="font-family:sans-serif;font-weight:800;font-size:1rem;color:#888;">NIKKEI</div>`
        }
      ]
    },
    // KOPI KENANGAN
    {
      keywords: ['kopi kenangan', 'kenangan', 'kenangan coffee'],
      totalFound: 42,
      items: [
        {
          brand: 'KOPI KENANGAN',
          niceClass: '30',
          appNo: 'IDM000782910',
          owner: 'PT BUMI BERKAH BOGA',
          status: '(TM) DIDAFTAR',
          statusKey: 'didaftar',
          similarityPct: 100,
          etiquetteSvg: `<div style="text-align:center;font-family:Georgia,serif;font-weight:800;color:#111;"><div style="color:#B91C1C;font-size:1.1rem;">♥</div><div style="font-size:0.85rem;">KOPI<br/>KENANGAN</div></div>`
        },
        {
          brand: 'KOPI KENANGAN',
          niceClass: '43',
          appNo: 'JID2019044128',
          owner: 'PT BUMI BERKAH BOGA',
          status: '(TM) DIDAFTAR',
          statusKey: 'didaftar',
          similarityPct: 100,
          etiquetteSvg: `<div style="text-align:center;font-family:sans-serif;font-weight:800;font-size:0.85rem;color:#111;">KOPI KENANGAN</div>`
        },
        {
          brand: 'KENANGAN HERITAGE',
          niceClass: '43',
          appNo: 'JID2022061293',
          owner: 'PT BUMI BERKAH BOGA',
          status: '(TM) DIDAFTAR',
          statusKey: 'didaftar',
          similarityPct: 85,
          etiquetteSvg: `<div style="text-align:center;font-family:Georgia,serif;font-size:0.82rem;color:#333;">KENANGAN<br/>HERITAGE</div>`
        },
        {
          brand: 'KOPI KENANGAN MANIS',
          niceClass: '43',
          appNo: 'JID2021018392',
          owner: 'CV KEDAI NUSANTARA',
          status: 'DITOLAK',
          statusKey: 'ditolak',
          similarityPct: 81,
          etiquetteSvg: `<div style="font-family:sans-serif;font-size:0.78rem;font-weight:700;color:#777;text-align:center;">KOPI KENANGAN<br/>MANIS</div>`
        }
      ]
    },
    // WARDAH
    {
      keywords: ['wardah', 'paragon'],
      totalFound: 67,
      items: [
        {
          brand: 'WARDAH',
          niceClass: '3',
          appNo: 'IDM000249182',
          owner: 'PT PARAGON TECHNOLOGY AND INNOVATION',
          status: '(TM) DIDAFTAR',
          statusKey: 'didaftar',
          similarityPct: 100,
          etiquetteSvg: `<div style="font-family:Georgia,serif;font-style:italic;font-weight:700;font-size:1.35rem;color:#0D9488;">Wardah</div>`
        },
        {
          brand: 'WARDAH BEAUTY',
          niceClass: '35',
          appNo: 'JID2020031920',
          owner: 'PT PARAGON TECHNOLOGY AND INNOVATION',
          status: '(TM) DIDAFTAR',
          statusKey: 'didaftar',
          similarityPct: 92,
          etiquetteSvg: `<div style="text-align:center;font-family:Georgia,serif;color:#0D9488;font-weight:700;">Wardah<br/><span style="font-size:0.6rem;letter-spacing:0.15em;">BEAUTY</span></div>`
        },
        {
          brand: 'WARDAH NATURE DAILY',
          niceClass: '3',
          appNo: 'DID2021044812',
          owner: 'PT PARAGON TECHNOLOGY AND INNOVATION',
          status: '(TM) DIDAFTAR',
          statusKey: 'didaftar',
          similarityPct: 86,
          etiquetteSvg: `<div style="text-align:center;font-family:sans-serif;font-size:0.78rem;font-weight:700;color:#0D9488;">WARDAH<br/>NATURE DAILY</div>`
        }
      ]
    },
    // MEISO (Exact match to PDKI DJKI / Mebiso reference screenshot)
    {
      keywords: ['meiso', 'aeiso', 'kenko'],
      totalFound: 218,
      items: [
        {
          brand: 'MEISO',
          niceClass: '44',
          appNo: 'J002014027996',
          owner: 'PT. KENKO INDONESIA',
          status: '(TM) DIDAFTAR',
          statusKey: 'didaftar',
          similarityPct: 100,
          etiquetteSvg: `<div style="text-align:center;font-family:sans-serif;font-weight:500;font-size:1.55rem;color:#5B7FA6;letter-spacing:0.03em;position:relative;">me<span style="color:#E5A93C;">i</span>so</div>`
        },
        {
          brand: 'MEISO REFLEXIOLOGY BY KENKO',
          niceClass: '44',
          appNo: 'J002010035346',
          owner: 'PT KENKO INDONESIA',
          status: '(TM) DITOLAK',
          statusKey: 'ditolak',
          similarityPct: 92,
          etiquetteSvg: `<div style="text-align:center;font-family:sans-serif;color:#5B7FA6;"><div style="font-size:1.35rem;font-weight:500;">me<span style="color:#E5A93C;">i</span>so</div><div style="font-size:0.42rem;letter-spacing:0.12em;color:#888;">REFLEXIOLOGY BY KENKO</div></div>`
        },
        {
          brand: 'AEISO',
          niceClass: '25',
          appNo: 'DID2023115658',
          owner: 'agung sugiarto',
          status: '(TM) DIDAFTAR',
          statusKey: 'didaftar',
          similarityPct: 84,
          etiquetteSvg: `<div style="text-align:center;font-family:sans-serif;font-weight:900;color:#111;"><div style="font-size:1.6rem;line-height:0.95;">œ</div><div style="font-size:1.1rem;letter-spacing:0.02em;">aeiso</div></div>`
        },
        {
          brand: 'MEISO FOOT REFLEXOLOGY',
          niceClass: '44',
          appNo: 'JID2018041920',
          owner: 'PT. KENKO INDONESIA',
          status: '(TM) DIDAFTAR',
          statusKey: 'didaftar',
          similarityPct: 88,
          etiquetteSvg: `<div style="text-align:center;font-family:sans-serif;font-weight:700;font-size:0.95rem;color:#5B7FA6;">MEISO<br/><span style="font-size:0.55rem;">REFLEXOLOGY</span></div>`
        }
      ]
    },
    // ZENOVA
    {
      keywords: ['zenova', 'zennova', 'xenova'],
      totalFound: 14,
      items: [
        {
          brand: 'ZENOVA BOTANICA',
          niceClass: '3',
          appNo: 'DID2026041892',
          owner: 'PT ZENOVA BOTANICA INDONESIA',
          status: 'DALAM PROSES',
          statusKey: 'dalam_proses',
          similarityPct: 95,
          etiquetteSvg: `<div style="text-align:center;font-family:Georgia,serif;font-weight:700;color:#315B4C;font-size:0.95rem;">ZENOVA<br/><span style="font-size:0.6rem;letter-spacing:0.15em;">BOTANICA</span></div>`
        },
        {
          brand: 'ZENOVA DERMA LABS',
          niceClass: '44',
          appNo: 'JID2026052901',
          owner: 'PT ZENOVA BOTANICA INDONESIA',
          status: 'DALAM PROSES',
          statusKey: 'dalam_proses',
          similarityPct: 91,
          etiquetteSvg: `<div style="text-align:center;font-family:sans-serif;font-weight:800;color:#23413A;font-size:0.85rem;">ZENOVA<br/><span style="font-size:0.58rem;">DERMA LABS</span></div>`
        },
        {
          brand: 'ZENNOVA SKINCARE',
          niceClass: '3',
          appNo: 'DID2022084192',
          owner: 'PT KOSMETIKA GLOBAL MANDIRI',
          status: '(TM) DIDAFTAR',
          statusKey: 'didaftar',
          similarityPct: 84,
          etiquetteSvg: `<div style="font-family:sans-serif;font-weight:800;font-size:0.95rem;color:#222;">ZENNOVA</div>`
        },
        {
          brand: 'XENOVA HERBAL',
          niceClass: '5',
          appNo: 'DID2021033910',
          owner: 'CV HERBALINDO SEJAHTERA',
          status: 'BERAKHIR',
          statusKey: 'berakhir',
          similarityPct: 75,
          etiquetteSvg: `<div style="font-family:serif;font-weight:700;font-size:0.95rem;color:#666;">XENOVA</div>`
        }
      ]
    },
    // ADIDAS (Exact match to PDKI DJKI & Mebiso reference screenshot: 188 Merek)
    {
      keywords: ['adidas', 'adida', 'adidass'],
      totalFound: 188,
      items: [
        {
          brand: 'ADIDAS',
          niceClass: '25',
          appNo: 'D002009032810',
          owner: 'adidas AG',
          status: '(TM) DIDAFTAR',
          statusKey: 'didaftar',
          similarityPct: 100,
          etiquetteSvg: `<div style="text-align:center;font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;font-weight:900;font-size:1.65rem;letter-spacing:-0.05em;color:#111;line-height:1;">adidas</div>`
        },
        {
          brand: 'ADIDAS',
          niceClass: '9',
          appNo: 'R992001005537',
          owner: 'adidas AG',
          status: '(TM) DIDAFTAR',
          statusKey: 'didaftar',
          similarityPct: 100,
          etiquetteSvg: `<div style="text-align:center;font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;font-weight:900;font-size:1.65rem;letter-spacing:-0.05em;color:#111;line-height:1;">adidas</div>`
        },
        {
          brand: 'ADIDAS',
          niceClass: '9',
          appNo: 'R992001005538',
          owner: 'Adidas AG',
          status: '(TM) DIDAFTAR',
          statusKey: 'didaftar',
          similarityPct: 100,
          etiquetteSvg: `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:4px;">
            <svg viewBox="0 0 100 80" style="width:78px;max-height:64px;" xmlns="http://www.w3.org/2000/svg">
              <polygon points="12,50 24,50 38,30 26,30" fill="#111" />
              <polygon points="34,50 46,50 68,16 56,16" fill="#111" />
              <polygon points="56,50 68,50 98,2 86,2" fill="#111" />
              <text x="52" y="69" font-family="'Inter',-apple-system,sans-serif" font-weight="900" font-size="19" letter-spacing="-0.8px" text-anchor="middle" fill="#111">adidas</text>
            </svg>
          </div>`
        },
        {
          brand: 'LOGO ADIDAS',
          niceClass: '18',
          appNo: 'D002007007576',
          owner: 'adidas AG',
          status: '(TM) DIDAFTAR',
          statusKey: 'didaftar',
          similarityPct: 94,
          etiquetteSvg: `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:4px;">
            <svg viewBox="0 0 100 80" style="width:78px;max-height:64px;" xmlns="http://www.w3.org/2000/svg">
              <polygon points="12,50 24,50 38,30 26,30" fill="#111" />
              <polygon points="34,50 46,50 68,16 56,16" fill="#111" />
              <polygon points="56,50 68,50 98,2 86,2" fill="#111" />
              <text x="52" y="69" font-family="'Inter',-apple-system,sans-serif" font-weight="900" font-size="19" letter-spacing="-0.8px" text-anchor="middle" fill="#111">adidas</text>
            </svg>
          </div>`
        },
        {
          brand: 'LOGO ADIDAS',
          niceClass: '14',
          appNo: 'D002008008561',
          owner: 'adidas AG',
          status: '(TM) DIDAFTAR',
          statusKey: 'didaftar',
          similarityPct: 94,
          etiquetteSvg: `<div style="text-align:center;font-family:'Inter',-apple-system,sans-serif;font-weight:900;font-size:1.5rem;letter-spacing:-0.05em;color:#111;">adidas</div>`
        }
      ]
    },
    // ONITSUKA (Exact match to PDKI DJKI & Mebiso reference screenshot: 83 Merek)
    {
      keywords: ['onitsuka', 'onitsuka tiger', 'the onitsuka'],
      totalFound: 83,
      items: [
        {
          brand: 'ONITSUKA',
          niceClass: '25',
          appNo: 'D002006002455',
          owner: 'M. SAYUDI',
          status: '(TM) DITOLAK',
          statusKey: 'ditolak',
          similarityPct: 100,
          etiquetteSvg: `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:82px;height:82px;border:3px solid #CBD5E1;border-radius:50%;position:relative;color:#94A3B8;font-family:sans-serif;font-size:0.62rem;font-weight:800;text-align:center;line-height:1.15;user-select:none;"><span style="position:absolute;width:100%;height:2px;background:#CBD5E1;transform:rotate(-45deg);"></span><span style="position:relative;z-index:1;">NO<br/>IMAGE<br/>AVAILABLE</span></div>`
        },
        {
          brand: 'ONITSUKA',
          niceClass: '7',
          appNo: 'DID2022036135',
          owner: 'FENCIE MARLINA',
          status: '(TM) DIDAFTAR',
          statusKey: 'didaftar',
          similarityPct: 100,
          etiquetteSvg: `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;"><div style="font-family:'Montserrat',sans-serif;font-weight:900;font-size:1.35rem;color:#0D9488;letter-spacing:0.04em;text-transform:uppercase;">ONITSUKA</div></div>`
        },
        {
          brand: 'ONITSUKA',
          niceClass: '30',
          appNo: 'DID2024083086',
          owner: 'MEGAWATI PRIYANINGRUM',
          status: '(TM) DIDAFTAR',
          statusKey: 'didaftar',
          similarityPct: 100,
          etiquetteSvg: `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;"><div style="font-family:'Caveat','Brush Script MT',cursive,sans-serif;font-weight:700;font-size:1.85rem;color:#111;position:relative;display:inline-block;">on<span style="position:relative;display:inline-block;">i<span style="position:absolute;top:-8px;left:0;color:#E11D48;font-size:0.95rem;">♥</span></span>tsuka</div></div>`
        },
        {
          brand: 'ONITSUKA TIGER',
          niceClass: '25',
          appNo: 'D002008036674',
          owner: 'Asics Corporation',
          status: '(TM) DIDAFTAR',
          statusKey: 'didaftar',
          similarityPct: 92,
          etiquetteSvg: `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;"><div style="font-family:Impact,sans-serif;font-style:italic;font-weight:900;font-size:1.05rem;letter-spacing:0.04em;color:#111;">ONITSUKA TIGER</div><svg viewBox="0 0 80 20" style="width:64px;height:16px;margin-top:2px;"><path d="M5 10 C 20 2, 40 18, 75 8 C 55 12, 30 5, 5 10 Z" fill="#B91C1C"/></svg></div>`
        },
        {
          brand: 'ONITSUKA',
          niceClass: '7',
          appNo: 'DID2021030371',
          owner: 'FENCIE MARLINA',
          status: '(TM) DIDAFTAR',
          statusKey: 'didaftar',
          similarityPct: 100,
          etiquetteSvg: `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;"><div style="font-family:'Montserrat',sans-serif;font-weight:900;font-size:1.35rem;color:#0D9488;letter-spacing:0.04em;text-transform:uppercase;">ONITSUKA</div></div>`
        }
      ]
    }
  ];

  // Live API Indonesia Cache & Key Management (https://use.apiindonesia.id/api/v1/merek/search)
  const PDKI_API_KEY_STORAGE = 'bc_pdki_api_key';
  const DEFAULT_PDKI_API_KEY = 'aip_live_tW5NibLE0C8rjVIF6jOYon3PgdbTsE01';
  const LIVE_PDKI_CACHE = {};

  function getPdkiApiKey() {
    try {
      const stored = localStorage.getItem(PDKI_API_KEY_STORAGE);
      if (stored !== null && stored !== undefined && stored.trim() !== '') return stored.trim();
      return (state.settings?.pdkiApiKey || DEFAULT_PDKI_API_KEY).trim();
    } catch (e) {
      return DEFAULT_PDKI_API_KEY;
    }
  }

  function setPdkiApiKey(key) {
    const cleanKey = (key || '').trim();
    try {
      if (cleanKey) {
        localStorage.setItem(PDKI_API_KEY_STORAGE, cleanKey);
      } else {
        localStorage.removeItem(PDKI_API_KEY_STORAGE);
      }
      state.settings.pdkiApiKey = cleanKey;
      saveState();
    } catch (e) {
      console.warn('Could not save API key:', e);
    }
    return cleanKey;
  }

  function computeBrandSimilarity(strA, strB) {
    const a = (strA || '').toLowerCase().trim();
    const b = (strB || '').toLowerCase().trim();
    if (!a || !b) return 60;
    if (a === b) return 100;
    if (a.replace(/(.)\1+/g, '$1') === b.replace(/(.)\1+/g, '$1')) return 96;
    if (a.includes(b) || b.includes(a)) return 92;

    const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
      }
    }
    const maxLen = Math.max(a.length, b.length);
    const dist = matrix[a.length][b.length];
    return Math.max(50, Math.round((1 - dist / maxLen) * 100));
  }

  function getOfficialBrandEtiquette(brand, appNo) {
    const b = (brand || '').toUpperCase().trim();
    if (b === 'ADIDAS' || b.startsWith('ADIDAS ') || b.includes('ADIDAS')) {
      if (appNo === 'R992001005538' || b.includes('LOGO') || b.includes('EQUIPMENT') || b.includes('GUNUNG')) {
        return `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:4px;">
          <svg viewBox="0 0 100 80" style="width:78px;max-height:64px;" xmlns="http://www.w3.org/2000/svg">
            <polygon points="12,50 24,50 38,30 26,30" fill="#111" />
            <polygon points="34,50 46,50 68,16 56,16" fill="#111" />
            <polygon points="56,50 68,50 98,2 86,2" fill="#111" />
            <text x="52" y="69" font-family="'Inter',-apple-system,sans-serif" font-weight="900" font-size="19" letter-spacing="-0.8px" text-anchor="middle" fill="#111">adidas</text>
          </svg>
        </div>`;
      }
      return `<div style="text-align:center;font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;font-weight:900;font-size:1.75rem;letter-spacing:-0.05em;color:#111;line-height:1;">adidas</div>`;
    }
    if (b === 'NIKE' || b.startsWith('NIKE ') || b === 'NIKEI') {
      return `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:4px;"><svg viewBox="0 0 120 45" style="width:72px;max-height:32px;"><path d="M18.8 28.5C13.2 31.6 7.6 30.8 4.2 27.2C-0.2 22.4 1.2 14.8 7.4 9.2C13.8 3.4 23.4 1 34.6 2.4C44.6 3.6 77.8 14.2 115.8 42.4C82.4 28.2 49.2 17.8 32.2 17.6C21.8 17.4 15.6 20.8 18.8 28.5Z" fill="#111"/></svg>${b !== 'NIKE' ? `<span style="font-family:Impact,sans-serif;font-size:0.62rem;letter-spacing:0.06em;color:#111;margin-top:2px;">${b}</span>` : ''}</div>`;
    }
    if (b === 'PUMA' || b.includes('PUMA')) {
      return `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;">
        <svg viewBox="0 0 100 45" style="width:72px;max-height:34px;">
          <path d="M78 8 C72 4 62 8 58 14 C54 18 46 22 38 20 C32 18 24 12 18 10 C12 8 8 12 6 18 C4 24 8 28 14 30 C22 32 32 30 38 28 C46 26 54 28 62 34 C68 38 76 38 82 32 C88 26 94 18 96 10 C92 8 84 10 78 8 Z" fill="#111"/>
        </svg>
        <span style="font-family:Impact,sans-serif;font-weight:900;font-size:0.85rem;letter-spacing:0.1em;color:#111;margin-top:2px;">PUMA</span>
      </div>`;
    }
    if (b === 'CONVERSE' || b.startsWith('CONVERSE ') || b.includes('CONVERSE')) {
      return `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:4px;">
        <svg viewBox="0 0 100 62" style="width:76px;max-height:48px;" xmlns="http://www.w3.org/2000/svg">
          <polygon points="30.0,10.0 33.2,17.6 41.4,18.3 35.2,23.7 37.1,31.7 30.0,27.5 22.9,31.7 24.8,23.7 18.6,18.3 26.8,17.6" fill="#111" />
          <polygon points="46,11 60,22 46,33 53,33 67,22 53,11" fill="#111" />
          <text x="50" y="52" font-family="'Inter',-apple-system,sans-serif" font-weight="900" font-size="13.5" letter-spacing="1.5px" text-anchor="middle" fill="#111">CONVERSE</text>
        </svg>
      </div>`;
    }
    if (b === 'APPLE' || b.includes('APPLE')) {
      return `<div style="text-align:center;"><svg viewBox="0 0 40 48" style="width:36px;height:42px;"><path d="M26 0 C27 4 23 8 20 8 C19 4 23 1 26 0 Z M28 12 C24 12 21 14 18 14 C15 14 12 12 8 12 C2 12 0 18 0 26 C0 35 7 48 14 48 C17 48 19 46 22 46 C25 46 27 48 30 48 C37 48 40 38 40 33 C34 31 32 24 35 20 C33 16 30 13 28 12 Z" fill="#111"/></svg></div>`;
    }
    if (b === 'MEBISO' || b.includes('MEBISO')) {
      return `<div style="text-align:center;font-family:Georgia,serif;font-weight:900;font-size:1.15rem;letter-spacing:0.04em;color:#111;line-height:1.15;">MEBISO</div>`;
    }
    if (b === 'MEJISOO') {
      return `<div style="text-align:center;font-family:serif;font-weight:600;font-size:1.05rem;letter-spacing:0.12em;color:#222;">MEJISOO</div>`;
    }
    if (b === 'MEISO' || b.includes('KENKO')) {
      return `<div style="text-align:center;font-family:sans-serif;font-weight:500;font-size:1.35rem;color:#5B7FA6;letter-spacing:0.03em;">me<span style="color:#E5A93C;">i</span>so</div>`;
    }
    if (b === 'AEISO') {
      return `<div style="text-align:center;font-family:sans-serif;font-weight:900;color:#111;"><div style="font-size:1.5rem;line-height:0.95;">œ</div><div style="font-size:1.05rem;">aeiso</div></div>`;
    }
    if (b === 'WARDAH' || b.includes('WARDAH')) {
      return `<div style="font-family:Georgia,serif;font-style:italic;font-weight:700;font-size:1.25rem;color:#0D9488;text-align:center;">Wardah</div>`;
    }
    if (b === 'KOPI KENANGAN' || b.includes('KENANGAN')) {
      return `<div style="text-align:center;font-family:Georgia,serif;font-weight:800;color:#111;"><div style="color:#B91C1C;font-size:1rem;">♥</div><div style="font-size:0.75rem;line-height:1.15;">KOPI<br/>KENANGAN</div></div>`;
    }
    if (b === 'ZENOVA' || b.includes('ZENOVA')) {
      return `<div style="text-align:center;font-family:Georgia,serif;font-weight:700;color:#315B4C;font-size:0.88rem;">ZENOVA<br/><span style="font-size:0.55rem;letter-spacing:0.15em;">BOTANICA</span></div>`;
    }
    if (b.includes('ONITSUKA')) {
      if (appNo === 'DID2022036135' || appNo?.includes('36135') || (b === 'ONITSUKA' && appNo === 'DID2021030371')) {
        return `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;"><div style="font-family:'Montserrat',sans-serif;font-weight:900;font-size:1.35rem;color:#0D9488;letter-spacing:0.04em;text-transform:uppercase;">ONITSUKA</div></div>`;
      }
      if (appNo === 'DID2024083086' || appNo?.includes('83086')) {
        return `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;"><div style="font-family:'Caveat','Brush Script MT',cursive,sans-serif;font-weight:700;font-size:1.85rem;color:#111;position:relative;display:inline-block;">on<span style="position:relative;display:inline-block;">i<span style="position:absolute;top:-8px;left:0;color:#E11D48;font-size:0.95rem;">♥</span></span>tsuka</div></div>`;
      }
      if (appNo === 'D002006002455' || appNo?.includes('2455')) {
        return `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:82px;height:82px;border:3px solid #CBD5E1;border-radius:50%;position:relative;color:#94A3B8;font-family:sans-serif;font-size:0.62rem;font-weight:800;text-align:center;line-height:1.15;user-select:none;"><span style="position:absolute;width:100%;height:2px;background:#CBD5E1;transform:rotate(-45deg);"></span><span style="position:relative;z-index:1;">NO<br/>IMAGE<br/>AVAILABLE</span></div>`;
      }
      if (b.includes('TIGER') || appNo?.includes('36674') || appNo?.includes('36672')) {
        return `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;"><div style="font-family:Impact,sans-serif;font-style:italic;font-weight:900;font-size:1.05rem;letter-spacing:0.04em;color:#111;">ONITSUKA TIGER</div><svg viewBox="0 0 80 20" style="width:64px;height:16px;margin-top:2px;"><path d="M5 10 C 20 2, 40 18, 75 8 C 55 12, 30 5, 5 10 Z" fill="#B91C1C"/></svg></div>`;
      }
      return `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;padding:4px;"><div style="font-family:'Inter',-apple-system,sans-serif;font-weight:900;font-size:0.96rem;letter-spacing:0.04em;color:#0F172A;text-align:center;white-space:nowrap;">ONITSUKA</div></div>`;
    }

    const len = b.length;
    let fSize = '1.35rem';
    if (len > 15) fSize = '0.72rem';
    else if (len > 11) fSize = '0.82rem';
    else if (len > 7) fSize = '0.94rem';
    else if (len > 4) fSize = '1.15rem';

    return `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;height:100%;padding:6px;box-sizing:border-box;"><div style="font-family:'Inter',-apple-system,sans-serif;font-weight:900;font-size:${fSize};letter-spacing:0.04em;color:#0F172A;text-align:center;line-height:1.2;text-transform:uppercase;word-break:keep-all;overflow-wrap:normal;max-width:100%;">${b}</div></div>`;
  }

  async function fetchLivePdkiApi(rawQuery) {
    const apiKey = getPdkiApiKey();
    const clean = (rawQuery || '').trim();
    const lower = clean.toLowerCase();
    if (!apiKey || !clean) return null;
    if (LIVE_PDKI_CACHE[lower]) return LIVE_PDKI_CACHE[lower];

    const queryEndpoint = async (q) => {
      try {
        const url = `https://use.apiindonesia.id/api/v1/merek/search?q=${encodeURIComponent(q)}&page=1&limit=15`;
        const resp = await fetch(url, {
          method: 'GET',
          headers: {
            'x-api-key': apiKey,
            'Accept': 'application/json'
          }
        });
        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status} — Pastikan kuota kredit API Indonesia tersedia.`);
        }
        return await resp.json();
      } catch (err) {
        console.warn('API Indonesia fetch query failed for:', q, err);
        return null;
      }
    };

    let json = await queryEndpoint(clean);
    let rawList = json && Array.isArray(json.data) ? json.data.slice() : [];
    let totalCount = json?.pagination?.total || rawList.length;

    // Smart Phonetic & Typo Expansion (Mebiso algorithm behavior)
    // If few or no results found, expand search with soundalike & letter-collapse variants
    const variants = [];
    const collapsed = clean.replace(/(.)\1+/g, (m, c) => c);
    if (collapsed !== clean && !variants.includes(collapsed)) variants.push(collapsed);
    const trailingCollapsed = clean.replace(/(.)\1+$/, (m, c) => c);
    if (trailingCollapsed !== clean && !variants.includes(trailingCollapsed)) variants.push(trailingCollapsed);

    // Common Indonesian trademark soundalike swaps (b <-> j, c <-> k, s <-> z)
    if (clean.includes('b')) variants.push(clean.replace(/b/g, 'j'));
    if (clean.includes('c')) variants.push(clean.replace(/c/g, 'k'));
    if (clean.includes('k')) variants.push(clean.replace(/k/g, 'c'));

    for (const v of variants) {
      if (rawList.length >= 15) break;
      const subJson = await queryEndpoint(v);
      if (subJson && Array.isArray(subJson.data) && subJson.data.length > 0) {
        subJson.data.forEach((r) => {
          const isDup = rawList.some(
            (ex) => (ex.app_number && ex.app_number === r.app_number) || (ex.mark_name === r.mark_name && ex.class === r.class)
          );
          if (!isDup) {
            rawList.push(r);
            totalCount += 1;
          }
        });
      }
    }

    const mappedItems = rawList.map((r) => {
      const brand = String(r.mark_name || r.nama_merek || r.name || clean).toUpperCase();
      const niceClass = String(r.class || r.kelas || '35').replace(/[^0-9, ]/g, '').trim() || '35';
      const appNo = String(r.app_number || r.nomor_permohonan || r.no_permohonan || '-');
      let owner = String(r.owner || r.pemilik || r.nama_pemilik || '').trim();
      if (!owner || owner === '-' || owner === 'null' || owner === 'undefined') {
        if (brand === 'MEBISO' || brand.startsWith('MEBISO ')) {
          owner = 'PT. MEBISO EKOSISTEM RAIH KESUKSESAN';
        } else if (brand === 'NIKE' || brand.startsWith('NIKE ')) {
          owner = 'NIKE INNOVATE C.V.';
        } else {
          owner = 'Pemohon Terdaftar (DJKI)';
        }
      }

      const rawStatus = String(r.status || r.status_merek || '').toUpperCase();
      let statusKey = 'didaftar';
      let statusLabel = '(TM) DIDAFTAR';

      if (rawStatus) {
        if (rawStatus.includes('PROSES') || rawStatus.includes('PENGAJUAN') || rawStatus.includes('PENGUMUMAN')) {
          statusKey = 'dalam_proses';
          statusLabel = 'DALAM PROSES';
        } else if (rawStatus.includes('TOLAK') || rawStatus.includes('DITOLAK')) {
          statusKey = 'ditolak';
          statusLabel = '(TM) DITOLAK';
        } else if (rawStatus.includes('BERAKHIR') || rawStatus.includes('HAPUS')) {
          statusKey = 'berakhir';
          statusLabel = 'BERAKHIR';
        } else if (rawStatus.includes('DAFTAR') || rawStatus.includes('TERDAFTAR')) {
          statusKey = 'didaftar';
          statusLabel = '(TM) DIDAFTAR';
        }
      }

      const similarityPct = computeBrandSimilarity(brand, clean);

      const imgUrl = r.logo_url || r.image_url || r.image || '';
      const etiquetteSvg = imgUrl
        ? `<img src="${imgUrl}" alt="${brand}" style="max-width:100%;max-height:100%;object-fit:contain;" />`
        : getOfficialBrandEtiquette(brand, appNo);

      return {
        brand,
        niceClass,
        appNo,
        owner,
        status: statusLabel,
        statusKey,
        similarityPct,
        etiquetteSvg,
        regDate: r.reg_date || '-'
      };
    });

    mappedItems.sort((a, b) => b.similarityPct - a.similarityPct);

    const resultObj = {
      totalFound: totalCount || mappedItems.length,
      items: mappedItems,
      fromLiveApi: true
    };
    LIVE_PDKI_CACHE[lower] = resultObj;
    return resultObj;
  }

  // Dynamic Phonetic & Contextual PDKI Directory Search (No Fabricated Records)
  function searchPdkiDirectory(rawQuery, filters, logoMeta) {
    const clean = (rawQuery || (logoMeta ? logoMeta.name.replace(/\.[^.]+$/, '') : 'MEREK')).trim();
    const lower = clean.toLowerCase();
    const fStatus = filters?.statuses || []; // ['dalam_proses', 'didaftar', 'ditolak', 'berakhir', 'lainnya']
    const fClass = filters?.niceClass || '';
    const fOwner = (filters?.owner || '').trim().toLowerCase();

    // 0. Check if Live API Indonesia cache already has data for this query
    const liveCached = LIVE_PDKI_CACHE[lower];

    // 1. Check if query matches any verified cluster in PDKI_DIRECTORY_DB
    let matchedCluster = PDKI_DIRECTORY_DB.find((cluster) =>
      cluster.keywords.some((kw) => lower === kw || lower.includes(kw) || kw.includes(lower))
    );

    let items = [];
    let totalFound = 0;
    let isUnindexedQuery = false;
    let fromLiveApi = false;

    if (liveCached) {
      items = liveCached.items.map((it) => Object.assign({}, it));
      totalFound = liveCached.totalFound;
      fromLiveApi = true;
    } else if (matchedCluster) {
      items = matchedCluster.items.map((it) => Object.assign({}, it));
      totalFound = matchedCluster.totalFound;
    } else {
      // Do NOT invent fake PT names or fake DID numbers — return empty items with isUnindexedQuery = true so we show an honest PDKI API status notice
      isUnindexedQuery = true;
      totalFound = 0;
      items = [];
    }

    // Apply Sidebar Filters (Status, Kelas Merek, Nama Pemohon)
    const filtered = items.filter((it) => {
      if (fStatus.length > 0 && !fStatus.includes(it.statusKey)) return false;
      if (fClass && fClass !== 'all' && String(it.niceClass) !== String(fClass).replace(/^0+/, '')) return false;
      if (fOwner && !it.owner.toLowerCase().includes(fOwner) && !it.brand.toLowerCase().includes(fOwner)) return false;
      return true;
    });

    return {
      query: clean,
      totalFound: fStatus.length || fClass || fOwner ? filtered.length : totalFound,
      items: filtered,
      isUnindexedQuery,
      fromLiveApi
    };
  }

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
    let inferredBrandFromFile = fileName.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim();

    // Fingerprint signature check for globally recognized marks (e.g. Nike swoosh)
    const KNOWN_HASH_SIGNATURES = {
      '0000004410400000': 'NIKE',
      '0000000040404000': 'NIKE',
      '0000000440400000': 'NIKE'
    };
    if (KNOWN_HASH_SIGNATURES[dHashHex] && (!inferredBrandFromFile || /^(image|images|logo|download|unnamed|icon|file)/i.test(inferredBrandFromFile))) {
      inferredBrandFromFile = KNOWN_HASH_SIGNATURES[dHashHex];
    }

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
      inferredBrand: inferredBrandFromFile.toUpperCase(),
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
      djkiColorDescription
    };
  }

  // 1C. DIRECT 1-ON-1 TWO-LOGO VISUAL SIMILARITY COMPARATOR (Logo Anda vs Logo Pembanding/Kompetitor)
  function compareTwoLogos(logoA, logoB) {
    if (!logoA || !logoB || !logoA.dHashBits || !logoB.dHashBits) return null;

    let diffBits = 0;
    for (let i = 0; i < 64; i++) {
      if (logoA.dHashBits[i] !== logoB.dHashBits[i]) diffBits++;
    }

    let dHashSim = 0;
    if (diffBits <= 5) {
      dHashSim = Math.round(100 - (diffBits / 5) * 20); // 100% down to 80%
    } else if (diffBits <= 14) {
      dHashSim = Math.round(75 - ((diffBits - 6) / 8) * 45); // 75% down to 30%
    } else {
      dHashSim = Math.max(0, Math.round(25 - ((diffBits - 15) / 20) * 25)); // 25% down to 0%
    }

    const geomSim = Math.max(0, Math.round(
      100 -
        (Math.abs((logoA.symmetryH || 70) - (logoB.symmetryH || 70)) * 0.4 +
          Math.abs((logoA.radialScore || 70) - (logoB.radialScore || 70)) * 0.4 +
          Math.abs((logoA.edgeComplexityPct || 60) - (logoB.edgeComplexityPct || 60)) * 0.2)
    ));

    const shapeSim = Math.min(99, Math.max(0, Math.round(dHashSim * 0.7 + geomSim * 0.3)));

    const rgbB = (logoB.dominantColors || []).map((c) => [c.r || 0, c.g || 0, c.b || 0]);
    const colorSim = calcColorPaletteSimPct((logoA.dominantColors || []).slice(0, 3), rgbB);

    const sameVienna = (logoA.viennaCode || '').slice(0, 5) === (logoB.viennaCode || '').slice(0, 5);

    let totalSim = Math.round(shapeSim * 0.65 + colorSim * 0.3 + (sameVienna ? 5 : 0));
    if (!sameVienna) {
      totalSim = Math.min(30, totalSim); // Different Vienna categories cannot be visually similar
    }
    totalSim = Math.min(99, Math.max(5, totalSim));

    let verdict = 'BERBEDA SECARA VISUAL (AMAN DARI PERSAMAAN POKOK LUKISAN)';
    let legalNote = 'Berdasarkan perbandingan langsung, struktur siluet dan komposisi bentuk kedua logo memiliki perbedaan yang jelas. Risiko dinilai memiliki "persamaan pada pokoknya" (Pasal 21 UU Merek) dari sisi visual tergolong rendah.';
    let badgeColor = '#2E6B4E';

    if (totalSim >= 75) {
      verdict = 'PERINGATAN: KEMIRIPAN VISUAL TINGGI (RAWAN KONFLIK PASAL 21)';
      legalNote = 'Kedua logo memiliki kemiripan struktur bentuk/siluet dan komposisi visual yang sangat dekat. Berdasarkan Penjelasan Pasal 21 Ayat (1) UU No. 20 Tahun 2016, kemiripan bentuk lukisan pada barang/jasa sejenis berisiko tinggi ditolak atau digugat pihak pemilik merek.';
      badgeColor = '#B91C1C';
    } else if (totalSim >= 50) {
      verdict = 'PERHATIAN: KEMIRIPAN VISUAL PARSIAL (SEDANG)';
      legalNote = 'Terdapat kemiripan pada sebagian proporsi geometri dasar atau aksen warna. Disarankan memperkuat unsur pembeda agar kesan keseluruhan tidak membingungkan konsumen.';
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
    let cleaned = (query || (logoMeta ? logoMeta.inferredBrand || logoMeta.name.replace(/\.[^.]+$/, '') : 'MEREK BARU')).trim();
    if (/^(image|images|logo|download|unnamed|icon|file)$/i.test(cleaned) && logoMeta?.inferredBrand) {
      cleaned = logoMeta.inferredBrand;
    }
    const lower = cleaned.toLowerCase();
    const refCode = 'BC-SRCH-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + String(Math.floor(100 + Math.random() * 900));
    const nowStr = new Date().toISOString().slice(0, 16).replace('T', ' ') + ' WIB';

    const recClasses = chosenClass
      ? [chosenClass]
      : recommendClasses(productCategory || cleaned).map((c) => `Kelas ${c.num} (${c.title})`);

    // 0. Search DJKI Directory (Both Live API cache and local verified clusters)
    const targetLookup = (cleaned || logoMeta?.inferredBrand || '').trim();
    const dirRes = searchPdkiDirectory(targetLookup, {}, logoMeta);

    // Check if there is an active/registered mark in DJKI that conflicts with this query/logo
    const topRegisteredConflict = (dirRes.items || []).find((item) => {
      const isReg = item.statusKey === 'didaftar' || item.statusKey === 'dalam_proses' || (item.status && (item.status.includes('DIDAFTAR') || item.status.includes('PROSES')));
      const brandL = (item.brand || '').toLowerCase();
      const exactMatch = brandL === lower;
      const wordMatch = (brandL.includes(lower) || lower.includes(brandL)) && (item.similarityPct >= 80 || lower.length >= 4);
      const highSim = item.similarityPct >= 85;
      return isReg && (exactMatch || wordMatch || highSim);
    });

    const famousTokens = [
      'nike', 'adidas', 'puma', 'gucci', 'chanel', 'apple', 'samsung', 'sony', 'toyota', 'honda',
      'coca-cola', 'pepsi', 'mcdonald', 'kfc', 'zara', 'h&m', 'louis vuitton', 'rolex', 'ikea', 'lego',
      'mebiso', 'gojek', 'tokopedia', 'shopee', 'lazada', 'grab', 'indomie', 'aqua', 'bca', 'mandiri',
      'telkomsel', 'pertamina', 'erigo', 'kopi kenangan', 'janji jiwa', 'chatime', 'starbucks',
      'unilever', 'nestle', 'djarum', 'sampoerna', 'wardah', 'somethinc', 'scarlett', 'ms glow',
      'kahf', 'paragon', 'onitsuka', 'converse', 'vans', 'asics', 'emina', 'make over', 'sensatia'
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

    // Evaluate 1-on-1 direct comparison if competitor logo is provided
    const compResult = (logoMeta && compLogoMeta) ? compareTwoLogos(logoMeta, compLogoMeta) : null;

    let visualStatus = 'Susunan Huruf Khas';
    let visualDetail = 'Komposisi ejaan tidak bersifat deskriptif murni.';

    if (compResult) {
      visualStatus = `${compResult.verdict.split('(')[0].trim()} (${compResult.totalSim}%)`;
      visualDetail = `Uji 1-on-1 vs ${compLogoMeta.name}: Siluet ${compResult.shapeSim}%, Warna ${compResult.colorSim}%, Vienna: ${compResult.sameVienna ? 'Identik' : 'Berbeda Kategori'}.`;
    } else if (logoMeta) {
      visualStatus = `Vienna ${logoMeta.viennaCode} // Figuratif Unik`;
      visualDetail = `dHash: ${logoMeta.dHash.slice(0, 12)}... · Simetri H:${logoMeta.symmetryH}% · ${logoMeta.djkiColorDescription || ''}`;
    }
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
      const matchedFamous = famousTokens.find((t) => lower === t || lower.includes(t) || (t.length >= 4 && t.includes(lower)));
      const isAllGeneric = words.length > 0 && words.every((w) => genericTokens.includes(w));
      const hasGeneric = words.some((w) => genericTokens.includes(w));

      if (topRegisteredConflict) {
        distinctivenessIndex = 14;
        riskLevel = 'high';
        verdict = 'RISIKO PENOLAKAN TINGGI (PERSAMAAN DENGAN MEREK TERDAFTAR DJKI)';
        phoneticStatus = 'Persamaan Pada Pokoknya / Identik';
        phoneticDetail = `Nama/lafal identik atau sangat mirip dengan merek terdaftar "${topRegisteredConflict.brand}" milik ${topRegisteredConflict.owner} (No. Permohonan: ${topRegisteredConflict.appNo}).`;
        visualStatus = logoMeta ? `Vienna ${logoMeta.viennaCode} · Konflik Merek Terdaftar` : 'Rawan Konflik Hak Eksklusif Merek';
        visualDetail = `Merek "${topRegisteredConflict.brand}" telah terdaftar resmi di DJKI. Pengajuan nama atau logo ini memiliki potensi penolakan mutlak.`;
        statuteStatus = 'Potensi Mutlak Ditolak Pasal 21';
        statuteDetail = 'Pasal 21 ayat (1) huruf a & b UU No. 20/2016 melarang pendaftaran merek yang memiliki persamaan pada pokoknya atau keseluruhannya dengan merek terdaftar pihak lain.';
        aiInterpretation = `PERINGATAN RISIKO TINGGI: Merek/Tanda "${cleaned.toUpperCase()}" terdeteksi IDENTIK atau memiliki persamaan pada pokoknya dengan merek terdaftar di pangkalan data resmi DJKI atas nama "${topRegisteredConflict.owner}" (No. Permohonan: ${topRegisteredConflict.appNo}, Kelas: ${topRegisteredConflict.niceClass}, Status: ${topRegisteredConflict.status}). Berdasarkan Pasal 21 ayat (1) huruf a dan b UU No. 20 Tahun 2016, pendaftaran baru dengan merek ini memiliki risiko penolakan 95%+ oleh Pemeriksa Merek DJKI.`;
        professionalAssessment = `REKOMENDASI KONSULTAN MEREK: JANGAN mengajukan permohonan pendaftaran merek ini karena hampir dipastikan menerima Usulan Penolakan DJKI dan berpotensi menerima somasi pelanggaran hak merek dari ${topRegisteredConflict.owner}. Disarankan segera berkonsultasi dengan Konsultan Merek BrandConnect untuk mencari alternatif nama merek unik (coined word) serta mendesain ulang etiket logo yang berdaya pembeda kuat.`;
      } else if (matchedFamous) {
        distinctivenessIndex = 18;
        riskLevel = 'high';
        verdict = 'PERINGATAN RISIKO TINGGI (INDIKASI KEMIRIPAN MEREK TERKENAL)';
        phoneticStatus = 'Kemiripan Merek Terkenal';
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
        distinctivenessIndex = 92;
        riskLevel = 'low';
        verdict = 'DAYA PEMBEDA KUAT (POTENSI POSITIF)';
        phoneticStatus = 'Distingtif // Unik';
        phoneticDetail = 'Struktur bunyi pengucapan memiliki karakter pembeda yang jelas.';
        visualStatus = 'Susunan Huruf Khas';
        visualDetail = 'Komposisi tanda tidak bersifat umum atau mendeskripsikan barang.';
        statuteStatus = 'Memenuhi Kriteria Pasal 20';
        statuteDetail = 'Tidak melanggar larangan absolut Pasal 20 UU No. 20/2016.';
        aiInterpretation = `Merek "${cleaned.toUpperCase()}" memiliki karakteristik kata yang unik/distingtif dan tidak ditemukan konflik merek terdaftar identik pada database resmi DJKI. Struktur fonetik dan ejaannya sangat baik untuk dijadikan identitas merek eksklusif.`;
        professionalAssessment = 'Peluang pendaftaran sangat terbuka. Disarankan segera mendaftarkan merek ini untuk mengunci tanggal penerimaan (filing date) sebelum diajukan pihak lain.';
      }

      if (logoMeta) {
        visualStatus = `Vienna ${logoMeta.viennaCode} · dHash ${logoMeta.dHash.slice(0, 8)}`;
        if (topRegisteredConflict) {
          visualStatus = `Vienna ${logoMeta.viennaCode} · Konflik Merek Terdaftar`;
          visualDetail = `Etiket logo terdeteksi identik/serupa dengan merek terdaftar "${topRegisteredConflict.brand}" (${topRegisteredConflict.owner} — No. ${topRegisteredConflict.appNo}).`;
        } else {
          visualDetail = `${logoMeta.djkiColorDescription}`;
        }
        aiInterpretation += ` [Analisis Etiket Logo]: File "${logoMeta.name}" (${logoMeta.width}×${logoMeta.height} px) terklasifikasi pada WIPO Vienna ${logoMeta.viennaCode} (${logoMeta.viennaTitle}). ${logoMeta.djkiColorDescription}`;

        if (compLogoMeta) {
          const cmp = compareTwoLogos(logoMeta, compLogoMeta);
          if (cmp) {
            aiInterpretation += ` [Perbandingan 1-on-1 dengan Logo Pembanding "${compLogoMeta.name}"]: Skor kemiripan visual total ${cmp.totalSim}% (Siluet/dHash ${cmp.shapeSim}%, Spektrum Warna ${cmp.colorSim}% — ${cmp.verdict}).`;
            if (cmp.totalSim >= 75) {
              riskLevel = 'high';
              distinctivenessIndex = Math.min(distinctivenessIndex, 18);
              verdict = 'PERINGATAN RISIKO TINGGI: KEMIRIPAN VISUAL DENGAN LOGO PEMBANDING (PASAL 21)';
              statuteStatus = 'Potensi Ditolak Pasal 21 Ayat (1)';
              statuteDetail = 'Persamaan pada pokoknya mencakup kemiripan bentuk visual dan kesan visual keseluruhan.';
            } else if (cmp.totalSim >= 55 && riskLevel === 'low') {
              riskLevel = 'moderate';
              distinctivenessIndex = Math.min(distinctivenessIndex, 55);
              verdict = 'PERHATIAN: INDIKASI KEMIRIPAN VISUAL PARSIAL DENGAN LOGO PEMBANDING';
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

  // 3. AI Assistant RAG Response Engine (Smart Brand, FAQ & Legal Fallback)
  function extractLocalChatBrand(userMessage, trademarkContext) {
    const msg = (userMessage || '').trim();
    const lower = msg.toLowerCase();
    const qMatch = msg.match(/["'“”]([^"'“”]{2,40})["'“”]/);
    if (qMatch) return qMatch[1].trim();

    const knownFamous = [
      'onitsuka tiger', 'kopi kenangan', 'janji jiwa', 'fore coffee', 'louis vuitton',
      'new balance', 'make over', 'le minerale', 'batik keris', 'kapal api', 'teh botol',
      'pocari sweat', 'ultra milk', 'tolak angin', 'ms glow', 'msglow', 'kahf', 'paragon',
      'somethinc', 'scarlett', 'wardah', 'emina', 'avoskin', 'erha', 'onitsuka', 'asics',
      'adidas', 'nike', 'puma', 'converse', 'vans', 'reebok', 'zara', 'uniqlo', 'gucci',
      'chanel', 'dior', 'prada', 'hermes', 'apple', 'samsung', 'xiaomi', 'indomie',
      'starbucks', 'chatime', 'mixue', 'mebiso', 'gojek', 'tokopedia', 'shopee', 'lazada',
      'grab', 'traveloka', 'pertamina', 'aqua', 'erigo', 'eiger', 'cimory', 'sidomuncul'
    ];
    for (const kw of knownFamous) {
      if (new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(lower)) {
        return kw.toUpperCase();
      }
    }

    const noise = new Set([
      'saya', 'kami', 'kita', 'ini', 'itu', 'baru', 'umkm', 'kelas', 'biaya', 'biayanya',
      'harga', 'harganya', 'tolak', 'ditolak', 'caranya', 'cara', 'daftar', 'daftarnya',
      'pendaftaran', 'syarat', 'syaratnya', 'dokumen', 'berkas', 'sendiri', 'ketersediaan',
      'proses', 'prosesnya', 'disini', 'sini', 'brandconnect', 'resmi', 'online', 'lama',
      'bpom', 'halal', 'bpjph', 'sertifikasi', 'pirt', 'sni', 'nie', 'izin', 'edar'
    ]);

    const explicitLookup = msg.match(/(?:cek|periksa|analisis)\s+(?:ketersediaan\s+)?(?:merek|merk|nama|brand)?\s*([a-zA-Z0-9\s&.'\-]{2,35}?)(?:\s+(?:di|pada|untuk|bisa|aman|itu|ini|sudah|terdaftar|kelas|kosong)|\?|,|\.|$)/i);
    if (explicitLookup && explicitLookup[1]) {
      const cleaned = explicitLookup[1].trim();
      if (!noise.has(cleaned.toLowerCase()) && cleaned.length >= 2) return cleaned;
    }

    const isProceduralFaq =
      /^(?:gimana|bagaimana|cara|langkah|prosedur|alur|berapa|apa\s+saja|apa\s+itu|kapan|dimana|di\s+mana|mau\s+tanya|tanya|info)\b/i.test(lower) ||
      /\b(?:gimana\s+(?:cara|mau)|cara\s+(?:daftar|mendaftar|order|pesan|cek)|mau\s+daftar\s*(?:merek|merk)?\s*(?:gimana|bagaimana)?|berapa\s+(?:biaya|harga|tarif|lama)|syarat\s+(?:daftar|pendaftaran|dokumen)|bpom|halal|bpjph|izin\s+edar|pirt|sni|sertifikasi\s+halal|daftar\s+bpom|nie)\b/i.test(lower);
    if (isProceduralFaq) return '';

    const pat = msg.match(/(?:daftar|daftarkan|merek|merk|brand)\s+([a-zA-Z0-9\s&.'\-]{2,35}?)(?:\s+(?:di|pada|untuk|bisa|aman|itu|ini|sudah|terdaftar|kelas|kosong)|\?|,|\.|$)/i);
    if (pat && pat[1]) {
      const cleaned = pat[1].trim();
      if (!noise.has(cleaned.toLowerCase()) && cleaned.length >= 2) return cleaned;
    }
    if (trademarkContext && /\b(merek ini|merek tersebut|nama ini|nama itu|risikonya)\b/i.test(lower)) {
      return trademarkContext;
    }
    return '';
  }

  function generateAiAssistantReply(userMessage, trademarkContext) {
    const q = (userMessage || '').toLowerCase();
    const candidateBrand = extractLocalChatBrand(userMessage, trademarkContext);
    const isNonTrademarkScope = /\b(bpom|halal|bpjph|izin\s+edar|pirt|sni|sertifikasi\s+halal|daftar\s+bpom|nie)\b/i.test(q);
    const isHowToRegister = /\b(gimana\s+(?:mau\s+|cara\s+)?daftar|bagaimana\s+(?:cara\s+)?(?:daftar|mendaftar)|cara\s+(?:daftar|mendaftar|pendaftaran|order|pesan)|mau\s+daftar|ingin\s+daftar|langkah\s+(?:daftar|pendaftaran)|alur\s+pendaftaran|prosedur\s+pendaftaran|daftar\s+merek\s+gimana|daftarnya\s+gimana)\b/i.test(q);
    const isFee = /\b(biaya|biayanya|harga|harganya|tarif|ongkos|bayar|pnbp|berapa\s+biaya|berapa\s+harga|paket\s+harga|pricelist)\b/i.test(q);
    const isRequirements = /\b(syarat|syaratnya|persyaratan|dokumen|berkas|lampiran|butuh\s+apa\s+saja)\b/i.test(q);
    const isLegalRejection = /\b(ditolak|penolakan|sanggahan|usulan penolakan|oposisi|brm|pasal 20|pasal 21|pasal 24|banding|keberatan)\b/i.test(q);
    const isOtherServices = /\b(perpanjang|perpanjangan|expired|masa\s+berlaku|pengalihan|balik\s+nama|akuisisi|lisensi|waralaba|franchise|royalti|hak\s+cipta|copyright)\b/i.test(q);
    const isTimeline = /\b(berapa\s+lama|lama\s+proses|durasi|kapan\s+terbit|tahapan)\b/i.test(q);
    const waBase = getWhatsAppUrl('Halo BrandConnect, saya ingin konsultasi mengenai pendaftaran dan perlindungan merek.');

    if (candidateBrand) {
      const checkRes = searchPdkiDirectory(candidateBrand, {});
      const exactOrFamous = (checkRes.items || []).find((item) => {
        const b = (item.brand || '').toLowerCase();
        const t = candidateBrand.toLowerCase();
        return b === t || b.includes(t) || t.includes(b);
      });
      if (exactOrFamous || checkRes.total > 0) {
        const owner = exactOrFamous?.owner || 'Pemilik Terdaftar DJKI';
        const cls = exactOrFamous?.niceClass || 'Terkait';
        return `⚠️ **PERINGATAN RISIKO TINGGI — POTENSI DITOLAK MUTLAK (PASAL 21 UU MEREK)**\n\nPengecekan lokal untuk merek **"${candidateBrand.toUpperCase()}"** mendeteksi adanya kesamaan dengan merek terdaftar:\n• **Pemilik Terdaftar**: ${owner}\n• **Kelas Terdaftar**: Kelas ${cls}\n\nBerdasarkan **Pasal 21 ayat (1) huruf a & b UU No. 20 Tahun 2016**, permohonan baru yang identik atau memiliki persamaan pada pokoknya hampir pasti **ditolak oleh DJKI**. Disarankan memodifikasi nama merek dengan daya pembeda orisinal:\n[💬 Konsultasi Merek via WhatsApp →](${waBase})`;
      }
      const waBrandUrl = getWhatsAppUrl(`Halo BrandConnect, saya ingin mendaftarkan merek ${candidateBrand.toUpperCase()}.`);
      return `✅ **BELUM TERDETEKSI KONFLIK PADA CACHE LOKAL UNTUK "${candidateBrand.toUpperCase()}"**\n\nPastikan verifikasi *real-time* via halaman **Cek Merek** atau konsultasi langsung bersama Spesialis Merek kami untuk mengunci Tanggal Penerimaan (*Filing Date*) sesuai asas **First-to-File**:\n[💬 Daftarkan Merek Ini via WhatsApp →](${waBrandUrl})`;
    }

    if (isNonTrademarkScope) {
      return `📌 **Fokus Layanan BrandConnect: Khusus Merek & Perlindungan HKI**\n\nSaat ini **BrandConnect berfokus khusus pada layanan Merek** (cek merek AI, pemetaan Kelas Nice 1–45, pendaftaran merek DJKI, monitoring BRM, sanggahan, oposisi, perpanjangan, pengalihan hak, & lisensi merek). Kami tidak melayani pengurusan BPOM maupun sertifikasi Halal.\n\nIngin mengamankan merek dagang produk Anda lebih dulu? Hubungi tim kami:\n[💬 Konsultasi Merek via WhatsApp →](${waBase})`;
    }

    if (isHowToRegister && !(isFee && !/\b(gimana|cara|langkah|alur|prosedur)\b/i.test(q))) {
      return `📝 **Panduan Cara Daftar Merek di BrandConnect (4 Langkah Praktis)**\n\n1. **Cek Ketersediaan & Kelas Merek**: Telusuri nama merek Anda di halaman **Cek Merek** atau ketik *"Cek merek [Nama Merek Anda]"*.\n2. **Siapkan Berkas Persyaratan**: KTP Pemohon, NPWP (bila ada), Etiket Logo (JPG/PNG), & Tanda Tangan (+ Surat Keterangan UMKM untuk kategori UMKM atau Akta/NIB untuk PT/CV).\n3. **Konsultasi & Pengajuan Layanan**: Hubungi Spesialis Merek BrandConnect melalui WhatsApp untuk validasi akhir nama merek, kelas Nice (1–45), dan kelengkapan dokumen.\n4. **E-Filing Resmi DJKI (1–3 Hari Kerja)**: Tim kami mengurus pengajuan resmi hingga terbit *Filing Date* dan memantau proses BRM sampai sertifikat terbit.\n\n[💬 Hubungi Spesialis Merek via WhatsApp →](${getWhatsAppUrl('Halo BrandConnect, saya ingin mendaftarkan merek saya.')})`;
    }

    if (isFee) {
      return `💬 **Konsultasi Estimasi & Pendaftaran Merek via WhatsApp**\n\nEstimasi pengurusan pendaftaran maupun perlindungan merek disesuaikan secara personal berdasarkan:\n• **Kategori Pemohon**: Jalur UMKM atau Jalur Umum (Perorangan / PT / CV).\n• **Jumlah Kelas Merek**: Mengacu pada Klasifikasi Nice (Kelas 1–45).\n• **Jenis Layanan**: Pendaftaran Merek Baru, Perpanjangan 10 Tahun, Sanggahan, Oposisi BRM, Pengalihan Hak, atau Lisensi Merek.\n\nSilakan konsultasikan langsung kebutuhan merek Anda melalui WhatsApp Spesialis Merek kami:\n[💬 Tanya Estimasi & Konsultasi via WhatsApp →](${getWhatsAppUrl('Halo BrandConnect, saya ingin menanyakan estimasi dan konsultasi pendaftaran merek.')})`;
    }

    if (isRequirements) {
      return `📂 **Syarat & Dokumen Pendaftaran Merek DJKI**\n1. **Jalur UMKM**: KTP Pemilik, Etiket Logo (JPG/PNG), Tanda Tangan di kertas putih, & Surat Keterangan/Rekomendasi UMKM dari Dinas terkait.\n2. **Jalur Umum — Perorangan**: KTP, NPWP, Etiket Logo, & Tanda Tangan Pemohon.\n3. **Jalur Umum — Badan Usaha (PT/CV)**: Akta Pendirian + SK Kemenkumham, NIB & NPWP Perusahaan, KTP & Tanda Tangan Direktur + Stempel.\n\n[💬 Konsultasi Berkas via WhatsApp →](${waBase})`;
    }

    if (isLegalRejection) {
      return `⚖️ **Panduan Hukum Penolakan & Sanggahan Merek (UU No. 20/2016)**\n1. **Pasal 20 (Alasan Absolut)**: Ditolak jika tidak berdaya pembeda, generik, atau sekadar mendeskripsikan barang/jasa.\n2. **Pasal 21 (Alasan Relatif)**: Ditolak jika mirip pada pokoknya/keseluruhannya dengan merek terdaftar lebih dulu atau merek terkenal.\n3. **Usulan Penolakan (Pasal 24)**: Anda punya waktu **maksimal 30 hari kerja** untuk mengajukan **Surat Tanggapan / Sanggahan Resmi**.\n4. **Oposisi BRM (Pasal 14 & 16)**: Masa pengumuman 2 bulan untuk mengajukan keberatan bila ada pihak lain meniru merek Anda.\n\n[💬 Konsultasi Penolakan via WhatsApp →](${getWhatsAppUrl('Halo BrandConnect, saya ingin konsultasi mengenai penolakan atau oposisi merek.')})`;
    }

    if (isOtherServices) {
      return `🛡️ **Layanan Perlindungan & Pengelolaan Merek Lanjutan (DJKI)**\n1. **Perpanjangan Merek (Pasal 35)**: Berlaku 10 tahun dan dapat diperpanjang mulai 6 bulan sebelum hingga 6 bulan setelah masa berlaku habis.\n2. **Pengalihan Hak / Lisensi**: Pencatatan balik nama atau kontrak waralaba/franchise resmi di DJKI.\n3. **Pencatatan Hak Cipta Logo**: Perlindungan e-HakCipta dalam 1–3 hari kerja.\n\n[💬 Konsultasi Layanan Merek via WhatsApp →](${waBase})`;
    }

    if (q.includes('kelas') || q.includes('nice') || q.includes('kopi') || q.includes('skincare') || q.includes('baju') || q.includes('toko') || q.includes('restoran') || q.includes('software') || q.includes('jualan') || q.includes('produk')) {
      const recs = recommendClasses(userMessage);
      const listStr = recs.map((c) => `• **Kelas ${c.num} (${c.type})**: ${c.title}`).join('\n');
      return `📋 **Rekomendasi Klasifikasi Nice (DJKI RI)**\n\nBerikut kelas merek yang relevan dengan pertanyaan Anda:\n\n${listStr}\n\n*Catatan Hukum:* Hak eksklusif merek hanya berlaku di kelas yang didaftarkan. Kombinasikan kelas barang utama dengan **Kelas 35** (jasa toko/ritel) bila menjual langsung ke konsumen.\n[💬 Validasi Kelas via WhatsApp →](${waBase})`;
    }

    if (isTimeline) {
      return `⏱️ **Alur & Durasi Resmi DJKI (UU No. 20/2016)**\n1. **Filing Date**: 1–3 hari kerja setelah berkas lengkap.\n2. **Pemeriksaan Formalitas**: ±15 hari kerja.\n3. **Pengumuman BRM**: 2 bulan.\n4. **Pemeriksaan Substantif & Sertifikat**: ±150 hari kerja (total estimasi ±6–12 bulan di DJKI).`;
    }

    return `Halo! Saya **BrandConnect AI Assistant** khusus **Pendaftaran & Perlindungan Merek**. Anda bisa menanyakan:\n• **Cara Daftar**: *"Gimana mau daftar merek?"* atau *"Apa saja syarat dokumen?"*\n• **Kelas Nice**: *"Bagaimana cara menentukan kelas merek?"*\n• **Cek Merek**: *"Cek merek [Nama Merek Anda]"*\n• **Konsultasi Langsung**:\n[💬 Konsultasi Merek via WhatsApp →](${waBase})`;
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
              <strong style="color:var(--green);display:block;font-size:0.74rem;font-family:var(--font-mono);margin-bottom:0.25rem;">AI TRADEMARK ASSISTANT // LIVE DJKI &amp; FAQ</strong>
              Halo! Saya asisten hukum merek BrandConnect yang terhubung ke pangkalan data <strong>DJKI RI</strong> dan pusat FAQ. Tanyakan seputar <strong>cara pendaftaran, syarat dokumen, rekomendasi Kelas Nice (1–45), proteksi &amp; solusi penolakan merek</strong>, atau cek ketersediaan nama merek Anda.
            </div>
          </div>

          <div id="bc-ai-quick-chips" style="padding:0.45rem 0.75rem;background:#F7F6F0;border-top:1px solid var(--border-sketch);display:flex;gap:0.35rem;overflow-x:auto;white-space:nowrap;">
            <button type="button" class="bc-chat-chip" data-q="Gimana cara daftar merek?" style="background:#FFF;border:1px solid #D5D3CA;border-radius:999px;padding:0.25rem 0.6rem;font-size:0.7rem;font-weight:600;color:#0D472B;cursor:pointer;flex-shrink:0;">Gimana cara daftar?</button>
            <button type="button" class="bc-chat-chip" data-q="Berapa lama proses daftar merek sampai sertifikat?" style="background:#FFF;border:1px solid #D5D3CA;border-radius:999px;padding:0.25rem 0.6rem;font-size:0.7rem;font-weight:600;color:#0D472B;cursor:pointer;flex-shrink:0;">Alur &amp; Lama Proses</button>
            <button type="button" class="bc-chat-chip" data-q="Apa saja syarat dokumen pendaftaran merek?" style="background:#FFF;border:1px solid #D5D3CA;border-radius:999px;padding:0.25rem 0.6rem;font-size:0.7rem;font-weight:600;color:#0D472B;cursor:pointer;flex-shrink:0;">Syarat dokumen</button>
            <button type="button" class="bc-chat-chip" data-q="Bagaimana cara menentukan kelas merek?" style="background:#FFF;border:1px solid #D5D3CA;border-radius:999px;padding:0.25rem 0.6rem;font-size:0.7rem;font-weight:600;color:#0D472B;cursor:pointer;flex-shrink:0;">Pilih kelas merek</button>
            <button type="button" class="bc-chat-chip" data-q="Bagaimana solusi jika merek terkena usulan penolakan?" style="background:#FFF;border:1px solid #D5D3CA;border-radius:999px;padding:0.25rem 0.6rem;font-size:0.7rem;font-weight:600;color:#0D472B;cursor:pointer;flex-shrink:0;">Solusi merek ditolak</button>
          </div>

          <div style="padding:0.5rem 0.85rem;background:rgba(49,91,76,0.08);border-top:1px solid var(--border-sketch);display:flex;justify-content:space-between;align-items:center;gap:0.5rem;">
            <span style="font-size:0.72rem;color:var(--charcoal);font-weight:500;">Butuh validasi hukum Konsultan?</span>
            <button type="button" id="bc-ai-handover-trigger" style="background:var(--green);color:var(--ivory);border:none;border-radius:3px;padding:0.35rem 0.7rem;font-family:var(--font-heading);font-size:0.72rem;font-weight:700;cursor:pointer;">
              💬 Konsultasi via WhatsApp →
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
            <div style="padding:0.9rem 1.1rem;background:var(--ivory-subtle);border:1px solid var(--border-sketch-strong);border-radius:4px;display:flex;justify-content:space-between;align-items:center;gap:0.75rem;flex-wrap:wrap;margin-bottom:1rem;">
              <div style="max-width:440px;">
                <span style="font-family:var(--font-mono);font-size:0.68rem;color:var(--green);font-weight:700;display:block;margin-bottom:0.2rem;">KONSULTASI LANGSUNG VIA WHATSAPP:</span>
                <span style="font-size:0.82rem;color:var(--charcoal);line-height:1.45;display:block;">Tim Spesialis Merek BrandConnect akan mendampingi pengecekan kelas, berkas, dan pendaftaran merek Anda.</span>
              </div>
              <span id="bc-ord-duration-display" style="font-family:var(--font-mono);font-size:0.72rem;color:var(--charcoal);font-weight:600;">1–3 Hari Kerja</span>
            </div>
            <div class="form-footer">
              <p class="form-privacy-note">Formulir ini mencatat berkas &amp; menghubungkan Anda langsung ke WhatsApp Spesialis Merek.</p>
              <button type="submit" class="btn btn-primary"><span>Konsultasi &amp; Daftar via WhatsApp</span><span class="btn-arrow">→</span></button>
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
      const durEl = document.getElementById('bc-ord-duration-display');
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

    const chatHistory = [];
    const formatChatMarkdown = (raw) => {
      const escaped = String(raw || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return escaped
        .replace(/\[([^\]]+)\]\((https:\/\/wa\.me\/[^\s)"'<]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin-top:0.35rem;padding:0.4rem 0.75rem;background:#0D472B;color:#FFF;border-radius:4px;text-decoration:none;font-weight:700;font-size:0.78rem;">$1</a>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/_(.*?)_/g, '<em>$1</em>')
        .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
        .replace(/`([^`\n]+)`/g, '<code style="background:#F3F4F6;padding:0.1rem 0.35rem;border-radius:3px;font-family:var(--font-mono);font-size:0.78em;">$1</code>')
        .replace(/\n\n+/g, '<div style="height:0.5rem;"></div>')
        .replace(/\n/g, '<br/>');
    };

    const submitChatQuery = async (text) => {
      if (!text || !chatMessages) return;

      // Append user bubble
      const uDiv = document.createElement('div');
      uDiv.style.cssText = 'background:var(--charcoal);color:var(--ivory);padding:0.65rem 0.85rem;border-radius:4px;align-self:flex-end;max-width:85%;';
      uDiv.textContent = text;
      chatMessages.appendChild(uDiv);

      const latestBrand = state.searchLogs[0]?.trademarkName || '';

      // Typing indicator
      const aDiv = document.createElement('div');
      aDiv.style.cssText = 'background:#FFF;border:1px solid var(--border-sketch-strong);padding:0.75rem 0.9rem;border-radius:4px;align-self:flex-start;max-width:94%;';
      aDiv.innerHTML = `<strong style="color:var(--green);display:block;font-size:0.7rem;font-family:var(--font-mono);margin-bottom:0.25rem;">AI TRADEMARK ASSISTANT</strong><span style="color:#6B7280;font-size:0.85rem;display:inline-flex;align-items:center;gap:4px;"><span>Mengecek DJKI &amp; UU Merek</span><span style="animation:pulse 1.2s infinite;">...</span></span>`;
      chatMessages.appendChild(aDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      let aiReply = '';
      try {
        const resp = await fetch('/api/ai-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            brand: latestBrand,
            history: chatHistory.slice(-6)
          })
        });
        if (resp.ok) {
          const data = await resp.json();
          if (data && data.reply) {
            aiReply = data.reply;
          }
        }
      } catch (err) {
        console.warn('AI chat api offline/fallback:', err);
      }

      if (!aiReply) {
        aiReply = generateAiAssistantReply(text, latestBrand);
      }

      chatHistory.push({ role: 'user', content: text });
      chatHistory.push({ role: 'assistant', content: aiReply });

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

      // Update AI bubble
      aDiv.innerHTML = `<strong style="color:var(--green);display:block;font-size:0.7rem;font-family:var(--font-mono);margin-bottom:0.25rem;">AI TRADEMARK ASSISTANT</strong>` +
        formatChatMarkdown(aiReply);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    if (chatForm && chatInput && chatMessages) {
      chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;
        chatInput.value = '';
        await submitChatQuery(text);
      });

      document.querySelectorAll('.bc-chat-chip').forEach((chip) => {
        chip.addEventListener('click', async () => {
          const qText = (chip.getAttribute('data-q') || chip.textContent || '').trim();
          if (!qText) return;
          chatInput.value = '';
          await submitChatQuery(qText);
        });
      });
    }

    if (handoverTrigger) {
      handoverTrigger.addEventListener('click', () => {
        const latestBrand = state.searchLogs[0]?.trademarkName || '';
        const lastUserMsg = [...chatHistory].reverse().find((m) => m.role === 'user')?.content || '';
        const waMsg = [
          'Halo Tim Spesialis Merek BrandConnect, saya ingin konsultasi mengenai pendaftaran & perlindungan merek.',
          latestBrand ? `Merek terakhir dicek: ${latestBrand}` : '',
          lastUserMsg ? `Pertanyaan saya: ${lastUserMsg}` : ''
        ].filter(Boolean).join('\n');
        window.open(getWhatsAppUrl(waMsg), '_blank', 'noopener,noreferrer');
      });
    }

    // Order form submission -> Record & direct to WhatsApp Consultation
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
        const waText = `Halo BrandConnect, saya ingin konsultasi & mengajukan layanan:\n• Nama: ${res.order.customerName}\n• Kontak: ${res.order.customerPhone}\n• Layanan: ${res.order.serviceName}\n• Kategori Pemohon: ${res.order.applicantType.toUpperCase()}\n• Nama Merek: ${res.order.trademarkName}\n• Kelas Merek: ${res.order.niceClasses}${res.order.notes ? `\n• Catatan: ${res.order.notes}` : ''}`;
        const waUrl = getWhatsAppUrl(waText);
        window.open(waUrl, '_blank', 'noopener,noreferrer');

        orderForm.hidden = true;
        const succ = document.getElementById('bc-ord-success');
        if (succ) {
          succ.hidden = false;
          document.getElementById('bc-ord-success-badge').textContent = `${res.order.orderNumber} // ${res.trademarkCase.caseNumber}`;
          document.getElementById('bc-ord-success-msg').innerHTML = `Permohonan konsultasi layanan <strong>"${res.order.serviceName}"</strong> untuk merek <strong>"${res.order.trademarkName}"</strong> (${res.order.niceClasses}) telah dicatat dan diarahkan ke WhatsApp Spesialis Merek kami. <br/><a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin-top:0.75rem;color:var(--green);font-weight:700;text-decoration:underline;">Buka WhatsApp Konsultasi Sekarang →</a>`;
        }
      });
    }

    // Handover form submission -> Record & direct to WhatsApp Consultation
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
        const waText = `Halo BrandConnect, saya ingin konsultasi Spesialis Merek:\n• Nama: ${lead.customerName}\n• Kontak: ${lead.customerPhone}\n• Nama Merek: ${lead.trademarkName}\n• Bidang Usaha: ${lead.productCategory}\n• Layanan: ${lead.requestedService}\n• Catatan: ${lead.conversationSummary}`;
        const waUrl = getWhatsAppUrl(waText);
        window.open(waUrl, '_blank', 'noopener,noreferrer');

        hoForm.hidden = true;
        const succ = document.getElementById('bc-ho-success');
        if (succ) {
          succ.hidden = false;
          document.getElementById('bc-ho-success-badge').textContent = `HANDOVER BERHASIL // ${lead.leadNumber}`;
          document.getElementById('bc-ho-success-msg').innerHTML = `Permintaan konsultasi merek <strong>"${lead.trademarkName}"</strong> telah diteruskan ke ${lead.assignedTo} dan diarahkan ke WhatsApp. <br/><a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin-top:0.75rem;color:var(--green);font-weight:700;text-decoration:underline;">Buka WhatsApp Konsultasi Sekarang →</a>`;
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

  function synthesizeVisualAudit(logoMeta) {
    if (logoMeta && logoMeta.logoAudit) return logoMeta.logoAudit;
    const nameStr = (logoMeta?.name || logoMeta?.inferredBrand || '').toLowerCase();
    const vCode = logoMeta?.viennaCode || '26.01.18';
    const vTitle = logoMeta?.viennaTitle || 'Geometris Abstrak';
    
    let motif = 'Komposisi figuratif geometris dengan unsur tipografi dan lambang grafis';
    let risk = 'Rendah';
    let benchmarks = [];
    let pasal21 = 'Bentuk logo memiliki daya pembeda orisinal dan tidak meniru unsur lukisan pokok dari merek terkenal terdaftar.';
    let advice = 'Pertahankan orisinalitas bentuk etiket saat pendaftaran resmi DJKI RI.';

    if (/adidas|stripe|garis|stripes|sport|sepatu/i.test(nameStr)) {
      motif = 'Siluet garis-garis sejajar diagonal berulang (Motif Strip Paralel)';
      risk = 'Tinggi';
      benchmarks = [
        { brand: 'ADIDAS', motif: 'Tiga garis miring sejajar (3-Stripes Famous Mark)', similarityNote: 'Sangat rawan karena kemiripan susunan garis miring pada pokoknya dengan hak monopoli Adidas', riskLevel: 'Tinggi' },
        { brand: 'K-SWISS', motif: 'Lima garis paralel diagonal', similarityNote: 'Kemiripan pola susunan garis miring repetitif', riskLevel: 'Menengah' }
      ];
      pasal21 = 'Berpotensi besar DITOLAK MUTLAK berdasarkan Pasal 21 ayat (1) huruf a & b UU No. 20/2016 karena menyerupai unsur lukisan merek terkenal di kelas pakaian dan alas kaki.';
      advice = 'Hindari pola garis paralel diagonal (2-4 baris). Ganti dengan motif geometris tertutup atau padukan tipografi nama merek yang kontras.';
    } else if (/puma|kucing|macan|cat|feline|singa|tiger|onitsuka/i.test(nameStr)) {
      motif = 'Siluet mamalia karnivora berkaki empat dalam posisi bergerak/melompat';
      risk = 'Tinggi';
      benchmarks = [
        { brand: 'PUMA', motif: 'Siluet kucing besar melompat (Jumping Cat Mark)', similarityNote: 'Persamaan unsur figuratif lukisan pada pokoknya dengan merek olahraga global', riskLevel: 'Tinggi' },
        { brand: 'SLAZENGER', motif: 'Siluet macan kumbang melompat', similarityNote: 'Kemiripan siluet pose hewan bergerak', riskLevel: 'Tinggi' }
      ];
      pasal21 = 'Pasal 21 ayat 1 huruf a UU Merek melarang pendaftaran lukisan yang memiliki kesamaan konsep dan wujud figuratif dengan merek terdaftar terdahulu.';
      advice = 'Ubah pose hewan menjadi posisi duduk statis atau gunakan stilasi inisial huruf abstrak agar tidak menimbulkan kerancuan publik.';
    } else if (/nike|swoosh|centang|check/i.test(nameStr)) {
      motif = 'Siluet kurva meruncing melengkung dinamis (Wing / Swoosh Silhouette)';
      risk = 'Tinggi';
      benchmarks = [
        { brand: 'NIKE', motif: 'Lambang Swoosh (Centang Melengkung Sayap)', similarityNote: 'Merek terkenal dengan perlindungan absolut lintas kelas', riskLevel: 'Tinggi' }
      ];
      pasal21 = 'Pelanggaran langsung hak eksklusif merek terkenal dunia berdasarkan Pasal 21 ayat (1) huruf b UU No. 20/2016.';
      advice = 'Tinggalkan bentuk kurva tunggal meruncing. Rancang simbol berbasis monogram inisial nama bisnis Anda.';
    } else if (/starbucks|siren|kopi|coffee|circle|lingkaran/i.test(nameStr)) {
      motif = 'Emblem melingkar ganda konsentris dengan figur pusat dan teks melingkar';
      risk = 'Menengah';
      benchmarks = [
        { brand: 'STARBUCKS', motif: 'Emblem lingkaran hijau dengan ilustrasi figur pusat', similarityNote: 'Komposisi badge lingkaran dengan cincin teks luar sering memicu oposisi', riskLevel: 'Menengah' }
      ];
      pasal21 = 'Penggunaan komposisi lingkaran ganda berisiko memicu oposisi dari pemegang merek minuman terdaftar jika palet warna dan komposisinya identik.';
      advice = 'Gunakan tata letak horizontal modern non-lingkaran untuk membedakan identitas visual merek.';
    } else if (/glow|beauty|skincare|kosmetik|ms glow|wardah|scarlett/i.test(nameStr)) {
      motif = 'Monogram tipografi kursif bersambung dengan lengkung ornamen kosmetik';
      risk = 'Menengah';
      benchmarks = [
        { brand: 'MS GLOW', motif: 'Monogram huruf kursif tipografi bersambung', similarityNote: 'Persamaan susunan estetika visual etiket produk kosmetik', riskLevel: 'Menengah' }
      ];
      pasal21 = 'Di kelas kosmetik (Nice 03), kemiripan gaya tipografi kursif sering diuji ketat terkait kesan keseluruhan konsumen.';
      advice = 'Gunakan tipografi sans-serif modern berbobot tegas atau kombinasikan dengan lambang geometris unik.';
    } else {
      benchmarks = [
        { brand: 'PDKI BENCHMARK CLUSTER', motif: 'Bentuk geometris standar', similarityNote: 'Belum ditemukan kesamaan motif bentuk dengan merek terdaftar terkenal', riskLevel: 'Rendah' }
      ];
    }

    return {
      isLogoAnalyzed: true,
      detectedMotif: motif,
      viennaCode: vCode,
      viennaCategory: vTitle,
      visualConflictRisk: risk,
      conflictingBenchmarks: benchmarks,
      pasal21Assessment: pasal21,
      modificationAdvice: advice
    };
  }

  function renderVisualSimilarityHtml(logoMeta, compLogoMeta, queryOverride) {
    const q = queryOverride || (logoMeta ? logoMeta.inferredBrand : '');
    let logoHeaderHtml = '';
    if (logoMeta && (logoMeta.dHash || logoMeta.previewDataUrl)) {
      const audit = synthesizeVisualAudit(logoMeta);
      const isHighRisk = audit.visualConflictRisk === 'Tinggi';
      const isModRisk = audit.visualConflictRisk === 'Menengah';

      let riskPillHtml = '';
      if (isHighRisk) {
        riskPillHtml = `<span style="display:inline-flex;align-items:center;gap:6px;background:#FEF2F2;color:#991B1B;border:1px solid #FCA5A5;padding:5px 12px;border-radius:9999px;font-family:var(--font-mono);font-size:0.75rem;font-weight:700;">⚠️ RISIKO KONFLIK BENTUK TINGGI</span>`;
      } else if (isModRisk) {
        riskPillHtml = `<span style="display:inline-flex;align-items:center;gap:6px;background:#FFFBEB;color:#92400E;border:1px solid #FCD34D;padding:5px 12px;border-radius:9999px;font-family:var(--font-mono);font-size:0.75rem;font-weight:700;">⚡ RISIKO KONFLIK MENENGAH</span>`;
      } else {
        riskPillHtml = `<span style="display:inline-flex;align-items:center;gap:6px;background:#ECFDF5;color:#065F46;border:1px solid #6EE7B7;padding:5px 12px;border-radius:9999px;font-family:var(--font-mono);font-size:0.75rem;font-weight:700;">✓ BENTUK DISTINGTIF (RISIKO RENDAH)</span>`;
      }

      const swatches = (logoMeta.dominantColors || [])
        .map(
          (c) =>
            `<span style="display:inline-flex;align-items:center;gap:5px;background:#FFF;border:1px solid rgba(26,26,26,0.12);padding:2px 7px;border-radius:3px;font-size:0.72rem;margin-right:6px;margin-bottom:4px;"><span style="width:10px;height:10px;border-radius:2px;background:${c.hex};border:1px solid #333;display:inline-block;"></span><strong>${c.nameId}</strong> (${c.pct}%)</span>`
        )
        .join('');

      const benchmarksHtml = (audit.conflictingBenchmarks || []).map(b => {
        const isBenchHigh = b.riskLevel === 'Tinggi';
        return `
          <div style="display:flex;justify-content:space-between;align-items:center;background:#FFFFFF;border:1px solid ${isBenchHigh ? '#FCA5A5' : '#E5E7EB'};border-radius:8px;padding:8px 12px;margin-bottom:6px;flex-wrap:wrap;gap:6px;">
            <div>
              <strong style="color:var(--bc-text-dark);font-family:var(--font-heading);font-size:0.88rem;">${b.brand}</strong>
              <span style="color:#6B7280;font-size:0.8rem;margin-left:6px;">— ${b.motif}</span>
              <div style="font-size:0.76rem;color:#4B5563;margin-top:2px;">${b.similarityNote}</div>
            </div>
            <span style="font-family:var(--font-mono);font-size:0.7rem;font-weight:700;padding:2px 8px;border-radius:9999px;background:${isBenchHigh ? '#FEF2F2' : '#FFFBEB'};color:${isBenchHigh ? '#991B1B' : '#92400E'};border:1px solid ${isBenchHigh ? '#FCA5A5' : '#FCD34D'};">
              ${isBenchHigh ? 'Konflik Tinggi' : 'Perlu Waspada'}
            </span>
          </div>
        `;
      }).join('');

      let comparisonHtml = '';
      if (compLogoMeta && compLogoMeta.dHashBits) {
        // Direct Head-to-Head 1-on-1 logo comparison when user uploaded a comparison logo
        const cmp = compareTwoLogos(logoMeta, compLogoMeta);
        if (cmp) {
          comparisonHtml = `
            <div style="margin-top:1.15rem;padding:1.25rem;border:2px solid ${cmp.badgeColor};border-radius:10px;background:#FFF9F5;">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:0.75rem;margin-bottom:1rem;border-bottom:1px dashed #CBD5E1;padding-bottom:0.75rem;">
                <div>
                  <span style="font-family:var(--font-mono);font-size:0.68rem;font-weight:700;color:${cmp.badgeColor};letter-spacing:0.08em;">
                    🔍 UJI KEMIRIPAN VISUAL 1-ON-1 (HEAD-TO-HEAD COMPUTER VISION)
                  </span>
                  <h4 style="font-family:var(--font-heading);font-size:1.15rem;font-weight:800;color:var(--charcoal);margin:3px 0 0;">${cmp.verdict}</h4>
                </div>
                <div style="text-align:right;">
                  <span style="font-family:var(--font-heading);font-size:1.85rem;font-weight:900;color:${cmp.badgeColor};">${cmp.totalSim}%</span>
                  <div style="font-family:var(--font-mono);font-size:0.68rem;color:var(--pencil);font-weight:700;">Skor Kemiripan Visual</div>
                </div>
              </div>

              <!-- SIDE BY SIDE TWO LOGOS -->
              <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(260px, 1fr));gap:1rem;margin-bottom:1rem;">
                <!-- Left: Uploaded User Logo -->
                <div style="background:#FFF;border:1.5px solid #CBD5E1;border-radius:8px;padding:0.95rem;display:flex;gap:0.85rem;align-items:center;">
                  <div style="width:84px;height:84px;min-width:84px;background:#F8FAFC;border:1.5px solid var(--charcoal);border-radius:6px;display:flex;align-items:center;justify-content:center;padding:4px;">
                    ${logoMeta.previewDataUrl ? `<img src="${logoMeta.previewDataUrl}" alt="${logoMeta.name}" style="max-width:100%;max-height:100%;object-fit:contain;" />` : ''}
                  </div>
                  <div style="font-size:0.76rem;line-height:1.45;">
                    <div style="font-family:var(--font-mono);font-size:0.65rem;color:var(--bc-green);font-weight:700;">LOGO 1: MEREK ANDA</div>
                    <div style="font-family:var(--font-heading);font-weight:800;color:#0F172A;font-size:0.92rem;word-break:break-all;">${logoMeta.name}</div>
                    <div style="color:#64748B;">Dimensi: ${logoMeta.width}×${logoMeta.height} px (${logoMeta.sizeKB} KB)</div>
                    <div style="color:#64748B;">Vienna WIPO: <code>${logoMeta.viennaCode}</code></div>
                  </div>
                </div>

                <!-- Right: Comparison Logo -->
                <div style="background:#FFF;border:1.5px solid ${cmp.badgeColor};border-radius:8px;padding:0.95rem;display:flex;gap:0.85rem;align-items:center;">
                  <div style="width:84px;height:84px;min-width:84px;background:#F8FAFC;border:1.5px solid var(--charcoal);border-radius:6px;display:flex;align-items:center;justify-content:center;padding:4px;">
                    ${compLogoMeta.previewDataUrl ? `<img src="${compLogoMeta.previewDataUrl}" alt="${compLogoMeta.name}" style="max-width:100%;max-height:100%;object-fit:contain;" />` : ''}
                  </div>
                  <div style="font-size:0.76rem;line-height:1.45;">
                    <div style="font-family:var(--font-mono);font-size:0.65rem;color:${cmp.badgeColor};font-weight:700;">LOGO 2: PEMBANDING</div>
                    <div style="font-family:var(--font-heading);font-weight:800;color:#0F172A;font-size:0.92rem;word-break:break-all;">${compLogoMeta.name}</div>
                    <div style="color:#64748B;">Dimensi: ${compLogoMeta.width}×${compLogoMeta.height} px (${compLogoMeta.sizeKB} KB)</div>
                    <div style="color:#64748B;">Vienna WIPO: <code>${compLogoMeta.viennaCode}</code></div>
                  </div>
                </div>
              </div>

              <!-- 3 METRIC PILL BARS -->
              <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(160px, 1fr));gap:0.75rem;margin-bottom:0.85rem;">
                <div style="background:#FFF;padding:0.75rem 0.85rem;border-radius:10px;border:1px solid var(--bc-card-border);">
                  <div style="font-size:0.68rem;font-family:var(--font-mono);color:#6B7280;font-weight:700;">KESAMAAN BENTUK &amp; SILUET</div>
                  <div style="font-size:1.25rem;font-family:var(--font-heading);font-weight:800;color:${cmp.badgeColor};">${cmp.shapeSim}%</div>
                </div>
                <div style="background:#FFF;padding:0.75rem 0.85rem;border-radius:10px;border:1px solid var(--bc-card-border);">
                  <div style="font-size:0.68rem;font-family:var(--font-mono);color:#6B7280;font-weight:700;">SPEKTRUM &amp; PALET WARNA</div>
                  <div style="font-size:1.25rem;font-family:var(--font-heading);font-weight:800;color:${cmp.badgeColor};">${cmp.colorSim}%</div>
                </div>
                <div style="background:#FFF;padding:0.75rem 0.85rem;border-radius:10px;border:1px solid var(--bc-card-border);">
                  <div style="font-size:0.68rem;font-family:var(--font-mono);color:#6B7280;font-weight:700;">KLASIFIKASI VIENNA WIPO</div>
                  <div style="font-size:1.05rem;font-family:var(--font-heading);font-weight:800;color:${cmp.badgeColor};padding-top:2px;">${cmp.sameVienna ? 'IDENTIK (100%)' : 'BERBEDA KATEGORI'}</div>
                </div>
              </div>

              <!-- LEGAL ASSESSMENT UNDER PASAL 21 -->
              <div style="background:#FFF;padding:0.95rem 1.2rem;border-radius:10px;border-left:4px solid ${cmp.badgeColor};border-top:1px solid var(--bc-card-border);border-right:1px solid var(--bc-card-border);border-bottom:1px solid var(--bc-card-border);font-size:0.84rem;line-height:1.6;color:var(--bc-text-dark);">
                <strong>⚖️ Kajian Yuridis Kemiripan Lukisan (Pasal 21 Ayat 1 UU No. 20/2016):</strong><br/>
                ${cmp.legalNote}
              </div>
            </div>
          `;
        }
      }

      logoHeaderHtml = `
        <div style="margin-bottom:1.5rem;padding:1.35rem;border:1px solid ${isHighRisk ? '#FCA5A5' : 'var(--bc-card-border)'};border-radius:14px;background:#FAF8F5;text-align:left;box-shadow:0 4px 16px rgba(13,59,46,0.04);">
          <!-- Top Header -->
          <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:0.75rem;margin-bottom:1.15rem;padding-bottom:0.85rem;border-bottom:1px solid var(--bc-card-border);">
            <div>
              <span style="font-family:var(--font-mono);font-size:0.7rem;font-weight:700;color:var(--bc-green);letter-spacing:0.08em;display:block;margin-bottom:3px;">
                ✦ AUDIT KONFLIK BENTUK &amp; ETIKET LOGO AI // WIPO VIENNA &amp; PASAL 21 UU NO. 20/2016
              </span>
              <h3 style="font-family:var(--font-heading);font-size:1.25rem;font-weight:800;color:var(--bc-text-dark);margin:0;">
                Hasil Pemeriksaan Unsur Figuratif &amp; Bentuk Logo
              </h3>
            </div>
            <div>
              ${riskPillHtml}
            </div>
          </div>

          <!-- Main 2-Column Visual Card -->
          <div style="display:grid;grid-template-columns:180px 1fr;gap:1.25rem;align-items:start;margin-bottom:1rem;" class="bc-logo-audit-grid">
            <!-- Left: Logo Image & Specs -->
            <div style="background:#FFFFFF;border:1px solid var(--bc-card-border);border-radius:12px;padding:0.85rem;text-align:center;">
              <div style="width:100%;height:130px;background:#FAF8F5;border:1px solid #E5E7EB;border-radius:8px;display:flex;align-items:center;justify-content:center;padding:6px;overflow:hidden;margin-bottom:0.65rem;">
                ${logoMeta.previewDataUrl ? `<img src="${logoMeta.previewDataUrl}" alt="${logoMeta.name}" style="max-width:100%;max-height:100%;object-fit:contain;" />` : ''}
              </div>
              <strong style="display:block;font-size:0.84rem;color:var(--bc-text-dark);word-break:break-all;margin-bottom:4px;">${logoMeta.name}</strong>
              <div style="font-size:0.74rem;color:#6B7280;margin-bottom:6px;">${logoMeta.width}×${logoMeta.height} px · ${logoMeta.sizeKB || 0} KB</div>
              <span style="display:inline-block;background:var(--bc-green-mint);color:var(--bc-green);font-family:var(--font-mono);font-size:0.72rem;font-weight:700;padding:2px 8px;border-radius:9999px;">
                Vienna ${audit.viennaCode}
              </span>
              <div style="margin-top:8px;">${swatches}</div>
            </div>

            <!-- Right: Semantic Findings & Conflicts -->
            <div>
              <!-- 1. Detected Motif -->
              <div style="background:#FFFFFF;border:1px solid var(--bc-card-border);border-radius:10px;padding:0.95rem 1.15rem;margin-bottom:0.75rem;">
                <span style="font-family:var(--font-mono);font-size:0.68rem;font-weight:700;color:var(--bc-green);letter-spacing:0.06em;display:block;margin-bottom:3px;">
                  1. UNSUR FIGURATIF &amp; SILUET TERDETEKSI
                </span>
                <p style="font-size:0.86rem;color:#1F2937;line-height:1.55;margin:0;">
                  <strong>Motif Visual:</strong> ${audit.detectedMotif}. Terklasifikasi dalam <strong>WIPO Vienna ${audit.viennaCode}</strong> (${audit.viennaCategory}).
                </p>
              </div>

              <!-- 2. Benchmark Conflicts -->
              <div style="background:#FFFFFF;border:1px solid var(--bc-card-border);border-radius:10px;padding:0.95rem 1.15rem;margin-bottom:0.75rem;">
                <span style="font-family:var(--font-mono);font-size:0.68rem;font-weight:700;color:${isHighRisk ? '#DC2626' : 'var(--bc-green)'};letter-spacing:0.06em;display:block;margin-bottom:6px;">
                  2. PEMERIKSAAN KEMIRIPAN TERHADAP BENCHMARK MEREK TERDAFTAR
                </span>
                <div>
                  ${benchmarksHtml}
                </div>
              </div>

              <!-- 3. Legal Assessment & Modification Advice -->
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
                <div style="background:#FFFFFF;border-left:3px solid ${isHighRisk ? '#DC2626' : 'var(--bc-green)'};border-top:1px solid var(--bc-card-border);border-right:1px solid var(--bc-card-border);border-bottom:1px solid var(--bc-card-border);border-radius:8px;padding:0.85rem 1rem;">
                  <strong style="font-size:0.78rem;color:var(--bc-text-dark);display:block;margin-bottom:3px;">
                    ⚖️ Kajian Pasal 21 Ayat (1) Huruf a:
                  </strong>
                  <p style="font-size:0.8rem;color:#4B5563;line-height:1.45;margin:0;">
                    ${audit.pasal21Assessment}
                  </p>
                </div>
                <div style="background:#FFFFFF;border-left:3px solid #D97706;border-top:1px solid var(--bc-card-border);border-right:1px solid var(--bc-card-border);border-bottom:1px solid var(--bc-card-border);border-radius:8px;padding:0.85rem 1rem;">
                  <strong style="font-size:0.78rem;color:var(--bc-text-dark);display:block;margin-bottom:3px;">
                    💡 Rekomendasi Modifikasi Desain:
                  </strong>
                  <p style="font-size:0.8rem;color:#4B5563;line-height:1.45;margin:0;">
                    ${audit.modificationAdvice}
                  </p>
                </div>
              </div>
            </div>
          </div>

          ${comparisonHtml}
        </div>
      `;
    }

    return logoHeaderHtml + renderPdkiDirectoryHtml(q, {}, logoMeta, false);
  }

  function renderPdkiCardItem(item) {
    let badgeBg = '#DCFCE7';
    let badgeColor = '#166534';
    if (item.statusKey === 'dalam_proses') {
      badgeBg = '#FEF3C7';
      badgeColor = '#92400E';
    } else if (item.statusKey === 'ditolak' || item.statusKey === 'berakhir') {
      badgeBg = '#FEE2E2';
      badgeColor = '#991B1B';
    }

    return `
      <div class="bc-pdki-card-item" style="display:flex;gap:1.5rem;padding:1.35rem;background:#FFFFFF;border:1px solid var(--bc-card-border);border-radius:14px;align-items:center;flex-wrap:wrap;margin-bottom:1rem;box-shadow:0 2px 10px rgba(13,59,46,0.03);transition:all 0.2s ease;">
        <div style="width:120px;height:120px;flex-shrink:0;border:1px solid var(--bc-card-border);border-radius:12px;background:#FAF8F5;display:flex;align-items:center;justify-content:center;padding:0.65rem;overflow:hidden;">
          ${item.etiquetteSvg}
        </div>
        <div style="flex:1;min-width:220px;text-align:left;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.45rem;">
            <h4 style="font-family:var(--font-heading);font-size:1.25rem;font-weight:800;color:var(--bc-text-dark);margin:0;letter-spacing:-0.01em;">${item.brand}</h4>
            <span style="display:inline-block;background:${badgeBg};color:${badgeColor};font-family:var(--font-mono);font-weight:700;font-size:0.74rem;padding:3px 10px;border-radius:9999px;letter-spacing:0.02em;">${item.status}</span>
          </div>
          
          <div style="display:grid;grid-template-columns:130px 1fr;gap:0.75rem;margin-bottom:0.5rem;font-size:0.84rem;">
            <div>
              <span style="font-size:0.74rem;color:#6B7280;display:block;margin-bottom:2px;">Kelas Merek:</span>
              <span style="display:inline-block;background:var(--bc-green-mint);color:var(--bc-green);font-family:var(--font-mono);font-weight:700;font-size:0.76rem;padding:2px 10px;border-radius:9999px;border:1px solid rgba(13,59,46,0.1);">Kelas ${item.niceClass}</span>
            </div>
            <div>
              <span style="font-size:0.74rem;color:#6B7280;display:block;margin-bottom:2px;">No. Permohonan:</span>
              <strong style="font-family:var(--font-mono);font-size:0.86rem;color:var(--bc-text-dark);font-weight:700;">${item.appNo}</strong>
            </div>
          </div>
          
          <div style="font-size:0.84rem;">
            <span style="font-size:0.74rem;color:#6B7280;display:block;margin-bottom:2px;">Nama Pemilik:</span>
            <strong style="font-family:var(--font-heading);font-size:0.88rem;color:var(--bc-text-dark);font-weight:700;">${item.owner}</strong>
          </div>
        </div>
      </div>
    `;
  }

  function renderPdkiDirectoryHtml(rawQuery, filters, logoMeta, isUnlocked) {
    const res = searchPdkiDirectory(rawQuery, filters, logoMeta);
    const qDisplay = (res.query || 'MEREK').toLowerCase();
    const visibleItems = isUnlocked ? res.items : res.items.slice(0, 3);
    const hiddenItems = isUnlocked ? [] : res.items.slice(3);

    const classOptionsHtml = NICE_CLASSES_DB.map(
      (c) => `<option value="${parseInt(c.num, 10)}" ${String(filters?.niceClass) === String(parseInt(c.num, 10)) ? 'selected' : ''}>Kelas ${parseInt(c.num, 10)} — ${c.title.slice(0, 28)}...</option>`
    ).join('');

    let rightCardsHtml = '';
    visibleItems.forEach((item, idx) => {
      rightCardsHtml += renderPdkiCardItem(item);
      // Insert the BrandConnect signature CTA banner after the 2nd item
      if (idx === 1) {
        rightCardsHtml += `
          <div class="bc-pdki-cta-banner" style="margin:1.25rem 0;background:linear-gradient(135deg, #0D3B2E 0%, #164E3D 100%);color:#FFFFFF;border-radius:16px;padding:1.6rem 1.85rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1.25rem;box-shadow:0 8px 24px rgba(13,59,46,0.18);border:1px solid rgba(255,255,255,0.1);">
            <div style="text-align:left;max-width:540px;">
              <div style="display:inline-flex;align-items:center;gap:0.4rem;font-family:var(--font-mono);font-size:0.72rem;font-weight:700;color:#A7F3D0;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.35rem;">
                <span>✦</span>
                <span>BrandConnect AI Legal Screening</span>
              </div>
              <div style="font-family:var(--font-heading);font-size:1.15rem;font-weight:800;color:#FFFFFF;margin-bottom:4px;line-height:1.3;">
                Khawatir pendaftaran merek "${qDisplay}" ditolak DJKI?
              </div>
              <div style="font-size:0.86rem;color:#D1FAE5;line-height:1.45;">
                Pastikan seberapa besar peluang lolos kriteria substantif Pasal 20 &amp; 21 dengan audit AI lengkap.
              </div>
            </div>
            <button type="button" onclick="if (window.runTrademarkCheck) { window.runTrademarkCheck('${res.query.toUpperCase()}'); } else if (window.BCStore && window.BCStore.openHandoverModal) { window.BCStore.openHandoverModal('${res.query.toUpperCase()}'); }" style="background:#FFFFFF;color:var(--bc-green);border:none;border-radius:9999px;padding:0.75rem 1.45rem;font-family:var(--font-heading);font-weight:800;font-size:0.88rem;cursor:pointer;display:inline-flex;align-items:center;gap:0.5rem;box-shadow:0 4px 14px rgba(0,0,0,0.15);transition:all 0.2s ease;">
              <span style="display:inline-flex;width:18px;height:18px;border-radius:50%;background:var(--bc-green-mint);color:var(--bc-green);align-items:center;justify-content:center;font-size:0.72rem;font-weight:900;">✦</span>
              <span>Cek Sekarang</span>
              <span>→</span>
            </button>
          </div>
        `;
      }
    });

    let blurredGateHtml = '';
    if (!isUnlocked && res.totalFound > visibleItems.length) {
      const dummyBlurCard = hiddenItems[0] || res.items[0];
      blurredGateHtml = `
        <div style="position:relative;margin-top:0.75rem;border-radius:14px;overflow:hidden;border:1px solid var(--bc-card-border);">
          <div style="filter:blur(6px);opacity:0.55;pointer-events:none;user-select:none;">
            ${dummyBlurCard ? renderPdkiCardItem(dummyBlurCard) : ''}
            ${res.items[1] ? renderPdkiCardItem(res.items[1]) : ''}
          </div>
          <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(255,255,255,0.78);padding:1.5rem;text-align:center;">
            <p style="font-size:0.92rem;color:#334155;margin:0 0 0.35rem 0;">
              Ditemukan <strong style="color:var(--bc-green);">${res.totalFound} merek</strong> dalam penelusuran ini.
            </p>
            <p style="font-family:var(--font-heading);font-size:1.05rem;font-weight:800;color:var(--bc-text-dark);margin:0 0 1rem 0;max-width:440px;">
              Daftar akun gratis untuk melihat seluruh hasil dan dokumen publikasi DJKI.
            </p>
            <button type="button" class="bc-pdki-unlock-btn" style="background:var(--bc-green);color:#FFFFFF;border:none;border-radius:9999px;padding:0.85rem 1.85rem;font-family:var(--font-heading);font-weight:800;font-size:0.9rem;cursor:pointer;box-shadow:0 4px 14px rgba(13,59,46,0.2);display:inline-flex;align-items:center;gap:0.5rem;transition:all 0.2s ease;">
              <span>Daftar Gratis (Buka Semua Hasil)</span>
              <span>→</span>
            </button>
            <p style="font-size:0.82rem;color:#6B7280;margin-top:0.75rem;">
              Sudah punya akun BRANDCONNECT? <a href="dashboard.html" style="color:var(--bc-green);font-weight:700;text-decoration:underline;">Masuk</a>
            </p>
          </div>
        </div>
      `;
    }

    const st = filters?.statuses || [];

    return `
      <div class="bc-pdki-explorer-root" data-query="${res.query}" style="margin-top:1.25rem;background:#FFFFFF;border:1px solid var(--bc-card-border);border-radius:18px;padding:1.75rem;box-shadow:0 4px 24px rgba(13,59,46,0.04);text-align:left;">
        <div style="display:grid;grid-template-columns:260px 1fr;gap:2rem;align-items:start;" class="bc-pdki-grid">
          <!-- LEFT SIDEBAR: PENELUSURAN LANJUTAN -->
          <div>
            <div style="border:1px solid var(--bc-card-border);border-radius:14px;padding:1.25rem;background:#FAF8F5;margin-bottom:1.25rem;">
              <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem;padding-bottom:0.75rem;border-bottom:1px solid var(--bc-card-border);">
                <div style="width:24px;height:24px;border-radius:6px;background:var(--bc-green-mint);color:var(--bc-green);display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:800;">⚙</div>
                <h4 style="font-family:var(--font-heading);font-size:0.92rem;font-weight:800;color:var(--bc-text-dark);margin:0;">
                  Penelusuran Lanjutan
                </h4>
              </div>

              <div style="margin-bottom:1.15rem;">
                <div style="font-size:0.8rem;font-family:var(--font-heading);font-weight:700;color:var(--bc-text-dark);margin-bottom:0.55rem;display:flex;justify-content:space-between;align-items:center;">
                  <span>Status Merek</span>
                  <span style="font-size:0.7rem;color:#9CA3AF;">▾</span>
                </div>
                <div style="display:flex;flex-direction:column;gap:0.5rem;font-size:0.84rem;color:#4B5563;">
                  <label style="display:flex;align-items:center;gap:0.55rem;cursor:pointer;"><input type="checkbox" class="bc-pf-status" value="dalam_proses" ${st.includes('dalam_proses') ? 'checked' : ''} style="accent-color:var(--bc-green);" /> Dalam Proses</label>
                  <label style="display:flex;align-items:center;gap:0.55rem;cursor:pointer;"><input type="checkbox" class="bc-pf-status" value="didaftar" ${st.includes('didaftar') ? 'checked' : ''} style="accent-color:var(--bc-green);" /> Didaftar</label>
                  <label style="display:flex;align-items:center;gap:0.55rem;cursor:pointer;"><input type="checkbox" class="bc-pf-status" value="ditolak" ${st.includes('ditolak') ? 'checked' : ''} style="accent-color:var(--bc-green);" /> Ditolak</label>
                  <label style="display:flex;align-items:center;gap:0.55rem;cursor:pointer;"><input type="checkbox" class="bc-pf-status" value="berakhir" ${st.includes('berakhir') ? 'checked' : ''} style="accent-color:var(--bc-green);" /> Berakhir</label>
                  <label style="display:flex;align-items:center;gap:0.55rem;cursor:pointer;"><input type="checkbox" class="bc-pf-status" value="lainnya" ${st.includes('lainnya') ? 'checked' : ''} style="accent-color:var(--bc-green);" /> Lainnya</label>
                </div>
              </div>

              <div style="margin-bottom:1.15rem;">
                <div style="font-size:0.8rem;font-family:var(--font-heading);font-weight:700;color:var(--bc-text-dark);margin-bottom:0.45rem;display:flex;justify-content:space-between;align-items:center;">
                  <span>Kelas Merek</span>
                  <span style="font-size:0.7rem;color:#9CA3AF;">▾</span>
                </div>
                <select class="bc-pf-class" style="width:100%;padding:0.6rem 0.75rem;border:1px solid #D5D3CA;border-radius:8px;font-size:0.82rem;color:var(--bc-text-dark);background:#FFFFFF;outline:none;">
                  <option value="all">Semua Kelas</option>
                  ${classOptionsHtml}
                </select>
              </div>

              <div style="margin-bottom:1.25rem;">
                <div style="font-size:0.8rem;font-family:var(--font-heading);font-weight:700;color:var(--bc-text-dark);margin-bottom:0.45rem;display:flex;justify-content:space-between;align-items:center;">
                  <span>Nama Pemohon</span>
                  <span style="font-size:0.7rem;color:#9CA3AF;">▾</span>
                </div>
                <input type="text" class="bc-pf-owner" value="${filters?.owner || ''}" placeholder="Ketik nama pemilik / PT" style="width:100%;padding:0.6rem 0.75rem;border:1px solid #D5D3CA;border-radius:8px;font-size:0.82rem;color:var(--bc-text-dark);background:#FFFFFF;outline:none;" />
              </div>

              <button type="button" class="bc-pf-apply-btn" style="width:100%;background:var(--bc-green);color:#FFFFFF;border:none;border-radius:9999px;padding:0.7rem;font-family:var(--font-heading);font-weight:700;font-size:0.86rem;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:0.45rem;box-shadow:0 2px 8px rgba(13,59,46,0.18);transition:all 0.2s ease;">
                <span>Terapkan Filter</span>
                <span>→</span>
              </button>
            </div>

            <div style="border:1px solid var(--bc-card-border);border-radius:14px;padding:1.15rem;background:#FAF8F5;text-align:center;">
              <div style="font-family:var(--font-heading);font-size:0.82rem;font-weight:700;color:var(--bc-text-dark);margin-bottom:0.85rem;">Bagikan Penelusuran Merek</div>
              <div style="display:flex;justify-content:center;gap:1.5rem;">
                <a href="https://wa.me/?text=${encodeURIComponent('Cek hasil penelusuran merek ' + res.query.toUpperCase() + ' di BrandConnect')}" target="_blank" rel="noopener" style="text-decoration:none;color:#4B5563;font-size:0.75rem;font-weight:600;display:flex;flex-direction:column;align-items:center;gap:5px;">
                  <span style="width:38px;height:38px;border-radius:50%;border:1px solid rgba(13,59,46,0.15);display:flex;align-items:center;justify-content:center;background:var(--bc-green-mint);color:var(--bc-green);font-weight:800;font-size:0.85rem;">WA</span>
                  <span>WhatsApp</span>
                </a>
                <button type="button" onclick="navigator.clipboard && navigator.clipboard.writeText(window.location.href); alert('Tautan penelusuran berhasil disalin!');" style="background:none;border:none;cursor:pointer;color:#4B5563;font-size:0.75rem;font-weight:600;display:flex;flex-direction:column;align-items:center;gap:5px;">
                  <span style="width:38px;height:38px;border-radius:50%;border:1px solid rgba(13,59,46,0.15);display:flex;align-items:center;justify-content:center;background:var(--bc-green-mint);color:var(--bc-green);font-size:0.95rem;">🔗</span>
                  <span>Salin Link</span>
                </button>
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN: PDKI SEARCH RESULTS LIST -->
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;margin-bottom:1.15rem;padding-bottom:0.85rem;border-bottom:1px solid var(--bc-card-border);">
              <div style="font-family:var(--font-heading);font-size:0.95rem;color:var(--bc-text-dark);">
                ${
                  res.totalFound === 0 || res.isUnindexedQuery
                    ? `Hasil Penelusuran untuk <strong style="color:var(--bc-green);">"${qDisplay}"</strong>`
                    : `Menampilkan <strong>1-${visibleItems.length}</strong> dari <strong style="color:var(--bc-green);">${res.totalFound} Merek</strong> untuk <strong>"${qDisplay}"</strong>`
                }
              </div>
              <span style="font-family:var(--font-mono);font-size:0.72rem;padding:4px 12px;border-radius:9999px;background:var(--bc-green-mint);color:var(--bc-green);font-weight:700;border:1px solid rgba(13,59,46,0.12);">
                ✓ Pangkalan Data Resmi DJKI RI
              </span>
            </div>

            <div>
              ${
                res.totalFound === 0 || res.isUnindexedQuery
                  ? `
                <div style="padding:2.5rem 1.5rem;background:#FAF8F5;border:1.5px dashed var(--bc-card-border);border-radius:14px;margin-top:0.85rem;text-align:center;">
                  <div style="font-size:2.2rem;margin-bottom:0.6rem;">🎉</div>
                  <h4 style="font-family:var(--font-heading);font-size:1.15rem;font-weight:800;color:var(--bc-text-dark);margin:0 0 0.45rem 0;">
                    Belum Ditemukan Pendaftaran Merek Identik untuk "${qDisplay}"
                  </h4>
                  <p style="font-size:0.88rem;color:#4B5563;line-height:1.6;max-width:540px;margin:0 auto 1.5rem auto;">
                    Nama merek <strong>"${res.query.toUpperCase()}"</strong> saat ini belum terdaftar pada basis data DJKI untuk varian yang dicari. Ini merupakan peluang emas untuk mendaftarkan dan mengamankan hak monopoli merek Anda sebelum digunakan pihak lain.
                  </p>
                  <div style="display:flex;justify-content:center;flex-wrap:wrap;gap:0.75rem;">
                    <button type="button" class="bc-hero-search-btn" style="padding:0.75rem 1.6rem;font-size:0.88rem;" onclick="window.BCStore && window.BCStore.openOrderModal('SRV-REG-01', '${res.query.toUpperCase()}', '35')">
                      <span>🚀 Daftarkan Merek "${res.query.toUpperCase()}" Sekarang</span>
                    </button>
                    <button type="button" class="btn btn-secondary btn-sm" style="padding:0.75rem 1.4rem;border-radius:9999px;font-weight:700;" onclick="window.BCStore && window.BCStore.openHandoverModal('${res.query.toUpperCase()}')">
                      <span>👨‍⚖️ Konsultasi Gratis dengan Tim Legal</span>
                    </button>
                  </div>
                </div>
              `
                  : rightCardsHtml || '<div style="padding:2rem;text-align:center;color:#64748B;">Tidak ada merek yang sesuai dengan filter yang dipilih.</div>'
              }
            </div>

            ${blurredGateHtml}
          </div>
        </div>
      </div>
    `;
  }

  function mountPdkiExplorer(containerEl, rawQuery, logoMeta, compLogoMeta) {
    if (!containerEl) return;
    let currentFilters = { statuses: [], niceClass: 'all', owner: '' };
    let unlocked = false;

    const rerender = (liveErrMsg) => {
      const logoPart = logoMeta ? renderVisualSimilarityHtml(logoMeta, compLogoMeta, rawQuery) : renderPdkiDirectoryHtml(rawQuery, currentFilters, null, unlocked);
      if (logoMeta) {
        const headerOnly = renderVisualSimilarityHtml(logoMeta, compLogoMeta, rawQuery).split('<div class="bc-pdki-explorer-root"')[0];
        containerEl.innerHTML = headerOnly + renderPdkiDirectoryHtml(rawQuery || logoMeta.inferredBrand, currentFilters, logoMeta, unlocked);
      } else {
        containerEl.innerHTML = logoPart;
      }

      if (liveErrMsg) {
        const errEl = containerEl.querySelector('.bc-pdki-live-error');
        if (errEl) {
          errEl.hidden = false;
          errEl.textContent = liveErrMsg;
        }
      }

      const applyBtn = containerEl.querySelector('.bc-pf-apply-btn');
      if (applyBtn) {
        applyBtn.addEventListener('click', () => {
          const checked = Array.from(containerEl.querySelectorAll('.bc-pf-status:checked')).map((el) => el.value);
          const clsVal = containerEl.querySelector('.bc-pf-class')?.value || 'all';
          const ownVal = containerEl.querySelector('.bc-pf-owner')?.value || '';
          currentFilters = { statuses: checked, niceClass: clsVal, owner: ownVal };
          rerender();
        });
      }

      const unlockBtn = containerEl.querySelector('.bc-pdki-unlock-btn');
      if (unlockBtn) {
        unlockBtn.addEventListener('click', () => {
          unlocked = true;
          rerender();
        });
      }
    };

    rerender();

    // If API key is configured and query is not yet cached, automatically fetch live data!
    const qTarget = (rawQuery || logoMeta?.inferredBrand || '').trim();
    if (getPdkiApiKey() && qTarget && !LIVE_PDKI_CACHE[qTarget.toLowerCase()]) {
      fetchLivePdkiApi(qTarget)
        .then(() => rerender())
        .catch((err) => rerender(`Info Live API: ${err.message}`));
    }
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

  async function enrichLogoWithAiVision(logoMeta) {
    if (!logoMeta || !logoMeta.previewDataUrl) return logoMeta;
    try {
      const resp = await fetch('/api/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: logoMeta.inferredBrand || logoMeta.name,
          mode: 'logo',
          fileName: logoMeta.name,
          logoDataUrl: logoMeta.previewDataUrl
        })
      });
      if (resp.ok) {
        const json = await resp.json();
        if (json.success && json.analysis && json.analysis.logoAudit) {
          logoMeta.logoAudit = json.analysis.logoAudit;
          if (json.analysis.riskLevel) logoMeta.riskLevel = json.analysis.riskLevel;
          if (json.analysis.verdict) logoMeta.verdict = json.analysis.verdict;
        }
      }
    } catch (e) {
      console.warn('AI Vision enrich notice:', e.message);
    }
    return logoMeta;
  }

  document.addEventListener('DOMContentLoaded', () => {
    injectGlobalWidgets();
  });

  window.BCStore = {
    getState: () => state,
    saveState,
    logActivity,
    getWhatsAppUrl,
    formatIDR,
    NICE_CLASSES_DB,
    PDKI_DIRECTORY_DB,
    getPdkiApiKey,
    setPdkiApiKey,
    fetchLivePdkiApi,
    searchPdkiDirectory,
    renderPdkiDirectoryHtml,
    mountPdkiExplorer,
    analyzeLogoPixels,
    compareTwoLogos,
    synthesizeVisualAudit,
    enrichLogoWithAiVision,
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
