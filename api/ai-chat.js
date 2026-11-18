// Vercel Serverless Function: AI Trademark Assistant Chat (RAG + Live DJKI Lookup)
const DJKI_API_KEY = process.env.PDKI_API_KEY || 'aip_live_tW5NibLE0C8rjVIF6jOYon3PgdbTsE01';

const MAJOR_BRANDS = {
  kahf: { brand: 'KAHF', owner: 'PT PARAGON TECHNOLOGY AND INNOVATION', classes: '03, 16, 18, 20, 24, 25', note: 'Merek perawatan pria & kosmetik terdaftar resmi.' },
  paragon: { brand: 'PARAGON', owner: 'PT PARAGON TECHNOLOGY AND INNOVATION', classes: '03, 35', note: 'Merek grup kosmetik terkemuka terdaftar.' },
  'ms glow': { brand: 'MS GLOW', owner: 'PT KOSMETIKA CANTIK INDONESIA / SHANDY PURNAMASARI', classes: '03, 05, 35, 44', note: 'Merek skincare & kosmetik terkenal terdaftar di Kelas 03.' },
  msglow: { brand: 'MS GLOW', owner: 'PT KOSMETIKA CANTIK INDONESIA / SHANDY PURNAMASARI', classes: '03, 05, 35, 44', note: 'Merek skincare & kosmetik terkenal terdaftar di Kelas 03.' },
  somethinc: { brand: 'SOMETHINC', owner: 'PT ROYAL PESONA INDONESIA', classes: '03, 35', note: 'Merek skincare terdaftar resmi di DJKI.' },
  scarlett: { brand: 'SCARLETT', owner: 'FELICYA ANGELISTA / PT CARSLAN', classes: '03, 35', note: 'Merek perawatan tubuh & wajah terdaftar resmi.' },
  wardah: { brand: 'WARDAH', owner: 'PT PARAGON TECHNOLOGY AND INNOVATION', classes: '03, 35, 44', note: 'Merek terkenal kosmetik terdaftar di Kelas 03.' },
  emina: { brand: 'EMINA', owner: 'PT PARAGON TECHNOLOGY AND INNOVATION', classes: '03, 35', note: 'Merek kosmetik terdaftar resmi.' },
  'make over': { brand: 'MAKE OVER', owner: 'PT PARAGON TECHNOLOGY AND INNOVATION', classes: '03', note: 'Merek kosmetik terdaftar resmi.' },
  biore: { brand: 'BIORE', owner: 'KAO CORPORATION', classes: '03', note: 'Merek terkenal perawatan kulit terdaftar.' },
  garnier: { brand: 'GARNIER', owner: "L'OREAL", classes: '03', note: 'Merek terkenal kosmetik internasional.' },
  ponds: { brand: "POND'S", owner: 'UNILEVER N.V.', classes: '03', note: 'Merek terkenal perawatan wajah terdaftar.' },
  nivea: { brand: 'NIVEA', owner: 'BEIERSDORF AG', classes: '03, 05', note: 'Merek terkenal perawatan kulit internasional.' },
  vaseline: { brand: 'VASELINE', owner: 'UNILEVER N.V.', classes: '03, 05', note: 'Merek terkenal terdaftar.' },
  dettol: { brand: 'DETTOL', owner: 'RECKITT BENCKISER', classes: '03, 05', note: 'Merek antiseptik terkenal terdaftar.' },
  lifebuoy: { brand: 'LIFEBUOY', owner: 'UNILEVER N.V.', classes: '03, 05', note: 'Merek sabun terkenal terdaftar.' },
  sensatia: { brand: 'SENSATIA BOTANICALS', owner: 'PT SENSATIA BOTANICALS', classes: '03, 35', note: 'Merek skincare alami terdaftar.' },
  avoskin: { brand: 'AVOSKIN', owner: 'PT AVO INNOVATION TECHNOLOGY', classes: '03, 35', note: 'Merek skincare terdaftar resmi.' },
  erha: { brand: 'ERHA', owner: 'PT DHARMA NUSA ABADI / ERHA CLINIC GROUP', classes: '03, 05, 44', note: 'Merek klinik & skincare terdaftar.' },
  onitsuka: { brand: 'ONITSUKA TIGER', owner: 'ASICS CORPORATION', classes: '25, 18, 35', note: 'Merek alas kaki terkenal internasional.' },
  'onitsuka tiger': { brand: 'ONITSUKA TIGER', owner: 'ASICS CORPORATION', classes: '25, 18, 35', note: 'Merek alas kaki terkenal internasional.' },
  asics: { brand: 'ASICS', owner: 'ASICS CORPORATION', classes: '25, 28, 35', note: 'Merek olahraga terkenal internasional.' },
  adidas: { brand: 'ADIDAS', owner: 'ADIDAS AG', classes: '25, 18, 28, 35', note: 'Merek terkenal global dilindungi Pasal 21 ayat (1) huruf b & c.' },
  nike: { brand: 'NIKE', owner: 'NIKE INNOVATE C.V.', classes: '25, 18, 28, 35', note: 'Merek terkenal global.' },
  puma: { brand: 'PUMA', owner: 'PUMA SE', classes: '25, 18, 28', note: 'Merek terkenal global.' },
  converse: { brand: 'CONVERSE', owner: 'CONVERSE INC.', classes: '25', note: 'Merek alas kaki terkenal global.' },
  vans: { brand: 'VANS', owner: 'VANS, INC.', classes: '25, 18', note: 'Merek alas kaki & apparel terkenal.' },
  'new balance': { brand: 'NEW BALANCE', owner: 'NEW BALANCE ATHLETICS, INC.', classes: '25', note: 'Merek alas kaki terkenal.' },
  reebok: { brand: 'REEBOK', owner: 'REEBOK INTERNATIONAL', classes: '25, 28', note: 'Merek olahraga terkenal.' },
  skechers: { brand: 'SKECHERS', owner: 'SKECHERS U.S.A., INC.', classes: '25', note: 'Merek alas kaki terkenal.' },
  zara: { brand: 'ZARA', owner: 'INDITEX S.A.', classes: '25, 35', note: 'Merek ritel fashion terkenal global.' },
  uniqlo: { brand: 'UNIQLO', owner: 'FAST RETAILING CO., LTD.', classes: '25, 35', note: 'Merek fashion terkenal global.' },
  'h&m': { brand: 'H&M', owner: 'H & M HENNES & MAURITZ AB', classes: '25, 35', note: 'Merek ritel fashion terkenal global.' },
  gucci: { brand: 'GUCCI', owner: 'GUCCIO GUCCI S.P.A.', classes: '03, 14, 18, 25, 35', note: 'Merek mewah terkenal global.' },
  chanel: { brand: 'CHANEL', owner: 'CHANEL SARL', classes: '03, 14, 18, 25', note: 'Merek mewah terkenal global.' },
  'louis vuitton': { brand: 'LOUIS VUITTON', owner: 'LOUIS VUITTON MALLETIER', classes: '14, 18, 25', note: 'Merek mewah terkenal global.' },
  dior: { brand: 'DIOR', owner: 'CHRISTIAN DIOR COUTURE', classes: '03, 14, 18, 25', note: 'Merek mewah terkenal global.' },
  prada: { brand: 'PRADA', owner: 'PRADA S.A.', classes: '18, 25', note: 'Merek mewah terkenal global.' },
  hermes: { brand: 'HERMES', owner: 'HERMES INTERNATIONAL', classes: '14, 18, 25', note: 'Merek mewah terkenal global.' },
  apple: { brand: 'APPLE', owner: 'APPLE INC.', classes: '09, 35, 38, 42', note: 'Merek teknologi terkenal global.' },
  samsung: { brand: 'SAMSUNG', owner: 'SAMSUNG ELECTRONICS CO., LTD.', classes: '07, 09, 11, 42', note: 'Merek elektronik terkenal global.' },
  xiaomi: { brand: 'XIAOMI', owner: 'XIAOMI INC.', classes: '09, 11, 35', note: 'Merek teknologi terkenal global.' },
  oppo: { brand: 'OPPO', owner: 'GUANGDONG OPPO MOBILE TELECOMMUNICATIONS', classes: '09', note: 'Merek perangkat mobile terkenal.' },
  vivo: { brand: 'VIVO', owner: 'VIVO MOBILE COMMUNICATION CO., LTD.', classes: '09', note: 'Merek perangkat mobile terkenal.' },
  asus: { brand: 'ASUS', owner: 'ASUSTEK COMPUTER INC.', classes: '09, 42', note: 'Merek komputer & elektronik terkenal.' },
  lenovo: { brand: 'LENOVO', owner: 'LENOVO (BEIJING) LIMITED', classes: '09, 42', note: 'Merek komputer terkenal.' },
  sony: { brand: 'SONY', owner: 'SONY GROUP CORPORATION', classes: '09, 28, 41', note: 'Merek elektronik & hiburan terkenal.' },
  lg: { brand: 'LG', owner: 'LG CORP.', classes: '07, 09, 11', note: 'Merek elektronik terkenal.' },
  indomie: { brand: 'INDOMIE', owner: 'PT INDOFOOD CBP SUKSES MAKMUR TBK', classes: '30, 35', note: 'Merek mi instan terkenal Indonesia.' },
  'mie sedaap': { brand: 'MIE SEDAAP', owner: 'PT KARUNIA ALAM SEGAR (WINGS GROUP)', classes: '30', note: 'Merek mi instan terkenal terdaftar.' },
  'kopi kenangan': { brand: 'KOPI KENANGAN', owner: 'PT BUMI BERKAH BOGA', classes: '30, 32, 35, 43', note: 'Merek kedai kopi & minuman terkenal terdaftar.' },
  'janji jiwa': { brand: 'JANJI JIWA', owner: 'PT LUNA BOGA NARAYAN', classes: '30, 43', note: 'Merek kedai kopi terkenal terdaftar.' },
  'fore coffee': { brand: 'FORE COFFEE', owner: 'PT FORE KOPI INDONESIA', classes: '30, 35, 43', note: 'Merek kedai kopi modern terdaftar.' },
  starbucks: { brand: 'STARBUCKS', owner: 'STARBUCKS CORPORATION', classes: '30, 35, 43', note: 'Merek kedai kopi terkenal global.' },
  chatime: { brand: 'CHATIME', owner: 'LA KAFFA INTERNATIONAL / KAWAN LAMA', classes: '30, 32, 43', note: 'Merek minuman teh terkenal terdaftar.' },
  mixue: { brand: 'MIXUE', owner: 'ZHENGZHOU LIANGJIAQI / MIXUEBINGCHENG', classes: '30, 32, 43', note: 'Merek es krim & teh terkenal terdaftar.' },
  mebiso: { brand: 'MEBISO', owner: 'PT MEBISO TEKNOLOGI INDONESIA', classes: '35, 42, 45', note: 'Merek platform cek merek terdaftar.' },
  bca: { brand: 'BCA', owner: 'PT BANK CENTRAL ASIA TBK', classes: '09, 36, 42', note: 'Merek perbankan terkenal Indonesia.' },
  mandiri: { brand: 'MANDIRI', owner: 'PT BANK MANDIRI (PERSERO) TBK', classes: '36', note: 'Merek perbankan terkenal terdaftar.' },
  bri: { brand: 'BRI', owner: 'PT BANK RAKYAT INDONESIA (PERSERO) TBK', classes: '36', note: 'Merek perbankan terkenal terdaftar.' },
  bni: { brand: 'BNI', owner: 'PT BANK NEGARA INDONESIA (PERSERO) TBK', classes: '36', note: 'Merek perbankan terkenal terdaftar.' },
  telkomsel: { brand: 'TELKOMSEL', owner: 'PT TELEKOMUNIKASI SELULAR', classes: '09, 38, 42', note: 'Merek telekomunikasi terkenal.' },
  indosat: { brand: 'INDOSAT', owner: 'PT INDOSAT TBK', classes: '38', note: 'Merek telekomunikasi terkenal.' },
  xl: { brand: 'XL', owner: 'PT XL AXIATA TBK', classes: '38', note: 'Merek telekomunikasi terkenal.' },
  gojek: { brand: 'GOJEK', owner: 'PT GO-JEK INDONESIA / GOTO', classes: '09, 35, 36, 39, 42', note: 'Merek super-app terkenal Indonesia.' },
  tokopedia: { brand: 'TOKOPEDIA', owner: 'PT TOKOPEDIA', classes: '09, 35, 42', note: 'Merek marketplace terkenal terdaftar.' },
  shopee: { brand: 'SHOPEE', owner: 'SHOPEE LIMITED', classes: '09, 35, 36, 42', note: 'Merek marketplace terkenal terdaftar.' },
  lazada: { brand: 'LAZADA', owner: 'LAZADA SOUTH EAST ASIA', classes: '35, 42', note: 'Merek marketplace terkenal.' },
  grab: { brand: 'GRAB', owner: 'GRABTAXI HOLDINGS', classes: '09, 39, 42', note: 'Merek transportasi & aplikasi terkenal.' },
  traveloka: { brand: 'TRAVELOKA', owner: 'PT TRINUSA TRAVELINDO', classes: '09, 39, 43', note: 'Merek layanan perjalanan terkenal.' },
  pertamina: { brand: 'PERTAMINA', owner: 'PT PERTAMINA (PERSERO)', classes: '01, 04, 35, 37, 39', note: 'Merek energi BUMN terkenal.' },
  unilever: { brand: 'UNILEVER', owner: 'UNILEVER N.V.', classes: '03, 05, 29, 30', note: 'Merek FMCG terkenal global.' },
  nestle: { brand: 'NESTLE', owner: 'SOCIETE DES PRODUITS NESTLE S.A.', classes: '05, 29, 30, 32', note: 'Merek makanan & minuman terkenal global.' },
  aqua: { brand: 'AQUA', owner: 'PT TIRTA INVESTAMA (DANONE)', classes: '32', note: 'Merek air minum dalam kemasan terkenal.' },
  'le minerale': { brand: 'LE MINERALE', owner: 'PT TIRTA FRESINDO JAYA (MAYORA)', classes: '32', note: 'Merek air mineral terkenal terdaftar.' },
  djarum: { brand: 'DJARUM', owner: 'PT DJARUM', classes: '34', note: 'Merek rokok terkenal Indonesia.' },
  sampoerna: { brand: 'SAMPOERNA', owner: 'PT HM SAMPOERNA TBK', classes: '34', note: 'Merek rokok terkenal Indonesia.' },
  'gudang garam': { brand: 'GUDANG GARAM', owner: 'PT GUDANG GARAM TBK', classes: '34', note: 'Merek rokok terkenal Indonesia.' },
  'batik keris': { brand: 'BATIK KERIS', owner: 'PT BATIK KERIS', classes: '24, 25, 35', note: 'Merek batik & retail terkenal terdaftar.' },
  erigo: { brand: 'ERIGO', owner: 'PT ERIGO APPAREL INDONESIA', classes: '18, 25, 35', note: 'Merek apparel lokal terkenal terdaftar.' },
  eiger: { brand: 'EIGER', owner: 'PT EIGERINDO MULTI PRODUK INDUSTRI', classes: '18, 22, 25, 35', note: 'Merek perlengkapan outdoor terkenal.' },
  polygon: { brand: 'POLYGON', owner: 'PT INSERA SENA', classes: '12, 28, 35', note: 'Merek sepeda terkenal Indonesia.' },
  polytron: { brand: 'POLYTRON', owner: 'PT HARTONO ISTANA TEKNOLOGI', classes: '07, 09, 11', note: 'Merek elektronik terkenal Indonesia.' },
  'kapal api': { brand: 'KAPAL API', owner: 'PT SANTOS JAYA ABADI', classes: '30', note: 'Merek kopi terkenal Indonesia.' },
  'teh botol': { brand: 'TEH BOTOL SOSRO', owner: 'PT SINAR SOSRO', classes: '30, 32', note: 'Merek minuman teh terkenal Indonesia.' },
  'pocari sweat': { brand: 'POCARI SWEAT', owner: 'OTSUKA PHARMACEUTICAL', classes: '32', note: 'Merek minuman isotonik terkenal.' },
  'ultra milk': { brand: 'ULTRA MILK', owner: 'PT ULTRAJAYA MILK INDUSTRY', classes: '29', note: 'Merek susu UHT terkenal.' },
  cimory: { brand: 'CIMORY', owner: 'PT CISARUA MOUNTAIN DAIRY', classes: '29, 30, 32, 43', note: 'Merek olahan susu & restoran terkenal.' },
  silverqueen: { brand: 'SILVERQUEEN', owner: 'PT PERUSAHAAN INDUSTRI CERES', classes: '30', note: 'Merek cokelat terkenal Indonesia.' },
  'tolak angin': { brand: 'TOLAK ANGIN', owner: 'PT INDUSTRI JAMU DAN FARMASI SIDO MUNCUL', classes: '05, 30', note: 'Merek obat herbal terkenal.' },
  sidomuncul: { brand: 'SIDO MUNCUL', owner: 'PT INDUSTRI JAMU DAN FARMASI SIDO MUNCUL', classes: '05, 30, 35', note: 'Merek jamu & herbal terkenal.' }
};

