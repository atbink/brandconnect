// Vercel Serverless Function: Admin Live VPS Trademarks & Expiry Monitoring API
const adminAuth = require('./admin-auth');

const VPS_BASE_URL = process.env.COLLECTION_ENGINE_BASE_URL || 'http://31.59.119.67';
const VPS_API_TOKEN =
  process.env.COLLECTION_ENGINE_API_TOKEN ||
  '3440669e55976bc93dfb2f4ff61d221946ec3825de61ed0cfac66f5cd9a3cff1';

const MONTH_MAP = {
  januari: 0, january: 0, jan: 0,
  februari: 1, february: 1, feb: 1,
  maret: 2, march: 2, mar: 2,
  april: 3, apr: 3,
  mei: 4, may: 4,
  juni: 5, june: 5, jun: 5,
  juli: 6, july: 6, jul: 6,
  agustus: 7, august: 7, aug: 7, agu: 7,
  september: 8, sep: 8, sept: 8,
  oktober: 9, october: 9, okt: 9, oct: 9,
  november: 10, nov: 10,
  desember: 11, december: 11, des: 11, dec: 11
};

function parseFlexibleDate(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const s = raw.trim();
  if (!s || s === '-' || s === '--') return null;

  // ISO YYYY-MM-DD
  const isoMatch = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    const d = new Date(Date.UTC(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3])));
    return isNaN(d.getTime()) ? null : d;
  }

  // DD/MM/YYYY or DD-MM-YYYY
  const dmyNum = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmyNum) {
    const d = new Date(Date.UTC(Number(dmyNum[3]), Number(dmyNum[2]) - 1, Number(dmyNum[1])));
    return isNaN(d.getTime()) ? null : d;
  }

  // DD-Month-YYYY or DD Month YYYY
  const dmyText = s.match(/^(\d{1,2})[\s\-]+([A-Za-z]+)[\s\-]+(\d{4})$/);
  if (dmyText) {
    const m = MONTH_MAP[dmyText[2].toLowerCase()];
    if (m !== undefined) {
      const d = new Date(Date.UTC(Number(dmyText[3]), m, Number(dmyText[1])));
      return isNaN(d.getTime()) ? null : d;
    }
  }

  const fallback = new Date(s);
  return isNaN(fallback.getTime()) ? null : fallback;
}

function toIsoDate(d) {
  if (!d) return null;
  return d.toISOString().slice(0, 10);
}

function extractFilingYearHint(appNo) {
  if (!appNo || typeof appNo !== 'string') return null;
  const m = appNo.trim().match(/^[A-Z]{1,3}\d{0,2}?(19\d{2}|20[0-2]\d)\d{4,}$/i);
  if (!m) return null;
  const yr = parseInt(m[1], 10);
  if (yr >= 1980 && yr <= 2030) return yr;
  return null;
}

