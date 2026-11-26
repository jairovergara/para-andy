// ============================================================================
// PARA ANDY, DE JAIRO — Mobile-First Interactive Story + Live Text Editor
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'jairo_andy_custom_texts_v4';

  // 1. Cartas de los sobres "Ábrelo cuando..." (voz real y cercana de Jairo)
  const defaultCapsules = {
    convivencia: {
      kicker: 'Sobre dónde estás viviendo hoy',
      title: 'Cuando sientas que ya no aguantas la convivencia allá...',
      body: `
        <p>Andy, respira un momento, mi amor. Yo sé lo mal que la estás pasando viviendo con tu mamá y tu hermana. Sé que no te gusta estar ahí ni un poquito, y te entiendo totalmente.</p>
        <p>Tú ya tenías tu vida armada sola, tu privacidad, tu independencia, llegar y hacer tus cosas sin que nadie se metiera en tu espacio. Y me parte el alma saber que por mi culpa hoy no tienes eso.</p>
        <p>No te pido que te conformes con estar ahí. Solo te pido que aguantes un poquito mi mano: <strong>esto es temporal</strong>. Todo lo que estoy moviendo hoy es para que salgas de ahí y recuperes tu espacio, tu silencio y tu tranquilidad con Damon.</p>
      `
    },
    confianza: {
      kicker: 'Sobre las cosas que te callé',
      title: 'Cuando te dé rabia o tristeza acordarte de las cosas que te oculté...',
      body: `
        <p>Tienes toda la razón de estar dolida conmigo. Ocultarte mis deudas y mis problemas por tanto tiempo fue lo peor que pude hacerte, porque rompí tu confianza.</p>
        <p>Yo no espero que se te pase de la noche a la mañana ni que hoy confíes en mí como antes. Sé que eso no se arregla con una página bonita. La confianza se recupera diciendo la verdad todos los días, sin esconderte ni un solo peso ni un solo problema nunca más. Y eso es lo que voy a hacer.</p>
      `
    },
    trabajo: {
      kicker: 'Sobre lo que pasó con el trabajo',
      title: 'Cuando te sientas frustrada por lo que pasó con el trabajo...',
      body: `
        <p>Todavía me da una impotencia horrible. Yo te había prometido ese trabajo remoto con toda la ilusión para que pudieras estar tranquila, y que justo el primer día que empezabas me despidieran fue como un balde de agua fría para los dos.</p>
        <p>Perdóname por esa desilusión tan grande. Quedarme sin trabajo en este momento es durísimo, pero no me voy a quedar de brazos cruzados. Vamos a conseguir algo mejor y más estable, sin promesas en el aire, con trabajo real.</p>
      `
    },
    collar: {
      kicker: 'Sobre aquel 6 de junio',
      title: 'Cuando mires el collar y dudes de hacia dónde vamos...',
      body: `
        <p>¿Te acuerdas de ese 6 de junio? Tú estabas un poco bajoneada, fuimos por pizza y luego en tu casa, yo estaba temblando de los nervios con la carta que te decía que miraras por dentro del dije del collar que te había dado días antes (aunque ya por culpa de Antonella lo habías descubierto jajaja) y te pedí que fueras mi novia.</p>
        <p>Ese día fui el hombre más feliz del mundo. Si hoy tú estás bajoneada por mi culpa, déjame volver a ser ese Jairo que te levanta el ánimo y te cuida. No me dejes solo, todavía tenemos mucho por vivir.</p>
      `
    }
  };

  // 2. Welcome Envelope + Soft Ambient Piano Melody
  const welcomeOverlay = document.getElementById('welcome-overlay');
  const openLetterBtn = document.getElementById('open-letter-btn');
  const musicToggle = document.getElementById('music-toggle');
  const musicText = document.getElementById('music-text');

  let audioCtx = null;
  let isMusicPlaying = false;
  let melodyInterval = null;

  const chordProgression = [
    [261.63, 329.63, 392.00, 493.88],
    [220.00, 261.63, 329.63, 392.00],
    [174.61, 220.00, 261.63, 329.63],
    [196.00, 246.94, 293.66, 329.63],
  ];
  let chordIndex = 0;

  function playSoftNote(freq, delaySecs, durationSecs = 3.2) {
    if (!audioCtx || !isMusicPlaying) return;
    const now = audioCtx.currentTime + delaySecs;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.022, now + 0.45);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSecs);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + durationSecs + 0.05);
  }

  function triggerChordStep() {
    if (!isMusicPlaying) return;
    const chord = chordProgression[chordIndex % chordProgression.length];
    chord.forEach((freq, idx) => playSoftNote(freq, idx * 0.4, 3.6));
    chordIndex++;
  }

  function startAmbientMelody() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) audioCtx = new AudioContextClass();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    isMusicPlaying = true;
    musicToggle.classList.add('playing');
    musicText.textContent = 'Música: On';
    triggerChordStep();
    clearInterval(melodyInterval);
    melodyInterval = setInterval(triggerChordStep, 3800);
  }

  function stopAmbientMelody() {
    isMusicPlaying = false;
    musicToggle.classList.remove('playing');
    musicText.textContent = 'Música: Off';
    clearInterval(melodyInterval);
  }

  if (openLetterBtn && welcomeOverlay) {
    openLetterBtn.addEventListener('click', () => {
      welcomeOverlay.classList.add('hidden-overlay');
      startAmbientMelody();
    });
  }

  if (musicToggle) {
    musicToggle.addEventListener('click', () => {
      if (isMusicPlaying) stopAmbientMelody();
      else startAmbientMelody();
    });
  }

  // 3. Mobile-First Live Photos (Auto-play subtly when in center of mobile screen + touch/hover)
  const liveBoxes = document.querySelectorAll('.live-photo-box, .necklace-feature');
  const liveObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const box = entry.target;
        const vid = box.querySelector('video');
        if (!vid) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.65) {
          box.classList.add('is-playing');
          vid.play().catch(() => {});
        } else {
          box.classList.remove('is-playing');
          vid.pause();
        }
      });
    },
    { threshold: [0.2, 0.65, 0.9] }
  );

  liveBoxes.forEach((box) => {
    liveObserver.observe(box);
    const vid = box.querySelector('video');
    if (!vid) return;
    const startLive = () => {
      box.classList.add('is-playing');
      vid.currentTime = 0;
      vid.play().catch(() => {});
    };
    const stopLive = () => {
      box.classList.remove('is-playing');
      vid.pause();
    };
    box.addEventListener('mouseenter', startLive);
    box.addEventListener('mouseleave', stopLive);
    box.addEventListener('touchstart', startLive, { passive: true });
  });

  // 4. Mobile Bottom Navigation Active Highlight on Scroll
  const navLinks = document.querySelectorAll('.bottom-nav-item');
  const sections = document.querySelectorAll('.story-section');

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = '#' + entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === id);
          });
        }
      });
    },
    { threshold: 0.35 }
  );
  sections.forEach((sec) => {
    if (sec.id) navObserver.observe(sec);
  });

  // 5. Lightbox for Photos, Live Photos, and Videos
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxMediaWrap = document.getElementById('lightbox-media-wrap');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(imgSrc, videoSrc, captionText) {
    lightboxMediaWrap.innerHTML = '';
    if (videoSrc) {
      const video = document.createElement('video');
      video.src = videoSrc;
      video.poster = imgSrc || '';
      video.controls = true;
      video.autoplay = true;
      video.loop = true;
      video.playsInline = true;
      lightboxMediaWrap.appendChild(video);
    } else if (imgSrc) {
      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = captionText || 'Recuerdo';
      lightboxMediaWrap.appendChild(img);
    }
    lightboxCaption.textContent = captionText || '';
    lightboxModal.hidden = false;
  }

  function closeLightbox() {
    lightboxModal.hidden = true;
    lightboxMediaWrap.innerHTML = '';
  }

  document.querySelectorAll('[data-lightbox]').forEach((el) => {
    el.addEventListener('click', () => {
      openLightbox(
        el.getAttribute('data-lightbox'),
        el.getAttribute('data-video'),
        el.getAttribute('data-caption')
      );
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // 6. Capsules ("Ábrelo cuando...") Modal
  const capsuleModal = document.getElementById('capsule-modal');
  const capsuleModalKicker = document.getElementById('capsule-modal-kicker');
  const capsuleModalTitle = document.getElementById('capsule-modal-title');
  const capsuleModalBody = document.getElementById('capsule-modal-body');
  const capsuleClose = document.getElementById('capsule-close');
  const capsuleOkBtn = document.getElementById('capsule-ok-btn');

  document.querySelectorAll('[data-capsule]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-capsule');
      const info = defaultCapsules[key];
      if (!info) return;
      capsuleModalKicker.textContent = info.kicker;
      capsuleModalTitle.textContent = info.title;
      capsuleModalBody.innerHTML = info.body;
      capsuleModal.hidden = false;
    });
  });

  function closeCapsule() {
    capsuleModal.hidden = true;
  }

  if (capsuleClose) capsuleClose.addEventListener('click', closeCapsule);
  if (capsuleOkBtn) capsuleOkBtn.addEventListener('click', closeCapsule);
  if (capsuleModal) {
    capsuleModal.addEventListener('click', (e) => {
      if (e.target === capsuleModal) closeCapsule();
    });
  }

  // 7. Final Button & Heart Burst
  const forgiveBtn = document.getElementById('forgive-btn');
  const finalResponseBox = document.getElementById('final-response-box');

  if (forgiveBtn && finalResponseBox) {
    forgiveBtn.addEventListener('click', () => {
      finalResponseBox.hidden = false;
      if (window.spawnHeartBurst) window.spawnHeartBurst();
      finalResponseBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // 8. LIVE TEXT EDITOR TAB FOR JAIRO (Pestaña de aprobación y edición de todos los textos)
  const openEditorBtn = document.getElementById('open-editor-btn');
  const closeEditorBtn = document.getElementById('close-editor-btn');
  const editorDrawer = document.getElementById('editor-drawer');
  const editorFieldsContainer = document.getElementById('editor-fields-container');
  const exportTextsBtn = document.getElementById('export-texts-btn');
  const resetTextsBtn = document.getElementById('reset-texts-btn');
  const hideEditorBtn = document.getElementById('hide-editor-btn');

  // Show editor button only if URL has ?edit=1 (hidden by default for Andy)
  if (window.location.search.includes('edit=1') && openEditorBtn) {
    openEditorBtn.classList.remove('hidden-for-andy');
  }

  // ==========================================================================
  // 10. REAL-TIME VISIT & READING TRACKER CON DIFERENCIACIÓN POR IP Y DISPOSITIVO
  // ==========================================================================
  const NTFY_TOPIC = 'jairo_andy_visitas_7d01d9';
  const JAIRO_FLAG_KEY = 'es_dispositivo_de_jairo_v2';
  const DEVICE_ID_KEY = 'visitor_device_uid_v1';
  const KNOWN_JAIRO_IPS_KEY = 'jairo_known_ips_v1';
  const DEFAULT_JAIRO_IP = '191.108.201.176'; // Tu IP Wi-Fi actual detectada
  const SESSION_ID = Math.random().toString(36).substring(2, 6).toUpperCase();

  const isVisitsPanelUrl = window.location.search.includes('visitas=1');
  const isEditPanelUrl = window.location.search.includes('edit=1');

  function getOrCreateDeviceId() {
    try {
      let id = localStorage.getItem(DEVICE_ID_KEY);
      if (!id) {
        id = 'CEL-' + Math.random().toString(36).substring(2, 6).toUpperCase();
        localStorage.setItem(DEVICE_ID_KEY, id);
      }
      return id;
    } catch (e) {
      return 'CEL-' + SESSION_ID;
    }
  }

  const MY_DEVICE_ID = getOrCreateDeviceId();

  function getKnownJairoIps() {
    try {
      const raw = localStorage.getItem(KNOWN_JAIRO_IPS_KEY);
      const list = raw ? JSON.parse(raw) : [];
      if (!list.includes(DEFAULT_JAIRO_IP)) list.push(DEFAULT_JAIRO_IP);
      return list;
    } catch (e) {
      return [DEFAULT_JAIRO_IP];
    }
  }

  function addKnownJairoIp(ipOrDev) {
    if (!ipOrDev) return;
    try {
      const list = getKnownJairoIps();
      if (!list.includes(ipOrDev)) {
        list.push(ipOrDev);
        localStorage.setItem(KNOWN_JAIRO_IPS_KEY, JSON.stringify(list));
      }
    } catch (e) {}
  }

  function isJairoDevice() {
    try {
      return localStorage.getItem(JAIRO_FLAG_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function getDeviceLabel() {
    const ua = navigator.userAgent || '';
    const screenRes = `${window.screen.width}x${window.screen.height}`;
    if (/iPhone/i.test(ua)) return `📱 iPhone (${screenRes})`;
    if (/iPad/i.test(ua)) return `📱 iPad (${screenRes})`;
    if (/Android/i.test(ua)) {
      const match = ua.match(/Android\s([0-9.]+);\s([^;)]+)/i);
      const model = match && match[2] ? match[2].trim() : 'Android';
      return `📱 ${model} (${screenRes})`;
    }
    if (/Macintosh|Mac OS/i.test(ua)) return `💻 Mac (${screenRes})`;
    if (/Windows/i.test(ua)) return `💻 PC Windows (${screenRes})`;
    return `📱 Celular (${screenRes})`;
  }

  // Obtener IP pública y Operador (ISP) una sola vez por sesión
  let visitorNetInfoPromise = null;
  function getVisitorNetInfo() {
    if (visitorNetInfoPromise) return visitorNetInfoPromise;
    visitorNetInfoPromise = fetch('https://ipwho.is/')
      .then((r) => r.json())
      .then((data) => ({
        ip: data.ip || 'Desconocida',
        isp: (data.connection && data.connection.isp) || data.org || '',
        city: data.city || ''
      }))
      .catch(() =>
        fetch('https://api.ipify.org?format=json')
          .then((r) => r.json())
          .then((d) => ({ ip: d.ip || 'Desconocida', isp: '', city: '' }))
          .catch(() => ({ ip: 'Desconocida', isp: '', city: '' }))
      );
    return visitorNetInfoPromise;
  }

  // Si Jairo abre ?visitas=1, guardamos automáticamente su IP actual y su DeviceID como "De Jairo"
  if (isVisitsPanelUrl || isEditPanelUrl) {
    addKnownJairoIp(MY_DEVICE_ID);
    getVisitorNetInfo().then((net) => {
      if (net.ip && net.ip !== 'Desconocida') {
        addKnownJairoIp(net.ip);
      }
    });
  }

  const sentEvents = new Set();

  async function trackAndyEvent(actionLabel, allowRepeat = false) {
    if (isVisitsPanelUrl || isEditPanelUrl) return;
    if (isJairoDevice()) return;
    if (!allowRepeat && sentEvents.has(actionLabel)) return;
    sentEvents.add(actionLabel);

    const net = await getVisitorNetInfo();

    const payload = {
      session: SESSION_ID,
      deviceId: MY_DEVICE_ID,
      ip: net.ip,
      isp: net.isp,
      city: net.city,
      device: getDeviceLabel(),
      action: actionLabel,
      ts: Date.now()
    };

    fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: 'POST',
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(() => {});
  }

  // 1) Registrar apenas abre el link
  trackAndyEvent('👀 Abrió el link (Vio la portada)');

  // 2) Registrar cuando toca "Entrar y leer a Jairo"
  if (openLetterBtn) {
    openLetterBtn.addEventListener('click', () => {
      trackAndyEvent('💌 Tocó "Entrar y leer a Jairo"');
    });
  }

  // 3) Registrar cada sección que va leyendo al bajar
  const sectionNames = {
    inicio: '📖 Leyó el Inicio (Foto principal)',
    'el-collar': '项链 Leyó la historia del 6 de marzo y el collar del 6 de junio',
    'de-frente': '❤️‍🩹 Leyó "Hablándote claro" (Las deudas, el trabajo y donde vive hoy)',
    damon: '🐾 Vio la sección de Damon y su espacio',
    razones: '✨ Leyó las 6 Razones para seguir intentándolo',
    recuerdos: '📸 Vio la galería de fotos y recuerdos',
    capsulas: '✉️ Llegó a los sobres "Ábrelo cuando..."',
    esperanza: '🤍 Llegó hasta el final ("No me dejes solo, Andy")'
  };

  const trackSectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
          const id = entry.target.id;
          if (id && sectionNames[id]) {
            trackAndyEvent(sectionNames[id]);
          }
        }
      });
    },
    { threshold: [0.55] }
  );

  document.querySelectorAll('.story-section').forEach((sec) => {
    trackSectionObserver.observe(sec);
  });

  // 4) Registrar si abre alguno de los 4 sobres "Ábrelo cuando..."
  const capsuleTrackNames = {
    convivencia: '📬 Abrió el sobre: "No soportes más la convivencia en casa de tu mamá..."',
    confianza: '📬 Abrió el sobre: "Te dé rabia o tristeza acordarte de las cosas que te oculté"',
    trabajo: '📬 Abrió el sobre: "Te sientas frustrada por lo que pasó con el trabajo"',
    collar: '📬 Abrió el sobre: "Mires el collar del 6 de junio y dudes..."'
  };

  document.querySelectorAll('[data-capsule]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const k = btn.getAttribute('data-capsule');
      if (capsuleTrackNames[k]) {
        trackAndyEvent(capsuleTrackNames[k], true);
      }
    });
  });

  // 5) Registrar si toca una foto para verla en grande
  document.querySelectorAll('[data-lightbox]').forEach((el) => {
    el.addEventListener('click', () => {
      const cap = el.getAttribute('data-caption') || 'una foto';
      trackAndyEvent(`🖼️ Abrió en grande: "${cap}"`, true);
    });
  });

  // 6) Registrar tiempo de lectura (al cumplir 1 min y 3 min en la página)
  setTimeout(() => trackAndyEvent('⏱️ Lleva 1 minuto leyendo la página'), 60000);
  setTimeout(() => trackAndyEvent('⏱️ Lleva 3 minutos leyendo la página'), 180000);

  // ==========================================================================
  // PANEL DE VISITAS PARA JAIRO (?visitas=1)
  // ==========================================================================
  const visitsDrawer = document.getElementById('visits-drawer');
  const closeVisitsBtn = document.getElementById('close-visits-btn');
  const refreshVisitsBtn = document.getElementById('refresh-visits-btn');
  const filterAndyOnlyBtn = document.getElementById('filter-andy-only-btn');
  const toggleIgnoreMeBtn = document.getElementById('toggle-ignore-me-btn');
  const visitsSummaryBox = document.getElementById('visits-summary-box');
  const visitsListContainer = document.getElementById('visits-list-container');

  let showAndyOnly = false;

  function updateIgnoreBtnLabel() {
    if (!toggleIgnoreMeBtn) return;
    if (isJairoDevice()) {
      toggleIgnoreMeBtn.textContent = '🚫 Este navegador está silenciado (Toca para reactivar)';
    } else {
      toggleIgnoreMeBtn.textContent = '🛡️ Silenciar mis futuras visitas desde este navegador';
    }
  }

  function checkIsJairoEvent(ev) {
    const known = getKnownJairoIps();
    if (ev.ip && known.includes(ev.ip)) return true;
    if (ev.deviceId && known.includes(ev.deviceId)) return true;
    return false;
  }

  async function loadVisitsHistory() {
    if (!visitsListContainer || !visitsSummaryBox) return;
    visitsSummaryBox.innerHTML = 'Cargando registro en vivo e identificando IPs...';
    visitsListContainer.innerHTML = '';

    try {
      const myNet = await getVisitorNetInfo();
      if (myNet.ip && myNet.ip !== 'Desconocida') {
        addKnownJairoIp(myNet.ip);
      }

      const res = await fetch(
        `https://ntfy.sh/${NTFY_TOPIC}/json?poll=1&since=all&_t=${Date.now()}`,
        { cache: 'no-store' }
      );
      const text = await res.text();
      const lines = text
        .trim()
        .split('\n')
        .filter((l) => l.trim().length > 0);

      const allEvents = [];
      lines.forEach((line) => {
        try {
          const item = JSON.parse(line);
          if (item.event === 'message' && item.message) {
            const parsed = JSON.parse(item.message);
            if (parsed && parsed.action) {
              allEvents.push({
                ...parsed,
                serverTime: item.time * 1000
              });
            }
          }
        } catch (e) {}
      });

      allEvents.reverse(); // Más recientes primero

      const andyEvents = allEvents.filter((e) => !checkIsJairoEvent(e));
      const jairoEvents = allEvents.filter((e) => checkIsJairoEvent(e));
      const eventsToDisplay = showAndyOnly ? andyEvents : allEvents;

      const andySessions = new Set(andyEvents.map((e) => e.session));
      const andyReachedEnd = andyEvents.some((e) => e.action && e.action.includes('final'));

      visitsSummaryBox.innerHTML = `
        <div style="margin-bottom:0.45rem;">
          <strong>🏠 Tu IP actual (Jairo):</strong> <code>${myNet.ip}</code> ${myNet.city ? `(${myNet.city})` : ''}
        </div>
        <div>
          <strong>💖 Visitas de Andy (Otra IP diferente a la tuya):</strong>
          ${
            andyEvents.length > 0
              ? `<span style="color:#ffb8ae;font-weight:700;">¡SÍ! ${andyEvents.length} acciones en ${andySessions.size} sesión(es)</span>`
              : `<span style="color:#c9b8b4;">0 todavía (solo hay ${jairoEvents.length} eventos desde tu propia IP/dispositivo)</span>`
          }
          ${andyReachedEnd ? '<br/><span style="color:#f3c892;">🤍 ¡Andy llegó a leer hasta el final de la página!</span>' : ''}
        </div>
      `;

      if (eventsToDisplay.length === 0) {
        visitsListContainer.innerHTML = `
          <div class="editor-field-group" style="text-align:center;color:#c9b8b4;">
            No hay eventos de otra IP todavía. (Si quieres ver tus propias pruebas, toca el botón de filtro arriba).
          </div>
        `;
        return;
      }

      eventsToDisplay.forEach((ev) => {
        const isMine = checkIsJairoEvent(ev);
        const card = document.createElement('div');
        card.className = `visit-event-card ${isMine ? 'jairo-event' : 'andy-event'}`;

        const dateStr = new Date(ev.ts || ev.serverTime).toLocaleTimeString('es-CO', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
        const dayStr = new Date(ev.ts || ev.serverTime).toLocaleDateString('es-CO', {
          day: 'numeric',
          month: 'short'
        });

        const ipText = ev.ip ? `IP: ${ev.ip}` : 'IP no registrada (prueba anterior)';
        const ispText = ev.isp ? ` · ${ev.isp}` : '';
        const cityText = ev.city ? ` (${ev.city})` : '';
        const devIdText = ev.deviceId ? ` · ID: ${ev.deviceId}` : '';

        card.innerHTML = `
          <div>
            <span class="who-pill ${isMine ? 'jairo' : 'andy'}">
              ${isMine ? '🧪 TU RED / TU DISPOSITIVO (Jairo)' : '💖 OTRA IP / POSIBLE ANDY'}
            </span>
            <div class="visit-event-main">${ev.action}</div>
            <div class="visit-event-meta">
              <strong>${ev.device || 'Celular'}</strong> · ${ipText}${cityText}${ispText}${devIdText} · Sesión #${ev.session}
            </div>
            ${
              !isMine && (ev.ip || ev.deviceId)
                ? `<button class="mark-mine-mini-btn" data-mark-ip="${ev.ip || ''}" data-mark-dev="${ev.deviceId || ''}">Es mi celular con datos (Marcar como mío)</button>`
                : ''
            }
          </div>
          <div class="visit-event-time">${dayStr}, ${dateStr}</div>
        `;
        visitsListContainer.appendChild(card);
      });

      visitsListContainer.querySelectorAll('.mark-mine-mini-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const ipToMark = btn.getAttribute('data-mark-ip');
          const devToMark = btn.getAttribute('data-mark-dev');
          if (ipToMark && ipToMark !== 'Desconocida') addKnownJairoIp(ipToMark);
          if (devToMark) addKnownJairoIp(devToMark);
          loadVisitsHistory();
        });
      });
    } catch (err) {
      visitsSummaryBox.innerHTML = 'No se pudo cargar el historial en este momento. Toca "Actualizar ahora".';
    }
  }

  if (filterAndyOnlyBtn) {
    filterAndyOnlyBtn.addEventListener('click', () => {
      showAndyOnly = !showAndyOnly;
      filterAndyOnlyBtn.textContent = showAndyOnly
        ? '💖 Filtro: Viendo SOLO Andy (Otras IPs)'
        : '📋 Filtro: Viendo Todas (Andy + Mis pruebas)';
      loadVisitsHistory();
    });
  }

  if (window.location.search.includes('visitas=1') && visitsDrawer) {
    visitsDrawer.hidden = false;
    updateIgnoreBtnLabel();
    loadVisitsHistory();
  }

  if (closeVisitsBtn && visitsDrawer) {
    closeVisitsBtn.addEventListener('click', () => {
      visitsDrawer.hidden = true;
    });
  }

  if (refreshVisitsBtn) {
    refreshVisitsBtn.addEventListener('click', loadVisitsHistory);
  }

  if (toggleIgnoreMeBtn) {
    toggleIgnoreMeBtn.addEventListener('click', () => {
      try {
        if (isJairoDevice()) {
          localStorage.removeItem(JAIRO_FLAG_KEY);
        } else {
          localStorage.setItem(JAIRO_FLAG_KEY, '1');
        }
      } catch (e) {}
      updateIgnoreBtnLabel();
    });
  }

  const editableLabels = {
    welcome_badge: 'Portada · Etiqueta superior',
    welcome_title: 'Portada · Título principal',
    welcome_subtitle: 'Portada · Mensaje de bienvenida',
    welcome_btn: 'Portada · Botón de entrada',
    hero_kicker: 'Inicio · Etiqueta fecha (6 de marzo)',
    hero_title: 'Inicio · Título principal sobre la foto',
    hero_lead: 'Inicio · Párrafo de introducción',
    chip_1: 'Inicio · Mini Polaroid 1',
    chip_2: 'Inicio · Mini Polaroid 2',
    chip_3: 'Inicio · Mini Polaroid 3',
    chip_4: 'Inicio · Mini Polaroid 4',
    origen_tag: 'Sección 6 de Junio · Etiqueta',
    origen_title: 'Sección 6 de Junio · Título del collar',
    origen_p1: 'Sección 6 de Junio · Párrafo 1 (El helado del 6 de marzo)',
    origen_p2: 'Sección 6 de Junio · Párrafo 2 (La pizza y los nervios del 6 de junio)',
    origen_quote: 'Sección 6 de Junio · Recuadro (La carta y el dije del collar)',
    origen_p3: 'Sección 6 de Junio · Párrafo 3 (Cierre de la sección)',
    verdad_tag: 'Sección La Verdad · Etiqueta',
    verdad_title: 'Sección La Verdad · Título principal',
    verdad_p1: 'Sección La Verdad · Párrafo 1 (Las deudas ocultas)',
    verdad_p2: 'Sección La Verdad · Párrafo 2 (El despido el primer día del trabajo remoto)',
    verdad_p3: 'Sección La Verdad · Recuadro (Vivir donde su mamá y su hermana, sin su independencia)',
    verdad_p4: 'Sección La Verdad · Párrafo 4 (Sin promesas vacías ni exigir confianza inmediata)',
    damon_tag: 'Sección Damon · Etiqueta',
    damon_title: 'Sección Damon · Título',
    damon_p1: 'Sección Damon · Párrafo introductorio',
    damon_cap1: 'Sección Damon · Foto 1 de Damon',
    damon_cap2: 'Sección Damon · Foto 2 de Damon',
    damon_cap3: 'Sección Damon · Foto 3 de Damon',
    damon_p2: 'Sección Damon · Párrafo final de esperanza',
    razones_tag: 'Sección Razones · Etiqueta',
    razones_title: 'Sección Razones · Título',
    razones_subtitle: 'Sección Razones · Subtítulo',
    r1_title: 'Razón 1 (Cumpleaños 26) · Título',
    r1_text: 'Razón 1 (Cumpleaños 26) · Texto',
    r2_title: 'Razón 2 (En el mar) · Título',
    r2_text: 'Razón 2 (En el mar) · Texto',
    r3_title: 'Razón 3 (Dos Coca-Colas) · Título',
    r3_text: 'Razón 3 (Dos Coca-Colas) · Texto',
    r4_title: 'Razón 4 (Cine, helado y pizza) · Título',
    r4_text: 'Razón 4 (Cine, helado y pizza) · Texto',
    r5_title: 'Razón 5 (Muecas en la calle) · Título',
    r5_text: 'Razón 5 (Muecas en la calle) · Texto',
    r6_title: 'Razón 6 (Mismo equipo) · Título',
    r6_text: 'Razón 6 (Mismo equipo) · Texto',
    galeria_tag: 'Galería · Etiqueta',
    galeria_title: 'Galería · Título',
    galeria_subtitle: 'Galería · Subtítulo',
    capsulas_tag: 'Sobres Ábrelo Cuando · Etiqueta',
    capsulas_title: 'Sobres Ábrelo Cuando · Título',
    cap1_btn_title: 'Sobre 1 · Título del botón',
    cap2_btn_title: 'Sobre 2 · Título del botón',
    cap3_btn_title: 'Sobre 3 · Título del botón',
    cap4_btn_title: 'Sobre 4 · Título del botón',
    final_tag: 'Cierre · Etiqueta',
    final_title: 'Cierre · Título ("No me dejes solo, Andy")',
    final_p1: 'Cierre · Párrafo 1',
    final_p2: 'Cierre · Párrafo 2',
    final_p3: 'Cierre · Párrafo 3',
    final_signoff: 'Cierre · Firma final'
  };

  // Load saved custom texts if Jairo already edited them in his browser
  function loadSavedTexts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      Object.entries(saved).forEach(([key, val]) => {
        const el = document.querySelector(`[data-editable="${key}"]`);
        if (el) el.innerHTML = val;
      });
    } catch (e) {}
  }

  function saveCurrentTexts() {
    const data = {};
    document.querySelectorAll('[data-editable]').forEach((el) => {
      const key = el.getAttribute('data-editable');
      data[key] = el.innerHTML.trim();
    });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
    return data;
  }

  function buildEditorFields() {
    if (!editorFieldsContainer) return;
    editorFieldsContainer.innerHTML = '';
    document.querySelectorAll('[data-editable]').forEach((el) => {
      const key = el.getAttribute('data-editable');
      const labelText = editableLabels[key] || key;
      const currentVal = el.innerHTML.replace(/\s+/g, ' ').trim();

      const group = document.createElement('div');
      group.className = 'editor-field-group';

      const label = document.createElement('label');
      label.textContent = labelText;

      const isLong = currentVal.length > 75;
      const input = document.createElement(isLong ? 'textarea' : 'input');
      if (isLong) input.rows = 3;
      input.value = currentVal;

      input.addEventListener('input', () => {
        el.innerHTML = input.value;
        saveCurrentTexts();
      });

      group.appendChild(label);
      group.appendChild(input);
      editorFieldsContainer.appendChild(group);
    });
  }

  loadSavedTexts();

  if (openEditorBtn && editorDrawer) {
    openEditorBtn.addEventListener('click', () => {
      buildEditorFields();
      editorDrawer.hidden = false;
    });
  }

  if (closeEditorBtn && editorDrawer) {
    closeEditorBtn.addEventListener('click', () => {
      editorDrawer.hidden = true;
    });
  }

  if (hideEditorBtn && openEditorBtn && editorDrawer) {
    hideEditorBtn.addEventListener('click', () => {
      openEditorBtn.classList.add('hidden-for-andy');
      editorDrawer.hidden = true;
    });
  }

  if (exportTextsBtn) {
    exportTextsBtn.addEventListener('click', () => {
      const data = saveCurrentTexts();
      const formatted = Object.entries(data)
        .map(([k, v]) => `[${editableLabels[k] || k}]:\n${v}\n`)
        .join('\n');
      navigator.clipboard.writeText(formatted).then(() => {
        exportTextsBtn.textContent = '✅ ¡Copiado! Pégalo en el chat';
        setTimeout(() => {
          exportTextsBtn.textContent = '📋 Copiar textos editados';
        }, 2500);
      });
    });
  }

  if (resetTextsBtn) {
    resetTextsBtn.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    });
  }

  // 9. Ambient Floating Particles & Heart Burst on Canvas
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 0.8,
      vy: -(Math.random() * 0.3 + 0.1),
      vx: (Math.random() - 0.5) * 0.2,
      alpha: Math.random() * 0.4 + 0.12,
      isHeart: false
    }));

    window.spawnHeartBurst = function () {
      for (let i = 0; i < 28; i++) {
        particles.push({
          x: width / 2 + (Math.random() - 0.5) * 220,
          y: height * 0.72 + (Math.random() - 0.5) * 60,
          r: Math.random() * 7 + 6,
          vy: -(Math.random() * 2 + 1),
          vx: (Math.random() - 0.5) * 1.8,
          alpha: 0.95,
          isHeart: true
        });
      }
    };

    function draw() {
      ctx.clearRect(0, 0, width, height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.isHeart) {
          p.alpha -= 0.009;
          ctx.save();
          ctx.font = `${p.r * 2}px serif`;
          ctx.fillStyle = `rgba(232, 165, 152, ${Math.max(0, p.alpha)})`;
          ctx.fillText('♥', p.x, p.y);
          ctx.restore();
          if (p.alpha <= 0) particles.splice(i, 1);
        } else {
          if (p.y < -10) p.y = height + 10;
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(243, 200, 146, ${p.alpha})`;
          ctx.fill();
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }
});
