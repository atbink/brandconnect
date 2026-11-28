// Vercel Serverless Function: Auto-Enrich Trademark Protection Expiry Dates via APIIndonesia -> VPS
const adminAuth = require('./admin-auth');

const VPS_BASE_URL = process.env.COLLECTION_ENGINE_BASE_URL || 'http://31.59.119.67';
const VPS_API_TOKEN =
  process.env.COLLECTION_ENGINE_API_TOKEN ||
  '3440669e55976bc93dfb2f4ff61d221946ec3825de61ed0cfac66f5cd9a3cff1';
const API_INDONESIA_KEY =
  process.env.PDKI_API_KEY || 'aip_live_tW5NibLE0C8rjVIF6jOYon3PgdbTsE01';

function parseDateToUtc(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const s = raw.trim();
  if (!s || s === '-' || s === '--') return null;

  // YYYY-MM-DD
  const iso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) {
    const d = new Date(Date.UTC(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])));
    return isNaN(d.getTime()) ? null : d;
  }

  // DD/MM/YYYY or DD-MM-YYYY
  const dmy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmy) {
    const d = new Date(Date.UTC(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1])));
    return isNaN(d.getTime()) ? null : d;
  }

  const fallback = new Date(s);
  return isNaN(fallback.getTime()) ? null : fallback;
}

function toIsoDate(d) {
  return d ? d.toISOString().slice(0, 10) : null;
}

function addTenYears(d) {
  return new Date(Date.UTC(d.getUTCFullYear() + 10, d.getUTCMonth(), d.getUTCDate()));
}

function cleanBrandQuery(name) {
  return String(name || '')
    .replace(/\s*[+&]\s*(?:LOGO|LUKISAN|GAMBAR|HURUF\s*KANJI|ETIKET).*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function findExactMatch(candidates, appNo, isSwapped) {
  if (!Array.isArray(candidates) || candidates.length === 0) return null;
  const targetApp = appNo.toUpperCase();
  const byApp = candidates.find((c) => {
    const cApp = String(c.app_number || c.nomor_permohonan || c.no_permohonan || '').trim().toUpperCase();
    return cApp === targetApp;
  });
  if (byApp) return byApp;

  if (isSwapped) {
    const targetName = appNo.toLowerCase();
    return (
      candidates.find((c) => String(c.mark_name || c.nama_merek || '').trim().toLowerCase() === targetName) ||
      candidates[0]
    );
  }
  return null;
}

async function queryApiIndonesia(q, limit = 10) {
  const url = `https://use.apiindonesia.id/api/v1/merek/search?q=${encodeURIComponent(q)}&page=1&limit=${limit}`;
  const resp = await fetch(url, {
    headers: {
      'x-api-key': API_INDONESIA_KEY,
      Accept: 'application/json'
    },
    signal: AbortSignal.timeout(5000)
  });
  if (!resp.ok) return [];
  const json = await resp.json().catch(() => ({}));
  return Array.isArray(json.data) ? json.data : [];
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Token');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const token = adminAuth.extractBearerToken(req);
  if (!adminAuth.verifyToken(token)) {
    return res.status(401).json({ success: false, message: 'Sesi admin tidak valid.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const rawItems = Array.isArray(body?.items) ? body.items.slice(0, 12) : [];
  if (rawItems.length === 0) {
    return res.status(400).json({ success: false, message: 'Tidak ada item merek yang dikirim untuk dilengkapi.' });
  }

  let enriched = 0;
  let notFound = 0;
  let failed = 0;
  const details = [];

  for (const item of rawItems) {
    const appNo = String(item.applicationNumber || '').trim();
    const brandName = String(item.brandName || '').trim();
    if (!appNo) {
      failed++;
      continue;
    }

    try {
      const isSwapped = !/\d/.test(appNo) && /^(?:IDM|D00|DID|JID|\d+)/i.test(brandName);
      let match = null;

      // 1. Search APIIndonesia by application number (or swapped brand name)
      let candidates = await queryApiIndonesia(appNo, isSwapped ? 10 : 5);
      match = findExactMatch(candidates, appNo, isSwapped);

      // 2. Fallback: search by raw brandName and cleaned brandName (without "+ LOGO", "& LUKISAN", etc.)
      if (!match && brandName && !isSwapped) {
        const queriesToTry = [brandName];
        const cleaned = cleanBrandQuery(brandName);
        if (cleaned && cleaned !== brandName) queriesToTry.push(cleaned);

        for (const q of queriesToTry) {
          candidates = await queryApiIndonesia(q, 15);
          match = findExactMatch(candidates, appNo, false);
          if (match) break;
        }
      }

      if (!match) {
        notFound++;
        details.push({ applicationNumber: appNo, brandName, status: 'not_found' });
        continue;
      }

      const rawStart =
        match.tgl_permohonan ||
        match.application_date ||
        match.reg_date ||
        match.tanggal_penerimaan ||
        null;
      const rawEnd =
        match.tgl_berakhir_perlindungan ||
        match.protection_end_date ||
        match.expired_date ||
        null;

      const startDateObj = parseDateToUtc(rawStart);
      let endDateObj = parseDateToUtc(rawEnd);
      if (!endDateObj && startDateObj) {
        endDateObj = addTenYears(startDateObj);
      }

      if (!endDateObj) {
        notFound++;
        details.push({ applicationNumber: appNo, brandName, status: 'no_date_in_api' });
        continue;
      }

      const protectionStartDate = toIsoDate(startDateObj);
      const protectionEndDate = toIsoDate(endDateObj);

      // 3. Persist enriched dates to VPS MySQL via /api/collections/import
      const importPayload = {
        application_number: appNo,
        applicationNumber: appNo,
        brand_name: brandName || String(match.mark_name || match.nama_merek || appNo),
        brandName: brandName || String(match.mark_name || match.nama_merek || appNo),
        status_text: item.statusText || '(TM) DIDAFTAR',
        statusText: item.statusText || '(TM) DIDAFTAR',
        status_key: item.statusKey || 'didaftar',
        statusKey: item.statusKey || 'didaftar',
        niceClasses: Array.isArray(item.niceClasses) && item.niceClasses.length > 0 ? item.niceClasses : ['35'],
        owner: {
          name: item.ownerName && item.ownerName !== '-' ? item.ownerName : (match.owner || match.pemilik || 'Pemohon Terdaftar (DJKI)'),
          nationality: 'ID'
        },
        registration: {
          applicationNumber: appNo,
          applicationDate: protectionStartDate,
          registrationDate: protectionStartDate,
          protectionStartDate,
          protectionEndDate
        }
      };

      const vpsResp = await fetch(`${VPS_BASE_URL}/api/collections/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${VPS_API_TOKEN}`,
          'X-API-KEY': VPS_API_TOKEN,
          Accept: 'application/json'
        },
        body: JSON.stringify(importPayload),
        signal: AbortSignal.timeout(8000)
      });

      if (vpsResp.ok) {
        enriched++;
        details.push({
          applicationNumber: appNo,
          brandName,
          status: 'enriched',
          protectionStartDate,
          protectionEndDate
        });
      } else {
        failed++;
        details.push({ applicationNumber: appNo, brandName, status: `vps_http_${vpsResp.status}` });
      }
    } catch (err) {
      failed++;
      details.push({ applicationNumber: appNo, brandName, status: 'error', error: err.message });
    }
  }

  return res.status(200).json({
    success: true,
    message: `Selesai melengkapi tanggal: ${enriched} berhasil, ${notFound} belum tersedia di API, ${failed} gagal.`,
    summary: { processed: rawItems.length, enriched, notFound, failed },
    details
  });
};