function computeExpiryInfo(item) {
  const reg = item.registration || {};
  let endDateObj = parseFlexibleDate(reg.protection_end_date);
  let estimated = false;

  // Fallback: DJKI trademark protection is 10 years from filing/start date if end date is missing
  if (!endDateObj) {
    const startObj =
      parseFlexibleDate(reg.protection_start_date) ||
      parseFlexibleDate(reg.registration_date) ||
      parseFlexibleDate(reg.application_date);
    if (startObj) {
      endDateObj = new Date(
        Date.UTC(startObj.getUTCFullYear() + 10, startObj.getUTCMonth(), startObj.getUTCDate())
      );
      estimated = true;
    }
  }

  const now = new Date();
  const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  if (!endDateObj) {
    if (item.status_key === 'berakhir' || /berakhir|kadaluarsa|hapus/i.test(item.status_text || '')) {
      return {
        protectionEndDate: null,
        daysUntilExpiry: -1,
        expiryStatus: 'expired',
        isEstimatedDate: false
      };
    }
    return {
      protectionEndDate: null,
      daysUntilExpiry: null,
      expiryStatus: 'no_date',
      isEstimatedDate: false
    };
  }

  const diffMs = endDateObj.getTime() - todayUtc;
  const daysUntilExpiry = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let expiryStatus = 'safe';
  if (daysUntilExpiry < 0) expiryStatus = 'expired';
  else if (daysUntilExpiry <= 30) expiryStatus = 'critical';
  else if (daysUntilExpiry <= 90) expiryStatus = 'warning';
  else if (daysUntilExpiry <= 180) expiryStatus = 'upcoming';

  return {
    protectionEndDate: toIsoDate(endDateObj),
    daysUntilExpiry,
    expiryStatus,
    isEstimatedDate: estimated
  };
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Token');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Verify Admin Auth
  const token = adminAuth.extractBearerToken(req);
  const decoded = adminAuth.verifyToken(token);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak. Silakan login sebagai Admin terlebih dahulu.'
    });
  }

  if (req.method === 'GET') {
    try {
      const q = String(req.query?.q || '').trim();
      const page = Math.max(1, parseInt(req.query?.page || '1', 10) || 1);
      const perPage = Math.min(200, Math.max(10, parseInt(req.query?.per_page || '100', 10) || 100));

      const params = new URLSearchParams({
        page: String(page),
        per_page: String(perPage),
        limit: String(perPage)
      });
      if (q) params.set('q', q);

      const vpsResp = await fetch(`${VPS_BASE_URL}/api/trademarks?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${VPS_API_TOKEN}`,
          Accept: 'application/json'
        },
        signal: AbortSignal.timeout(8000)
      });

      if (!vpsResp.ok) {
        return res.status(502).json({
          success: false,
          message: `VPS Collection Engine merespon HTTP ${vpsResp.status}`
        });
      }

      const vpsJson = await vpsResp.json();
      const rawData = Array.isArray(vpsJson.data) ? vpsJson.data : [];

      const summary = {
        total: vpsJson.meta?.total || rawData.length,
        fetched: rawData.length,
        expired: 0,
        critical: 0,
        warning: 0,
        upcoming: 0,
        safe: 0,
        noDate: 0,
        withLogo: 0
      };

      const items = rawData.map((item) => {
        let logoUrl = null;
        if (item.primary_image && item.primary_image.file_path) {
          logoUrl = `/api/logo?path=${encodeURIComponent(item.primary_image.file_path)}`;
        } else if (item.primary_image && item.primary_image.url) {
          logoUrl = item.primary_image.url.replace('http://127.0.0.1:8001', VPS_BASE_URL);
        }
        if (logoUrl) summary.withLogo++;

        const expiry = computeExpiryInfo(item);
        if (expiry.expiryStatus === 'expired') summary.expired++;
        else if (expiry.expiryStatus === 'critical') summary.critical++;
        else if (expiry.expiryStatus === 'warning') summary.warning++;
        else if (expiry.expiryStatus === 'upcoming') summary.upcoming++;
        else if (expiry.expiryStatus === 'safe') summary.safe++;
        else summary.noDate++;

        const classList = Array.isArray(item.classes)
          ? item.classes.map((c) => String(c.class_number)).filter(Boolean)
          : [];

        const filingYearHint = extractFilingYearHint(item.application_number);
        const estimatedExpiryYear = filingYearHint ? filingYearHint + 10 : null;

        return {
          id: item.id,
          brandName: (item.brand_name || '-').toUpperCase(),
          applicationNumber: item.application_number || '-',
          registrationNumber: item.registration?.registration_number || null,
          niceClasses: classList.length > 0 ? classList : ['35'],
          statusText: item.status_text || '(TM) DIDAFTAR',
          statusKey: item.status_key || 'didaftar',
          ownerName: item.owner?.name || '-',
          ownerAddress: item.owner?.address || null,
          consultantName: item.consultant?.name || null,
          applicationDate: item.registration?.application_date || null,
          registrationDate: item.registration?.registration_date || null,
          protectionStartDate: item.registration?.protection_start_date || null,
          protectionEndDate: expiry.protectionEndDate,
          daysUntilExpiry: expiry.daysUntilExpiry,
          expiryStatus: expiry.expiryStatus,
          isEstimatedDate: expiry.isEstimatedDate,
          filingYearHint,
          estimatedExpiryYear,
          detailUrl: item.detail_page_url || item.source_url || null,
          logoUrl,
          updatedAt: item.updated_at || item.collected_at || item.created_at || null
        };
      });

      return res.status(200).json({
        success: true,
        summary,
        meta: vpsJson.meta || { current_page: page, last_page: 1, per_page: perPage, total: items.length },
        data: items
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: `Gagal memuat data dari VPS: ${err.message}`
      });
    }
  }

  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch { body = {}; }
      }

      const appNumber = String(body?.applicationNumber || body?.application_number || '').trim();
      const brandName = String(body?.brandName || body?.brand_name || '').trim();
      if (!appNumber || !brandName) {
        return res.status(400).json({
          success: false,
          message: 'Nomor Permohonan dan Nama Merek wajib diisi.'
        });
      }

      const niceClasses = Array.isArray(body?.niceClasses)
        ? body.niceClasses
        : String(body?.niceClasses || '35')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);

      const statusKey = body?.statusKey || 'didaftar';
      const statusText =
        body?.statusText ||
        (statusKey === 'berakhir'
          ? 'BERAKHIR'
          : statusKey === 'dalam_proses'
          ? 'DALAM PROSES'
          : statusKey === 'ditolak'
          ? '(TM) DITOLAK'
          : '(TM) DIDAFTAR');

      const importPayload = {
        application_number: appNumber,
        applicationNumber: appNumber,
        brand_name: brandName,
        brandName: brandName,
        status_text: statusText,
        statusText: statusText,
        status_key: statusKey,
        statusKey: statusKey,
        niceClasses,
        owner: {
          name: body?.ownerName || 'Pemohon Terdaftar (DJKI)',
          address: body?.ownerAddress || null,
          nationality: 'ID'
        },
        registration: {
          applicationNumber: appNumber,
          registrationNumber: body?.registrationNumber || null,
          applicationDate: body?.applicationDate || null,
          registrationDate: body?.registrationDate || null,
          protectionStartDate: body?.protectionStartDate || null,
          protectionEndDate: body?.protectionEndDate || null
        },
        source_url: body?.detailUrl || 'https://brandconnect-virid.vercel.app/admin.html',
        detail_page_url: body?.detailUrl || null
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
        signal: AbortSignal.timeout(10000)
      });

      const vpsData = await vpsResp.json().catch(() => ({}));
      if (!vpsResp.ok || !vpsData.success) {
        return res.status(502).json({
          success: false,
          message: vpsData.message || `Gagal menyimpan ke VPS (HTTP ${vpsResp.status})`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Data merek & tanggal kedaluwarsa berhasil disimpan ke VPS.',
        data: vpsData
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: `Gagal menyimpan data: ${err.message}`
      });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
};
