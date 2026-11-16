-- ============================================================================
-- BRANDCONNECT — DATABASE SCHEMA (MySQL 8.4 / MariaDB / SQLite Compatible)
-- Architecture: Modular Monolith for AI Trademark Search, Brand Protection,
--               In-House Legal Services, CRM, Customer Dashboard & Admin Panel
-- ============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. USERS & ROLE-BASED ACCESS CONTROL (6 Admin Roles + Customer)
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(160) NOT NULL,
  `email` VARCHAR(190) NOT NULL UNIQUE,
  `phone` VARCHAR(40) DEFAULT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM(
    'customer',
    'super_admin',
    'admin',
    'customer_relations',
    'trademark_specialist',
    'legal_counsel',
    'document_officer'
  ) NOT NULL DEFAULT 'customer',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. BUSINESS PROFILES (Customer Entity Details)
CREATE TABLE IF NOT EXISTS `business_profiles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `company_name` VARCHAR(200) NOT NULL,
  `applicant_type` ENUM('perorangan', 'umkm', 'badan_usaha') NOT NULL DEFAULT 'perorangan',
  `industry_sector` VARCHAR(120) DEFAULT NULL,
  `npwp_number` VARCHAR(60) DEFAULT NULL,
  `nib_number` VARCHAR(60) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_business_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. SERVICE CATALOG (8 Configurable Professional Trademark & IP Services)
CREATE TABLE IF NOT EXISTS `service_catalog` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(32) NOT NULL UNIQUE,
  `slug` VARCHAR(120) NOT NULL UNIQUE,
  `name` VARCHAR(180) NOT NULL,
  `category` ENUM('registration', 'protection', 'licensing', 'copyright', 'advisory') NOT NULL,
  `base_price` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `umkm_price` DECIMAL(15,2) DEFAULT NULL,
  `estimated_duration` VARCHAR(100) DEFAULT NULL,
  `description` TEXT NOT NULL,
  `deliverables_json` JSON DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. AI SEARCH LOGS (Stores Trademark Searches, Similarity Scores & AI Reports)
CREATE TABLE IF NOT EXISTS `ai_search_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `reference_code` VARCHAR(40) NOT NULL UNIQUE,
  `user_id` BIGINT UNSIGNED DEFAULT NULL,
  `trademark_name` VARCHAR(200) NOT NULL,
  `search_mode` ENUM('name', 'application_no', 'logo_visual') NOT NULL DEFAULT 'name',
  `product_category` VARCHAR(200) DEFAULT NULL,
  `recommended_classes` VARCHAR(120) DEFAULT NULL,
  `distinctiveness_index` INT NOT NULL DEFAULT 0,
  `risk_level` ENUM('low', 'moderate', 'high') NOT NULL DEFAULT 'low',
  `search_results_json` JSON DEFAULT NULL,
  `ai_interpretation_text` TEXT DEFAULT NULL,
  `legal_disclaimer_text` TEXT DEFAULT NULL,
  `uploaded_logo_meta` JSON DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_search_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. AI CONVERSATIONS & RAG KNOWLEDGE BASE
CREATE TABLE IF NOT EXISTS `ai_knowledge_base` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `topic_code` VARCHAR(60) NOT NULL UNIQUE,
  `category` ENUM('uu_merek', 'nice_class', 'djki_procedure', 'protection_strategy') NOT NULL,
  `title` VARCHAR(220) NOT NULL,
  `Legal_reference` VARCHAR(160) DEFAULT NULL,
  `content_text` TEXT NOT NULL,
  `is_verified` TINYINT(1) NOT NULL DEFAULT 1,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ai_conversations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `session_code` VARCHAR(50) NOT NULL UNIQUE,
  `user_id` BIGINT UNSIGNED DEFAULT NULL,
  `trademark_context` VARCHAR(200) DEFAULT NULL,
  `messages_json` JSON NOT NULL,
  `ai_summary` TEXT DEFAULT NULL,
  `handover_status` ENUM('active_ai', 'handed_over', 'reviewed') NOT NULL DEFAULT 'active_ai',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. HUMAN EXPERT HANDOVER & CONSULTATION LEADS (Section F)
