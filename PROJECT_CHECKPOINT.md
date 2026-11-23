# BRANDCONNECT & INTRABROWSER — PROJECT CHECKPOINT
**Tanggal & Waktu Pembaruan:** 21 November 2026, 16:40 WIB  
**Status Sesi:** PHASE 5 (COLLECTION ENGINE VPS BACKEND & DATABASE) RESMI SELESAI & AKTIF 100%

---

## 1. Project Overview & Current Architecture

Proyek terdiri dari tiga subsistem terpisah dengan arsitektur standalone yang saling terintegrasi:

```
┌───────────────────────────────────────┐
│     IntraBrowser (Electron Desktop)   │
│   • Sequential Batch Collector        │
│   • Local Storage & Crash Resilience  │
│   • Auto-Sync via SSH Tunnel / HTTPS  │
└──────────────────┬────────────────────┘
                   │ REST API (Bearer Token / JSON + Base64 Logo)
                   ▼
┌─────────────────────────────────────────────────────────────┐
│    Collection Engine Standalone Backend (VPS Ubuntu 24.04)  │
│   • IP Server: 31.59.119.67                                 │
│   • OS: Ubuntu 24.04.5 LTS (Kernel 6.8.0)                   │
│   • Runtime: Laravel 13.43.0, PHP 8.3.6 FPM (Ondemand Pool) │
│   • Web Server: Nginx 1.24.0 (Port 8001 Loopback / Internal)│
│   • Firewall: UFW Active (Hanya Port 22, 80, 443 Terbuka)  │
│   • Memory & Swap: RAM 3.8 GB + Swapfile 2.0 GB Aktif       │
│   • Security: Least-Privilege Perms + Anti-Webshell Storage │
└──────────────────┬──────────────────────────────────────────┘
                   │ TCP Loopback (127.0.0.1:3306)
                   ▼
┌─────────────────────────────────────────────────────────────┐
│    MySQL 8.4.13 LTS Community Server (Database Mandiri)    │
│   • Database: brandconnect_collection                       │
│   • User: ce_user@127.0.0.1 (Tuned Buffer Pool 1024M)       │
│   • 8 Tabel Utama: trademarks, classes, owners, consultants,│
│     translations, registrations, images, collection_logs    │
└─────────────────────────────────────────────────────────────┘
```

1. **BrandConnect (Main Web App):**
   - Platform utama pencarian & perlindungan merek.
   - Frontend dihosting di Vercel (`brandconnect-virid.vercel.app`).
   - Backend lokal di `E:\dev\BRANDCONNECT\backend` (database `brandconnect_dev` tetap utuh dan aman).
2. **BrandConnect IntraBrowser (Desktop Collection Client):**
   - Desktop application mandiri berbasis Electron + React + TypeScript di `c:\Users\ibink\Downloads\IntraBrowser BC`.
   - Mengekstrak data merek dan logo asli PDKI secara manual maupun batch sekuensial anti-blokir.
3. **Collection Engine (VPS Storage & REST API Backend):**
   - **Status:** **LIVE & OPERATIONAL** di server VPS Ubuntu 24.04 (`31.59.119.67`).
   - Menyimpan seluruh metadata merek, relasi kelas, pemilik, konsultan, riwayat pendaftaran, serta biner logo asli dengan validasi magic bytes & SHA-256.

---

## 2. Infrastructure Status (VPS & Local)

| Komponen | Lingkungan | Versi / Status | Keterangan |
|---|---|---|---|
| **OS** | VPS Ubuntu | **Ubuntu 24.04.5 LTS** | Kernel `6.8.0-149-generic`, uptime normal |
| **RAM & Swap** | VPS Ubuntu | **RAM 3.8 GB + Swap 2.0 GB** | Swap aktif di `/swapfile` (swappiness=10, vfs_cache_pressure=50) |
| **UFW Firewall** | VPS Ubuntu | **ACTIVE** | Allow: `22/tcp (SSH)`, `80/tcp (HTTP)`, `443/tcp (HTTPS)`. Default deny incoming. Port 8001 & 3306 tertutup dari internet publik |
| **Web Server** | VPS Ubuntu | **Nginx 1.24.0** (Active) | Mendengarkan di `127.0.0.1:8001` dengan proteksi eksekusi webshell pada folder `/storage/` |
| **PHP Runtime** | VPS Ubuntu | **PHP 8.3.6 FPM** (Active) | Pool `collection-engine` terisolasi (`pm = ondemand`, max 5 children) |
| **Database Server** | VPS Ubuntu | **MySQL 8.4.13 LTS** (Active) | Oracle Community Server, bind `127.0.0.1`, buffer pool 1024M |
| **Database Schema** | VPS Ubuntu | **brandconnect_collection** | 8 tabel relasional termigrasi 100% via `php artisan migrate` |
| **Framework** | VPS Ubuntu | **Laravel 13.43.0** | App key terpasang, environment `production` |
| **BrandConnect Dev** | Local PC | **Untouched / Safe** | `E:\dev\BRANDCONNECT` dan database `brandconnect_dev` tidak mengalami perubahan |
| **IntraBrowser Desktop** | Local PC | **Ready / Tested** | Client batch collection dengan connector API siap pakai |

---

## 3. Database Schema (8 Tabel Termigrasi di VPS)

