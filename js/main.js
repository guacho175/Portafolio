document.addEventListener('DOMContentLoaded', init);

async function init() {
  setupUI();

  try {
    const response = await fetch(`data/data.json?v=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    populatePortfolio(data);
  } catch (err) {
    console.error('Error fetching data:', err);
    setText('#hero-headline', 'Portafolio tecnico no disponible');
    setText('#hero-desc', 'No se pudo cargar data/data.json. Levanta el sitio con levantar.bat y revisa que el archivo exista.');
  }
}

function setupUI() {
  const themeBtn = document.getElementById('themeBtn');
  const root = document.body;
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light' || savedTheme === 'dark') root.setAttribute('data-theme', savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  const menuBtn = document.getElementById('menuBtn');
  const mobileNav = document.getElementById('mobileNav');
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  document.querySelectorAll('[data-copy-email]').forEach(button => {
    button.addEventListener('click', async () => {
      // Read dataset.copy at click time, not at registration time,
      // because renderContact() populates it after this runs.
      const email = button.dataset.copy || document.getElementById('contact-email')?.textContent?.trim();
      if (!email) return;

      try {
        await navigator.clipboard.writeText(email);
        flashButton(button, 'Email copiado');
      } catch {
        flashButton(button, email, 2600);
      }
    });
  });

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.className = 'scroll-top';
  scrollTopBtn.type = 'button';
  scrollTopBtn.setAttribute('aria-label', 'Volver arriba');
  scrollTopBtn.textContent = '^';
  document.body.appendChild(scrollTopBtn);
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 360);
  }, { passive: true });

  setupObserver();
  setupContactForm();
  setupActiveNav();
}

function populatePortfolio(data) {
  const perfil = data.perfil || {};
  const links = data.links || {};

  document.title = `${perfil.nombre || 'Christian Galindez'} | Backend, APIs e Integraciones`;
  setText('#hero-disponibilidad', perfil.disponibilidad);
  renderHeadline('#hero-headline', perfil.headline || `Backend aplicado para sistemas reales.`);
  setText('#hero-desc', perfil.descripcion_corta);

  setGlobalLinks(links);
  renderHeroTags(perfil);
  renderStats(data.stats || []);
  renderVenture(data.venture || {});
  renderProjects(data.proyectos || [], data.skills || []);
  renderSkills(data.skills || []);
  renderContact(data);

  setupObserver();
  setupMouseGlow();
  setupHeroFloaters();
  setupPageFloaters();
  setupFooterRain();
  setupTilt();
}

/* Shared tech icon paths (lucide-style) used across floater effects */
const FLOATER_ICONS = [
  { d: '<path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>', c: '#4f9eff' },
  { d: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>', c: '#a78bfa' },
  { d: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>', c: '#34d399' },
  { d: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>', c: '#fb923c' },
  { d: '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/>', c: '#f472b6' },
  { d: '<polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/>', c: '#fbbf24' },
  { d: '<rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 6h.01M6 18h.01"/>', c: '#38bdf8' },
  { d: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>', c: '#c084fc' },
  { d: '<path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>', c: '#2dd4bf' },
];

function floaterSvg(pathData, color, size, stroke = 1.3) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${pathData}</svg>`;
}

/* ── Floating icon/emoji stickers in the hero ── */
function setupHeroFloaters() {
  const layer = document.getElementById('hero-floaters');
  if (!layer || layer.childElementCount) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const icons = [
    { d: '<path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>', x: 6, y: 16, s: 40, dur: 6, del: 0, c: '#4f9eff', r: -14 },
    { d: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>', x: 88, y: 10, s: 30, dur: 5, del: 0.6, c: '#a78bfa', r: 10 },
    { d: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>', x: 90, y: 58, s: 38, dur: 7, del: 1.4, c: '#34d399', r: 6 },
    { d: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>', x: 4, y: 64, s: 32, dur: 5.5, del: 0.3, c: '#fb923c', r: -8 },
    { d: '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/>', x: 46, y: 6, s: 26, dur: 8, del: 1.8, c: '#f472b6', r: 18 },
    { d: '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>', x: 72, y: 20, s: 28, dur: 6.5, del: 1.1, c: '#38bdf8', r: -12 },
    { d: '<polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/>', x: 14, y: 40, s: 24, dur: 7, del: 0.5, c: '#fbbf24', r: 8 },
    { d: '<rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 6h.01M6 18h.01"/>', x: 80, y: 78, s: 28, dur: 6, del: 1.6, c: '#34d399', r: -6 },
    { d: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>', x: 60, y: 86, s: 22, dur: 5.5, del: 1, c: '#fbbf24', r: 14 },
  ];

  const svg = i => `<svg width="${i.s}" height="${i.s}" viewBox="0 0 24 24" fill="none" stroke="${i.c}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${i.d}</svg>`;

  layer.innerHTML = icons.map(i =>
    `<span class="floater" style="left:${i.x}%;top:${i.y}%;--rot:${i.r}deg;--dur:${i.dur}s;--del:${i.del}s;">${svg(i)}</span>`
  ).join('') + [
    { e: '🚀', x: 89, y: 26, d: 4.2, l: 0 },
    { e: '⚡', x: 5, y: 74, d: 3.8, l: 0.5 },
    { e: '💡', x: 22, y: 12, d: 4.6, l: 0.9 },
    { e: '🌐', x: 70, y: 82, d: 4.0, l: 1.3 },
  ].map(s => `<span class="floater floater--emoji" style="left:${s.x}%;top:${s.y}%;--dur:${s.d}s;--del:${s.l}s;">${s.e}</span>`).join('');
}

/* ── Ambient icons drifting along both side gutters of the whole page ── */
function setupPageFloaters() {
  const layer = document.getElementById('page-floaters');
  if (!layer || layer.childElementCount) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Fixed layer stays visible while scrolling, so a handful per side is enough.
  const spots = [
    { side: 'left', x: 3, y: 14 }, { side: 'right', x: 96, y: 20 },
    { side: 'left', x: 5, y: 38 }, { side: 'right', x: 94, y: 46 },
    { side: 'left', x: 2, y: 62 }, { side: 'right', x: 97, y: 68 },
    { side: 'left', x: 6, y: 86 }, { side: 'right', x: 95, y: 90 },
  ];

  layer.innerHTML = spots.map((s, i) => {
    const ic = FLOATER_ICONS[i % FLOATER_ICONS.length];
    const size = 26 + (i % 3) * 8;
    const dur = 7 + (i % 4);
    const del = (i * 0.6).toFixed(1);
    const rot = (i % 2 === 0 ? -1 : 1) * (6 + (i % 3) * 4);
    return `<span class="floater floater--page" style="left:${s.x}%;top:${s.y}%;--rot:${rot}deg;--dur:${dur}s;--del:${del}s;">${floaterSvg(ic.d, ic.c, size)}</span>`;
  }).join('');
}

/* ── Icons raining down inside the footer ── */
function setupFooterRain() {
  const layer = document.getElementById('footer-rain');
  if (!layer || layer.childElementCount) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const drops = 14;
  let html = '';
  for (let i = 0; i < drops; i++) {
    const ic = FLOATER_ICONS[i % FLOATER_ICONS.length];
    const left = ((i + 0.5) * (100 / drops) + (i % 2 ? 2.5 : -2.5)).toFixed(1);
    const size = 16 + (i % 4) * 6;
    const dur = (5 + (i % 5) * 1.4).toFixed(1);
    const del = (i * 0.5).toFixed(1);
    html += `<span class="rain-drop" style="left:${left}%;--size:${size}px;--dur:${dur}s;--del:${del}s;">${floaterSvg(ic.d, ic.c, size)}</span>`;
  }
  layer.innerHTML = html;
}

/* ── 3D tilt on project cards ── */
function setupTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  document.querySelectorAll('.project').forEach(card => {
    const inner = card.querySelector('.project-inner');
    if (!inner) return;

    card.addEventListener('pointermove', e => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      inner.style.setProperty('--rx', `${(py - 0.5) * -9}deg`);
      inner.style.setProperty('--ry', `${(px - 0.5) * 11}deg`);
    }, { passive: true });

    card.addEventListener('pointerleave', () => {
      inner.style.setProperty('--rx', '0deg');
      inner.style.setProperty('--ry', '0deg');
    }, { passive: true });
  });
}

function renderVenture(venture) {
  setText('#venture-name', venture.nombre || 'orbynex.digital');
  setText('#venture-summary', venture.resumen || '');
  setHref('#venture-link', venture.url || '#');

  const container = document.getElementById('venture-services');
  if (!container) return;

  const accents = ['#4f9eff', '#a78bfa', '#34d399', '#fb923c', '#f472b6', '#fbbf24'];

  container.innerHTML = (venture.servicios || []).map((service, index) => `
    <article class="venture-service" style="--pc:${accents[index % accents.length]};">
      <div class="vs-flip">
        <div class="vs-face vs-front">
          <span class="vs-num">${String(index + 1).padStart(2, '0')}</span>
          <strong>${escapeHtml(service.titulo)}</strong>
          <p>${escapeHtml(service.descripcion)}</p>
        </div>
        <div class="vs-face vs-back">
          <span class="vs-num">${String(index + 1).padStart(2, '0')}</span>
          <strong>${escapeHtml(service.titulo)}</strong>
          <p>${escapeHtml(service.descripcion)}</p>
        </div>
      </div>
    </article>
  `).join('');
}

function setGlobalLinks(links) {
  const github = links.github?.url || '#';
  const linkedin = links.linkedin?.url || '#';

  document.querySelectorAll('.link-github').forEach(el => { el.href = github; });
  document.querySelectorAll('.link-linkedin').forEach(el => { el.href = linkedin; });
}

function renderHeroTags(perfil) {
  const container = document.getElementById('hero-tags');
  if (!container) return;

  const tags = perfil.hero_tags || [perfil.ubicacion, perfil.stack, perfil.intereses].filter(Boolean);
  container.innerHTML = tags.map(tag => `<span class="pill">${escapeHtml(tag)}</span>`).join('');
}

function renderStats(stats) {
  const container = document.getElementById('proof-stats');
  if (!container) return;

  container.innerHTML = stats.map((stat, index) => `
    <div class="stat reveal" style="--i:${index}">
      <span class="k">${escapeHtml(stat.k)}</span>
      <span class="t">${escapeHtml(stat.t)}</span>
    </div>
  `).join('');
}

function renderProjects(projects, skills = []) {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  container.innerHTML = projects.map((project, index) => projectCard(project, index)).join('');
  renderProjectFilters(projects, skills);
}

const PROJECT_ACCENTS = [
  '#4f9eff', '#a78bfa', '#34d399', '#fb923c', '#f472b6', '#fbbf24',
  '#38bdf8', '#c084fc', '#2dd4bf', '#f59e0b', '#f87171', '#60a5fa'
];

function projectCard(project, index) {
  const tags = project.tags || [];
  const labels = project.visual_labels || tags.slice(0, 3);
  const accent = PROJECT_ACCENTS[index % PROJECT_ACCENTS.length];
  const links = [
    project.repo_url ? `<a class="link" href="${escapeAttr(project.repo_url)}" target="_blank" rel="noopener">Codigo <span aria-hidden="true">-></span></a>` : '',
    project.demo_url ? `<a class="link link--demo" href="${escapeAttr(project.demo_url)}" target="_blank" rel="noopener">Ver proyecto <span aria-hidden="true">-></span></a>` : '',
  ].filter(Boolean).join('');

  return `
    <article class="project reveal" style="--i:${index}; --pc:${accent};" data-tags="${escapeAttr(tags.join('|'))}">
      <div class="project-inner">
        <span class="project-line" aria-hidden="true"></span>
        <div class="card-glow" aria-hidden="true"></div>
        <div class="project-content">
          <div class="project-head">
            <span class="project-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
            </span>
            <span class="badge">${escapeHtml(project.estado || project.badge || 'Proyecto')}</span>
          </div>
          <h3>${escapeHtml(project.titulo)}</h3>
          <p>${escapeHtml(project.descripcion)}</p>
          ${project.impacto ? `<div class="impact">${escapeHtml(project.impacto)}</div>` : ''}
          <div class="visual-labels" aria-hidden="true">
            ${labels.map(label => `<span class="visual-label">${escapeHtml(label)}</span>`).join('')}
          </div>
          <div class="tags">${tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}</div>
          ${links ? `<div class="links">${links}</div>` : ''}
        </div>
      </div>
    </article>
  `;
}

function renderProjectFilters(projects, skills = []) {
  const filterBar = document.getElementById('filter-bar');
  if (!filterBar) return;

  const projectTags = projects.flatMap(project => project.tags || []);
  const skillTags = skills.flatMap(skill => skill.items || []);
  const allTags = [...new Set([...projectTags, ...skillTags])];
  const marqueeItems = ['Todos', ...allTags];
  const marqueeContent = marqueeItems.map(tag => `<span class="marquee-chip">${escapeHtml(tag)}</span>`).join('');

  filterBar.innerHTML = `
    <div class="marquee-track">
      <div class="marquee-group">${marqueeContent}</div>
      <div class="marquee-group" aria-hidden="true">${marqueeContent}</div>
    </div>
  `;
}

function renderSkills(skills) {
  const container = document.getElementById('skills-grid');
  if (!container) return;

  container.innerHTML = skills.map((skill, index) => `
    <article class="skill-block reveal" style="--i:${index}">
      <div class="skill-block-head">
        <span class="skill-num">${String(index + 1).padStart(2, '0')}</span>
        <div>
          <h3>${escapeHtml(skill.categoria)}</h3>
          ${skill.descripcion ? `<p>${escapeHtml(skill.descripcion)}</p>` : ''}
        </div>
      </div>
      <div class="skill-chips">
        ${(skill.items || []).map(item => `<span class="chip">${escapeHtml(item)}</span>`).join('')}
      </div>
    </article>
  `).join('');
}

function renderContact(data) {
  const contacto = data.contacto || {};
  const email = contacto.email || '';
  setText('#contact-pitch', contacto.pitch || 'Estoy abierto a oportunidades backend y proyectos con clientes.');

  if (!email) return;

  document.querySelectorAll('[data-copy-email]').forEach(button => {
    button.dataset.copy = email;
  });
  setText('#contact-email', email);
}

function setupContactForm() {
  const form = document.getElementById('contact-form');
  const submitButton = document.getElementById('contact-submit');
  const status = document.getElementById('form-status');
  if (!form || !submitButton || !status) return;

  ['name', 'email', 'message'].forEach(fieldName => {
    const field = form.elements[fieldName];
    if (!field) return;

    field.addEventListener('input', () => {
      setFieldError(form, fieldName, '');
      if (status.dataset.state === 'error') setFormStatus(status, 'Listo para enviar.', '');
    });

    // Validate email format on blur so the user sees the error right away
    if (fieldName === 'email') {
      field.addEventListener('blur', () => {
        const val = field.value.trim();
        if (!val) return;
        if (!/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(val)) {
          setFieldError(form, 'email', 'Ingresa un correo valido (ejemplo: nombre@correo.com).');
        }
      });
    }
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    clearFieldErrors(form);

    const payload = {
      access_key: String(form.elements.access_key?.value || '').trim(),
      subject: String(form.elements.subject?.value || '').trim(),
      from_name: String(form.elements.from_name?.value || '').trim(),
      name: String(form.elements.name?.value || '').trim(),
      email: String(form.elements.email?.value || '').trim(),
      message: String(form.elements.message?.value || '').trim(),
      botcheck: form.elements.botcheck?.checked ? '1' : ''
    };

    const validation = validateContactPayload(payload);
    if (!validation.isValid) {
      applyFieldErrors(form, validation.fields);
      setFormStatus(status, validation.message, 'error');
      return;
    }

    setSubmitting(submitButton, true);
    setFormStatus(status, 'Enviando...', 'loading');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || `HTTP ${response.status}`);
      }

      form.reset();
      clearFieldErrors(form);
      setFormStatus(status, 'Mensaje enviado. Te respondere por correo.', 'success');
    } catch (error) {
      console.error('Error sending contact form:', error);
      setFormStatus(status, 'No se pudo enviar el mensaje. Revisa tu conexion e intentalo otra vez.', 'error');
    } finally {
      setSubmitting(submitButton, false);
    }
  });
}

function setupObserver() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('show'));
    return;
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('show'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);

        // Animate stat numbers when they appear
        if (entry.target.classList.contains('stat')) {
          animateStatNumber(entry.target);
        }
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

  document.querySelectorAll('.reveal:not(.show)').forEach(el => observer.observe(el));
}