CREATE TABLE IF NOT EXISTS `consultation_leads` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `lead_number` VARCHAR(40) NOT NULL UNIQUE,
  `user_id` BIGINT UNSIGNED DEFAULT NULL,
  `customer_name` VARCHAR(160) NOT NULL,
  `customer_email` VARCHAR(190) NOT NULL,
  `customer_phone` VARCHAR(50) NOT NULL,
  `trademark_name` VARCHAR(200) NOT NULL,
  `product_category` VARCHAR(200) DEFAULT NULL,
  `requested_service` VARCHAR(180) NOT NULL,
  `search_results_snapshot` JSON DEFAULT NULL,
  `ai_assessment` TEXT DEFAULT NULL,
  `conversation_summary` TEXT DEFAULT NULL,
  `uploaded_documents_json` JSON DEFAULT NULL,
  `lead_status` ENUM('new', 'in_review', 'assigned', 'converted_to_order', 'closed') NOT NULL DEFAULT 'new',
  `assigned_specialist_id` BIGINT UNSIGNED DEFAULT NULL,
  `specialist_notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. SERVICE ORDERS
CREATE TABLE IF NOT EXISTS `service_orders` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_number` VARCHAR(40) NOT NULL UNIQUE,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `service_id` BIGINT UNSIGNED NOT NULL,
  `trademark_name` VARCHAR(200) NOT NULL,
  `nice_classes` VARCHAR(80) NOT NULL,
  `applicant_type` ENUM('perorangan', 'umkm', 'badan_usaha') NOT NULL DEFAULT 'perorangan',
  `quoted_amount` DECIMAL(15,2) NOT NULL,
  `payment_status` ENUM('unpaid', 'paid', 'refunded') NOT NULL DEFAULT 'unpaid',
  `order_status` ENUM('pending_review', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'pending_review',
  `customer_notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_order_service` FOREIGN KEY (`service_id`) REFERENCES `service_catalog` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. TRADEMARK PORTFOLIO & CASE MANAGEMENT
CREATE TABLE IF NOT EXISTS `trademark_cases` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `case_number` VARCHAR(40) NOT NULL UNIQUE,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `trademark_name` VARCHAR(200) NOT NULL,
  `nice_classes` VARCHAR(80) NOT NULL,
  `djki_application_no` VARCHAR(80) DEFAULT NULL,
  `filing_date` DATE DEFAULT NULL,
  `case_stage` ENUM(
    'document_verification',
    'specialist_review',
    'djki_filing_submitted',
    'formality_check',
    'brm_publication_2mo',
    'substantive_examination',
    'certificate_issued',
    'refusal_or_opposition_action'
  ) NOT NULL DEFAULT 'document_verification',
  `assigned_specialist_id` BIGINT UNSIGNED DEFAULT NULL,
  `assigned_counsel_id` BIGINT UNSIGNED DEFAULT NULL,
  `assigned_doc_officer_id` BIGINT UNSIGNED DEFAULT NULL,
  `professional_legal_assessment` TEXT DEFAULT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_case_order` FOREIGN KEY (`order_id`) REFERENCES `service_orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. SECURE PRIVATE DOCUMENTS
CREATE TABLE IF NOT EXISTS `case_documents` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `case_id` BIGINT UNSIGNED DEFAULT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `doc_type` ENUM('etiket_merek', 'ktp_pemohon', 'npwp', 'akta_perusahaan', 'surat_umkm', 'surat_kuasa', 'sertifikat_djki', 'lainnya') NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `file_mime` VARCHAR(100) NOT NULL,
  `file_size_kb` INT NOT NULL DEFAULT 0,
  `dimensions_px` VARCHAR(40) DEFAULT NULL,
  `verification_status` ENUM('pending', 'verified', 'revision_required') NOT NULL DEFAULT 'pending',
  `officer_notes` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. TRADEMARK MONITORING & ALERTS
CREATE TABLE IF NOT EXISTS `trademark_monitors` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `trademark_name` VARCHAR(200) NOT NULL,
  `nice_classes` VARCHAR(80) NOT NULL,
  `phonetic_watch_tokens` VARCHAR(255) DEFAULT NULL,
  `monitor_status` ENUM('active', 'paused') NOT NULL DEFAULT 'active',
  `last_brm_checked` VARCHAR(80) DEFAULT 'BRM Seri-A No. 18/2026',
  `alerts_count` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. ACTIVITY LOGS (Audit Trail for Sensitive Operations)
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `actor_name` VARCHAR(160) NOT NULL,
  `actor_role` VARCHAR(60) NOT NULL,
  `action_type` VARCHAR(80) NOT NULL,
  `target_reference` VARCHAR(80) DEFAULT NULL,
  `description` TEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SEED DATA: 8 PROFESSIONAL SERVICES (Section E)
-- ============================================================================
INSERT INTO `service_catalog` (`code`, `slug`, `name`, `category`, `base_price`, `umkm_price`, `estimated_duration`, `description`) VALUES
('SRV-REG-01', 'trademark-registration', 'Trademark Registration (Pendaftaran Merek Baru)', 'registration', 3200000.00, 1850000.00, 'Proses Pengajuan 1–3 Hari Kerja (Sertifikat ±6–12 Bulan DJKI)', 'Penelusuran mendalam, analisis kelas Nice, penyusunan etiket merek, pengajuan resmi ke DJKI, dan pemantauan hingga sertifikat terbit.'),
('SRV-REN-02', 'trademark-renewal', 'Trademark Renewal (Perpanjangan Merek 10 Tahun)', 'registration', 3800000.00, 2400000.00, '3–7 Hari Kerja', 'Perpanjangan masa perlindungan merek terdaftar untuk 10 tahun berikutnya (sebelum atau dalam masa tenggang 6 bulan).'),
('SRV-ASN-03', 'trademark-assignment', 'Trademark Assignment (Pengalihan Hak Merek)', 'licensing', 2900000.00, 2900000.00, '5–10 Hari Kerja', 'Pencatatan resmi pengalihan kepemilikan hak atas merek (jual-beli, hibah, waris, atau akuisisi perusahaan) pada Berita Resmi DJKI.'),
('SRV-LIC-04', 'trademark-licensing', 'Trademark Licensing (Perjanjian Lisensi Merek)', 'licensing', 3500000.00, 3500000.00, '5–10 Hari Kerja', 'Penyusunan kontrak lisensi merek (kemitraan/waralaba/royalti) serta pencatatan resmi perjanjian lisensi di DJKI.'),
('SRV-OPP-05', 'trademark-opposition', 'Trademark Opposition (Pengajuan Oposisi Merek)', 'protection', 4500000.00, 4500000.00, 'Selama Masa Publikasi BRM (2 Bulan)', 'Penyusunan dan pengajuan surat keberatan hukum (oposisi) terhadap permohonan merek pihak lain yang meniru merek Anda di BRM DJKI.'),
('SRV-REF-06', 'response-to-refusal', 'Response to Trademark Refusal (Sanggahan Penolakan)', 'protection', 3200000.00, 2500000.00, 'Maks. 30 Hari Hari Kerja sejak Surat DJKI', 'Penyusunan argumentasi hukum dan bukti pembeda untuk menanggapi Surat Usulan Penolakan dari Pemeriksa Merek DJKI.'),
('SRV-COP-07', 'copyright-registration', 'Copyright Registration (Pencatatan Hak Cipta)', 'copyright', 1750000.00, 1250000.00, '1–3 Hari Kerja', 'Pencatatan resmi Hak Cipta untuk karya seni logo, maskot brand, desain kemasan, buku panduan, atau aset digital.'),
('SRV-CON-08', 'legal-consultation', 'Legal Consultation & Assistance (Konsultasi Ahli Merek)', 'advisory', 750000.00, 450000.00, 'Sesi 60 Menit + Laporan Tertulis', 'Sesi konsultasi mendalam bersama Spesialis Merek & Konsultan Hukum BrandConnect untuk audit portofolio merek atau sengketa HAKI.');

SET FOREIGN_KEY_CHECKS = 1;
