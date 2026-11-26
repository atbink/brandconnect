/**
 * BrandConnect Live Admin Panel Controller
 * - Stateless Admin Authentication (/api/admin-auth)
 * - Live VPS Trademark Database (/api/admin-trademarks)
 * - Expiry Monitoring & 1-Click WhatsApp / Email Reminder
 */
(function () {
  const TOKEN_KEY = 'bc_admin_token_v1';
  const CONTACTS_KEY = 'bc_admin_contacts_v1';

  let allTrademarks = [];
  let currentSummary = null;
  let activeExpiryFilter = 'all';
  let expirySearchQuery = '';
  let dbSearchQuery = '';

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
        'position:fixed;bottom:24px;right:24px;z-index:99999;padding:12px 18px;border-radius:8px;font-size:0.84rem;font-weight:700;color:#fff;box-shadow:0 10px 28px rgba(0,0,0,0.28);transition:opacity 0.25s ease;max-width:420px;';
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
    }, 3200);
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
    return `<span style="display:inline-block;padding:3px 8px;border-radius:999px;font-size:0.72rem;font-weight:600;background:#F3F4F6;color:#6B7280;border:1px solid #D1D5DB;">Belum Ada Tanggal</span>`;
  }

  function buildReminderMessage(item) {
    const brand = item.brandName || '-';
    const appNo = item.applicationNumber || '-';
    const classes = Array.isArray(item.niceClasses) ? item.niceClasses.join(', ') : '-';
    const endDate = item.protectionEndDate || '(belum tercatat)';
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

  // Expose 1-click WA & Email handlers globally
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

    // Also update sidebar badge
    const badge = document.getElementById('sb-expiry-alert-badge');
    if (badge) {
      const urgentCount = (currentSummary.critical || 0) + (currentSummary.warning || 0) + (currentSummary.expired || 0);
      badge.textContent = urgentCount;
      badge.style.display = urgentCount > 0 ? 'inline-block' : 'none';
    }
  }

  function renderExpiryTable() {
    const tbody = document.getElementById('adm-expiry-tbody');
    if (!tbody) return;

    const contactsMap = getContactsMap();
    const q = expirySearchQuery.trim().toLowerCase();

    let list = allTrademarks.filter((item) => {
      if (activeExpiryFilter === 'critical' && item.expiryStatus !== 'critical') return false;
      if (activeExpiryFilter === 'upcoming' && !['warning', 'upcoming'].includes(item.expiryStatus)) return false;
      if (activeExpiryFilter === 'expired' && item.expiryStatus !== 'expired') return false;
      if (activeExpiryFilter === 'safe' && item.expiryStatus !== 'safe') return false;
      if (activeExpiryFilter === 'no_date' && item.expiryStatus !== 'no_date') return false;

      if (q) {
        const hay = `${item.brandName} ${item.applicationNumber} ${item.ownerName} ${(item.niceClasses || []).join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    list.sort((a, b) => {
      const rankDiff = getUrgencyRank(a) - getUrgencyRank(b);
      if (rankDiff !== 0) return rankDiff;
      if (a.daysUntilExpiry !== null && b.daysUntilExpiry !== null) {
        return a.daysUntilExpiry - b.daysUntilExpiry;
      }
      return 0;
    });

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;color:#6B7280;">Tidak ada data merek yang cocok dengan filter ini. Klik <strong>"+ Tambah / Atur Jadwal"</strong> untuk menambahkan merek atau tanggal kedaluwarsa.</td></tr>`;
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
          ? `<div style="font-family:var(--font-mono);font-weight:700;color:#1C1D1B;">${escapeHtml(item.protectionEndDate)}</div>${item.isEstimatedDate ? '<div style="font-size:0.66rem;color:#6B7280;">(estimasi +10 thn)</div>' : ''}`
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
              <div style="display:flex;gap:0.35rem;flex-wrap:wrap;">
                <button type="button" onclick="window.bcSendWaReminder('${safeApp}')" title="Kirim Reminder via WhatsApp" style="padding:5px 9px;background:#16A34A;color:#FFF;border:none;border-radius:4px;font-size:0.72rem;font-weight:700;cursor:pointer;">💬 WA</button>
                <button type="button" onclick="window.bcSendEmailReminder('${safeApp}')" title="Kirim Reminder via Email" style="padding:5px 9px;background:#0D3B2E;color:#FFF;border:none;border-radius:4px;font-size:0.72rem;font-weight:700;cursor:pointer;">✉️ Email</button>
                <button type="button" onclick="window.bcOpenExpiryModal('${safeApp}')" title="Atur Tanggal Kedaluwarsa & Kontak" style="padding:5px 9px;background:#F3F4F6;color:#1C1D1B;border:1px solid #D1D5DB;border-radius:4px;font-size:0.72rem;font-weight:700;cursor:pointer;">✏️ Atur</button>
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

    const q = dbSearchQuery.trim().toLowerCase();
    const list = q
      ? allTrademarks.filter((item) =>
          `${item.brandName} ${item.applicationNumber} ${item.ownerName} ${(item.niceClasses || []).join(' ')}`
            .toLowerCase()
            .includes(q)
        )
      : allTrademarks;

    const countEl = document.getElementById('adm-vpsdb-count');
    if (countEl) countEl.textContent = `Menampilkan ${list.length} dari ${currentSummary?.total || allTrademarks.length} merek di VPS`;

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;color:#6B7280;">Tidak ada data merek ditemukan di VPS.</td></tr>`;
      return;
    }

    tbody.innerHTML = list
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

  async function loadVpsTrademarks(searchQ = '') {
    const token = getToken();
    if (!token) return;

    const statusEl = document.getElementById('adm-vps-sync-status');
    if (statusEl) statusEl.textContent = 'Memuat data live dari VPS...';

    try {
      const url = `/api/admin-trademarks?per_page=200${searchQ ? '&q=' + encodeURIComponent(searchQ) : ''}&_t=${Date.now()}`;
      const resp = await fetch(url, {
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

      if (statusEl) {
        statusEl.textContent = `Terhubung ke VPS · ${currentSummary?.total || allTrademarks.length} merek aktif`;
      }

      renderKpis();
      renderExpiryTable();
      renderVpsDbTable();
    } catch (err) {
      if (statusEl) statusEl.textContent = `Gagal koneksi VPS: ${err.message}`;
      showToast(`Gagal memuat VPS: ${err.message}`, true);
    }
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
          await loadVpsTrademarks();
          return;
        }
      }
    } catch {}
    setToken('');
    showLoginGate();
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Login form
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
          await loadVpsTrademarks();
        } catch (err) {
          errBox.textContent = 'Gagal terhubung ke server autentikasi.';
          errBox.style.display = 'block';
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Masuk ke Admin Panel →';
        }
      });
    }

    // Logout button
    const logoutBtn = document.getElementById('adm-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        setToken('');
        showLoginGate();
        showToast('Anda telah keluar dari Admin Panel.');
      });
    }

    // Search inputs
    const expSearch = document.getElementById('adm-expiry-search');
    if (expSearch) {
      expSearch.addEventListener('input', (e) => {
        expirySearchQuery = e.target.value;
        renderExpiryTable();
      });
    }

    const dbSearch = document.getElementById('adm-vpsdb-search');
    if (dbSearch) {
      dbSearch.addEventListener('input', (e) => {
        dbSearchQuery = e.target.value;
        renderVpsDbTable();
      });
    }

    // Refresh button
    const refreshBtns = document.querySelectorAll('.adm-vps-refresh-btn');
    refreshBtns.forEach((btn) => {
      btn.addEventListener('click', () => loadVpsTrademarks());
    });

    // Save Expiry / Add Brand modal form
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
          await loadVpsTrademarks();
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
