// Vercel Serverless Function: Dual-Source Trademark Search (Collection Engine VPS + APIIndonesia)
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

  // 1. Fetch from Collection Engine VPS
  try {
    // Generate query variants for tolerance (e.g. "barbers daily" -> "barber daily", "barber")
    const searchQueries = [rawQuery];
    const strippedS = rawQuery.replace(/s\b/gi, '').trim();
    if (strippedS !== rawQuery && strippedS.length > 2) {
      searchQueries.push(strippedS);
    }
    const firstWord = rawQuery.split(/\s+/)[0];
    if (firstWord.length > 3 && !searchQueries.includes(firstWord)) {
      searchQueries.push(firstWord);
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

            const mapped = {
              brand: (item.brand_name || rawQuery).toUpperCase(),
              niceClass: niceClassStr,
              appNo: appNo || '-',
              owner: item.owner?.name || 'Pemohon Terdaftar (DJKI)',
              ownerAddress: item.owner?.address || null,
              status: item.status_text || '(TM) DIDAFTAR',
              statusKey: item.status_key || 'didaftar',
              regDate: item.registration?.application_date || item.registration?.registration_date || '-',
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
      const strippedS = rawQuery.replace(/s\b/gi, '').trim();
      if (strippedS !== rawQuery && strippedS.length > 2) {
        extTerms.push(strippedS);
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

  return res.status(200).json({
    success: true,
    query: rawQuery,
    source_mode: sourceMode,
    sources_consulted: sourcesConsulted,
    total: items.length,
    data: items
  });
};
