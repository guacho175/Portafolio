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
      const email = button.dataset.copy;
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
  renderProjects(data.proyectos || [], data.skills || []);
  renderSkills(data.skills || []);
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

function renderContact(data) {
  const contacto = data.contacto || {};
  const email = contacto.email || '';
  setText('#contact-pitch', contacto.pitch || 'Estoy abierto a oportunidades backend y proyectos con clientes.');

  if (!email) return;

  document.querySelectorAll('[data-copy-email]').forEach(button => {
    button.dataset.copy = email;
  });
  setText('#contact-email', email);
  setText('#footer-email', email);
}

function setupContactForm() {
  const form = document.getElementById('contact-form');
  const submitButton = document.getElementById('contact-submit');
  const status = document.getElementById('form-status');
  if (!form || !submitButton || !status) return;

  form.addEventListener('submit', async event => {
    event.preventDefault();

    const payload = {
      access_key: String(form.elements.access_key?.value || '').trim(),
      subject: String(form.elements.subject?.value || '').trim(),
      from_name: String(form.elements.from_name?.value || '').trim(),
      name: String(form.elements.name?.value || '').trim(),
      email: String(form.elements.email?.value || '').trim(),
      message: String(form.elements.message?.value || '').trim(),
      botcheck: form.elements.botcheck?.checked ? '1' : ''
    };

    const validationError = validateContactPayload(payload);
    if (validationError) {
      setFormStatus(status, validationError, 'error');
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

function flashButton(button, text, timeout = 1600) {
  const previous = button.textContent;
  button.textContent = text;
  window.setTimeout(() => {
    button.textContent = previous;
  }, timeout);
}

function validateContactPayload(payload) {
  if (!payload.name) return 'Ingresa tu nombre.';
  if (!payload.email) return 'Ingresa un correo valido.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) return 'Ingresa un correo valido.';
  if (!payload.message) return 'Escribe un mensaje antes de enviar.';
  if (payload.botcheck) return 'No se pudo validar el envio. Intenta nuevamente.';
  return '';
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
