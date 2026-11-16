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
      badge: 'STAGE 01 // IDEA',
      heading: 'Setiap bisnis besar dimulai dari sketsa di atas kertas.',
      desc: 'Sebelum badan usaha berdiri atau produk masuk ke pasar, semuanya berawal dari konsep, catatan buku, dan rencana awal. Kami membantu Anda memetakan langkah yang tepat sejak hari pertama.',
      sketch: 'Catatan ide bisnis, konsep nama brand, & sketsa produk awal',
      reality: 'Peta kebutuhan badan usaha, KBLI, merek, dan izin produk yang jelas',
      target: '#stage-build',
      linkLabel: 'LIHAT TAHAP 01: BUILD'
    },
    '02': {
      badge: 'STAGE 02 // BUILD (BUSINESS FOUNDATION)',
      heading: 'Siapkan fondasi badan usaha yang tepat.',
      desc: 'Kami membantu mempersiapkan pendirian PT, CV, atau badan usaha Anda beserta penentuan kode KBLI dan NIB agar bisnis memiliki struktur resmi yang jelas.',
      sketch: 'Rencana struktur usaha, pembagian peran, & draf kegiatan bisnis',
      reality: 'Akta Pendirian PT/CV, SK Kemenkumham, NPWP Badan, & NIB',
      target: '#stage-build',
      linkLabel: 'MENUJU 01 / BUILD'
    },
    '03': {
      badge: 'STAGE 03 // LEGALIZE (LEGAL ENTITY & LICENSING)',
      heading: 'Jadikan operasional bisnis Anda resmi dan terarah.',
      desc: 'Kami membantu mengidentifikasi dan mengurus kebutuhan NIB, sistem OSS Berbasis Risiko, serta izin operasional yang relevan dengan kegiatan usaha Anda.',
      sketch: 'Daftar kebutuhan operasional & kelengkapan dokumen usaha',
      reality: 'NIB Aktif, Perizinan Berusaha OSS, & Izin Operasional Terverifikasi',
      target: '#stage-legalize',
      linkLabel: 'MENUJU 02 / LEGALIZE'
    },
    '04': {
      badge: 'STAGE 04 // PROTECT (PROTECTED BRAND)',
      heading: 'Lindungi nama dan identitas brand yang Anda bangun.',
      desc: 'Ubah nama dan logo brand Anda menjadi aset kekayaan intelektual yang terlindungi secara resmi melalui pendaftaran merek di DJKI.',
      sketch: 'Sketsa logo awal, pemilihan nama brand, & eksplorasi identitas',
      reality: 'Bukti Permohonan / Sertifikat Merek Terdaftar (®) di DJKI',
      target: '#stage-protect',
      linkLabel: 'MENUJU 03 / PROTECT'
    },
    '05': {
      badge: 'STAGE 05 // CERTIFY (COMPLIANT PRODUCT)',
      heading: 'Siapkan produk Anda sebelum masuk ke pasar.',
      desc: 'Mulai dari evaluasi komposisi dan label kemasan hingga pendampingan izin edar BPOM dan sertifikasi Halal BPJPH sesuai kategori produk Anda.',
      sketch: 'Sampel prototipe produk, daftar komposisi, & draf desain kemasan',
      reality: 'Produk dengan Nomor Izin Edar BPOM & Sertifikat Halal siap jual',
      target: '#stage-certify',
      linkLabel: 'MENUJU 04 / CERTIFY'
    },
    '06': {
      badge: 'STAGE 06 // MOVE FORWARD',
      heading: 'Melangkah lebih jauh dengan kesiapan penuh.',
      desc: 'Ketika fondasi badan usaha telah berdiri, izin usaha jelas, merek terlindungi, dan produk telah terdaftar, bisnis Anda siap memperluas distribusi dan kemitraan.',
      sketch: 'Seluruh tahapan bisnis terhubung dalam satu peta jalan',
      reality: 'Bisnis dan produk beroperasi resmi serta siap berekspansi di pasar',
      target: '#stage-move-forward',
      linkLabel: 'MENUJU 05 / MOVE FORWARD'
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

  // Recommendation Engine based on User Answers
  const catalogBlocks = {
    BUILD: {
      stageCode: '01 — BUILD',
      title: 'FONDASI BISNIS & BADAN USAHA',
      desc: 'Mulai dengan mempersiapkan struktur badan usaha (PT atau CV), penentuan kode KBLI yang tepat, serta pendaftaran awal agar bisnis Anda memiliki landasan resmi.',
      services: ['Pendirian Badan Usaha (PT / CV)', 'Pendaftaran Bisnis & NPWP Badan', 'Pengurusan NIB'],
      ctaLabel: 'MULAI BANGUN BISNIS →',
      ctaHref: 'pendirian-bisnis.html',
      preselect: '01 BUILD'
    },
    LEGALIZE: {
      stageCode: '02 — LEGALIZE',
      title: 'LEGALITAS & PERIZINAN USAHA',
      desc: 'Lengkapi dan tertibkan Nomor Induk Berusaha (NIB), sinkronisasi sistem OSS Berbasis Risiko, serta izin operasional sesuai bidang usaha Anda.',
      services: ['Pengurusan NIB', 'Perizinan Berusaha & OSS', 'Izin Operasional & Sertifikat Standar'],
      ctaLabel: 'URUS LEGALITAS →',
      ctaHref: 'legalitas-perizinan.html',
      preselect: '02 LEGALIZE'
    },
    PROTECT: {
      stageCode: '03 — PROTECT',
      title: 'PENDAFTARAN MEREK & PROTEKSI BRAND',
      desc: 'Lindungi nama dan identitas brand yang telah Anda bangun melalui pengecekan kemiripan dan pendaftaran merek resmi di DJKI sebelum diklaim pihak lain.',
      services: ['Pendaftaran Merek (DJKI)', 'Konsultasi & Cek Kemiripan Merek', 'Perlindungan Kekayaan Intelektual'],
      ctaLabel: 'PELAJARI LAYANAN MEREK →',
      ctaHref: 'pendaftaran-merek.html',
      preselect: '03 PROTECT'
    },
    CERTIFY: {
      stageCode: '04 — CERTIFY',
      title: 'PERSIAPAN & REGISTRASI PRODUK',
      desc: 'Identifikasi kebutuhan registrasi, evaluasi label kemasan, izin edar BPOM, serta sertifikasi Halal yang relevan dengan kategori produk Anda.',
      services: ['Registrasi Produk', 'Kepatuhan Produk & Label', 'Pendampingan BPOM', 'Sertifikasi Halal'],
      ctaLabel: 'SIAPKAN PRODUK →',
      ctaHref: 'sertifikasi-produk.html',
      preselect: '04 CERTIFY'
    }
  };

  const computeRecommendations = () => {
    const { building, stage, foundation, hasProduct, productCategory, priority } = mapperState;
    const hasEntity = foundation.includes('BADAN_USAHA');
    const hasNib = foundation.includes('NIB');
    const hasTrademark = foundation.includes('MEREK');
    const hasNone =
      foundation.length === 0 ||
      foundation.includes('BELUM_SEMUA') ||
      foundation.includes('BELUM_YAKIN');

    const order = [];

    // Explicit Rule 1: "A BRAND" + "ALREADY OPERATING" + "NO REGISTERED TRADEMARK" -> Prioritize PROTECT
    if (building === 'BRAND' && stage === 'ALREADY_OPERATING' && !hasTrademark) {
      order.push('PROTECT', 'LEGALIZE', hasProduct === 'YA' ? 'CERTIFY' : 'BUILD');
    }
    // Explicit Rule 2: "A BUSINESS" + "IDEA" + "NONE OF THE ABOVE" -> Prioritize BUILD
    else if (building === 'BISNIS' && stage === 'IDEA' && hasNone) {
      order.push('BUILD', 'LEGALIZE', 'PROTECT');
    }
    // Explicit Rule 3: "A PRODUCT" + "READY TO LAUNCH" -> Prioritize CERTIFY
    else if (building === 'PRODUK' && stage === 'READY_TO_LAUNCH') {
      order.push('CERTIFY', !hasTrademark ? 'PROTECT' : 'LEGALIZE', !hasEntity ? 'BUILD' : 'LEGALIZE');
    }
    // Priority-driven & intelligent fallback rules
    else {
      if (priority === 'DAFTAR_MEREK' || building === 'BRAND') {
        order.push('PROTECT');
      } else if (
        priority === 'REGISTRASI_PRODUK' ||
        priority === 'BPOM' ||
        priority === 'HALAL' ||
        building === 'PRODUK'
      ) {
        order.push('CERTIFY');
      } else if (priority === 'NIB_PERIZINAN') {
        order.push('LEGALIZE');
      } else {
        order.push('BUILD');
      }

      // Secondary steps based on missing foundation
      if (!hasEntity && !order.includes('BUILD')) order.push('BUILD');
      if (!hasNib && !order.includes('LEGALIZE')) order.push('LEGALIZE');
      if (!hasTrademark && !order.includes('PROTECT')) order.push('PROTECT');
      if (hasProduct === 'YA' && !order.includes('CERTIFY')) order.push('CERTIFY');

      ['BUILD', 'LEGALIZE', 'PROTECT', 'CERTIFY'].forEach((k) => {
        if (!order.includes(k)) order.push(k);
      });
    }

    const uniqueTop3 = [...new Set(order)].slice(0, 3);
    return uniqueTop3.map((key, idx) => {
      const base = { ...catalogBlocks[key] };
      if (key === 'CERTIFY' && productCategory) {
        base.title = `PERSIAPAN PRODUK (${productCategory.toUpperCase()})`;
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
      category: '01 // FONDASI & LEGALITAS · ISSUE NO. 14',
      title: 'What Does a New Business Actually Need to Start Legally?',
      preselect: '01 BUILD',
      body: `
        <p>Ketika seorang pengusaha melangkah dari konsep di buku catatan menuju eksekusi bisnis nyata, kebingungan yang paling sering muncul adalah: dokumen apa yang harus diurus lebih dulu agar bisnis berjalan resmi tanpa membuang biaya untuk izin yang belum diperlukan?</p>
        <h4>1. Pilih Bentuk Badan Usaha yang Sesuai dengan Rencana Bisnis</h4>
        <p>Pemilihan antara PT Umum, PT Perorangan, atau CV menentukan pemisahan tanggung jawab harta pribadi serta kemudahan saat bekerja sama dengan pihak ketiga atau mendaftarkan produk di kemudian hari.</p>
        <h4>2. Ketepatan Memilih Kode KBLI Sejak Awal</h4>
        <p>Seluruh perizinan usaha di Indonesia mengacu pada KBLI (Klasifikasi Baku Lapangan Usaha Indonesia). Memilih kode KBLI yang tepat saat pembuatan akta pendirian akan menghindarkan Anda dari keharusan mengubah akta ketika ingin mengurus izin operasional atau BPOM.</p>
        <ul>
          <li><strong>Akta Pendirian & SK Kemenkumham:</strong> Dasar pengesahan berdirinya badan usaha Anda.</li>
          <li><strong>NPWP Badan Usaha:</strong> Diperlukan untuk pembukaan rekening bank perusahaan dan administrasi perpajakan.</li>
          <li><strong>NIB (Nomor Induk Berusaha):</strong> Identitas resmi pelaku usaha yang diterbitkan melalui sistem OSS.</li>
        </ul>
        <p>Di BRANDCONNECT, kami membantu menyusun langkah awal ini secara berurutan agar fondasi perusahaan Anda siap mendukung perlindungan merek dan registrasi produk di tahap berikutnya.</p>
      `
    },
    'article-2': {
      category: '02 // PERLINDUNGAN MEREK · ISSUE NO. 19',
      title: 'Before Registering Your Trademark, Understand These Things.',
      preselect: '03 PROTECT',
      body: `
        <p>Banyak pemilik bisnis menginvestasikan biaya besar untuk desain kemasan, kampanye pemasaran, dan pembuatan toko fisik sebelum memeriksa apakah nama brand yang mereka gunakan masih tersedia secara hukum di DJKI.</p>
        <h4>1. Hindari Nama yang Terlalu Umum (Deskriptif)</h4>
        <p>Merek yang hanya menjelaskan jenis barang atau sifat produk umumnya sulit mendapatkan persetujuan. Nama yang unik dan memiliki daya pembeda kuat memiliki peluang pendaftaran yang jauh lebih tinggi.</p>
        <h4>2. Tentukan Kelas Merek (Nice Classification) dengan Tepat</h4>
        <p>Perlindungan merek berlaku berdasarkan kelas barang atau jasa (Kelas 1 hingga 45). Pastikan Anda mendaftarkan merek pada kelas yang benar-benar mewakili produk maupun layanan bisnis Anda saat ini dan rencana pengembangannya.</p>
        <ul>
          <li>Lakukan pengecekan kemiripan merek sebelum mencetak kemasan dalam jumlah besar.</li>
          <li>Pahami prinsip <em>First-to-File</em>: pihak yang mendaftar lebih dulu memiliki prioritas perlindungan hukum.</li>
          <li>Bukti pengajuan merek resmi juga menjadi syarat penting ketika Anda ingin mengurus izin edar BPOM.</li>
        </ul>
      `
    },
    'article-3': {
      category: '03 // REGISTRASI PRODUK · ISSUE NO. 23',
      title: 'From Product Idea to Market: What Should You Prepare?',
      preselect: '04 CERTIFY',
      body: `
        <p>Membawa produk fisik—seperti skincare, kosmetik, makanan dan minuman kemasan, atau suplemen—dari tahap sampel menuju penjualan resmi di pasar memerlukan persiapan kepatuhan produk yang terencana.</p>
        <h4>1. Kesiapan Komposisi & Fasilitas Produksi</h4>
        <p>Pastikan setiap bahan baku yang digunakan sesuai dengan batas keamanan yang berlaku. Baik Anda memproduksi sendiri maupun bekerja sama dengan pabrik maklon, dokumen kerjasama dan standar fasilitas produksi harus selaras.</p>
        <h4>2. Kesesuaian Desain Label Kemasan</h4>
        <p>Informasi pada kemasan produk (seperti nama produk, komposisi, berat bersih, nomor bets, dan klaim manfaat) wajib mengikuti ketentuan pelabelan agar tidak mengalami kendala saat evaluasi.</p>
        <ul>
          <li><strong>Nomor Izin Edar (NIE) BPOM:</strong> Syarat utama agar produk dapat dipasarkan secara luas dan aman.</li>
          <li><strong>Sertifikasi Halal BPJPH:</strong> Memberikan jaminan kehalalan produk sekaligus memenuhi kewajiban regulasi yang berlaku.</li>
          <li><strong>Keterhubungan Legalitas:</strong> Pastikan KBLI badan usaha dan pendaftaran merek Anda sudah siap mendukung proses registrasi produk.</li>
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
    const modeTabs = document.querySelectorAll('.tm-mode-tab');
    const modePrompt = document.getElementById('tm-mode-prompt');
    const logoUploadArea = document.getElementById('tm-logo-upload-area');
    const logoFileInput = document.getElementById('tm-logo-file-input');
    const logoPlaceholder = document.getElementById('tm-logo-upload-placeholder');
    const logoPreviewWrap = document.getElementById('tm-logo-preview-wrap');
    const logoPreviewImg = document.getElementById('tm-logo-preview-img');
    const logoFileNameEl = document.getElementById('tm-logo-file-name');
    const logoFileMetaEl = document.getElementById('tm-logo-file-meta');
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

    const compLogoInput = document.getElementById('tm-comp-logo-input');
    const compLogoStatus = document.getElementById('tm-comp-logo-status');
    const visualSimContainer = document.getElementById('tm-visual-similarity-container');

    let uploadedLogoInfo = null;
    let uploadedCompLogoInfo = null;

    // Mode Tabs Switching
    modeTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
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
          if (modePrompt) modePrompt.textContent = 'Cek Merek Anda Gratis, sekarang!';
          if (logoUploadArea) logoUploadArea.hidden = true;
        } else if (mode === 'number') {
          brandInput.placeholder = 'Masukkan nomor permohonan / registrasi DJKI (contoh: DID2026012345 / IDM000...)...';
          if (modePrompt) modePrompt.textContent = 'Cek Status Nomor Permohonan Merek DJKI';
          if (logoUploadArea) logoUploadArea.hidden = true;
        } else if (mode === 'logo') {
          brandInput.placeholder = 'Masukkan nama merek pada logo Anda (opsional, otomatis terisi dari nama file)...';
          if (modePrompt) modePrompt.textContent = 'Unggah Logo untuk Cek Kemiripan Visual (dHash, Vienna Code & Komposisi Warna)';
          if (logoUploadArea) logoUploadArea.hidden = false;
        }
        brandInput.focus();
      });
    });

    // Logo Upload Handling
    if (logoUploadArea && logoFileInput) {
      logoUploadArea.addEventListener('click', (ev) => {
        if (ev.target.closest('label')) return;
        logoFileInput.click();
      });

      logoFileInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
          const dataUrl = ev.target?.result;
          if (logoPreviewImg && typeof dataUrl === 'string') {
            logoPreviewImg.src = dataUrl;
            const imgObj = new Image();
            imgObj.onload = () => {
              const sizeKB = Math.round(file.size / 1024);
              uploadedLogoInfo = window.BCStore && window.BCStore.analyzeLogoPixels
                ? window.BCStore.analyzeLogoPixels(imgObj, file.name, sizeKB)
                : {
                    name: file.name,
                    sizeKB,
                    width: imgObj.naturalWidth,
                    height: imgObj.naturalHeight
                  };

              if (!brandInput.value.trim()) {
                brandInput.value = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').toUpperCase();
              }

              if (logoFileNameEl) logoFileNameEl.textContent = `${file.name} (${uploadedLogoInfo.width}×${uploadedLogoInfo.height} px · ${sizeKB} KB)`;
              if (logoFileMetaEl) {
                const swatchesHtml = (uploadedLogoInfo.dominantColors || [])
                  .map((c) => `<span style="display:inline-flex;align-items:center;gap:4px;margin-right:8px;"><span style="width:11px;height:11px;border-radius:2px;background:${c.hex};border:1px solid #333;display:inline-block;"></span>${c.nameId} (${c.hex})</span>`)
                  .join('');
                logoFileMetaEl.innerHTML = `
                  <div style="margin-top:3px;"><strong>Palet Warna Terdeteksi:</strong> ${swatchesHtml}</div>
                  <div style="margin-top:2px;"><strong>Vienna Code:</strong> <code>${uploadedLogoInfo.viennaCode || '-'}</code> · <strong>Simetri:</strong> H:${uploadedLogoInfo.symmetryH || 80}% / V:${uploadedLogoInfo.symmetryV || 75}% · <strong>dHash:</strong> <code>${uploadedLogoInfo.dHash || '-'}</code></div>
                  <div style="margin-top:2px;color:var(--green);font-weight:700;">✓ Klik "Cek Merek Gratis" untuk menampilkan Daftar Penelusuran Merek PDKI &amp; Filter Lanjutan!</div>
                `;
              }
              if (logoPlaceholder) logoPlaceholder.hidden = true;
              if (logoPreviewWrap) logoPreviewWrap.hidden = false;
            };
            imgObj.src = dataUrl;
          }
        };
        reader.readAsDataURL(file);
      });
    }

    // Competitor Logo 1-on-1 Upload Handling
    if (compLogoInput) {
      compLogoInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const dataUrl = ev.target?.result;
          if (typeof dataUrl === 'string') {
            const imgObj = new Image();
            imgObj.onload = () => {
              const sizeKB = Math.round(file.size / 1024);
              uploadedCompLogoInfo = window.BCStore && window.BCStore.analyzeLogoPixels
                ? window.BCStore.analyzeLogoPixels(imgObj, file.name, sizeKB)
                : null;
              if (compLogoStatus && uploadedCompLogoInfo) {
                const cmp = uploadedLogoInfo && window.BCStore.compareTwoLogos
                  ? window.BCStore.compareTwoLogos(uploadedLogoInfo, uploadedCompLogoInfo)
                  : null;
                compLogoStatus.innerHTML = `<strong style="color:var(--green);">✓ Logo Pembanding Terbaca: ${file.name}</strong> (dHash: <code>${uploadedCompLogoInfo.dHash}</code>)${cmp ? ` — <strong>Kemiripan 1-on-1: ${cmp.totalSim}% (${cmp.verdict})</strong>` : ''}`;
              }
            };
            imgObj.src = dataUrl;
          }
        };
        reader.readAsDataURL(file);
      });
    }

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

      const result = evaluateQuery(val, mode, chosenClass);
      renderResults(result);
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