function animateStatNumber(statEl) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const kEl = statEl.querySelector('.k');
  if (!kEl) return;

  const raw = kEl.textContent.trim();
  const match = raw.match(/^(\d+)(\+?)(.*)$/);
  if (!match) return;

  const target = parseInt(match[1], 10);
  const suffix = match[2] + match[3];
  const duration = 1400;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out quart — faster start, crisp landing
    const eased = 1 - Math.pow(1 - progress, 4);
    const current = Math.round(eased * target);
    kEl.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function setupMouseGlow() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    // Reveal cards without animation
    document.querySelectorAll('.project, .skill-block, .stat').forEach(card => {
      card.querySelector('.card-glow') || (() => {
        const g = document.createElement('div');
        g.className = 'card-glow';
        g.setAttribute('aria-hidden', 'true');
        card.appendChild(g);
      })();
    });
    setupRipple();
    return;
  }

  /* ── Interactive background gradient — persistent RAF loop ──
     Strategy: one RAF loop runs continuously while the page is active.
     mousemove only writes targetX/targetY (no RAF scheduling there).
     This prevents the "stuck" bug where the loop cancels early when
     the mouse moves faster than the lerp can keep up.
  ── */
  let targetX = 50, targetY = 30;
  let currentX = 50, currentY = 30;
  let mouseActive = false;

  document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth) * 100;
    targetY = (e.clientY / window.innerHeight) * 100;
    mouseActive = true;
  }, { passive: true });

  // Higher lerp = snappier tracking, lower = more drag. 0.10 is a good balance.
  const LERP = 0.10;
  const THRESHOLD = 0.02; // stop writing to DOM when this close (avoids pointless repaints)

  function bgLoop() {
    if (mouseActive) {
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      currentX += dx * LERP;
      currentY += dy * LERP;

      if (Math.abs(dx) > THRESHOLD || Math.abs(dy) > THRESHOLD) {
        document.body.style.setProperty('--glow-x', `${currentX.toFixed(2)}%`);
        document.body.style.setProperty('--glow-y', `${currentY.toFixed(2)}%`);
        document.body.style.setProperty('--glow-opacity-bg', '1');
      }
    }
    requestAnimationFrame(bgLoop);
  }
  requestAnimationFrame(bgLoop);

  /* ── Per-card mouse-tracking glow ── */
  document.querySelectorAll('.project, .skill-block, .stat').forEach(card => {
    let glowEl = card.querySelector('.card-glow');
    if (!glowEl) {
      glowEl = document.createElement('div');
      glowEl.className = 'card-glow';
      glowEl.setAttribute('aria-hidden', 'true');
      card.appendChild(glowEl);
    }

    // Use pointermove (coalesced) — better performance than mousemove for rapid gestures
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${(((e.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`);
      card.style.setProperty('--mouse-y', `${(((e.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`);
      glowEl.classList.add('active');
    }, { passive: true });

    card.addEventListener('pointerleave', () => {
      glowEl.classList.remove('active');
    }, { passive: true });
  });

  setupRipple();
}

/* ── Ripple effect on .btn.primary ── */
function setupRipple() {
  document.querySelectorAll('.btn.primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.5;
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;`;
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    });
  });
}

function setupActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a, .mobile-nav a');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${entry.target.id}`) {
            link.style.color = 'var(--text)';
          } else {
            link.style.color = '';
          }
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
}

function flashButton(button, text, timeout = 1600) {
  const previous = button.textContent;
  button.textContent = text;
  window.setTimeout(() => {
    button.textContent = previous;
  }, timeout);
}

function validateContactPayload(payload) {
  const fields = {};

  if (!payload.name) fields.name = 'Ingresa tu nombre.';
  if (!payload.email) {
    fields.email = 'Ingresa tu correo.';
  } else if (!/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(payload.email)) {
    fields.email = 'Ingresa un correo valido (ejemplo: nombre@correo.com).';
  }
  if (!payload.message) fields.message = 'Escribe un mensaje antes de enviar.';

  if (payload.botcheck) {
    return {
      isValid: false,
      fields,
      message: 'No se pudo validar el envio. Intenta nuevamente.'
    };
  }

  const firstMessage = fields.name || fields.email || fields.message || '';
  return {
    isValid: !firstMessage,
    fields,
    message: firstMessage || ''
  };
}

function setSubmitting(button, isSubmitting) {
  button.disabled = isSubmitting;
  button.textContent = isSubmitting ? 'Enviando...' : 'Enviar mensaje';
  button.setAttribute('aria-busy', String(isSubmitting));
}

function setFormStatus(element, text, state) {
  element.textContent = text;
  element.dataset.state = state;
}

function applyFieldErrors(form, errors) {
  Object.entries(errors).forEach(([fieldName, message]) => {
    setFieldError(form, fieldName, message);
  });
}

function clearFieldErrors(form) {
  ['name', 'email', 'message'].forEach(fieldName => {
    setFieldError(form, fieldName, '');
  });
}

function setFieldError(form, fieldName, message) {
  const field = form.elements[fieldName];
  const error = document.getElementById(`${fieldName}-error`);
  if (!field || !error) return;

  field.setAttribute('aria-invalid', message ? 'true' : 'false');
  error.textContent = message;
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element && value !== undefined && value !== null) element.textContent = value;
}

/* Render the headline text unchanged, wrapping a keyword in a gradient span.
   The visible text is identical — only styling changes. */
function renderHeadline(selector, value) {
  const element = document.querySelector(selector);
  if (!element || !value) return;

  const keywords = ['automatizacion', 'automatización', 'productos web', 'backend'];
  const lower = value.toLowerCase();
  let matchIndex = -1;
  let matchWord = '';
  keywords.forEach(word => {
    const i = lower.indexOf(word);
    if (i !== -1 && (matchIndex === -1 || i < matchIndex)) {
      matchIndex = i;
      matchWord = value.substr(i, word.length);
    }
  });

  if (matchIndex === -1) {
    element.textContent = value;
    return;
  }

  const before = document.createTextNode(value.slice(0, matchIndex));
  const grad = document.createElement('span');
  grad.className = 'grad';
  grad.textContent = matchWord;
  const afterText = value.slice(matchIndex + matchWord.length);

  element.textContent = '';
  if (!before.textContent && afterText.startsWith(', ')) {
    const mobileBreak = document.createElement('br');
    mobileBreak.className = 'hero-mobile-break';
    const mobileText = afterText.slice(2);
    const productIndex = mobileText.toLowerCase().indexOf('productos web');

    if (productIndex > 0) {
      const productBreak = document.createElement('br');
      productBreak.className = 'hero-mobile-break';
      element.append(
        before,
        grad,
        document.createTextNode(', '),
        mobileBreak,
        document.createTextNode(mobileText.slice(0, productIndex)),
        productBreak,
        document.createTextNode(mobileText.slice(productIndex))
      );
      return;
    }

    element.append(before, grad, document.createTextNode(', '), mobileBreak, document.createTextNode(mobileText));
    return;
  }

  element.append(before, grad, document.createTextNode(afterText));
}

function setHref(selector, value) {
  const element = document.querySelector(selector);
  if (element && value) element.href = value;
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function escapeAttr(value = '') {
  return escapeHtml(value).replaceAll('`', '&#096;');
}
