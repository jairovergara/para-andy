// ============================================================================
// PARA ANDY, DE JAIRO — Mobile-First Interactive Story
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Cartas de los sobres "Ábrelo cuando..."
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

  // 7. Lightweight Event Telemetry
  const NTFY_TOPIC = 'jairo_andy_visitas_7d01d9';
  const DEVICE_ID_KEY = 'visitor_device_uid_v1';
  const SESSION_ID = Math.random().toString(36).substring(2, 6).toUpperCase();

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

  let visitorNetInfoPromise = null;

  function fetchWithTimeout(url, ms = 2200) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms);
    return fetch(url, { signal: ctrl.signal, cache: 'no-store' }).finally(() =>
      clearTimeout(timer)
    );
  }

  function getVisitorNetInfo() {
    if (visitorNetInfoPromise) return visitorNetInfoPromise;

    const cfTracePromise = fetchWithTimeout('https://1.1.1.1/cdn-cgi/trace', 2200)
      .then((r) => r.text())
      .then((txt) => {
        const mIp = txt.match(/ip=([^\r\n]+)/);
        const mLoc = txt.match(/loc=([^\r\n]+)/);
        return {
          ip: mIp ? mIp[1].trim() : '',
          loc: mLoc ? mLoc[1].trim() : ''
        };
      })
      .catch(() => ({ ip: '', loc: '' }));

    const ipWhoPromise = fetchWithTimeout('https://ipwho.is/', 2200)
      .then((r) => r.json())
      .then((data) => ({
        ip: data.ip || '',
        isp: (data.connection && data.connection.isp) || data.org || '',
        city: data.city || ''
      }))
      .catch(() => ({ ip: '', isp: '', city: '' }));

    visitorNetInfoPromise = Promise.all([cfTracePromise, ipWhoPromise]).then(
      ([cf, who]) => ({
        ip: cf.ip || who.ip || 'IP oculta por navegador',
        isp: who.isp || '',
        city: who.city || cf.loc || ''
      })
    );

    return visitorNetInfoPromise;
  }

  const sentEvents = new Set();

  async function trackEvent(actionLabel, allowRepeat = false) {
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

  trackEvent('👀 Abrió el link (Vio la portada)');

  if (openLetterBtn) {
    openLetterBtn.addEventListener('click', () => {
      trackEvent('💌 Tocó "Entrar y leer a Jairo"');
    });
  }

  const sectionNames = {
    inicio: '📖 Leyó el Inicio (Foto principal)',
    'el-collar': '✨ Leyó la historia del 6 de marzo y el collar del 6 de junio',
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
            trackEvent(sectionNames[id]);
          }
        }
      });
    },
    { threshold: [0.55] }
  );

  document.querySelectorAll('.story-section').forEach((sec) => {
    trackSectionObserver.observe(sec);
  });

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
        trackEvent(capsuleTrackNames[k], true);
      }
    });
  });

  document.querySelectorAll('[data-lightbox]').forEach((el) => {
    el.addEventListener('click', () => {
      const cap = el.getAttribute('data-caption') || 'una foto';
      trackEvent(`🖼️ Abrió en grande: "${cap}"`, true);
    });
  });

  setTimeout(() => trackEvent('⏱️ Lleva 1 minuto leyendo la página'), 60000);
  setTimeout(() => trackEvent('⏱️ Lleva 3 minutos leyendo la página'), 180000);

  // 8. Ambient Floating Particles on Canvas
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
      alpha: Math.random() * 0.4 + 0.12
    }));

    function draw() {
      ctx.clearRect(0, 0, width, height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(243, 200, 146, ${p.alpha})`;
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    draw();
  }
});
