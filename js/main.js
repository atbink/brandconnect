/**
 * MARLEX & CO. — Interactive Experience, Mega Menu, & "Map My Business Journey" Controller
 * "From Idea to Reality" // SKETCH × REALITY
 */

document.addEventListener('DOMContentLoaded', () => {
  /* --------------------------------------------------
     1. STICKY HEADER, STRUCTURED "LAYANAN" MEGA MENU & MOBILE DRAWER
     -------------------------------------------------- */
  const header = document.getElementById('site-header');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-sub-link');

  const navLayananItem = document.getElementById('nav-layanan-item');
  const megaTrigger = document.getElementById('nav-mega-trigger');
  const megaMenu = document.getElementById('services-mega-menu');
  let megaCloseTimeout = null;

  const handleScrollHeader = () => {
    if (!header) return;
    if (window.scrollY > 24) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScrollHeader, { passive: true });
  handleScrollHeader();

  // Structured Mega Menu Hover & Click Behavior
  const openMegaMenu = () => {
    if (!megaMenu || !megaTrigger) return;
    clearTimeout(megaCloseTimeout);
    megaMenu.classList.add('open');
    megaMenu.setAttribute('aria-hidden', 'false');
    megaTrigger.setAttribute('aria-expanded', 'true');
  };

  const closeMegaMenu = () => {
    if (!megaMenu || !megaTrigger) return;
    megaMenu.classList.remove('open');
    megaMenu.setAttribute('aria-hidden', 'true');
    megaTrigger.setAttribute('aria-expanded', 'false');
  };

  if (navLayananItem && megaTrigger && megaMenu) {
    navLayananItem.addEventListener('mouseenter', openMegaMenu);
    navLayananItem.addEventListener('mouseleave', () => {
      megaCloseTimeout = setTimeout(closeMegaMenu, 160);
    });

    megaMenu.addEventListener('mouseenter', () => {
      clearTimeout(megaCloseTimeout);
    });
    megaMenu.addEventListener('mouseleave', () => {
      megaCloseTimeout = setTimeout(closeMegaMenu, 160);
    });

    megaTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = megaMenu.classList.contains('open');
      if (isOpen) {
        closeMegaMenu();
      } else {
        openMegaMenu();
      }
    });

    document.querySelectorAll('[data-close-mega], .mega-links a').forEach((link) => {
      link.addEventListener('click', closeMegaMenu);
    });

    document.addEventListener('click', (e) => {
      if (!megaMenu.contains(e.target) && !navLayananItem.contains(e.target)) {
        closeMegaMenu();
      }
    });
  }

  // Full-Screen Editorial Mobile Menu Drawer & LAYANAN Table of Contents
  const mobileLayananToggle = document.getElementById('mobile-layanan-toggle');
  const mobileTocServices = document.getElementById('mobile-toc-services');
  const allMobileMenuLinks = document.querySelectorAll(
    '.mobile-nav-drawer a, .mobile-start-conv-btn'
  );

  const closeMobileMenu = () => {
    if (!mobileToggle || !mobileDrawer) return;
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    if (!document.querySelector('.modal-backdrop.active')) {
      document.body.style.overflow = '';
    }
  };

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      const nextState = !isExpanded;
      mobileToggle.setAttribute('aria-expanded', String(nextState));
      mobileDrawer.classList.toggle('open', nextState);
      mobileDrawer.setAttribute('aria-hidden', String(!nextState));
      document.body.style.overflow = nextState ? 'hidden' : '';
    });

    allMobileMenuLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });
  }

  if (mobileLayananToggle && mobileTocServices) {
    mobileLayananToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isExpanded = mobileLayananToggle.getAttribute('aria-expanded') === 'true';
      const nextState = !isExpanded;
      mobileLayananToggle.setAttribute('aria-expanded', String(nextState));
      mobileTocServices.hidden = !nextState;
      const iconEl = mobileLayananToggle.querySelector('.m-nav-toggle-icon');
      if (iconEl) iconEl.textContent = nextState ? '−' : '+';
    });
  }

  // Sticky Mobile Bottom CTA Bar (Appears after scrolling past Hero)
  const mobileStickyBar = document.getElementById('mobile-sticky-bar');
  const closeStickyBarBtn = document.getElementById('close-sticky-bar');
  let stickyBarDismissed = false;

  const handleStickyBarScroll = () => {
    if (!mobileStickyBar || stickyBarDismissed) return;
    const triggerY = 420;
    if (window.scrollY > triggerY) {
      mobileStickyBar.classList.add('visible');
    } else {
      mobileStickyBar.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleStickyBarScroll, { passive: true });
  handleStickyBarScroll();

  if (closeStickyBarBtn && mobileStickyBar) {
    closeStickyBarBtn.addEventListener('click', () => {
      stickyBarDismissed = true;
      mobileStickyBar.classList.remove('visible');
      mobileStickyBar.classList.add('dismissed');
    });
  }

  /* --------------------------------------------------
     2. SCROLL REVEAL & HAND-DRAWN SKETCH LINE OBSERVER
     -------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-up');
  const sketchPaths = document.querySelectorAll('.sketch-draw-path');

  sketchPaths.forEach((path) => {
    try {
      const length = path.getTotalLength();
      if (length) {
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
      }
    } catch (_) {
      // Fallback uses CSS default dasharray
    }
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  const sketchObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('drawn');
          entry.target.style.strokeDashoffset = '0';
          sketchObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  sketchPaths.forEach((path) => sketchObserver.observe(path));

  /* --------------------------------------------------
     3. SECTION 02 — INTERACTIVE BUSINESS JOURNEY NODES (BILINGUAL)
     -------------------------------------------------- */
  const journeyData = {
    '01': {
      badge: 'STAGE 01 // IDEA & NAME EXPLORATION',
      heading: 'Setiap merek besar dimulai dari sketsa nama dan identitas unik.',
      desc: 'Sebelum merilis produk atau mencetak kemasan, pastikan konsep nama dan logo brand Anda memiliki daya pembeda kuat di bawah Pasal 20 UU Merek.',
      sketch: 'Sketsa logo awal, konsep nama brand, & daftar produk/layanan',
      reality: 'Konsep identitas merek orisinal siap cek kemiripan di DJKI',
      target: '#cek-merek',
      linkLabel: 'CEK MEREK SEKARANG'
    },
    '02': {
      badge: 'STAGE 02 // AI TRADEMARK SEARCH',
      heading: 'Cek potensi kemiripan sebelum mengajukan ke DJKI.',
      desc: 'Telusuri kesamaan bunyi (fonetik), ejaan, maupun nama terdaftar di pangkalan data PDKI DJKI untuk menghindari risiko penolakan Pasal 21.',
      sketch: 'Ide nama brand mentah sebelum masuk database resmi',
      reality: 'Laporan analisis risiko penolakan & status ketersediaan merek',
      target: '#cek-merek',
      linkLabel: 'MENUJU CEK MEREK'
    },
    '03': {
      badge: 'STAGE 03 // NICE CLASSIFICATION (1–45)',
      heading: 'Petakan kelas barang dan jasa secara presisi.',
      desc: 'Perlindungan hukum merek hanya berlaku pada kelas yang didaftarkan. Kombinasikan kelas produk utama (1–34) dan kelas jasa (35–45) sesuai lini bisnis.',
      sketch: 'Daftar barang/jasa yang dijual maupun rencana toko online',
      reality: 'Pemetaan kelas Nice 1–45 presisi untuk perlindungan berlapis',
      target: '#cari-kelas',
      linkLabel: 'CARI KELAS MEREK'
    },
    '04': {
      badge: 'STAGE 04 // PROTECT (TRADEMARK REGISTRATION)',
      heading: 'Amankan Tanggal Penerimaan (Filing Date) di DJKI.',
      desc: 'Ubah nama dan logo brand Anda menjadi aset kekayaan intelektual resmi melalui e-filing DJKI di bawah asas First-to-File.',
      sketch: 'Etiket logo final & kelengkapan berkas pemohon (UMKM/Umum)',
      reality: 'Bukti Permohonan Resmi / Sertifikat Merek Terdaftar (®) DJKI',
      target: '#pendaftaran-merek',
      linkLabel: 'DAFTAR MEREK RESMI'
    },
    '05': {
      badge: 'STAGE 05 // MONITOR & DEFENSE (BRM DJKI)',
      heading: 'Pantau Berita Resmi Merek & cegah peniruan.',
      desc: 'Awasi pengumuman BRM DJKI selama masa publikasi 2 bulan dan tangani kebutuhan sanggahan penolakan maupun pengajuan oposisi pihak ketiga.',
      sketch: 'Pemantauan berkala terhadap pengajuan merek sejenis',
      reality: 'Surat Oposisi / Tanggapan Sanggahan & proteksi hak eksklusif',
      target: '#monitoring-merek',
      linkLabel: 'MONITORING MEREK'
    },
    '06': {
      badge: 'STAGE 06 // LICENSE & RENEW (10 YEARS+)',
      heading: 'Kelola aset merek untuk ekspansi, lisensi, dan waralaba.',
      desc: 'Dengan sertifikat merek terlindungi hingga 10 tahun dan dapat diperpanjang, bisnis Anda siap menjalin lisensi, pengalihan hak, atau franchise resmi.',
      sketch: 'Portofolio merek aktif yang siap dikomersialisasikan',
      reality: 'Perpanjangan 10 Tahun, Perjanjian Lisensi, & Pengalihan Hak Sah',
      target: '#layanan-merek',
      linkLabel: 'LIHAT LAYANAN MEREK'
    }
  };

  const journeyNodes = document.querySelectorAll('.journey-node');
  const badgeEl = document.getElementById('journey-badge');
  const headingEl = document.getElementById('journey-heading');
  const descEl = document.getElementById('journey-desc');
  const sketchValEl = document.getElementById('journey-sketch-val');
  const realityValEl = document.getElementById('journey-reality-val');
  const jumpLinkEl = document.getElementById('journey-jump-link');

  journeyNodes.forEach((node) => {
    node.addEventListener('click', () => {
      const stageKey = node.getAttribute('data-stage');
      const data = journeyData[stageKey];
      if (!data) return;

      journeyNodes.forEach((n) => {
        n.classList.remove('active');
        n.setAttribute('aria-selected', 'false');
      });
      node.classList.add('active');
      node.setAttribute('aria-selected', 'true');

      if (badgeEl) badgeEl.textContent = data.badge;
      if (headingEl) headingEl.textContent = data.heading;
      if (descEl) descEl.textContent = data.desc;
      if (sketchValEl) sketchValEl.textContent = data.sketch;
      if (realityValEl) realityValEl.textContent = data.reality;
      if (jumpLinkEl) {
        jumpLinkEl.setAttribute('href', data.target);
        const span = jumpLinkEl.querySelector('span:first-child');
        if (span) span.textContent = data.linkLabel;
      }
    });
  });

  /* --------------------------------------------------
     3B. MOBILE EDITORIAL JOURNEY SWIPEABLE CAROUSEL
     -------------------------------------------------- */
  const mjTrack = document.getElementById('mj-track');
  const mjCounter = document.getElementById('mj-counter');
  const mjPrevBtn = document.getElementById('mj-prev-card');
  const mjNextBtn = document.getElementById('mj-next-card');
  const mjDots = document.querySelectorAll('.mj-dots-wrapper .mj-dot');
  const mjCards = document.querySelectorAll('.mj-card');

  const stageTitles = [
    'IDEA',
    'BUILD',
    'LEGALIZE',
    'PROTECT',
    'CERTIFY',
    'MOVE FORWARD'
  ];

  const updateMjActive = (idx) => {
    if (mjCounter) {
      const stageName = stageTitles[idx] || 'STAGE';
      mjCounter.textContent = `0${idx + 1} / 06 // ${stageName}`;
    }
    mjDots.forEach((dot, dIdx) => {
      dot.classList.toggle('active', dIdx === idx);
    });
  };

  if (mjTrack && mjCards.length > 0) {
    let scrollTimeout = null;
    mjTrack.addEventListener(
      'scroll',
      () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          const scrollLeft = mjTrack.scrollLeft;
          const cardWidth = (mjCards[0].offsetWidth || 280) + 14;
          const activeIdx = Math.round(scrollLeft / cardWidth);
          const clampedIdx = Math.max(0, Math.min(mjCards.length - 1, activeIdx));
          updateMjActive(clampedIdx);
        }, 60);
      },
      { passive: true }
    );

    const scrollToCard = (idx) => {
      const targetCard = mjCards[idx];
      if (targetCard) {
        targetCard.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
        updateMjActive(idx);
      }
    };

    if (mjPrevBtn) {
      mjPrevBtn.addEventListener('click', () => {
        const cardWidth = (mjCards[0].offsetWidth || 280) + 14;
        const currentIdx = Math.round(mjTrack.scrollLeft / cardWidth);
        const prevIdx = Math.max(0, currentIdx - 1);
        scrollToCard(prevIdx);
      });
    }

    if (mjNextBtn) {
      mjNextBtn.addEventListener('click', () => {
        const cardWidth = (mjCards[0].offsetWidth || 280) + 14;
        const currentIdx = Math.round(mjTrack.scrollLeft / cardWidth);
        const nextIdx = Math.min(mjCards.length - 1, currentIdx + 1);
        scrollToCard(nextIdx);
      });
    }

    mjDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const dotIdx = Number(dot.getAttribute('data-dot')) - 1;
        scrollToCard(dotIdx);
      });
    });
  }

  /* --------------------------------------------------
     4. CONSULTATION BRIEF MODAL (BAHASA INDONESIA)
     -------------------------------------------------- */
  const consultationModal = document.getElementById('consultation-modal');
  const consultationForm = document.getElementById('consultation-form');
  const formSuccessState = document.getElementById('form-success-state');
  const clientStageSelect = document.getElementById('client-stage');
  const clientNotesTextarea = document.getElementById('client-notes');
  const openModalTriggers = document.querySelectorAll('[data-open-modal="consultation"]');

  const openModal = (modalEl, preselectValue, customNote) => {
    if (!modalEl) return;
    if (preselectValue && clientStageSelect) {
      const prefix = preselectValue.slice(0, 8);
      const matchingOption = Array.from(clientStageSelect.options).find((opt) =>
        opt.value.startsWith(prefix.trim())
      );
      if (matchingOption) {
        clientStageSelect.value = matchingOption.value;
      }
    }
    if (customNote && clientNotesTextarea) {
      clientNotesTextarea.value = customNote;
    }
    modalEl.classList.add('active');
    modalEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeAllModals = () => {
    document.querySelectorAll('.modal-backdrop.active').forEach((modal) => {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    });
    document.body.style.overflow = '';
  };

  openModalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const preselect = trigger.getAttribute('data-preselect');
      if (consultationForm && formSuccessState) {
        consultationForm.hidden = false;
        formSuccessState.hidden = true;
      }
      openModal(consultationModal, preselect);
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', closeAllModals);
  });

  document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeAllModals();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
      closeMegaMenu();
    }
  });

  if (consultationForm) {
    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      consultationForm.hidden = true;
      if (formSuccessState) {
        formSuccessState.hidden = false;
      }
      consultationForm.reset();
    });
  }

  /* --------------------------------------------------
     5. SIGNATURE INTERACTIVE FEATURE: MAP MY BUSINESS JOURNEY
     -------------------------------------------------- */
  const mapperIntroView = document.getElementById('mapper-intro-view');
  const mapperStepsView = document.getElementById('mapper-steps-view');
  const mapperResultView = document.getElementById('mapper-result-view');
  const startMapperBtn = document.getElementById('start-mapper-btn');
  const mapperPrevBtn = document.getElementById('mapper-prev-btn');
  const mapperNextBtn = document.getElementById('mapper-next-btn');
  const mapperNextLabel = document.getElementById('mapper-next-btn')?.querySelector('#mapper-next-label');
  const mapperProgressFill = document.getElementById('mapper-progress-fill');
  const mapperProgressLabel = document.getElementById('mapper-progress-label');
  const mapperResetBtn = document.getElementById('mapper-reset-btn');
  const mapperConsultBtn = document.getElementById('mapper-consult-btn');
  const productSubquestion = document.getElementById('product-type-subquestion');

  const mapperState = {
    currentStep: 1,
    building: 'BISNIS',
    stage: 'IDEA',
    foundation: [],
    hasProduct: 'BELUM',
    productCategory: '',
    priority: 'MULAI_LEGAL'
  };

  const showMapperStep = (stepNum) => {
    mapperState.currentStep = stepNum;
    const allStepPanels = document.querySelectorAll('.mapper-step');
    allStepPanels.forEach((panel) => {
      const panelStep = Number(panel.getAttribute('data-step'));
      panel.hidden = panelStep !== stepNum;
    });

    const pct = Math.min(100, Math.max(20, stepNum * 20));
    if (mapperProgressFill) mapperProgressFill.style.width = `${pct}%`;
    if (mapperProgressLabel) mapperProgressLabel.textContent = `0${stepNum} / 05`;
    if (mapperNextLabel) {
      mapperNextLabel.textContent = stepNum === 5 ? 'LIHAT REKOMENDASI' : 'NEXT';
    }
  };

  if (startMapperBtn && mapperIntroView && mapperStepsView) {
    startMapperBtn.addEventListener('click', () => {
      mapperIntroView.hidden = true;
      mapperStepsView.hidden = false;
      mapperResultView.hidden = true;
      showMapperStep(1);
    });
  }

  // Single-choice option cards (Steps 1, 2, 4, 5)
  document.querySelectorAll('.mapper-option-card').forEach((card) => {
    card.addEventListener('click', () => {
      const field = card.getAttribute('data-field');
      const value = card.getAttribute('data-value');
      if (!field || !value) return;

      mapperState[field] = value;

      // Highlight within same field group
      document.querySelectorAll(`.mapper-option-card[data-field="${field}"]`).forEach((sibling) => {
        sibling.classList.remove('selected');
      });
      card.classList.add('selected');

      // Step 04 conditional product category subquestion
      if (field === 'hasProduct' && productSubquestion) {
        if (value === 'YA') {
          productSubquestion.hidden = false;
        } else {
          productSubquestion.hidden = true;
          mapperState.productCategory = '';
          document.querySelectorAll('.mapper-pill').forEach((p) => p.classList.remove('selected'));
        }
      }

      // Auto-advance on Step 1 & Step 2 for smooth editorial flow
      if ((field === 'building' && mapperState.currentStep === 1) || (field === 'stage' && mapperState.currentStep === 2)) {
        setTimeout(() => {
          showMapperStep(mapperState.currentStep + 1);
        }, 220);
      }
    });
  });

  // Step 04 Product Category Pills
  document.querySelectorAll('.mapper-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.mapper-pill').forEach((p) => p.classList.remove('selected'));
      pill.classList.add('selected');
      mapperState.productCategory = pill.getAttribute('data-product-cat') || '';
    });
  });

  // Step 03 Multi-select checkboxes with exclusive logic for "Belum memiliki semuanya" / "Belum yakin"
  const foundationInputs = document.querySelectorAll('input[name="foundation"]');
  foundationInputs.forEach((input) => {
    input.addEventListener('change', () => {
      const isExclusive = input.getAttribute('data-exclusive') === 'true';
      if (isExclusive && input.checked) {
        foundationInputs.forEach((other) => {
          if (other !== input) other.checked = false;
        });
      } else if (!isExclusive && input.checked) {
        foundationInputs.forEach((other) => {
          if (other.getAttribute('data-exclusive') === 'true') other.checked = false;
        });
      }

      mapperState.foundation = Array.from(foundationInputs)
        .filter((i) => i.checked)
        .map((i) => i.value);
    });
  });

  // Recommendation Engine based on User Answers (100% Trademark & Brand Protection Focus)
  const catalogBlocks = {
    BUILD: {
      stageCode: '01 — SEARCH',
      title: 'PENELUSURAN MEREK AI (PDKI DJKI)',
      desc: 'Mulai dengan memeriksa potensi kemiripan bunyi, ejaan, dan merek terdaftar di pangkalan data resmi DJKI sebelum mengajukan permohonan.',
      services: ['AI Trademark Search', 'Audit Risiko Pasal 20 & 21', 'Laporan Pra-Skrining Merek'],
      ctaLabel: 'CEK MEREK SEKARANG →',
      ctaHref: 'trademark-checker.html',
      preselect: '01 SEARCH'
    },
    LEGALIZE: {
      stageCode: '02 — CLASSIFY',
      title: 'PEMETAAN KELAS MEREK (NICE 1–45)',
      desc: 'Tentukan kelas barang (Kelas 1–34) dan jasa (Kelas 35–45) secara presisi agar perlindungan hukum merek Anda mencakup seluruh lini produk dan penjualan.',
      services: ['Cari Kelas Merek Nice', 'Strategi Perlindungan Multi-Kelas', 'Validasi Uraian Barang/Jasa'],
      ctaLabel: 'CARI KELAS MEREK →',
      ctaHref: 'class-finder.html',
      preselect: '02 CLASSIFY'
    },
    PROTECT: {
      stageCode: '03 — REGISTER',
      title: 'PENDAFTARAN MEREK RESMI DJKI',
      desc: 'Lindungi nama dan logo brand Anda secara resmi di DJKI untuk mengamankan Tanggal Penerimaan (Filing Date) di bawah asas First-to-File.',
      services: ['Pendaftaran Merek (DJKI)', 'Verifikasi Etiket Logo', 'Pemantauan Masa BRM'],
      ctaLabel: 'DAFTAR MEREK RESMI →',
      ctaHref: 'pendaftaran-merek.html',
      preselect: '03 REGISTER'
    },
    CERTIFY: {
      stageCode: '04 — DEFEND & MONITOR',
      title: 'MONITORING BRM & PROTEKSI MEREK',
      desc: 'Pantau publikasi Berita Resmi Merek secara berkala serta lindungi merek melalui layanan sanggahan penolakan, oposisi, perpanjangan, dan lisensi.',
      services: ['Monitoring BRM DJKI', 'Sanggahan & Oposisi Merek', 'Perpanjangan & Lisensi Merek'],
      ctaLabel: 'PROTEKSI MEREK →',
      ctaHref: 'brand-protection.html',
      preselect: '04 PROTECT'
    }
  };

  const computeRecommendations = () => {
    const { building, stage, foundation, productCategory, priority } = mapperState;
    const hasTrademark = foundation.includes('MEREK');

    const order = [];

    if (priority === 'DAFTAR_MEREK' || !hasTrademark || stage === 'ALREADY_OPERATING') {
      order.push('BUILD', 'LEGALIZE', 'PROTECT', 'CERTIFY');
    } else if (building === 'BRAND' || priority === 'PROTEKSI_MEREK') {
      order.push('PROTECT', 'CERTIFY', 'LEGALIZE', 'BUILD');
    } else {
      order.push('BUILD', 'LEGALIZE', 'PROTECT', 'CERTIFY');
    }

    const uniqueTop3 = [...new Set(order)].slice(0, 3);
    return uniqueTop3.map((key, idx) => {
      const base = { ...catalogBlocks[key] };
      if (key === 'LEGALIZE' && productCategory) {
        base.title = `PEMETAAN KELAS MEREK (${productCategory.toUpperCase()})`;
      }
      return {
        ...base,
        rank: idx + 1,
        badgeText: idx === 0 ? '01 — PRIORITY' : `0${idx + 1} — NEXT STEP`
      };
    });
  };

  const renderMapperResults = () => {
    const recommendations = computeRecommendations();
    const roadmapGrid = document.getElementById('mapper-roadmap-grid');
    const nextStepsMobile = document.getElementById('mapper-next-steps-mobile');
    const summaryStrip = document.getElementById('mapper-summary-strip');

    const buildingLabels = {
      BISNIS: 'Fokus: Membangun Bisnis',
      BRAND: 'Fokus: Melindungi Brand',
      PRODUK: 'Fokus: Menyiapkan Produk',
      BELUM_YAKIN: 'Fokus: Eksplorasi Langkah Awal'
    };
    const stageLabels = {
      IDEA: 'Tahap: Idea / Konsep',
      BUILDING: 'Tahap: Sedang Mempersiapkan',
      ALREADY_OPERATING: 'Tahap: Sudah Berjalan',
      READY_TO_LAUNCH: 'Tahap: Siap Peluncuran',
      READY_TO_EXPAND: 'Tahap: Siap Ekspansi'
    };

    if (summaryStrip) {
      const chips = [
        buildingLabels[mapperState.building] || 'Bisnis',
        stageLabels[mapperState.stage] || 'Tahap Awal'
      ];
      if (mapperState.hasProduct === 'YA') {
        chips.push(
          mapperState.productCategory
            ? `Produk: ${mapperState.productCategory}`
            : 'Memiliki Produk Siap Jual'
        );
      }
      summaryStrip.innerHTML = chips.map((c) => `<span class="summary-chip">${c}</span>`).join('');
    }

    if (roadmapGrid) {
      roadmapGrid.innerHTML = recommendations
        .map(
          (rec, idx) => `
          <article class="roadmap-card ${idx === 0 ? 'priority-primary' : ''}">
            <div>
              <span class="roadmap-badge">${rec.badgeText}</span>
              <div class="roadmap-stage">${rec.stageCode}</div>
              <h4 class="roadmap-title">${rec.title}</h4>
              <p class="roadmap-desc">${rec.desc}</p>
              <div class="roadmap-services">
                <span class="roadmap-services-label">LAYANAN YANG DIREKOMENDASIKAN:</span>
                <ul>
                  ${rec.services.map((s) => `<li>${s}</li>`).join('')}
                </ul>
              </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.6rem;">
              ${
                idx === 0
                  ? `<button type="button" class="btn btn-primary btn-full" data-priority-consult="${rec.preselect}">
                      <span>KONSULTASI SEKARANG</span>
                      <span class="btn-arrow">→</span>
                    </button>`
                  : ''
              }
              <a href="${rec.ctaHref}" class="btn ${idx === 0 ? 'btn-secondary' : 'btn-secondary'} btn-full">
                <span>${rec.ctaLabel}</span>
              </a>
            </div>
          </article>
        `
        )
        .join('');

      const priorityConsultBtn = roadmapGrid.querySelector('[data-priority-consult]');
      if (priorityConsultBtn && recommendations[0]) {
        const topRec = recommendations[0];
        const summaryNote = `Hasil Map My Business Journey — Prioritas: ${topRec.stageCode} (${topRec.title}). Fokus: ${
          buildingLabels[mapperState.building] || ''
        }, ${stageLabels[mapperState.stage] || ''}${
          mapperState.productCategory ? `, Kategori Produk: ${mapperState.productCategory}` : ''
        }.`;
        priorityConsultBtn.addEventListener('click', () => {
          openModal(consultationModal, topRec.preselect, summaryNote);
        });
      }
    }

    if (nextStepsMobile) {
      const secondaryRecs = recommendations.slice(1);
      nextStepsMobile.innerHTML = `
        <span class="next-steps-mobile-title">YOUR NEXT STEPS:</span>
        <div class="next-steps-mobile-list">
          ${secondaryRecs
            .map(
              (rec, i) => `
              <a href="${rec.ctaHref}" class="next-step-mobile-row">
                <div>
                  <strong>0${i + 2} — ${rec.title}</strong>
                  <span>${rec.services.slice(0, 2).join(' · ')}</span>
                </div>
                <span class="btn-arrow" aria-hidden="true">→</span>
              </a>
            `
            )
            .join('')}
        </div>
      `;
    }

    if (mapperConsultBtn && recommendations[0]) {
      const topRec = recommendations[0];
      const summaryNote = `Hasil Map My Business Journey — Prioritas: ${topRec.stageCode} (${topRec.title}). Fokus: ${
        buildingLabels[mapperState.building] || ''
      }, ${stageLabels[mapperState.stage] || ''}${
        mapperState.productCategory ? `, Kategori Produk: ${mapperState.productCategory}` : ''
      }.`;
      mapperConsultBtn.onclick = () => {
        openModal(consultationModal, topRec.preselect, summaryNote);
      };
    }

    mapperIntroView.hidden = true;
    mapperStepsView.hidden = true;
    mapperResultView.hidden = false;
    if (mapperProgressLabel) mapperProgressLabel.textContent = 'INITIAL MAP GENERATED';
  };

  if (mapperPrevBtn) {
    mapperPrevBtn.addEventListener('click', () => {
      if (mapperState.currentStep > 1) {
        showMapperStep(mapperState.currentStep - 1);
      } else {
        mapperStepsView.hidden = true;
        mapperIntroView.hidden = false;
        if (mapperProgressLabel) mapperProgressLabel.textContent = 'READY TO START';
      }
    });
  }

  if (mapperNextBtn) {
    mapperNextBtn.addEventListener('click', () => {
      if (mapperState.currentStep < 5) {
        showMapperStep(mapperState.currentStep + 1);
      } else {
        renderMapperResults();
      }
    });
  }

  if (mapperResetBtn) {
    mapperResetBtn.addEventListener('click', () => {
      mapperResultView.hidden = true;
      mapperStepsView.hidden = false;
      showMapperStep(1);
    });
  }

  /* --------------------------------------------------
     6. SECTION 10 — EDITORIAL INSIGHTS READER MODAL (BAHASA INDONESIA)
     -------------------------------------------------- */
  const articlesContent = {
    'article-1': {
      category: '01 // KLASIFIKASI MEREK · ISSUE NO. 14',
      title: 'Panduan Menentukan Kelas Merek (Nice Classification 1–45)',
      preselect: '02 CLASSIFY',
      body: `
        <p>Salah satu kesalahan paling sering saat mengajukan pendaftaran merek adalah memilih kelas barang atau jasa yang kurang sesuai dengan lini usaha. Di DJKI RI, hak eksklusif merek hanya berlaku untuk barang dan jasa di kelas yang didaftarkan.</p>
        <h4>1. Bedakan Kelas Barang (1–34) dan Kelas Jasa (35–45)</h4>
        <p>Jika Anda memproduksi skincare, kosmetik, kopi bubuk, atau pakaian, pastikan kelas fisik utamanya terdaftar. Apabila Anda juga menjalankan toko ritel, marketplace, atau kedai kopi, pertimbangkan kelas jasa terkait seperti Kelas 35 atau Kelas 43.</p>
        <h4>2. Strategi Perlindungan Multi-Kelas</h4>
        <ul>
          <li><strong>Produk Skincare &amp; Toko:</strong> Gabungkan Kelas 03 (Kosmetik) dengan Kelas 35 (Ritel/Toko Online).</li>
          <li><strong>Kopi Kemasan &amp; Kedai:</strong> Kombinasikan Kelas 30 (Bubuk Kopi) dan Kelas 43 (Kedai Kopi/Kafe).</li>
          <li><strong>Aplikasi &amp; SaaS:</strong> Lindungi dengan Kelas 09 (Aplikasi) dan Kelas 42 (Layanan Software).</li>
        </ul>
        <p>Di BRANDCONNECT, konsultan kami membantu memetakan kelas Nice secara akurat sebelum pengajuan resmi ke DJKI.</p>
      `
    },
    'article-2': {
      category: '02 // PERLINDUNGAN MEREK · ISSUE NO. 19',
      title: 'Before Registering Your Trademark, Understand These Things.',
      preselect: '03 REGISTER',
      body: `
        <p>Banyak pemilik bisnis terlanjur membangun brand, mencetak kemasan, dan menjalankan kampanye pemasaran sebelum memeriksa apakah nama merek yang mereka gunakan tersedia secara hukum di pangkalan data DJKI.</p>
        <h4>1. Hindari Nama yang Terlalu Umum (Pasal 20)</h4>
        <p>Merek yang hanya menjelaskan jenis barang atau sifat produk umumnya akan ditolak secara absolut. Nama yang unik dan memiliki daya pembeda kuat jauh lebih berpeluang lolos pemeriksaan substantif.</p>
        <h4>2. Hindari Persamaan pada Pokoknya (Pasal 21)</h4>
        <p>Pemeriksa DJKI menilai kemiripan bunyi (fonetik), ejaan, maupun visual etiket dengan merek terdaftar lebih dulu di kelas sejenis.</p>
        <ul>
          <li>Lakukan pengecekan kemiripan merek AI sebelum mencetak kemasan dalam jumlah besar.</li>
          <li>Pahami asas <em>First-to-File</em>: pihak yang mendaftar lebih dulu dan memperoleh Tanggal Penerimaan (<em>Filing Date</em>) mendapat prioritas perlindungan hukum.</li>
          <li>Konsultasikan hasil pra-skrining bersama Spesialis Merek BrandConnect sebelum mengajukan permohonan.</li>
        </ul>
      `
    },
    'article-3': {
      category: '03 // PROTEKSI & MONITORING · ISSUE NO. 23',
      title: 'Cara Menghadapi Usulan Penolakan DJKI & Oposisi BRM',
      preselect: '04 PROTECT',
      body: `
        <p>Perlindungan merek tidak berhenti pada tahap pengajuan. Selama proses pemeriksaan di DJKI, permohonan Anda akan melalui masa pengumuman Berita Resmi Merek (BRM) serta pemeriksaan substantif.</p>
        <h4>1. Masa Pengumuman BRM 2 Bulan &amp; Oposisi (Pasal 14 &amp; 16)</h4>
        <p>Selama masa publikasi 2 bulan, pemilik merek terdahulu berhak mengajukan keberatan tertulis (oposisi) terhadap pihak lain yang mendaftarkan merek mirip atau beriktikad tidak baik.</p>
        <h4>2. Tanggapan Surat Usulan Penolakan (Pasal 24)</h4>
        <ul>
          <li><strong>Batas Waktu 30 Hari Kerja:</strong> Pemohon diberi kesempatan resmi mengajukan sanggahan tertulis sejak surat diterima.</li>
          <li><strong>Argumentasi Hukum:</strong> Menyusun pembuktian perbedaan fonetik, konsep, serta diferensiasi visual etiket logo.</li>
          <li><strong>Perlindungan Jangka Panjang:</strong> Setelah sertifikat terbit, merek dilindungi 10 tahun dan dapat diperpanjang atau dilisensikan.</li>
        </ul>
      `
    }
  };

  const insightModal = document.getElementById('insight-modal');
  const insightCategoryEl = document.getElementById('insight-modal-category');
  const insightTitleEl = document.getElementById('insight-modal-title');
  const insightBodyEl = document.getElementById('insight-modal-body');
  const insightCtaBtn = document.getElementById('insight-modal-cta');
  const insightCards = document.querySelectorAll('.insight-card');

  insightCards.forEach((card) => {
    const openArticle = () => {
      const id = card.getAttribute('data-article-id');
      const article = articlesContent[id];
      if (!article || !insightModal) return;

      if (insightCategoryEl) insightCategoryEl.textContent = article.category;
      if (insightTitleEl) insightTitleEl.textContent = article.title;
      if (insightBodyEl) insightBodyEl.innerHTML = article.body;
      if (insightCtaBtn) {
        insightCtaBtn.onclick = () => {
          closeAllModals();
          openModal(consultationModal, article.preselect);
        };
      }

      openModal(insightModal);
    };

    card.addEventListener('click', openArticle);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openArticle();
      }
    });
  });

  /* --------------------------------------------------
     7. ACTIVE NAV LINK HIGHLIGHTING ON SCROLL & LOGIN MODAL
     -------------------------------------------------- */
  const loginModal = document.getElementById('login-modal');
  const loginForm = document.getElementById('login-form');
  const loginStatusNotice = document.getElementById('login-status-notice');

  document.querySelectorAll('[data-open-modal="login"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (loginStatusNotice) loginStatusNotice.hidden = true;
      openModal(loginModal);
    });
  });

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (loginStatusNotice) {
        loginStatusNotice.hidden = false;
      }
    });
  }

  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const trackedSections = [
    { id: 'cek-merek', el: document.getElementById('cek-merek') },
    { id: 'cari-kelas', el: document.getElementById('cari-kelas') },
    { id: 'monitoring-merek', el: document.getElementById('monitoring-merek') },
    { id: 'proteksi-merek', el: document.getElementById('proteksi-merek') },
    { id: 'pendaftaran-merek', el: document.getElementById('pendaftaran-merek') }
  ];

  const updateActiveNav = () => {
    const scrollPos = window.scrollY + 260;
    let currentId = 'cek-merek';

    trackedSections.forEach((item) => {
      if (item.el && item.el.offsetTop <= scrollPos) {
        currentId = item.id;
      }
    });

    navLinks.forEach((link) => {
      const isMatch = link.getAttribute('data-section') === currentId;
      link.classList.toggle('active', isMatch);
    });
  };

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* --------------------------------------------------
     8. BRANDCONNECT — AI TRADEMARK SEARCH ENGINE (#cek-merek)
     Supports: Nama Merek, Nomor Permohonan, & Upload Logo (Visual)
     -------------------------------------------------- */
  const initAiTrademarkChecker = () => {
    const searchForm = document.getElementById('tm-search-form');
    const brandInput = document.getElementById('tm-brand-input');
    const modeInput = document.getElementById('tm-search-mode-input');
    const selectedClassHidden = document.getElementById('tm-selected-class-hidden');
    const modeTabs = document.querySelectorAll('.bc-mode-tab, .tm-mode-tab');
    const modePrompt = document.getElementById('tm-mode-prompt');
    const resultsPanel = document.getElementById('tm-results-panel');
    const honestNoticeEl = document.getElementById('tm-honest-notice');

    // Result elements
    const targetBrandEl = document.getElementById('tm-res-target-brand');
    const targetClassEl = document.getElementById('tm-res-target-class');
    const scoreBadgeEl = document.getElementById('tm-res-score-badge');
    const scoreNumEl = document.getElementById('tm-res-score-num');
    const scoreVerdictEl = document.getElementById('tm-res-score-verdict');
    const pillPhoneticEl = document.getElementById('tm-pill-phonetic');
    const pillVisualEl = document.getElementById('tm-pill-visual');
    const pillClassEl = document.getElementById('tm-pill-class');
    const pillStatuteEl = document.getElementById('tm-pill-statute');
    const waActionBtn = document.getElementById('tm-wa-action-btn');

    if (!searchForm || !brandInput) return;

    // Mode Tabs Switching (Supports Nama Merek & Nomor Permohonan)
    modeTabs.forEach((tab) => {
      tab.addEventListener('click', (ev) => {
        ev.preventDefault();
        modeTabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const mode = tab.getAttribute('data-search-mode') || 'name';
        if (modeInput) modeInput.value = mode;

        if (mode === 'name') {
          brandInput.placeholder = 'Masukkan nama merek (contoh: Kopi Nusantara, Zenova, GlowSkin)...';
          brandInput.required = true;
          if (modePrompt) modePrompt.textContent = 'Cek Merek Anda Gratis, sekarang!';
        } else if (mode === 'number') {
          brandInput.placeholder = 'Masukkan nomor permohonan / registrasi DJKI (contoh: DID2019079065, D002016040603, IDM000...)...';
          brandInput.required = true;
          if (modePrompt) modePrompt.textContent = 'Cek Status & Keterdaftaran Nomor Permohonan DJKI';
        }
        brandInput.focus();
      });
    });

    // Known well-known marks in Indonesia for rule-based collision warning
    const highConflictTokens = [
      'gojek', 'tokopedia', 'shopee', 'lazada', 'grab', 'indomie', 'aqua', 'bca', 'mandiri',
      'telkomsel', 'pertamina', 'erigo', 'kopi kenangan', 'janji jiwa', 'chatime', 'starbucks',
      'unilever', 'nestle', 'djarum', 'sampoerna', 'wardah', 'somethinc', 'scarlett', 'ms glow'
    ];

    // Generic / Descriptive terms prohibited under Article 20 UU Merek
    const genericTokens = [
      'kopi', 'coffee', 'teh', 'tea', 'susu', 'baju', 'kaos', 'tas', 'sepatu', 'roti',
      'air', 'water', 'sabun', 'shampoo', 'cream', 'skincare', 'restoran', 'cafe',
      'toko', 'shop', 'store', 'enak', 'murah', 'segar', 'super', 'best', 'original'
    ];

    const evaluateQuery = (rawVal, mode, chosenClass) => {
      const cleaned = rawVal.trim();
      const lower = cleaned.toLowerCase();
      const isAppNumberPattern = /^(did|jid|ipt|d00|j00|idm|w00)/i.test(cleaned);

      // Case A: Application Number Check
      if (mode === 'number' || isAppNumberPattern) {
        let prefixType = 'Permohonan Merek DJKI';
        if (/^did/i.test(cleaned)) prefixType = 'Merek Dagang Elektronik (DID)';
        else if (/^jid/i.test(cleaned)) prefixType = 'Merek Jasa Elektronik (JID)';
        else if (/^idm/i.test(cleaned)) prefixType = 'Sertifikat Merek Terdaftar (IDM)';

        return {
          mode: 'number',
          brand: cleaned.toUpperCase(),
          subtitle: `METODE: CEK NOMOR PERMOHONAN // KATEGORI: ${prefixType.toUpperCase()}`,
          scoreText: 'PDKI',
          badgeClass: 'score-high',
          verdictText: 'FORMAT NOMOR PERMOHONAN TERIDENTIFIKASI',
          honestNotice: 'Status Integrasi Nomor Permohonan: Format nomor permohonan telah dikenali. Penarikan status tahapan pemeriksaan terkini dari pangkalan data resmi DJKI (PDKI) dilakukan secara akurat oleh tim Konsultan Merek BrandConnect.',
          phoneticVerdict: prefixType,
          phoneticDetail: 'Kode awalan sesuai dengan format penomoran administrasi DJKI.',
          visualVerdict: 'Verifikasi Status Berkas',
          visualDetail: 'Memeriksa tahapan Formalitas, Masa Pengumuman BRM, atau Pemeriksaan Substantif.',
          classVerdict: chosenClass || 'Sesuai Dokumen Permohonan',
          classDetail: 'Kelas mengacu pada rincian barang/jasa di berkas permohonan.',
          statuteVerdict: 'Pemantauan Resmi',
          statuteDetail: 'Klik tombol WhatsApp di bawah untuk menerima laporan status terkini berkas ini.'
        };
      }

      // Case B: Brand Name & Optional Visual Logo Evaluation
      if (window.BCStore && window.BCStore.analyzeTrademark) {
        const rec = window.BCStore.analyzeTrademark(cleaned, mode, '', chosenClass, uploadedLogoInfo, uploadedCompLogoInfo);
        const scoreTxt = rec.riskLevel === 'high' ? 'Risiko' : rec.riskLevel === 'moderate' ? 'Sedang' : 'Tinggi';
        const badgeCls = rec.riskLevel === 'high' ? 'score-low' : rec.riskLevel === 'moderate' ? 'score-medium' : 'score-high';
        return {
          mode,
          brand: rec.trademarkName,
          subtitle: uploadedLogoInfo
            ? `METODE: EVALUASI NAMA & KEMIRIPAN VISUAL LOGO (${uploadedLogoInfo.name.toUpperCase()})`
            : `METODE: ANALISIS KARAKTERISTIK NAMA MEREK // PRA-SKRINING AI`,
          scoreText: scoreTxt,
          badgeClass: badgeCls,
          verdictText: rec.verdict,
          honestNotice: rec.aiInterpretation,
          phoneticVerdict: rec.phoneticStatus,
          phoneticDetail: rec.phoneticDetail,
          visualVerdict: rec.visualStatus,
          visualDetail: rec.visualDetail,
          classVerdict: rec.recommendedClasses,
          classDetail: 'Rekomendasi klasifikasi barang/jasa berdasarkan Nice Classification.',
          statuteVerdict: rec.statuteStatus,
          statuteDetail: rec.statuteDetail
        };
      }
    };

    const renderResults = (data) => {
      if (!resultsPanel) return;

      if (honestNoticeEl) honestNoticeEl.innerHTML = `<strong>Catatan Transparansi Analisis:</strong> ${data.honestNotice}`;
      if (targetBrandEl) targetBrandEl.textContent = data.brand;
      if (targetClassEl) targetClassEl.textContent = data.subtitle;
      if (scoreNumEl) scoreNumEl.textContent = data.scoreText;

      if (scoreBadgeEl) {
        scoreBadgeEl.classList.remove('score-high', 'score-medium', 'score-low');
        scoreBadgeEl.classList.add(data.badgeClass);
      }
      if (scoreVerdictEl) scoreVerdictEl.textContent = data.verdictText;

      if (pillPhoneticEl) {
        pillPhoneticEl.querySelector('.tm-pill-status').textContent = data.phoneticVerdict;
        pillPhoneticEl.querySelector('.tm-pill-detail').textContent = data.phoneticDetail;
      }
      if (pillVisualEl) {
        pillVisualEl.querySelector('.tm-pill-status').textContent = data.visualVerdict;
        pillVisualEl.querySelector('.tm-pill-detail').textContent = data.visualDetail;
      }
      if (pillClassEl) {
        pillClassEl.querySelector('.tm-pill-status').textContent = data.classVerdict;
        pillClassEl.querySelector('.tm-pill-detail').textContent = data.classDetail;
      }
      if (pillStatuteEl) {
        pillStatuteEl.querySelector('.tm-pill-status').textContent = data.statuteVerdict;
        pillStatuteEl.querySelector('.tm-pill-detail').textContent = data.statuteDetail;
      }

      if (visualSimContainer && window.BCStore && window.BCStore.mountPdkiExplorer) {
        window.BCStore.mountPdkiExplorer(visualSimContainer, data.brand, uploadedLogoInfo, uploadedCompLogoInfo);
      }

      if (waActionBtn) {
        const msg = encodeURIComponent(
          `Halo BrandConnect, saya baru saja mengecek merek "${data.brand}" (${data.classVerdict}) di website dengan hasil evaluasi awal: ${data.verdictText}. Saya ingin verifikasi database resmi DJKI dan konsultasi pendaftaran merek.`
        );
        waActionBtn.href = `https://wa.me/6281234567890?text=${msg}`;
      }

      resultsPanel.classList.add('active');
      resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    searchForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let val = brandInput.value.trim();
      if (!val && uploadedLogoInfo) {
        val = uploadedLogoInfo.inferredBrand || uploadedLogoInfo.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').toUpperCase();
        brandInput.value = val;
      }
      if (!val) {
        brandInput.focus();
        return;
      }
      const mode = modeInput ? modeInput.value : 'name';
      const chosenClass = selectedClassHidden ? selectedClassHidden.value : '';

      // Prefetch live PDKI DJKI data if key is configured so conflict check evaluates against live database
      if (window.BCStore && window.BCStore.fetchLivePdkiApi) {
        try {
          await window.BCStore.fetchLivePdkiApi(val);
        } catch (err) {
          console.warn('Live API prefetch info:', err);
        }
      }

      if (typeof window.runSearch === 'function') {
        window.runSearch(val, mode, uploadedLogoInfo);
      } else {
        const result = evaluateQuery(val, mode, chosenClass);
        renderResults(result);
      }
    });
  };

  initAiTrademarkChecker();

  /* --------------------------------------------------
     9. BRANDCONNECT — NICE CLASSIFICATION SMART FINDER (#cari-kelas)
     -------------------------------------------------- */
  const initNiceClassFinder = () => {
    const searchInput = document.getElementById('nice-search-input');
    const filterBtns = document.querySelectorAll('.nice-filter-btn');
    const classCards = document.querySelectorAll('.nice-card');
    const selectedClassHidden = document.getElementById('tm-selected-class-hidden');
    const modePrompt = document.getElementById('tm-mode-prompt');
    const heroBrandInput = document.getElementById('tm-brand-input');

    if (!searchInput || classCards.length === 0) return;

    let activeCategory = 'all';

    const filterClasses = () => {
      const query = searchInput.value.toLowerCase().trim();

      classCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category') || '';
        const cardTitle = card.querySelector('.nice-card-title')?.textContent.toLowerCase() || '';
        const cardDesc = card.querySelector('.nice-card-desc')?.textContent.toLowerCase() || '';
        const cardExamples = card.querySelector('.nice-card-examples')?.textContent.toLowerCase() || '';
        const cardNum = card.querySelector('.nice-card-num')?.textContent.toLowerCase() || '';

        const matchesCategory = activeCategory === 'all' || cardCategory.includes(activeCategory);
        const matchesQuery =
          query === '' ||
          cardTitle.includes(query) ||
          cardDesc.includes(query) ||
          cardExamples.includes(query) ||
          cardNum.includes(query);

        card.style.display = matchesCategory && matchesQuery ? 'flex' : 'none';
      });
    };

    searchInput.addEventListener('input', filterClasses);

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-filter') || 'all';
        filterClasses();
      });
    });

    // "Gunakan Kelas XX untuk Cek Merek" button interactions
    document.querySelectorAll('#cari-kelas .nice-select-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const classValue = btn.getAttribute('data-class-val') || '';
        if (selectedClassHidden && classValue) {
          selectedClassHidden.value = classValue;
        }
        if (modePrompt && classValue) {
          modePrompt.textContent = `Kelas Terpilih: ${classValue} — Masukkan nama merek Anda:`;
        }
        const checkerSection = document.getElementById('cek-merek');
        if (checkerSection) {
          checkerSection.scrollIntoView({ behavior: 'smooth' });
          if (heroBrandInput) {
            setTimeout(() => heroBrandInput.focus(), 350);
          }
        }
      });
    });
  };

  initNiceClassFinder();

  /* --------------------------------------------------
     10. BRANDCONNECT — BRAND MONITORING REGISTRATION (#monitoring-merek)
     -------------------------------------------------- */
  const initBrandMonitoringDemo = () => {
    const radarInput = document.getElementById('radar-brand-input');
    const radarBtn = document.getElementById('radar-scan-btn');
    const radarCenterBrand = document.getElementById('radar-center-brand-label');
    const radarStatusLog = document.getElementById('radar-status-log');

    if (!radarInput || !radarBtn) return;

    radarBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const brand = radarInput.value.trim();
      if (!brand) {
        radarInput.focus();
        return;
      }
      if (radarCenterBrand) {
        radarCenterBrand.textContent = `${brand.toUpperCase()} // SIAP DIPANTAU`;
      }
      if (radarStatusLog) {
        const waMsg = encodeURIComponent(
          `Halo BrandConnect, saya ingin mengaktifkan layanan Monitoring Merek berkala pada Berita Resmi Merek (BRM) DJKI untuk merek "${brand}".`
        );
        radarStatusLog.innerHTML = `
          <span style="color:#5CD4A5;">[SIAP DIAKTIFKAN]:</span> Merek <strong>${brand.toUpperCase()}</strong> siap didaftarkan ke dalam jadwal pemantauan Berita Resmi Merek (BRM) DJKI.<br/>
          <a href="https://wa.me/6281234567890?text=${waMsg}" target="_blank" rel="noopener noreferrer" style="color:#5CD4A5;text-decoration:underline;font-weight:700;display:inline-block;margin-top:4px;">Klik di sini untuk Konfirmasi &amp; Aktifkan Notifikasi Pantauan via WhatsApp →</a>
        `;
      }
    });
  };

  initBrandMonitoringDemo();
});
