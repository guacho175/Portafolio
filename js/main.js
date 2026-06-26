document.addEventListener('DOMContentLoaded', init);

async function init() {
  setupUI();

  try {
    const response = await fetch('data/data.json');
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

  const copyEmailBtn = document.getElementById('copy-email');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = copyEmailBtn.dataset.copy;
      if (!email) return;

      try {
        await navigator.clipboard.writeText(email);
        flashButton(copyEmailBtn, 'Email copiado');
      } catch {
        window.location.href = `mailto:${email}`;
      }
    });
  }

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
}

function populatePortfolio(data) {
  const perfil = data.perfil || {};
  const links = data.links || {};

  document.title = `${perfil.nombre || 'Christian Galindez'} | Backend, APIs e Integraciones`;
  setText('#hero-disponibilidad', perfil.disponibilidad);
  setText('#hero-headline', perfil.headline || `Backend aplicado para sistemas reales.`);
  setText('#hero-desc', perfil.descripcion_corta);
  setHref('#btn-cv', perfil.cv_url);

  setGlobalLinks(links);
  renderHeroTags(perfil);
  renderStats(data.stats || []);
  renderVenture(data.venture || {});
  renderCaseStudy(data.case_study || {});
  renderProjects(data.proyectos || [], data.skills || []);
  renderSkills(data.skills || []);
  renderExperience(data.experiencia || []);
  renderContact(data);

  setupObserver();
}

function renderVenture(venture) {
  setText('#venture-name', venture.nombre || 'orbynex.digital');
  setText('#venture-summary', venture.resumen || '');
  setHref('#venture-link', venture.url || '#');

  const container = document.getElementById('venture-services');
  if (!container) return;

  container.innerHTML = (venture.servicios || []).map((service, index) => `
    <article class="venture-service">
      <span>${String(index + 1).padStart(2, '0')}</span>
      <strong>${escapeHtml(service.titulo)}</strong>
      <p>${escapeHtml(service.descripcion)}</p>
    </article>
  `).join('');
}

function setGlobalLinks(links) {
  const github = links.github?.url || '#';
  const linkedin = links.linkedin?.url || '#';
  const email = links.email?.url || '#';

  document.querySelectorAll('.link-github').forEach(el => { el.href = github; });
  document.querySelectorAll('.link-linkedin').forEach(el => { el.href = linkedin; });
  document.querySelectorAll('.link-email').forEach(el => { el.href = email; });
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

function renderCaseStudy(caseStudy) {
  setText('#case-badge', caseStudy.badge || 'Backend + API');
  setText('#case-title', caseStudy.titulo || 'Turnero y bot de reservas por WhatsApp');
  setText('#case-summary', caseStudy.resumen || '');

  const results = document.getElementById('case-results');
  if (results) {
    results.innerHTML = (caseStudy.resultados || []).map(item => `
      <div class="case-point">${escapeHtml(item)}</div>
    `).join('');
  }

  const board = document.getElementById('case-board');
  if (!board) return;

  const flow = caseStudy.flujo || [];
  const stack = caseStudy.stack || [];
  board.innerHTML = `
    <div class="flow-map">
      ${flow.map((step, index) => `
        <div class="flow-node" style="--i:${index}">
          <span>${index + 1}</span>
          <strong>${escapeHtml(step.label)}</strong>
          <p>${escapeHtml(step.detail)}</p>
        </div>
      `).join('')}
    </div>
    <div class="case-stack">
      ${stack.map(item => `<span class="tag">${escapeHtml(item)}</span>`).join('')}
    </div>
  `;
}

function renderProjects(projects, skills = []) {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  container.innerHTML = projects.map((project, index) => projectCard(project, index)).join('');
  renderProjectFilters(projects, skills);
}

function projectCard(project, index) {
  const tags = project.tags || [];
  const labels = project.visual_labels || tags.slice(0, 3);
  const links = [
    project.repo_url ? `<a class="link" href="${escapeAttr(project.repo_url)}" target="_blank" rel="noopener">Codigo -></a>` : '',
    project.demo_url ? `<a class="link" href="${escapeAttr(project.demo_url)}" target="_blank" rel="noopener">Demo -></a>` : '',
  ].filter(Boolean).join('');

  return `
    <article class="project reveal" style="--i:${index}" data-tags="${escapeAttr(tags.join('|'))}">
      <div class="project-visual visual-${escapeAttr(project.visual || 'backend')}">
        <div class="visual-lines">
          ${labels.map(label => `<span class="visual-chip">${escapeHtml(label)}</span>`).join('')}
        </div>
      </div>
      <div class="project-body">
        <div class="project-top">
          <h3>${escapeHtml(project.titulo)}</h3>
          <span class="badge">${escapeHtml(project.estado || project.badge || 'Proyecto')}</span>
        </div>
        <p>${escapeHtml(project.descripcion)}</p>
        ${project.impacto ? `<div class="impact">${escapeHtml(project.impacto)}</div>` : ''}
        <div class="tags">${tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}</div>
        ${links ? `<div class="links">${links}</div>` : ''}
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
    <article class="capability-card reveal" style="--i:${index}">
      <h3>${escapeHtml(skill.categoria)}</h3>
      ${skill.descripcion ? `<p>${escapeHtml(skill.descripcion)}</p>` : ''}
      <div class="skill-list">
        ${(skill.items || []).map(item => `<span class="chip">${escapeHtml(item)}</span>`).join('')}
      </div>
    </article>
  `).join('');
}

function renderExperience(items) {
  const container = document.getElementById('experience-timeline');
  if (!container) return;

  container.innerHTML = items.map((item, index) => `
    <article class="experience-item reveal" style="--i:${index}">
      <div class="experience-date">${escapeHtml(item.fecha)}</div>
      <div>
        <h3>${escapeHtml(item.titulo)}</h3>
        <p>${escapeHtml(item.descripcion)}</p>
      </div>
    </article>
  `).join('');
}

function renderContact(data) {
  const contacto = data.contacto || {};
  const email = contacto.email || '';
  setText('#contact-pitch', contacto.pitch || 'Estoy abierto a oportunidades backend y proyectos con clientes.');

  const copyEmailBtn = document.getElementById('copy-email');
  if (copyEmailBtn && email) {
    copyEmailBtn.dataset.copy = email;
  }
}

function setupObserver() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('show'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal:not(.show)').forEach(el => observer.observe(el));
}

function flashButton(button, text) {
  const previous = button.textContent;
  button.textContent = text;
  window.setTimeout(() => {
    button.textContent = previous;
  }, 1600);
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element && value !== undefined && value !== null) element.textContent = value;
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
