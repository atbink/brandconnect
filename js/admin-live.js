/**
 * BrandConnect Live Admin Panel Controller
 * - Stateless Admin Authentication (/api/admin-auth)
 * - Live VPS Trademark Database with Server-Side Search & Pagination (/api/admin-trademarks)
 * - Expiry Monitoring, Auto-Enrich Dates (/api/admin-enrich-expiry), CSV Export & 1-Click WA/Email/Copy Reminder
 */
(function () {
  const TOKEN_KEY = 'bc_admin_token_v1';
  const CONTACTS_KEY = 'bc_admin_contacts_v1';

  let allTrademarks = [];
  let currentSummary = null;
  let currentMeta = { current_page: 1, last_page: 1, per_page: 50, total: 0 };
  let currentPage = 1;
  let serverQuery = '';
  let activeExpiryFilter = 'all';
  let isEnriching = false;
  let searchDebounce = null;

  function getToken() {
    return localStorage.getItem(TOKEN_KEY) || '';
  }

  function setToken(token) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }

  function getContactsMap() {
    try {
      return JSON.parse(localStorage.getItem(CONTACTS_KEY) || '{}');
    } catch {
      return {};
    }
  }

  function saveContact(appNo, phone, email) {
    if (!appNo) return;
    const map = getContactsMap();
    map[appNo] = {
      phone: (phone || '').trim(),
      email: (email || '').trim(),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(map));
  }

  function showToast(msg, isError = false) {
    let el = document.getElementById('adm-live-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'adm-live-toast';
      el.style.cssText =
        'position:fixed;bottom:24px;right:24px;z-index:99999;padding:12px 18px;border-radius:8px;font-size:0.84rem;font-weight:700;color:#fff;box-shadow:0 10px 28px rgba(0,0,0,0.28);transition:opacity 0.25s ease;max-width:460px;';
      document.body.appendChild(el);
    }
    el.style.background = isError ? '#991B1B' : '#0D3B2E';
    el.textContent = msg;
    el.style.opacity = '1';
    el.style.display = 'block';
    clearTimeout(el._timer);
    el._timer = setTimeout(() => {
      el.style.opacity = '0';
      setTimeout(() => (el.style.display = 'none'), 250);
    }, 3600);
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalizeWaPhone(raw) {
    if (!raw) return '';
    let digits = String(raw).replace(/[^0-9]/g, '');
    if (digits.startsWith('0')) digits = '62' + digits.slice(1);
    return digits;
  }

  function formatExpiryBadge(item) {
    const s = item.expiryStatus;
    const d = item.daysUntilExpiry;
    if (s === 'critical') {
      return `<span style="display:inline-block;padding:3px 8px;border-radius:999px;font-size:0.72rem;font-weight:800;background:#FEE2E2;color:#991B1B;border:1px solid #FCA5A5;">KRITIS · Sisa ${d} Hari</span>`;
    }
    if (s === 'warning') {
      return `<span style="display:inline-block;padding:3px 8px;border-radius:999px;font-size:0.72rem;font-weight:800;background:#FEF3C7;color:#92400E;border:1px solid #FCD34D;">SEGERA · Sisa ${d} Hari</span>`;
    }
    if (s === 'upcoming') {
      return `<span style="display:inline-block;padding:3px 8px;border-radius:999px;font-size:0.72rem;font-weight:700;background:#E0F2FE;color:#075985;border:1px solid #7DD3FC;">H-180 · Sisa ${d} Hari</span>`;
    }
    if (s === 'expired') {
      const label = d !== null && d < -1 ? `KEDALUWARSA (${Math.abs(d)} hari lalu)` : 'KEDALUWARSA / BERAKHIR';
      return `<span style="display:inline-block;padding:3px 8px;border-radius:999px;font-size:0.72rem;font-weight:800;background:#1F2937;color:#F9FAFB;">${label}</span>`;
    }
    if (s === 'safe') {
      const years = Math.floor(d / 365);
      const label = years >= 1 ? `AMAN · ${years} thn (${d} hari)` : `AMAN · Sisa ${d} Hari`;
      return `<span style="display:inline-block;padding:3px 8px;border-radius:999px;font-size:0.72rem;font-weight:700;background:#DCFCE7;color:#166534;border:1px solid #86EFAC;">${label}</span>`;
    }

    // Smart Year Hint from Application Number when official date is not yet filled
    if (item.estimatedExpiryYear) {
      const thisYear = new Date().getFullYear();
      const isHot = item.estimatedExpiryYear <= thisYear + 1;
      const bg = isHot ? '#FEF3C7' : '#F3F4F6';
      const color = isHot ? '#92400E' : '#4B5563';
      const border = isHot ? '#FCD34D' : '#D1D5DB';
      return `<span style="display:inline-block;padding:3px 8px;border-radius:999px;font-size:0.71rem;font-weight:700;background:${bg};color:${color};border:1px solid ${border};">Est. ~${item.estimatedExpiryYear} (No. ${item.filingYearHint})</span>`;
    }

    return `<span style="display:inline-block;padding:3px 8px;border-radius:999px;font-size:0.72rem;font-weight:600;background:#F3F4F6;color:#6B7280;border:1px solid #D1D5DB;">Belum Ada Tanggal</span>`;
  }

  function buildReminderMessage(item) {
    const brand = item.brandName || '-';
    const appNo = item.applicationNumber || '-';
    const classes = Array.isArray(item.niceClasses) ? item.niceClasses.join(', ') : '-';
    const endDate =
      item.protectionEndDate ||
      (item.estimatedExpiryYear ? `Estimasi tahun ${item.estimatedExpiryYear}` : '(belum tercatat)');
    const owner = item.ownerName && item.ownerName !== '-' ? item.ownerName : 'Bapak/Ibu Pemilik Merek';

    if (item.expiryStatus === 'expired') {
      return (
        `Halo ${owner},\n\n` +
        `Kami dari tim *BrandConnect (Konsultan HKI & Perlindungan Merek)* ingin menginformasikan bahwa masa perlindungan merek berikut telah *BERAKHIR / KEDALUWARSA*:\n\n` +
        `• Nama Merek: *${brand}*\n` +
        `• No. Permohonan: ${appNo}\n` +
        `• Kelas Nice: ${classes}\n` +
        `• Tgl Berakhir: ${endDate}\n\n` +
        `Jika masih dalam masa tenggang (6 bulan) atau ingin didaftarkan ulang agar tidak diambil pihak lain, tim BrandConnect siap membantu proses perpanjangannya secara cepat dan resmi di DJKI.\n\n` +
        `Apakah Bapak/Ibu berkenan kami bantu cek opsi perpanjangannya?`
      );
    }

    const sisaText =
      item.daysUntilExpiry !== null ? ` (tersisa *${item.daysUntilExpiry} hari* lagi)` : '';

    return (
      `Halo ${owner},\n\n` +
      `Pengingat resmi dari tim *BrandConnect*: Masa perlindungan merek Anda di DJKI akan segera berakhir${sisaText}:\n\n` +
      `• Nama Merek: *${brand}*\n` +
      `• No. Permohonan: ${appNo}\n` +
      `• Kelas Nice: ${classes}\n` +
      `• Tgl Berakhir Perlindungan: *${endDate}*\n\n` +
      `Perpanjangan merek dapat diajukan sejak 6 bulan sebelum masa perlindungan habis agar hak eksklusif merek tetap aman tanpa denda keterlambatan.\n\n` +
      `Balas pesan ini jika Bapak/Ibu ingin dibantu pengurusan perpanjangannya oleh tim BrandConnect.`
    );
  }

  window.bcSendWaReminder = function (appNo) {
    const item = allTrademarks.find((t) => t.applicationNumber === appNo);
    if (!item) return;
    const contacts = getContactsMap()[appNo] || {};
    const phone = normalizeWaPhone(contacts.phone);
    const text = encodeURIComponent(buildReminderMessage(item));
    const url = phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank', 'noopener');
    showToast(`Membuka WhatsApp Reminder untuk ${item.brandName}...`);
  };

  window.bcSendEmailReminder = function (appNo) {
    const item = allTrademarks.find((t) => t.applicationNumber === appNo);
    if (!item) return;
    const contacts = getContactsMap()[appNo] || {};
    const email = contacts.email || '';
    const subject = encodeURIComponent(
      `[Reminder Kedaluwarsa Merek] ${item.brandName} (${item.applicationNumber}) — BrandConnect`
    );
    const body = encodeURIComponent(buildReminderMessage(item).replace(/\*/g, ''));
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  window.bcCopyReminder = async function (appNo) {
    const item = allTrademarks.find((t) => t.applicationNumber === appNo);
    if (!item) return;
    try {
      await navigator.clipboard.writeText(buildReminderMessage(item));
      showToast(`✓ Pesan reminder untuk ${item.brandName} berhasil disalin!`);
    } catch {
      showToast('Gagal menyalin pesan ke clipboard.', true);
    }
  };

  window.bcAutoEnrichDates = async function () {
    if (isEnriching) return;
    const targets = getFilteredExpiryList()
      .filter((t) => !t.protectionEndDate && t.applicationNumber && t.applicationNumber !== '-')
      .slice(0, 10);

    if (targets.length === 0) {
      showToast('Semua merek di halaman ini sudah memiliki tanggal perlindungan!');
      return;
    }

    isEnriching = true;
    const btn = document.getElementById('adm-auto-enrich-btn');
    const origText = btn ? btn.textContent : '';
    if (btn) {
      btn.disabled = true;
      btn.textContent = `⏳ Melengkapi ${targets.length} merek...`;
    }

    try {
      const resp = await fetch('/api/admin-enrich-expiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ items: targets })
      });
      const json = await resp.json();
      if (!resp.ok || !json.success) {
        throw new Error(json.message || 'Gagal melengkapi tanggal');
      }
      showToast(`✓ ${json.message}`);
      await loadVpsTrademarks(currentPage, serverQuery);
    } catch (err) {
      showToast(`Gagal auto-lengkapi: ${err.message}`, true);
    } finally {
      isEnriching = false;
      if (btn) {
        btn.disabled = false;
        btn.textContent = origText || '🔄 Lengkapi Tanggal Otomatis (10 Merek)';
      }
    }
  };

  window.bcExportExpiryCsv = function () {
    const list = getFilteredExpiryList();
    if (list.length === 0) {
      showToast('Tidak ada data untuk diexport.', true);
      return;
    }
    const contactsMap = getContactsMap();
    const headers = [
      'Nama Merek',
      'No Permohonan',
      'Kelas Nice',
      'Pemilik',
      'Status Merek',
      'Tgl Berakhir Perlindungan',
      'Estimasi Tahun',
      'Sisa Hari',
      'Kategori Kedaluwarsa',
      'WhatsApp Pemilik',
      'Email Pemilik'
    ];
    const escapeCsv = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = list.map((it) => {
      const c = contactsMap[it.applicationNumber] || {};
      return [
        it.brandName,
        it.applicationNumber,
        (it.niceClasses || []).join(', '),
        it.ownerName,
        it.statusText,
        it.protectionEndDate || '',
        it.estimatedExpiryYear || '',
        it.daysUntilExpiry !== null ? it.daysUntilExpiry : '',
        it.expiryStatus,
        c.phone || '',
        c.email || ''
      ]
        .map(escapeCsv)
        .join(',');
    });
    const csv = '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BrandConnect-Reminder-Kedaluwarsa-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`✓ ${list.length} data berhasil diexport ke CSV!`);
  };

  window.bcGoPage = function (nextPage) {
    const target = Math.max(1, Math.min(currentMeta.last_page || 1, nextPage));
    if (target === currentPage) return;
    currentPage = target;
    loadVpsTrademarks(currentPage, serverQuery);
  };

  window.bcOpenExpiryModal = function (appNo) {
    const modal = document.getElementById('adm-expiry-modal');
    if (!modal) return;
    const item = appNo ? allTrademarks.find((t) => t.applicationNumber === appNo) : null;
    const contacts = appNo ? getContactsMap()[appNo] || {} : {};

    document.getElementById('exp-modal-title').textContent = item
      ? `Atur Kedaluwarsa & Kontak — ${item.brandName}`
      : 'Tambah Merek & Jadwal Kedaluwarsa Baru';

    document.getElementById('exp-appno').value = item ? item.applicationNumber : '';
    document.getElementById('exp-appno').readOnly = Boolean(item);
    document.getElementById('exp-brand').value = item ? item.brandName : '';
    document.getElementById('exp-classes').value = item ? (item.niceClasses || []).join(', ') : '35';
    document.getElementById('exp-owner').value = item && item.ownerName !== '-' ? item.ownerName : '';
    document.getElementById('exp-status').value = item ? item.statusKey || 'didaftar' : 'didaftar';
    document.getElementById('exp-enddate').value = item && item.protectionEndDate ? item.protectionEndDate : '';
    document.getElementById('exp-phone').value = contacts.phone || '';
    document.getElementById('exp-email').value = contacts.email || '';

    modal.style.display = 'flex';
  };

  window.bcCloseExpiryModal = function () {
    const modal = document.getElementById('adm-expiry-modal');
    if (modal) modal.style.display = 'none';
  };

  window.bcSetExpiryFilter = function (filterKey) {
    activeExpiryFilter = filterKey;
    document.querySelectorAll('.exp-filter-pill').forEach((btn) => {
      const active = btn.getAttribute('data-filter') === filterKey;
      btn.style.background = active ? '#0D3B2E' : '#FFFFFF';
      btn.style.color = active ? '#FFFFFF' : '#1C1D1B';
      btn.style.borderColor = active ? '#0D3B2E' : '#D6D3CD';
    });
    renderExpiryTable();
  };

  function getUrgencyRank(item) {
    switch (item.expiryStatus) {
      case 'critical': return 1;
      case 'warning': return 2;
      case 'upcoming': return 3;
      case 'expired': return 4;
      case 'safe': return 5;
      default: return 6;
    }
  }

  function getFilteredExpiryList() {
    let list = allTrademarks.filter((item) => {
      if (activeExpiryFilter === 'critical' && item.expiryStatus !== 'critical') return false;
      if (activeExpiryFilter === 'upcoming' && !['warning', 'upcoming'].includes(item.expiryStatus)) return false;
      if (activeExpiryFilter === 'expired' && item.expiryStatus !== 'expired') return false;
      if (activeExpiryFilter === 'safe' && item.expiryStatus !== 'safe') return false;
      if (activeExpiryFilter === 'no_date' && item.expiryStatus !== 'no_date') return false;
      return true;
    });

    list.sort((a, b) => {
      const rankDiff = getUrgencyRank(a) - getUrgencyRank(b);
      if (rankDiff !== 0) return rankDiff;
      if (a.daysUntilExpiry !== null && b.daysUntilExpiry !== null) {
        return a.daysUntilExpiry - b.daysUntilExpiry;
      }
      if (a.estimatedExpiryYear && b.estimatedExpiryYear) {
        return a.estimatedExpiryYear - b.estimatedExpiryYear;
      }
      return 0;
    });

    return list;
  }

  function renderKpis() {
    if (!currentSummary) return;
    const elTotal = document.getElementById('adm-kpi-vps-total');
    const elCrit = document.getElementById('adm-kpi-exp-critical');
    const elUpc = document.getElementById('adm-kpi-exp-upcoming');
    const elExp = document.getElementById('adm-kpi-exp-expired');

    if (elTotal) elTotal.textContent = currentSummary.total ?? allTrademarks.length;
    if (elCrit) elCrit.textContent = currentSummary.critical ?? 0;
    if (elUpc) elUpc.textContent = (currentSummary.warning || 0) + (currentSummary.upcoming || 0);
    if (elExp) elExp.textContent = currentSummary.expired ?? 0;

    const badge = document.getElementById('sb-expiry-alert-badge');
    if (badge) {
      const urgentCount = (currentSummary.critical || 0) + (currentSummary.warning || 0) + (currentSummary.expired || 0);
      badge.textContent = urgentCount;
      badge.style.display = urgentCount > 0 ? 'inline-block' : 'none';
    }
  }

  function renderPaginationBars() {
    const html = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1rem;padding-top:0.85rem;border-top:1px solid #E5E7EB;flex-wrap:wrap;gap:0.75rem;font-size:0.8rem;">
        <div style="color:#4B5563;">
          Halaman <strong>${currentMeta.current_page}</strong> dari <strong>${currentMeta.last_page}</strong>
          (Total <strong>${currentMeta.total}</strong> merek di VPS${serverQuery ? ` untuk "${escapeHtml(serverQuery)}"` : ''})
        </div>
        <div style="display:flex;gap:0.45rem;">
          <button type="button" onclick="window.bcGoPage(${currentMeta.current_page - 1})" ${currentMeta.current_page <= 1 ? 'disabled' : ''} style="padding:5px 12px;border:1px solid #D6D3CD;border-radius:5px;background:#FFF;cursor:${currentMeta.current_page <= 1 ? 'not-allowed' : 'pointer'};opacity:${currentMeta.current_page <= 1 ? '0.5' : '1'};font-weight:700;">← Sebelumnya</button>
          <button type="button" onclick="window.bcGoPage(${currentMeta.current_page + 1})" ${currentMeta.current_page >= currentMeta.last_page ? 'disabled' : ''} style="padding:5px 12px;border:1px solid #0D3B2E;border-radius:5px;background:#0D3B2E;color:#FFF;cursor:${currentMeta.current_page >= currentMeta.last_page ? 'not-allowed' : 'pointer'};opacity:${currentMeta.current_page >= currentMeta.last_page ? '0.5' : '1'};font-weight:700;">Berikutnya →</button>
        </div>
      </div>
    `;
    const expPag = document.getElementById('adm-expiry-pagination');
    const dbPag = document.getElementById('adm-vpsdb-pagination');
    if (expPag) expPag.innerHTML = html;
    if (dbPag) dbPag.innerHTML = html;
  }

  function renderExpiryTable() {
    const tbody = document.getElementById('adm-expiry-tbody');
    if (!tbody) return;

    const contactsMap = getContactsMap();
    const list = getFilteredExpiryList();

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;color:#6B7280;">Tidak ada data merek pada filter ini di halaman ${currentMeta.current_page}. Coba ubah filter atau klik <strong>Berikutnya →</strong>.</td></tr>`;
      return;
    }

    tbody.innerHTML = list
      .map((item) => {
        const c = contactsMap[item.applicationNumber] || {};
        const thumb = item.logoUrl
          ? `<img src="${escapeHtml(item.logoUrl)}" alt="${escapeHtml(item.brandName)}" style="width:42px;height:42px;object-fit:contain;border:1px solid #E5E7EB;border-radius:4px;background:#FFF;padding:2px;" />`
          : `<div style="width:42px;height:42px;border:1px solid #E5E7EB;border-radius:4px;background:#F9FAFB;display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:800;color:#6B7280;">TM</div>`;

        const contactInfo =
          c.phone || c.email
            ? `<div style="font-size:0.72rem;color:#0D3B2E;margin-top:3px;">${c.phone ? `📱 ${escapeHtml(c.phone)}` : ''} ${c.email ? `✉️ ${escapeHtml(c.email)}` : ''}</div>`
            : `<div style="font-size:0.7rem;color:#9CA3AF;margin-top:3px;">Kontak belum diatur</div>`;

        const dateDisplay = item.protectionEndDate
          ? `<div style="font-family:var(--font-mono);font-weight:700;color:#1C1D1B;">${escapeHtml(item.protectionEndDate)}</div>${item.isEstimatedDate ? '<div style="font-size:0.66rem;color:#6B7280;">(+10 thn DJKI)</div>' : ''}`
          : item.estimatedExpiryYear
          ? `<div style="font-family:var(--font-mono);font-weight:700;color:#92400E;">~${item.estimatedExpiryYear}</div><div style="font-size:0.66rem;color:#6B7280;">perkiraan tahun</div>`
          : `<span style="color:#9CA3AF;font-size:0.78rem;">—</span>`;

        const safeApp = escapeHtml(item.applicationNumber);

        return `
          <tr>
            <td style="width:52px;">${thumb}</td>
            <td>
              <div style="font-weight:800;color:#1C1D1B;">${escapeHtml(item.brandName)}</div>
              <div style="font-family:var(--font-mono);font-size:0.72rem;color:#6B7280;">${safeApp} · Kelas ${escapeHtml((item.niceClasses || []).join(', '))}</div>
            </td>
            <td>
              <div style="font-weight:600;font-size:0.8rem;">${escapeHtml(item.ownerName)}</div>
              ${contactInfo}
            </td>
            <td>${dateDisplay}</td>
            <td>${formatExpiryBadge(item)}</td>
            <td style="white-space:nowrap;">
              <div style="display:flex;gap:0.3rem;flex-wrap:wrap;">
                <button type="button" onclick="window.bcSendWaReminder('${safeApp}')" title="Kirim Reminder via WhatsApp" style="padding:5px 8px;background:#16A34A;color:#FFF;border:none;border-radius:4px;font-size:0.71rem;font-weight:700;cursor:pointer;">💬 WA</button>
                <button type="button" onclick="window.bcSendEmailReminder('${safeApp}')" title="Kirim Reminder via Email" style="padding:5px 8px;background:#0D3B2E;color:#FFF;border:none;border-radius:4px;font-size:0.71rem;font-weight:700;cursor:pointer;">✉️ Email</button>
                <button type="button" onclick="window.bcCopyReminder('${safeApp}')" title="Salin Pesan Reminder" style="padding:5px 8px;background:#E5E7EB;color:#1C1D1B;border:none;border-radius:4px;font-size:0.71rem;font-weight:700;cursor:pointer;">📋</button>
                <button type="button" onclick="window.bcOpenExpiryModal('${safeApp}')" title="Atur Tanggal Kedaluwarsa & Kontak" style="padding:5px 8px;background:#FFF;color:#1C1D1B;border:1px solid #D1D5DB;border-radius:4px;font-size:0.71rem;font-weight:700;cursor:pointer;">✏️ Atur</button>
              </div>
            </td>
          </tr>
        `;
      })
      .join('');
  }

  function renderVpsDbTable() {
    const tbody = document.getElementById('adm-vpsdb-tbody');
    if (!tbody) return;

    const countEl = document.getElementById('adm-vpsdb-count');
    if (countEl) {
      countEl.textContent = `Menampilkan ${allTrademarks.length} merek (Halaman ${currentMeta.current_page}/${currentMeta.last_page} · Total ${currentMeta.total} merek di VPS)`;
    }

    if (allTrademarks.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;color:#6B7280;">Tidak ada data merek ditemukan di VPS.</td></tr>`;
      return;
    }

    tbody.innerHTML = allTrademarks
      .map((item) => {
        const thumb = item.logoUrl
          ? `<img src="${escapeHtml(item.logoUrl)}" alt="${escapeHtml(item.brandName)}" style="width:44px;height:44px;object-fit:contain;border:1px solid #E5E7EB;border-radius:4px;background:#FFF;padding:2px;" />`
          : `<div style="width:44px;height:44px;border:1px solid #E5E7EB;border-radius:4px;background:#F9FAFB;display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:800;color:#6B7280;">NO IMG</div>`;

        const safeApp = escapeHtml(item.applicationNumber);
        const updatedShort = item.updatedAt ? String(item.updatedAt).slice(0, 10) : '-';

        return `
          <tr>
            <td style="width:54px;">${thumb}</td>
            <td>
              <div style="font-weight:800;color:#1C1D1B;">${escapeHtml(item.brandName)}</div>
              <div style="font-family:var(--font-mono);font-size:0.72rem;color:#6B7280;">${safeApp}</div>
            </td>
            <td><span class="badge-class" style="background:#ECFDF5;color:#065F46;padding:2px 7px;border-radius:4px;font-weight:700;font-size:0.74rem;">Kelas ${escapeHtml((item.niceClasses || []).join(', '))}</span></td>
            <td style="font-size:0.8rem;">${escapeHtml(item.ownerName)}</td>
            <td>
              <div style="font-size:0.76rem;font-weight:700;">${escapeHtml(item.statusText)}</div>
              <div style="font-size:0.68rem;color:#6B7280;">Update: ${updatedShort}</div>
            </td>
            <td>
              <button type="button" onclick="window.bcOpenExpiryModal('${safeApp}')" style="padding:5px 10px;background:#0D3B2E;color:#FFF;border:none;border-radius:4px;font-size:0.72rem;font-weight:700;cursor:pointer;">📅 Atur Kedaluwarsa</button>
            </td>
          </tr>
        `;
      })
      .join('');
  }

  async function loadVpsTrademarks(page = 1, searchQ = '') {
    const token = getToken();
    if (!token) return;

    const statusEl = document.getElementById('adm-vps-sync-status');
    if (statusEl) statusEl.textContent = `Memuat halaman ${page} dari VPS...`;

    try {
      const params = new URLSearchParams({
        page: String(page),
        per_page: '50',
        _t: String(Date.now())
      });
      if (searchQ && searchQ.trim()) params.set('q', searchQ.trim());

      const resp = await fetch(`/api/admin-trademarks?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store'
      });

      if (resp.status === 401) {
        setToken('');
        showLoginGate();
        return;
      }

      const json = await resp.json();
      if (!resp.ok || !json.success) {
        throw new Error(json.message || 'Gagal memuat data VPS');
      }

      allTrademarks = Array.isArray(json.data) ? json.data : [];
      currentSummary = json.summary || null;
      currentMeta = json.meta || {
        current_page: page,
        last_page: 1,
        per_page: 50,
        total: allTrademarks.length
      };
      currentPage = currentMeta.current_page || page;

      if (statusEl) {
        statusEl.textContent = `Terhubung ke VPS · ${currentMeta.total} merek aktif (Halaman ${currentMeta.current_page}/${currentMeta.last_page})`;
      }

      renderKpis();
      renderExpiryTable();
      renderVpsDbTable();
      renderPaginationBars();
    } catch (err) {
      if (statusEl) statusEl.textContent = `Gagal koneksi VPS: ${err.message}`;
      showToast(`Gagal memuat VPS: ${err.message}`, true);
    }
  }

  function triggerLiveServerSearch(val) {
    serverQuery = val.trim();
    currentPage = 1;
    // Sync both search boxes
    const expInput = document.getElementById('adm-expiry-search');
    const dbInput = document.getElementById('adm-vpsdb-search');
    if (expInput && expInput.value !== val) expInput.value = val;
    if (dbInput && dbInput.value !== val) dbInput.value = val;

    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      loadVpsTrademarks(1, serverQuery);
    }, 400);
  }

  function showLoginGate() {
    const overlay = document.getElementById('adm-login-overlay');
    if (overlay) overlay.style.display = 'flex';
  }

  function hideLoginGate(user) {
    const overlay = document.getElementById('adm-login-overlay');
    if (overlay) overlay.style.display = 'none';
    const badge = document.getElementById('adm-logged-user-label');
    if (badge && user) badge.textContent = `${user.username} (${user.role})`;
  }

  async function verifySessionOnBoot() {
    const token = getToken();
    if (!token) {
      showLoginGate();
      return;
    }
    try {
      const resp = await fetch('/api/admin-auth', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store'
      });
      if (resp.ok) {
        const json = await resp.json();
        if (json.authenticated) {
          hideLoginGate(json.user);
          await loadVpsTrademarks(1, '');
          return;
        }
      }
    } catch {}
    setToken('');
    showLoginGate();
  }

  document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('adm-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const errBox = document.getElementById('adm-login-error');
        const submitBtn = document.getElementById('adm-login-submit');
        const username = document.getElementById('adm-login-username').value.trim();
        const password = document.getElementById('adm-login-password').value;

        errBox.style.display = 'none';
        submitBtn.disabled = true;
        submitBtn.textContent = 'Memverifikasi...';

        try {
          const resp = await fetch('/api/admin-auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
          const json = await resp.json();
          if (!resp.ok || !json.success) {
            errBox.textContent = json.message || 'Username atau password salah.';
            errBox.style.display = 'block';
            return;
          }
          setToken(json.token);
          hideLoginGate(json.user);
          showToast('Login Admin berhasil! Memuat data VPS...');
          await loadVpsTrademarks(1, '');
        } catch (err) {
          errBox.textContent = 'Gagal terhubung ke server autentikasi.';
          errBox.style.display = 'block';
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Masuk ke Admin Panel →';
        }
      });
    }

    const logoutBtn = document.getElementById('adm-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        setToken('');
        showLoginGate();
        showToast('Anda telah keluar dari Admin Panel.');
      });
    }

    const expSearch = document.getElementById('adm-expiry-search');
    if (expSearch) {
      expSearch.addEventListener('input', (e) => triggerLiveServerSearch(e.target.value));
    }

    const dbSearch = document.getElementById('adm-vpsdb-search');
    if (dbSearch) {
      dbSearch.addEventListener('input', (e) => triggerLiveServerSearch(e.target.value));
    }

    document.querySelectorAll('.adm-vps-refresh-btn').forEach((btn) => {
      btn.addEventListener('click', () => loadVpsTrademarks(currentPage, serverQuery));
    });

    const expForm = document.getElementById('adm-expiry-form');
    if (expForm) {
      expForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const saveBtn = document.getElementById('exp-save-btn');
        saveBtn.disabled = true;
        saveBtn.textContent = 'Menyimpan ke VPS...';

        const appNumber = document.getElementById('exp-appno').value.trim();
        const brandName = document.getElementById('exp-brand').value.trim();
        const niceClasses = document.getElementById('exp-classes').value.trim();
        const ownerName = document.getElementById('exp-owner').value.trim();
        const statusKey = document.getElementById('exp-status').value;
        const protectionEndDate = document.getElementById('exp-enddate').value.trim() || null;
        const phone = document.getElementById('exp-phone').value.trim();
        const email = document.getElementById('exp-email').value.trim();

        try {
          const resp = await fetch('/api/admin-trademarks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${getToken()}`
            },
            body: JSON.stringify({
              applicationNumber: appNumber,
              brandName,
              niceClasses,
              ownerName,
              statusKey,
              protectionEndDate
            })
          });
          const json = await resp.json();
          if (!resp.ok || !json.success) {
            throw new Error(json.message || 'Gagal menyimpan data ke VPS');
          }

          saveContact(appNumber, phone, email);
          window.bcCloseExpiryModal();
          showToast(`✓ ${brandName} & jadwal kedaluwarsa tersimpan ke VPS!`);
          await loadVpsTrademarks(currentPage, serverQuery);
        } catch (err) {
          showToast(`Gagal menyimpan: ${err.message}`, true);
        } finally {
          saveBtn.disabled = false;
          saveBtn.textContent = 'Simpan ke VPS';
        }
      });
    }

    verifySessionOnBoot();
  });
})();