const NICE_CLASS_RULES = [
  {
    num: '03', type: 'BARANG', title: 'Kosmetik, Skincare, Sabun & Parfum',
    keywords: ['skincare', 'kosmetik', 'serum', 'sabun', 'shampo', 'parfum', 'lotion', 'lipstik', 'sunscreen', 'wajah', 'kecantikan', 'krim', 'toner', 'facial wash', 'body care'],
    strategy: 'Wajib untuk produk fisik kecantikan/perawatan diri. Disarankan didampingi **Kelas 35** jika memiliki toko ritel/reseller/marketplace.'
  },
  {
    num: '05', type: 'BARANG', title: 'Farmasi, Obat Herbal, Jamu & Suplemen',
    keywords: ['obat', 'farmasi', 'herbal', 'jamu', 'vitamin', 'suplemen', 'madu herbal', 'salep', 'medis', 'pelangsing', 'kolagen', 'suplement'],
    strategy: 'Melindungi produk kesehatan, jamu berizin BPOM/TR, maupun suplemen konsumsi.'
  },
  {
    num: '09', type: 'BARANG', title: 'Aplikasi Mobile, Software & Elektronik',
    keywords: ['aplikasi', 'software', 'app', 'perangkat lunak', 'komputer', 'gadget', 'elektronik', 'kacamata', 'pos', 'game', 'apk'],
    strategy: 'Melindungi aplikasi yang dapat diunduh (iOS/Android) atau perangkat keras elektronik. Untuk layanan SaaS/web, kombinasikan dengan **Kelas 42**.'
  },
  {
    num: '14', type: 'BARANG', title: 'Perhiasan, Logam Mulia, Emas & Jam Tangan',
    keywords: ['perhiasan', 'emas', 'perak', 'berlian', 'cincin', 'kalung', 'gelang', 'jam tangan', 'arloji', 'jewelry'],
    strategy: 'Melindungi produk perhiasan dan penunjuk waktu.'
  },
  {
    num: '18', type: 'BARANG', title: 'Tas, Dompet, Koper & Barang Kulit',
    keywords: ['tas', 'dompet', 'ransel', 'koper', 'tote bag', 'kulit', 'selempang', 'pouch'],
    strategy: 'Sering dikombinasikan dengan **Kelas 25** (pakaian) untuk merek fashion dan aksesori.'
  },
  {
    num: '20', type: 'BARANG', title: 'Furnitur, Mebel, Kasur & Dekorasi Rumah',
    keywords: ['furnitur', 'furniture', 'mebel', 'kursi', 'meja', 'lemari', 'kasur', 'bantal', 'springbed', 'dekorasi kayu'],
    strategy: 'Melindungi produk mebel dan interior fisik.'
  },
  {
    num: '25', type: 'BARANG', title: 'Pakaian, Kaos, Hijab, Sepatu & Topi',
    keywords: ['pakaian', 'baju', 'kaos', 'kemeja', 'celana', 'jaket', 'hoodie', 'gamis', 'hijab', 'kerudung', 'sepatu', 'sandal', 'sneakers', 'topi', 'fashion', 'apparel', 'distro', 'batik', 'busana'],
    strategy: 'Kelas paling padat di DJKI. Sangat disarankan menambahkan **Kelas 35** untuk nama butik atau toko online.'
  },
  {
    num: '29', type: 'BARANG', title: 'Olahan Daging, Ikan, Frozen Food, Susu & Minyak',
    keywords: ['frozen food', 'nugget', 'sosis', 'bakso', 'dimsum', 'daging', 'ikan', 'susu', 'keju', 'yoghurt', 'minyak goreng', 'abon', 'rendang', 'ayam goreng kemasan', 'keripik kentang', 'keripik buah'],
    strategy: 'Mencakup produk pangan berbasis hewani, susu, dan sayur/buah olahan.'
  },
  {
    num: '30', type: 'BARANG', title: 'Kopi, Teh, Coklat, Roti, Kue, Snack, Beras & Bumbu',
    keywords: ['kopi', 'coffee', 'biji kopi', 'bubuk kopi', 'teh', 'tea', 'coklat', 'roti', 'bakery', 'kue', 'biskuit', 'cookies', 'pastry', 'mie', 'beras', 'tepung', 'madu', 'es krim', 'sambal', 'saus', 'kecap', 'bumbu', 'kerupuk', 'snack', 'camilan', 'makanan ringan'],
    strategy: 'Melindungi produk kopi kemasan, kue, roti, bumbu, dan camilan olahan berbasis tepung/gula/nabati.'
  },
  {
    num: '32', type: 'BARANG', title: 'Air Mineral, Jus Buah, Sirup & Minuman Non-Alkohol',
    keywords: ['air mineral', 'amdk', 'jus', 'sirup', 'soda', 'isotonik', 'minuman ringan', 'minuman rasa', 'boba', 'minuman botolan'],
    strategy: 'Cocok untuk produk minuman segar non-susu dan non-kopi dalam kemasan siap konsumsi.'
  },
  {
    num: '35', type: 'JASA', title: 'Toko Retail, Toko Online, Marketplace, Periklanan & Bisnis',
    keywords: ['toko', 'retail', 'eceran', 'grosir', 'toko online', 'marketplace', 'e-commerce', 'periklanan', 'advertising', 'agency', 'marketing', 'konsultan bisnis', 'franchise', 'waralaba', 'minimarket', 'jualan', 'dagang'],
    strategy: 'Kelas jasa defensif terpenting bagi brand lokal untuk melindungi nama toko fisik, toko online, dan sistem reseller/waralaba.'
  },
  {
    num: '36', type: 'JASA', title: 'Keuangan, Perbankan, Fintech, Asuransi & Properti',
    keywords: ['keuangan', 'fintech', 'asuransi', 'properti', 'real estate', 'broker', 'investasi', 'perumahan', 'developer'],
    strategy: 'Melindungi layanan jasa keuangan, pembiayaan, dan pengelolaan/penjualan properti.'
  },
  {
    num: '37', type: 'JASA', title: 'Konstruksi Bangunan, Renovasi, Bengkel & Laundry',
    keywords: ['konstruksi', 'kontraktor', 'renovasi', 'bengkel', 'cuci mobil', 'laundry', 'servis ac', 'perbaikan'],
    strategy: 'Melindungi layanan pemeliharaan, perbaikan, pencucian, dan pembangunan fisik.'
  },
  {
    num: '39', type: 'JASA', title: 'Ekspedisi, Logistik, Kurir, Travel & Tour',
    keywords: ['ekspedisi', 'logistik', 'kargo', 'kurir', 'pengiriman', 'travel', 'tour', 'umroh', 'rental mobil', 'pariwisata'],
    strategy: 'Melindungi layanan pengiriman barang dan biro perjalanan/transportasi.'
  },
  {
    num: '41', type: 'JASA', title: 'Pendidikan, Kursus, Pelatihan, EO & Hiburan',
    keywords: ['pendidikan', 'sekolah', 'kursus', 'bimbel', 'pelatihan', 'training', 'workshop', 'event organizer', 'eo', 'hiburan', 'studio foto', 'gym', 'olahraga', 'edukasi'],
    strategy: 'Melindungi lembaga kursus, akademi, bimbingan belajar, maupun penyelenggara acara.'
  },
  {
    num: '42', type: 'JASA', title: 'Layanan IT, Pembuatan Software/Web, Cloud SaaS & Desain',
    keywords: ['it', 'software house', 'web development', 'website', 'saas', 'cloud', 'ai', 'desain grafis', 'desain interior', 'arsitektur', 'teknologi'],
    strategy: 'Melindungi perusahaan pengembang perangkat lunak, platform web/SaaS berbasis langganan, dan jasa desain teknis.'
  },
  {
    num: '43', type: 'JASA', title: 'Restoran, Kafe, Kedai Kopi, Katering & Hotel',
    keywords: ['restoran', 'rumah makan', 'kafe', 'cafe', 'coffee shop', 'kedai kopi', 'kedai', 'warkop', 'katering', 'catering', 'cloud kitchen', 'kuliner', 'warung', 'bakery cafe', 'hotel', 'villa', 'penginapan'],
    strategy: 'Wajib dimiliki bisnis kuliner yang menyajikan makanan/minuman atau membuka tempat makan/kedai.'
  },
  {
    num: '44', type: 'JASA', title: 'Klinik Kesehatan, Klinik Kecantikan, Salon, Spa & Barbershop',
    keywords: ['klinik', 'rumah sakit', 'dokter', 'apotek', 'salon', 'barbershop', 'spa', 'klinik kecantikan', 'estetika', 'perawatan wajah', 'treatment'],
    strategy: 'Jika bisnis skincare Anda juga menyediakan layanan facial/treatment di klinik fisik, gabungkan **Kelas 03** dan **Kelas 44**.'
  },
  {
    num: '45', type: 'JASA', title: 'Layanan Hukum, Konsultan HAKI, Perizinan & Keamanan',
    keywords: ['hukum', 'konsultan haki', 'legal', 'pengacara', 'notaris', 'perizinan'],
    strategy: 'Melindungi layanan pendampingan hukum dan kekayaan intelektual.'
  }
];