1. `trademarks`: Nomor permohonan (`application_number` unique index), nama merek, status teks, status normalisasi, URL sumber, raw JSON payload.
2. `trademark_classes`: Relasi kelas 1–45 dan uraian barang/jasa lengkap (mendukung multi-class).
3. `trademark_owners`: Nama pemilik merek, alamat lengkap, dan kewarganegaraan.
4. `trademark_consultants`: Nama konsultan HKI, alamat, dan kewarganegaraan.
5. `trademark_translations`: Arti translasi/bahasa asing merek (null jika tidak ada).
6. `trademark_registrations`: Nomor pengumuman/pendaftaran, tanggal permohonan, tanggal pendaftaran, serta tanggal mulai dan berakhir perlindungan.
7. `trademark_images`: Penyimpanan biner logo asli di filesystem VPS (`storage/app/public/trademarks/{app_no}/`), hash SHA-256 integritas, MIME type, ukuran byte, dan dimensi piksel.
8. `collection_logs`: Audit trail otomatis yang mencatat diff perubahan field setiap kali data diimpor/diperbarui.

---

## 4. API Endpoints & Health Check

Seluruh endpoint diproteksi menggunakan token otentikasi Bearer `COLLECTION_API_TOKEN` yang tersimpan aman di `/root/.ce_api_token` (mode 600).

- **`GET /api/health`** (Public):
  ```json
  {
    "status": "ok",
    "service": "BrandConnect Collection Engine VPS Backend API",
    "version": "1.0.0",
    "framework": "Laravel 13.43.0",
    "php_version": "8.3.6",
    "database": { "status": "healthy", "connection": "mysql", "database_name": "brandconnect_collection", "error": null },
    "storage": { "status": "healthy", "driver": "public", "error": null }
  }
  ```
- **`POST /api/collections/import`** (Protected): Endpoint penerima batch dan single import dari IntraBrowser.
- **`GET /api/trademarks`** & **`GET /api/trademarks/{app_no}`** (Protected): Query data merek beserta seluruh relasi.
- **`POST /api/trademarks/{app_no}/images`** & **`GET /api/trademarks/{app_no}/images`** (Protected): Upload dan pengambilan logo.
- **`GET /api/collections/logs`** (Protected): Audit trail koleksi.

---

## 5. Cara Menghubungkan IntraBrowser ke VPS

Karena port 8001 dilindungi di localhost loopback demi keamanan, IntraBrowser di komputer lokal dapat berkomunikasi dengan VPS menggunakan **SSH Tunnel**:

```powershell
# Buka tunnel di komputer lokal (background atau terminal terpisah):
ssh -N -L 8001:127.0.0.1:8001 root@31.59.119.67
```

Setelah tunnel aktif:
- IntraBrowser mengakses `http://127.0.0.1:8001/api/collections/import`.
- Data dan logo langsung tersimpan secara permanen ke MySQL 8.4 dan filesystem VPS di `/var/www/collection-engine/storage/app/public/trademarks/`.

---

## 6. Verification & Milestones Completed

1. **Uji Koneksi End-to-End IntraBrowser ke VPS (SELESAI & VERIFIKASI 100%):**
   - Health check: HTTP 200, MySQL database & disk storage `healthy`.
   - Security middleware: Request tanpa token otomatis di-reject dengan HTTP 401.
   - Batch collection live berhasil: 24 merek (17 WAKAI, 1 GYMTIGER, 3 TYESO, 3 MINISO) tersimpan di MySQL 8.4 dan filesystem VPS (`/var/www/collection-engine/storage/app/public/trademarks/`).
   - Idempotent upsert & multi-class verified.
   - Biner logo asli terverifikasi di VPS disk & database dengan hash SHA-256 dan ukuran byte yang cocok 100%.

2. **Dual-Source Search di BrandConnect (SELESAI & TERUJI 100%):**
   - **Tiga Mode Pencarian Aktif:**
     - `internal_only`: Hanya query Local DB & Collection Engine VPS. 0 kuota eksternal, privasi penuh.
     - `internal_priority`: Query internal dulu; jika ada match >= 1, tidak panggil API eksternal sama sekali. Fallback ke API eksternal jika hasil internal 0.
     - `hybrid`: Query internal & eksternal sekaligus, deduplikasi pada `application_number` dengan preferensi data lengkap (logo & 8 kategori) dari Collection Engine.
   - **Dukungan Klien:**
     - `CollectionEngineClient` di `E:\dev\BRANDCONNECT\backend\app\Services\Search\CollectionEngineClient.php`.
     - `ApiIndonesiaClient` di `E:\dev\BRANDCONNECT\backend\app\Services\Search\ApiIndonesiaClient.php`.
     - `SearchOrchestrator` di `E:\dev\BRANDCONNECT\backend\app\Services\Search\SearchOrchestrator.php`.
     - Pengontrol `TrademarkSearchController` mendukung parameter `source_mode` dan header `X-Source-Mode`.
   - **Hasil Pengujian PHPUnit:**
     - `tests/Feature/DualSourceTrademarkSearchTest.php`: **5/5 tests PASS (100%)**.
     - `tests/Feature/TrademarkSearchApiTest.php`: **6/6 tests PASS (100%)**.
     - Full Backend Test Suite: **104/104 tests PASS (0 failures, 0 errors)**.

---

## 7. Next Steps (Pekerjaan Selanjutnya)

1. **Live Search Testing:** Buka tunnel SSH (`ssh -N -L 8001:127.0.0.1:8001 root@31.59.119.67`) dan jalankan request pencarian ke backend BrandConnect (`POST /api/v1/trademarks/search` dengan query seperti `WAKAI`, `MINISO`, atau `TYESO`).
2. **Penggunaan Langsung IntraBrowser (Koleksi Merek PDKI Tambahan):** Menjalankan aplikasi desktop Electron (`npm run dev`) untuk menambah database merek di VPS.
3. **Modul Expiry Monitoring & Lead Management:** Membangun antarmuka monitoring tanggal kedaluwarsa merek.
4. **Setup Domain & HTTPS (Opsional):** Mengarahkan subdomain dan mengaktifkan SSL Let's Encrypt port 443 di VPS.
