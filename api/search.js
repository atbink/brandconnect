// Vercel Serverless Function: Dual-Source Trademark Search (Collection Engine VPS + APIIndonesia)

/**
 * Menghasilkan variasi fonetik dan ejaan umum merek di Indonesia.
 * Mendukung variasi 'mie' <-> 'mi' (Sarimi/Sarimie, Indomie/Indomi, Bakmi/Bakmie),
 * kopi <-> coffee, kafe <-> cafe, pengurangan vokal rangkap (ee -> i, oo -> u, oe -> u),
 * konsonan serapan (ph -> f, ck -> k, sy/sh -> s), dan typo 1 huruf di akhir kata.
 */
function generatePhoneticQueryVariants(raw) {
  if (!raw) return [];
  const q = raw.toLowerCase().trim();
  const variants = new Set();

  // 1. Mie <-> Mi (Sarimi/Sarimie, Indomie/Indomi, Bakmi/Bakmie, Supermi/Supermie)
  if (/mie\b/i.test(q)) variants.add(q.replace(/mie\b/gi, 'mi'));
  if (/mi\b/i.test(q) && !/mie\b/i.test(q)) variants.add(q.replace(/mi\b/gi, 'mie'));
  if (q.includes('mie')) variants.add(q.replace(/mie/g, 'mi'));
  if (q.includes('mi') && !q.includes('mie')) variants.add(q.replace(/mi/g, 'mie'));

  // 2. Coffe / Coffee / Kopi
  if (q.includes('coffe') || q.includes('coffee') || q.includes('kopi')) {
    variants.add(q.replace(/coffe(e)?/g, 'kopi'));
    variants.add(q.replace(/kopi/g, 'coffee'));
    variants.add(q.replace(/coffe\b/g, 'coffee'));
  }

  // 3. Cafe / Kafe
  if (q.includes('cafe')) variants.add(q.replace(/cafe/g, 'kafe'));
  if (q.includes('kafe')) variants.add(q.replace(/kafe/g, 'cafe'));

  // 4. Double vowel reductions: ee -> i, oo -> u, oe -> u
  if (q.includes('ee')) variants.add(q.replace(/ee/g, 'i'));
  if (q.includes('oo')) variants.add(q.replace(/oo/g, 'u'));
  if (q.includes('oe')) variants.add(q.replace(/oe/g, 'u'));

  // 5. Consonants: ph -> f, v -> f, ck -> k, sh/sy -> s, dj -> j, tj -> c
  if (q.includes('ph')) variants.add(q.replace(/ph/g, 'f'));
  if (q.includes('ck')) variants.add(q.replace(/ck/g, 'k'));
  if (q.includes('sy')) variants.add(q.replace(/sy/g, 's'));
  if (q.includes('sh')) variants.add(q.replace(/sh/g, 's'));
  if (q.includes('dj')) variants.add(q.replace(/dj/g, 'j'));
  if (q.includes('tj')) variants.add(q.replace(/tj/g, 'c'));

  // 6. Typo 1 huruf di akhir kata (misal sarimie -> sarimi)
  if (q.length > 4 && q.endsWith('e') && !q.endsWith('ee')) {
    variants.add(q.slice(0, -1));
  }

  variants.delete(q);
  return Array.from(variants);
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const queryParams = req.method === 'POST' ? req.body : req.query;
  const rawQuery = (queryParams?.q || queryParams?.query || '').trim();
  const sourceMode = queryParams?.source_mode || 'hybrid'; // hybrid, internal_priority, internal_only

  if (!rawQuery) {
    return res.status(400).json({ success: false, message: 'Parameter "q" (kata kunci merek) diperlukan.' });
  }

  const VPS_BASE_URL = process.env.COLLECTION_ENGINE_BASE_URL || 'http://31.59.119.67';
  const VPS_API_TOKEN = process.env.COLLECTION_ENGINE_API_TOKEN || '3440669e55976bc93dfb2f4ff61d221946ec3825de61ed0cfac66f5cd9a3cff1';
  const API_INDONESIA_KEY = process.env.PDKI_API_KEY || 'aip_live_tW5NibLE0C8rjVIF6jOYon3PgdbTsE01';

  const sourcesConsulted = [];
  const itemsMap = new Map();
  const phoneticVariants = generatePhoneticQueryVariants(rawQuery);

  // 1. Fetch from Collection Engine VPS
  try {
    // Generate query variants for tolerance:
    // - Compound words without space: "gym tiger" -> "gymtiger", "mc donald" -> "mcdonald"
    // - Plurals / typos: "barbers daily" -> "barber daily"
    // - Word tokens: "gym", "tiger"
    const searchQueries = [rawQuery];

    const noSpace = rawQuery.replace(/\s+/g, '').trim();
    if (noSpace !== rawQuery && noSpace.length >= 3) {
      searchQueries.push(noSpace);
    }

    const strippedS = rawQuery.replace(/s\b/gi, '').replace(/\s+/g, ' ').trim();
    if (strippedS !== rawQuery && strippedS.length >= 3 && !searchQueries.includes(strippedS)) {
      searchQueries.push(strippedS);
    }

    const words = rawQuery.split(/\s+/).filter((w) => w.length >= 3);
    for (const w of words) {
      if (!searchQueries.includes(w)) searchQueries.push(w);
      const wNoS = w.replace(/s\b/gi, '');
      if (wNoS.length >= 3 && !searchQueries.includes(wNoS)) searchQueries.push(wNoS);
    }

    // Variasi Fonetik & Kemiripan Ejaan (misal "sarimie" -> "sarimi")
    for (const v of phoneticVariants) {
      if (!searchQueries.includes(v)) searchQueries.push(v);
    }

    for (const qTerm of searchQueries) {
      if (itemsMap.size >= 15) break;

      const vpsResp = await fetch(`${VPS_BASE_URL}/api/trademarks?q=${encodeURIComponent(qTerm)}`, {
        headers: {
          'Authorization': `Bearer ${VPS_API_TOKEN}`,
          'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(5000)
      });

      if (vpsResp.ok) {
        const vpsJson = await vpsResp.json();
        const rawVpsData = Array.isArray(vpsJson.data) ? vpsJson.data : [];
        if (rawVpsData.length > 0) {
          if (!sourcesConsulted.includes('collection_engine')) {
            sourcesConsulted.push('collection_engine');
          }
          for (const item of rawVpsData) {
            const appNo = item.application_number || '';
            const key = appNo || `VPS_${item.id}`;
            if (itemsMap.has(key)) continue;

            let logoUrl = null;
            if (item.primary_image && item.primary_image.file_path) {
              logoUrl = `/api/logo?path=${encodeURIComponent(item.primary_image.file_path)}`;
            } else if (item.primary_image && item.primary_image.url) {
              logoUrl = item.primary_image.url.replace('http://127.0.0.1:8001', VPS_BASE_URL);
            }

            const classList = Array.isArray(item.classes)
              ? item.classes.map(c => String(c.class_number)).filter(Boolean)
              : [];
            const niceClassStr = classList.length > 0 ? classList.join(', ') : '35';

            const classDescriptions = Array.isArray(item.classes)
              ? item.classes.map((c) => c.class_description).filter(Boolean).join('; ')
              : null;

            const mapped = {
              brand: (item.brand_name || rawQuery).toUpperCase(),
              niceClass: niceClassStr,
              appNo: appNo || '-',
              owner: item.owner?.name || 'Pemohon Terdaftar (DJKI)',
              ownerAddress: item.owner?.address || null,
              ownerNationality: item.owner?.nationality || 'ID',
              status: item.status_text || '(TM) DIDAFTAR',
              statusKey: item.status_key || 'didaftar',
              regDate: item.registration?.registration_date || item.registration?.application_date || '-',
              appDate: item.registration?.application_date || '-',
              regNo: item.registration?.registration_number || null,
              pubNo: item.registration?.publication_number || null,
              protectionStart: item.registration?.protection_start_date || null,
              protectionEnd: item.registration?.protection_end_date || null,
              classDescription: classDescriptions,
              consultant: item.consultant?.name || null,
              detailUrl: item.detail_page_url || item.source_url || null,
              logoUrl: logoUrl,
              source: 'collection_engine'
            };

            itemsMap.set(key, mapped);
          }
        }
      }
    }
  } catch (err) {
    console.warn('Collection Engine VPS fetch error:', err.message);
  }

  // 2. Determine whether to call external API (APIIndonesia)
  const shouldCallExternal =
    (sourceMode === 'hybrid') ||
    (sourceMode === 'internal_priority' && itemsMap.size === 0);

  if (shouldCallExternal && API_INDONESIA_KEY) {
    try {
      const extTerms = [rawQuery];
      const extNoSpace = rawQuery.replace(/\s+/g, '').trim();
      if (extNoSpace !== rawQuery && extNoSpace.length >= 3) {
        extTerms.push(extNoSpace);
      }
      const strippedS = rawQuery.replace(/s\b/gi, '').trim();
      if (strippedS !== rawQuery && strippedS.length > 2 && !extTerms.includes(strippedS)) {
        extTerms.push(strippedS);
      }

      // Variasi Fonetik & Kemiripan Ejaan untuk API Eksternal
      for (const v of phoneticVariants) {
        if (!extTerms.includes(v)) extTerms.push(v);
      }

      for (const term of extTerms) {
        if (itemsMap.size >= 15) break;

        const extResp = await fetch(`https://use.apiindonesia.id/api/v1/merek/search?q=${encodeURIComponent(term)}&page=1&limit=15`, {
          headers: {
            'x-api-key': API_INDONESIA_KEY,
            'Accept': 'application/json'
          },
          signal: AbortSignal.timeout(5000)
        });

        if (extResp.ok) {
          const extJson = await extResp.json();
          const rawExtData = Array.isArray(extJson.data) ? extJson.data : [];
          if (rawExtData.length > 0) {
            if (!sourcesConsulted.includes('api_indonesia')) {
              sourcesConsulted.push('api_indonesia');
            }
            for (const item of rawExtData) {
              const appNo = String(item.app_number || item.nomor_permohonan || item.no_permohonan || '');
              const key = appNo || `EXT_${item.id || Math.random()}`;

              // Do not overwrite Collection Engine records (Collection Engine has higher priority)
              if (!itemsMap.has(key)) {
                const brand = String(item.mark_name || item.nama_merek || item.name || rawQuery).toUpperCase();
                const rawClass = String(item.class || item.kelas || '35').replace(/[^0-9, ]/g, '').trim() || '35';
                const rawStatus = String(item.status || item.status_merek || '').toUpperCase();

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
                  }
                }

                itemsMap.set(key, {
                  brand,
                  niceClass: rawClass,
                  appNo: appNo || '-',
                  owner: String(item.owner || item.pemilik || item.nama_pemilik || 'Pemohon Terdaftar (DJKI)').trim(),
                  status: statusLabel,
                  statusKey,
                  regDate: item.reg_date || item.tgl_permohonan || '-',
                  logoUrl: item.logo_url || item.image_url || null,
                  source: 'api_indonesia'
                });
              }
            }
          }
        }
      }
    } catch (err) {
      console.warn('API Indonesia fetch error:', err.message);
    }
  }

  const items = Array.from(itemsMap.values());

  // Deteksi apakah hasil ditemukan melalui variasi fonetik
  const rawLower = rawQuery.toLowerCase().trim();
  const exactDirectMatch = items.some((it) => {
    const b = (it.brand || '').toLowerCase().trim();
    return b === rawLower || b.replace(/\s+/g, '') === rawLower.replace(/\s+/g, '');
  });

  let suggestedQuery = null;
  if (!exactDirectMatch && items.length > 0 && phoneticVariants.length > 0) {
    for (const v of phoneticVariants) {
      const vLower = v.toLowerCase();
      const matched = items.some((it) => {
        const b = (it.brand || '').toLowerCase();
        return b === vLower || b.includes(vLower);
      });
      if (matched) {
        suggestedQuery = v.toUpperCase();
        break;
      }
    }
    if (!suggestedQuery && items[0]) {
      suggestedQuery = items[0].brand;
    }
  }

  return res.status(200).json({
    success: true,
    query: rawQuery,
    suggested_query: suggestedQuery,
    is_phonetic_match: Boolean(suggestedQuery),
    source_mode: sourceMode,
    sources_consulted: sourcesConsulted,
    total: items.length,
    data: items
  });
};