const GENERIC_TOKENS = new Set([
  'kopi', 'coffee', 'teh', 'tea', 'roti', 'kue', 'baju', 'pakaian', 'kaos', 'sepatu', 'tas',
  'skincare', 'kosmetik', 'sabun', 'parfum', 'serum', 'makanan', 'minuman', 'kafe', 'cafe',
  'restoran', 'enak', 'nikmat', 'lezat', 'murah', 'asli', 'murni', 'segar', 'premium', 'super',
  'terbaik', 'original', 'baru', 'nusantara', 'indonesia', 'jaya', 'makmur', 'sentosa', 'digital',
  'kreatif', 'solusi', 'mart', 'store', 'shop', 'toko', 'kedai', 'warung', 'kuliner', 'herbal'
]);

const NOISE_WORDS = new Set([
  'saya', 'kami', 'kita', 'aku', 'anda', 'gua', 'gw', 'gue', 'baru', 'ini', 'itu', 'yang',
  'sendiri', 'umkm', 'pribadi', 'perusahaan', 'pt', 'cv', 'lokal', 'indonesia', 'djki', 'pdki',
  'haki', 'hki', 'merek', 'merk', 'nama', 'brand', 'kelas', 'biaya', 'harga', 'tarif', 'syarat',
  'cara', 'proses', 'lama', 'ditolak', 'tolak', 'sanggahan', 'oposisi', 'apa', 'apakah', 'bagaimana',
  'gimana', 'kenapa', 'mengapa', 'berapa', 'tolong', 'coba', 'bisa', 'boleh', 'mau', 'ingin',
  'bisa didaftarkan', 'didaftarkan', 'daftar', 'daftarkan', 'pakai', 'gunakan', 'cek', 'periksa',
  'aman', 'lolos', 'terdaftar', 'ada', 'sudah', 'belum', 'kalau', 'jika', 'untuk', 'tentang', 'soal',
  'ya', 'dong', 'sih', 'nih', 'kak', 'min', 'bro', 'bos', 'halo', 'hai', 'selamat', 'pagi', 'siang', 'malam'
]);

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function cleanBrandCandidate(raw) {
  if (!raw) return '';
  let tokens = raw
    .replace(/[?!.,;:()[\]{}]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  // Trim leading/trailing noise words
  while (tokens.length > 0 && NOISE_WORDS.has(tokens[0].toLowerCase())) {
    tokens.shift();
  }
  while (tokens.length > 0 && NOISE_WORDS.has(tokens[tokens.length - 1].toLowerCase())) {
    tokens.pop();
  }

  // Filter out trailing class numbers like "kelas 3" or "di kelas 30"
  const result = tokens.join(' ').replace(/\b(?:di|pada|untuk)?\s*kelas\s*\d+\b/gi, '').trim();
  if (!result || result.length < 2) return '';
  if (NOISE_WORDS.has(result.toLowerCase())) return '';
  if (/^\d+$/.test(result)) return '';
  return result;
}

function extractCandidateBrand(message, brandContext) {
  const msg = (message || '').trim();
  const lower = msg.toLowerCase();

  // 1. Check quoted brand explicitly first: "Kahf", 'MS Glow'
  const quoteMatch = msg.match(/["'“”]([^"'“”]{2,40})["'“”]/);
  if (quoteMatch) {
    const cleaned = cleanBrandCandidate(quoteMatch[1]);
    if (cleaned) return cleaned;
  }

  // 2. Check explicit brand phrase patterns
  const patterns = [
    /(?:cek|periksa|analisis|carikan|cari|daftar|daftarkan|mendaftarkan|pakai|menggunakan|gunakan|pake)\s+(?:merek|merk|nama\s+merek|nama\s+brand|nama|brand)\s+([a-zA-Z0-9\s&.'\-]{2,40}?)(?:\s+(?:di\s+kelas|pada\s+kelas|di|pada|untuk|bisa|apakah|aman|itu|ini|sudah|terdaftar|masuk|kelas|kosong|ada|gimana|bagaimana|atau|dan|yang|lolos)|\?|,|\.|$)/i,
    /(?:merek|merk|nama\s+merek|nama\s+brand|brand)\s+([a-zA-Z0-9\s&.'\-]{2,40}?)(?:\s+(?:apakah|bisa|aman|sudah|terdaftar|di\s+kelas|pada\s+kelas|di|pada|untuk|masuk|kelas|kosong|ada|gimana|bagaimana|itu|ini|milik|punya|lolos|kena)|\?|,|\.|$)/i,
    /(?:apakah|bisakah|amankah)\s+(?:saya\s+|kami\s+|kita\s+)?(?:bisa\s+)?(?:daftar|daftarkan|pakai|menggunakan)?\s*(?:merek|merk|nama|brand)?\s*([a-zA-Z0-9\s&.'\-]{2,35}?)\s+(?:bisa\s+didaftarkan|aman\s+didaftarkan|bisa\s+dipakai|aman\s+dipakai|sudah\s+terdaftar|sudah\s+ada|aman|bisa\s+daftar|bisa\s+lolos|tersedia)/i,
    /(?:cek|periksa)\s+([a-zA-Z0-9\s&.'\-]{2,35}?)(?:\s+(?:di\s+kelas|kelas|apakah|bisa|aman)|\?|,|\.|$)/i
  ];

  for (const pat of patterns) {
    const m = msg.match(pat);
    if (m && m[1]) {
      const cleaned = cleanBrandCandidate(m[1]);
      if (cleaned) return cleaned;
    }
  }

  // 3. Check direct mention of any known major brand inside message
  const sortedMajorKeys = Object.keys(MAJOR_BRANDS).sort((a, b) => b.length - a.length);
  for (const key of sortedMajorKeys) {
    const regex = new RegExp(`\\b${escapeRegex(key)}\\b`, 'i');
    if (regex.test(lower)) {
      return MAJOR_BRANDS[key].brand;
    }
  }

  // 4. Referential context fallback ("merek ini", "nama tersebut", "peluang lolosnya")
  if (brandContext && /\b(merek ini|merek tersebut|nama ini|nama itu|brand ini|peluangnya|pemiliknya|risikonya)\b/i.test(lower)) {
    return brandContext;
  }

  return '';
}

function mapCommoditiesToClasses(text) {
  const q = (text || '').toLowerCase();
  const matched = [];

  for (const rule of NICE_CLASS_RULES) {
    let score = 0;
    for (const kw of rule.keywords) {
      const kwRegex = new RegExp(`\\b${escapeRegex(kw)}\\b`, 'i');
      if (kwRegex.test(q)) {
        score += kw.includes(' ') ? 6 : 4;
      }
    }
    if (score > 0) {
      matched.push({ ...rule, score });
    }
  }

  // Explicit class number mention like "kelas 3" or "kelas 35"
  const numMatch = q.match(/\bkelas\s*(\d{1,2})\b/);
  if (numMatch) {
    const padded = numMatch[1].padStart(2, '0');
    const rule = NICE_CLASS_RULES.find((r) => r.num === padded);
    if (rule && !matched.some((m) => m.num === rule.num)) {
      matched.unshift({ ...rule, score: 10 });
    }
  }

  matched.sort((a, b) => b.score - a.score);
  return matched.slice(0, 4);
}

async function lookupDjkiBrand(brandName) {
  const clean = (brandName || '').trim();
  const lower = clean.toLowerCase();
  const famousEntry = MAJOR_BRANDS[lower] || Object.values(MAJOR_BRANDS).find((m) => {
    const mLower = m.brand.toLowerCase();
    return mLower === lower || (lower.length >= 4 && (mLower.includes(lower) || lower.includes(mLower)));
  }) || null;

  let liveItems = [];
  let totalFound = 0;
  let apiReachable = false;

  if (clean && DJKI_API_KEY) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4500);
    try {
      const url = `https://use.apiindonesia.id/api/v1/merek/search?q=${encodeURIComponent(clean)}&page=1&limit=15`;
      const resp = await fetch(url, {
        signal: controller.signal,
        headers: { 'x-api-key': DJKI_API_KEY, 'Accept': 'application/json' }
      });
      if (resp.ok) {
        const json = await resp.json();
        apiReachable = true;
        liveItems = Array.isArray(json?.data) ? json.data : [];
        totalFound = json?.pagination?.total || liveItems.length;
      }
    } catch (err) {
      console.warn('DJKI lookup warning:', err.message);
    } finally {
      clearTimeout(timer);
    }
  }

  // Prioritize exact match -> word boundary match -> closest match
  const exactMatches = liveItems.filter((item) => (item.mark_name || item.name || '').toLowerCase().trim() === lower);
  const wordMatches = liveItems.filter((item) => new RegExp(`\\b${escapeRegex(lower)}\\b`, 'i').test(item.mark_name || item.name || ''));
  const relevantList = exactMatches.length > 0 ? exactMatches : (wordMatches.length > 0 ? wordMatches : liveItems);

  const primaryItem = relevantList[0] || null;
  const uniqueOwners = [...new Set(relevantList.map((r) => (r.owner || r.pemilik || '').trim()).filter(Boolean))].slice(0, 3);
  const uniqueClasses = [...new Set(relevantList.map((r) => String(r.class || r.kelas || '').replace(/[^0-9]/g, '').padStart(2, '0')).filter((c) => c && c !== '00'))].slice(0, 6);

  const isExactOrStrongMatch = Boolean(
    famousEntry ||
    exactMatches.length > 0 ||
    (wordMatches.length > 0 && lower.length >= 3) ||
    (primaryItem && (primaryItem.mark_name || '').toLowerCase().includes(lower) && lower.length >= 4)
  );

  // Check if all tokens are generic descriptive words (Pasal 20)
  const brandWords = lower.split(/\s+/).filter(Boolean);
  const isGenericDescriptive = brandWords.length > 0 && brandWords.length <= 3 && brandWords.every((w) => GENERIC_TOKENS.has(w));

  return {
    brand: clean.toUpperCase(),
    totalFound,
    apiReachable,
    famousEntry,
    primaryItem,
    uniqueOwners,
    uniqueClasses,
    isDirectConflict: isExactOrStrongMatch,
    isGenericDescriptive
  };
}

function buildRuleBasedReply({ message, brandLookup, classMatches }) {
  const q = (message || '').toLowerCase();
  const isLegalRejectionQuery = /\b(ditolak|penolakan|sanggahan|usulan penolakan|oposisi|brm|pasal 20|pasal 21|pasal 24|banding|keberatan)\b/i.test(q);
  const isFeeQuery = /\b(biaya|harga|tarif|bayar|pnbp|berapa biaya|paket|jasa|syarat|dokumen)\b/i.test(q);
  const isTimelineQuery = /\b(berapa lama|lama proses|durasi|sertifikat|prosedur|alur|tahapan)\b/i.test(q);
  const isClassQuery = /\b(kelas|nice|klasifikasi|kategori|jualan|bisnis|usaha|produk)\b/i.test(q) || classMatches.length > 0;

  // PRIORITY 1: Specific Brand Check or Conflict Analysis
  if (brandLookup && brandLookup.brand) {
    const { brand, totalFound, famousEntry, primaryItem, uniqueOwners, uniqueClasses, isDirectConflict, isGenericDescriptive } = brandLookup;
    const ownerText = uniqueOwners.length > 0 ? uniqueOwners.join(' / ') : (famousEntry?.owner || 'Pemilik Terdaftar di DJKI');
    const classText = uniqueClasses.length > 0 ? uniqueClasses.map((c) => `Kelas ${c}`).join(', ') : (famousEntry?.classes ? `Kelas ${famousEntry.classes}` : 'Terkait');
    const appNoText = primaryItem?.app_number || primaryItem?.nomor_permohonan || '-';

    if (isDirectConflict) {
      let extraClassNote = '';
      if (classMatches.length > 0) {
        const clsSummary = classMatches.map((c) => `• **Kelas ${c.num} (${c.type})**: ${c.title}`).join('\n');
        extraClassNote = `\n\n📌 **Catatan Kelas yang Anda Sebutkan**:\n${clsSummary}\nDi kelas tersebut justru perlindungan merek terdaftar di atas aktif berlaku, sehingga pengajuan baru akan langsung terbentur penolakan substantif.`;
      }

      return `⚠️ **PERINGATAN RISIKO TINGGI — POTENSI DITOLAK MUTLAK (PASAL 21 UU MEREK)**

Saya baru saja mengecek pangkalan data resmi **DJKI RI** untuk merek **"${brand}"**:
• **Status Temuan DJKI**: Ditemukan **${totalFound > 0 ? totalFound : 'indikasi kuat'} merek terdaftar/terkenal** yang identik atau memiliki persamaan pada pokoknya.
• **Pemilik Terdaftar Utama**: ${ownerText}
• **Kelas Terdaftar**: ${classText}${appNoText !== '-' ? `\n• **Contoh No. Permohonan**: \`${appNoText}\`` : ''}

**Dasar Hukum (UU No. 20 Tahun 2016):**
Berdasarkan **Pasal 21 ayat (1) huruf a & b**, permohonan merek wajib **ditolak** apabila mempunyai persamaan pada pokoknya atau keseluruhannya dengan merek terdaftar milik pihak lain untuk barang/jasa sejenis, atau merek terkenal. Mengajukan nama **"${brand}"** berisiko **85%–95% ditolak DJKI** (biaya PNBP hangus) serta berpotensi memicu somasi pelanggaran HKI.${extraClassNote}

**Rekomendasi Taktis Konsultan:**
1. **Jangan ajukan** nama "${brand}" secara identik atau hanya menambah kata sifat/imbuhan tipis.
2. Ciptakan **nama merek orisinal (*coined word*)** dengan minimal 2 kata pembeda yang unik.
3. Klik **Handover ke Spesialis →** di bawah agar tim BrandConnect membantu mencari variasi nama yang aman lolos DJKI.`;
    }

    if (isGenericDescriptive) {
      return `⚠️ **PERHATIAN RISIKO PASAL 20 — KATA GENERIK / DESKRIPTIF**

Hasil pengecekan nama **"${brand}"**:
• Meskipun ditemukan **${totalFound} data** di DJKI, susunan kata **"${brand}"** bersifat **umum/deskriptif** (hanya menerangkan jenis barang, kualitas, atau lokasi).
• Berdasarkan **Pasal 20 huruf c, e, dan f UU No. 20/2016**, merek yang tidak memiliki daya pembeda atau hanya menyebutkan sifat barang akan **ditolak secara absolut** oleh Pemeriksa DJKI.

**Saran Perubahan:**
Tambahkan kata unik/imajinatif atau kata ciptaan sendiri (*fanciful word*) sebelum mendaftar. Tim Konsultan HKI BrandConnect dapat membantu merumuskan kombinasi nama dengan daya pembeda tinggi.`;
    }

    // Clear / Potentially Available
    const clsNote = classMatches.length > 0
      ? `\n\n📌 **Rekomendasi Kelas Terkait**:\n${classMatches.map((c) => `• **Kelas ${c.num} (${c.type})**: ${c.title}`).join('\n')}`
      : '';

    return `✅ **POTENSI DITERIMA TINGGI — BELUM ADA KONFLIK IDENTIK DI DJKI**

Hasil penelusuran pangkalan data resmi **DJKI RI** untuk **"${brand}"**:
• **Temuan Konflik Identik**: **0 merek identik ditemukan**${totalFound > 0 ? ` (terdapat ${totalFound} data parsial/umum, namun tidak mengunci nama exact "${brand}")` : ''}.
• **Penilaian Pasal 20 & 21**: Nama **"${brand}"** memiliki daya pembeda yang baik untuk didaftarkan.${clsNote}

**Langkah Selanjutnya (Asas First-to-File):**
Di Indonesia, siapa yang mendaftar lebih dulu dialah pemilik sah. Segera amankan **Tanggal Penerimaan (*Filing Date*)** dengan menyiapkan KTP, etiket logo, dan menentukan kelas barang/jasa. Klik **Handover ke Spesialis →** jika Anda ingin langsung mendaftarkan **"${brand}"**.`;
  }

  // PRIORITY 2: Rejection, Sanggahan, BRM Opposition
  if (isLegalRejectionQuery) {
    return `⚖️ **Panduan Hukum Penolakan & Sanggahan Merek (UU No. 20/2016)**

Jika merek mengalami kendala atau menerima surat dari DJKI, berikut dasar hukum dan langkah penanganannya:
1. **Penolakan Absolut (Pasal 20)**: Terjadi jika nama merek terlalu generik, tidak memiliki daya pembeda, mendeskripsikan barang secara langsung, atau bertentangan dengan norma.
2. **Penolakan Relatif (Pasal 21)**: Terjadi jika Pemeriksa menemukan persamaan pada pokoknya/keseluruhannya dengan merek terdaftar lebih dulu atau merek terkenal.
3. **Jika Menerima Surat Usulan Penolakan (Pasal 24)**: Anda memiliki waktu **maksimal 30 hari kerja** sejak tanggal surat untuk mengajukan **Surat Tanggapan / Sanggahan Resmi** berisi argumen pembeda fonetik, visual etiket, serta pembatasan uraian barang/jasa.
4. **Masa Pengumuman BRM & Oposisi (Pasal 14 & 16)**: Setiap merek diumumkan 2 bulan di Berita Resmi Merek. Jika ada kompetitor meniru merek Anda saat masa BRM, segera ajukan **Surat Keberatan (Oposisi)**.

Klik **Handover ke Spesialis →** untuk pendampingan penyusunan *Legal Drafting* Tanggapan/Oposisi oleh Konsultan HKI BrandConnect.`;
  }

  // PRIORITY 3: Nice Classification Inquiry
  if (isClassQuery) {
    if (classMatches.length > 0) {
      const listStr = classMatches.map((c) => `• **Kelas ${c.num} (${c.type}) — ${c.title}**\n  _${c.strategy}_`).join('\n');
      return `📋 **Rekomendasi Klasifikasi Nice (DJKI RI)**

Berdasarkan jenis usaha/produk yang Anda sebutkan, berikut kelas merek yang paling relevan:

${listStr}

**Prinsip Hukum Perlindungan Kelas:**
Hak eksklusif merek di Indonesia **hanya melindungi barang/jasa di kelas yang Anda daftarkan**. Disarankan mengambil kelas produk utama sekaligus kelas jasa pendukung (seperti **Kelas 35** untuk toko/ritel online) agar kompetitor tidak meniru nama toko Anda.`;
    }

    return `📋 **Panduan Klasifikasi Nice (Kelas 1–45) DJKI**

Sistem pendaftaran merek di Indonesia membagi perlindungan ke dalam **45 kelas**:
• **Kelas 1 – 34 (BARANG)**: Melindungi wujud produk fisik. Contoh populer: **Kelas 03** (Skincare/Kosmetik), **Kelas 05** (Herbal/Suplemen), **Kelas 25** (Fashion/Sepatu), **Kelas 30** (Kopi/Roti/Snack).
• **Kelas 35 – 45 (JASA)**: Melindungi layanan bisnis. Contoh populer: **Kelas 35** (Toko Online/Retail/Agency), **Kelas 42** (Software/IT/SaaS), **Kelas 43** (Kedai Kopi/Restoran), **Kelas 44** (Klinik Kecantikan/Salon).

Silakan sebutkan **jenis produk atau layanan bisnis Anda**, nanti saya hitungkan nomor kelas yang paling tepat!`;
  }

  // PRIORITY 4: Fees & Requirements
  if (isFeeQuery) {
    return `💳 **Estimasi Biaya & Syarat Pendaftaran Merek (DJKI RI)**

BrandConnect menyediakan layanan transparan mencakup penelusuran mendalam, penyiapan etiket, e-filing resmi, hingga pemantauan masa BRM:
• **Jalur UMKM (Tarif Subsidi)**: **Rp 1.850.000 / kelas** *(sudah termasuk PNBP resmi DJKI & jasa pengurusan)*. Syarat: KTP, Etiket Logo, dan Surat Keterangan/Rekomendasi UMKM dari Dinas terkait.
• **Jalur Umum / Perusahaan (PT/CV/Perorangan)**: **Rp 3.500.000 / kelas** *(termasuk PNBP resmi umum Rp 1.800.000 & jasa konsultan)*.
• **Layanan Tanggapan Penolakan / Oposisi**: Mulai **Rp 1.500.000 – Rp 2.500.000** per kasus.

Ingin cek ketersediaan merek dulu sebelum bayar PNBP? Ketik saja nama merek yang ingin Anda daftarkan di sini (misal: *"Cek merek Kopi Senja"*).`;
  }

  // PRIORITY 5: Timeline / Procedure
  if (isTimelineQuery) {
    return `⏱️ **Alur & Estimasi Waktu Pendaftaran Merek DJKI (UU No. 20/2016)**

1. **Pengecekan & Pengajuan (*Filing Date*)**: 1–3 hari kerja. Anda langsung mendapat Nomor Permohonan resmi sebagai bukti hak prioritas *First-to-File*.
2. **Pemeriksaan Formalitas**: ±15 hari kerja untuk verifikasi kelengkapan berkas dan etiket.
3. **Masa Pengumuman (BRM)**: **2 bulan** publikasi terbuka di Berita Resmi Merek untuk memberi kesempatan sanggahan pihak ketiga.
4. **Pemeriksaan Substantif & Sertifikat**: ±150 hari kerja hingga terbit Sertifikat Merek Elektronik (total estimasi proses DJKI berkisar **6–12 bulan**; merek tetap boleh digunakan komersial sejak tanggal pengajuan dengan simbol ™).`;
  }

  // PRIORITY 6: Conversational Greeting / General Guide
  return `Halo! Saya **BrandConnect AI Assistant** yang terhubung langsung ke pangkalan data merek DJKI RI. Supaya tidak salah langkah dan menghindari penolakan, Anda bisa langsung tanyakan hal berikut:

• **Cek Konflik Merek**: Ketik *"Cek merek Kahf"* atau *"Apakah merek Kopi Awan aman didaftarkan?"*
• **Rekomendasi Kelas Nice**: Ketik *"Saya jualan skincare dan buka klinik, masuk kelas berapa?"*
• **Kendala Hukum DJKI**: Ketik *"Merek saya kena usulan penolakan, gimana solusinya?"*
• **Biaya & Syarat**: Ketik *"Berapa biaya daftar merek UMKM?"*

Silakan ketik nama merek atau kebutuhan bisnis Anda sekarang!`;
}

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
    return res.status(400).json({ success: false, message: 'Pesan tidak boleh kosong.' });
  }

  // 1. Extract explicit or contextual brand name, and query live DJKI + Nice classes
  const candidateBrand = extractCandidateBrand(message, brandContext);
  const classMatches = mapCommoditiesToClasses(message);
  const brandLookup = candidateBrand ? await lookupDjkiBrand(candidateBrand) : null;

  // Build authoritative rule-based response backed by live DJKI search & UU Merek
  const factualReply = buildRuleBasedReply({ message, brandLookup, classMatches });

  // 2. If Gemini API Key is configured, use Gemini grounded on live DJKI facts (never hallucinating!)
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (geminiApiKey) {
    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash'];
    const groundingSummary = brandLookup
      ? `HASIL PENCARIAN LIVE DJKI UNTUK "${brandLookup.brand}":
- Total temuan di pangkalan data DJKI: ${brandLookup.totalFound}
- Konflik langsung / Merek Terdaftar / Terkenal: ${brandLookup.isDirectConflict ? 'YA (WAJIB PERINGATKAN RISIKO TINGGI DITOLAK PASAL 21!)' : 'TIDAK'}
- Pemilik Terdaftar: ${brandLookup.uniqueOwners.join(', ') || brandLookup.famousEntry?.owner || '-'}
- Kelas Terdaftar: ${brandLookup.uniqueClasses.join(', ') || brandLookup.famousEntry?.classes || '-'}
- Indikasi Kata Generik Pasal 20: ${brandLookup.isGenericDescriptive ? 'YA' : 'TIDAK'}`
      : 'Tidak ada nama merek spesifik dalam pertanyaan; fokus jawab pertanyaan kelas Nice, regulasi UU No. 20/2016, biaya, atau prosedur.';

    const classSummary = classMatches.length > 0
      ? `REKOMENDASI KELAS NICE RELEVAN:\n${classMatches.map((c) => `- Kelas ${c.num} (${c.type}): ${c.title} -> ${c.strategy}`).join('\n')}`
      : '';

    const prompt = `Anda adalah Konsultan HKI & BrandConnect AI Assistant di Indonesia.
ATURAN KETAT (ANTI-HALUSINASI):
1. DILARANG KERAS menyatakan suatu merek "aman" atau "berpotensi diterima" jika data DJKI di bawah menunjukkan KONFLIK LANGSUNG = YA. Anda wajib memberi peringatan tegas Risiko Tinggi ditolak di bawah Pasal 21 UU No. 20 Tahun 2016 dan menyebutkan nama pemilik terdaftarnya.
2. Selalu rujuk UU No. 20 Tahun 2016 (Pasal 20, Pasal 21, Pasal 24 batas 30 hari kerja untuk sanggahan, Pasal 14 & 16 untuk BRM 2 bulan).
3. Jawab dengan bahasa Indonesia yang jelas, terstruktur (markdown **bold** dan poin-poin), ringkas namun padat solusi hukum praktis.
4. Akhiri dengan ajakan mengklik tombol "Handover ke Spesialis →" bila perlu pendampingan langsung.

${groundingSummary}
${classSummary}

Pertanyaan pengguna: "${message}"`;

    for (const model of modelsToTry) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5000);
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 850 }
          })
        });
        clearTimeout(timer);

        if (response.ok) {
          const data = await response.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return res.status(200).json({
              success: true,
              fromGemini: true,
              modelUsed: model,
              checkedBrand: brandLookup?.brand || null,
              djkiFoundCount: brandLookup?.totalFound || 0,
              reply: text
            });
          }
        }
      } catch (err) {
        console.warn(`Gemini model ${model} failed:`, err.message);
      }
    }
  }

  return res.status(200).json({
    success: true,
    fromGemini: false,
    checkedBrand: brandLookup?.brand || null,
    djkiFoundCount: brandLookup?.totalFound || 0,
    reply: factualReply
  });
};
