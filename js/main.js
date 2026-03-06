document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial Logic setup
  setupUI();

  // 2. Fetch data and populate
  fetch('data/data.json')
    .then(response => response.json())
    .then(data => populatePortfolio(data))
    .catch(err => console.error('Error fetching data:', err));
});

function setupUI() {
  // --- Theme toggle ---
  const themeBtn = document.getElementById("themeBtn");
  const root = document.body;
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") root.setAttribute("data-theme", savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const cur = root.getAttribute("data-theme") || "dark";
      const next = cur === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }

  // --- Mobile menu ---
  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", () => {
      mobileNav.classList.toggle("open");
    });
    mobileNav.querySelectorAll("a").forEach(a => 
      a.addEventListener("click", () => mobileNav.classList.remove("open"))
    );
  }

  // --- Initialize Observer handler for elements already in DOM (can re-call later if needed) ---
  setupObserver();

  // --- Footer year ---
  const yearEl = document.getElementById("year");
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Scroll-to-top button ---
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.className = 'scroll-top';
  scrollTopBtn.setAttribute('aria-label', 'Volver arriba');
  scrollTopBtn.innerHTML = '&uarr;';
  document.body.appendChild(scrollTopBtn);
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });
}

function setupObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) e.target.classList.add("show");
        });
    }, { threshold: 0.12 });

    document.querySelectorAll(".reveal:not(.show)").forEach(el => observer.observe(el));
}

function populatePortfolio(data) {
  // --- Hero Section ---
  const heroNameTags = document.querySelectorAll('.hero-name');
  heroNameTags.forEach(el => el.textContent = data.perfil.nombre);
  const roleSegments = (data.perfil.rol || '').split(/\s*[|·]\s*/).filter(Boolean);
  
  if (document.getElementById('hero-disponibilidad')) document.getElementById('hero-disponibilidad').textContent = data.perfil.disponibilidad;
  if (document.getElementById('hero-rol-1')) document.getElementById('hero-rol-1').textContent = roleSegments[0] || data.perfil.rol;
  
  if (document.getElementById('hero-desc')) {
      document.getElementById('hero-desc').textContent = data.perfil.descripcion_corta;
  }

  if (document.getElementById('meta-ubicacion')) document.getElementById('meta-ubicacion').textContent = data.perfil.ubicacion;
  if (document.getElementById('meta-stack')) document.getElementById('meta-stack').textContent = data.perfil.stack;
  if (document.getElementById('meta-intereses')) document.getElementById('meta-intereses').textContent = data.perfil.intereses;

  if (document.getElementById('btn-cv')) document.getElementById('btn-cv').href = data.perfil.cv_url;

  const sidebarData = data.sidebar || {};
  if (document.getElementById('sidebar-kicker')) document.getElementById('sidebar-kicker').textContent = sidebarData.kicker || 'Resumen profesional';
  if (document.getElementById('sidebar-title')) document.getElementById('sidebar-title').textContent = sidebarData.titulo || 'Perfil tecnico orientado a backend';
  if (document.getElementById('sidebar-summary')) document.getElementById('sidebar-summary').textContent = sidebarData.resumen || '';
  const focusContainer = document.getElementById('sidebar-focus');
  if (focusContainer) {
    focusContainer.innerHTML = (sidebarData.foco || []).map(item => `<span class="focus-pill">${item}</span>`).join('');
  }

  // --- Sidebar Stats & Status ---
  const statsContainer = document.getElementById('sidebar-stats');
  if (statsContainer && data.stats) {
    statsContainer.innerHTML = data.stats.map(stat => `
      <div class="stat">
        <div class="k">${stat.k}</div>
        <div class="t">${stat.t}</div>
      </div>`).join('');
  }

  if (document.getElementById('sidebar-now')) document.getElementById('sidebar-now').textContent = data.now;
  if (document.getElementById('sidebar-busco')) document.getElementById('sidebar-busco').textContent = data.busco;

  // --- Links (Header, Sidebar, Contact, Footer) ---
  const linkGithub = data.links.github.url;
  const linkLinkedin = data.links.linkedin.url;
  const linkEmail = data.links.email.url;

  document.querySelectorAll('.link-github').forEach(el => el.href = linkGithub);
  document.querySelectorAll('.link-linkedin').forEach(el => el.href = linkLinkedin);
  document.querySelectorAll('.link-email').forEach(el => el.href = linkEmail);

  // --- Proyectos ---
  const projContainer = document.getElementById('projects-grid');
  if (projContainer && data.proyectos) {
    projContainer.innerHTML = '';
    data.proyectos.forEach((p, i) => {
      const tagsHtml = p.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
      const linksHtml = [
        p.repo_url ? `<a class="link" href="${p.repo_url}" target="_blank" rel="noopener">Codigo &rarr;</a>` : '',
        p.demo_url ? `<a class="link" href="${p.demo_url}" target="_blank" rel="noopener">Demo &rarr;</a>` : '',
      ].filter(Boolean).join('');
      projContainer.innerHTML += `
        <article class="project reveal" style="--i:${i}" data-tags="${p.tags.join(',')}">
          <div class="top">
            <h3>${p.titulo}</h3>
            <span class="badge">${p.badge}</span>
          </div>
          <p>${p.descripcion}</p>
          <div class="tags">${tagsHtml}</div>
          ${linksHtml ? `<div class="links">${linksHtml}</div>` : ''}
        </article>`;
    });

    const filterBar = document.getElementById('filter-bar');
    if (filterBar) {
      const allTags = [...new Set(data.proyectos.flatMap(p => p.tags))];
      filterBar.innerHTML = `<button class="filter-btn active" data-tag="all">Todos</button>` +
        allTags.map(tag => `<button class="filter-btn" data-tag="${tag}">${tag}</button>`).join('');
      filterBar.addEventListener('click', ev => {
        const btn = ev.target.closest('.filter-btn');
        if (!btn) return;
        filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tag = btn.dataset.tag;
        projContainer.querySelectorAll('.project').forEach(card => {
          const cardTags = card.dataset.tags.split(',');
          card.style.display = (tag === 'all' || cardTags.includes(tag)) ? '' : 'none';
        });
      });
    }
  }

  // --- Skills ---
  const skillsContainer = document.getElementById('skills-grid');
  if (skillsContainer && data.skills) {
    skillsContainer.innerHTML = '';
    data.skills.forEach(skillCat => {
      const chipsHtml = skillCat.items.map(item => `<span class="chip">${item}</span>`).join('');
      skillsContainer.innerHTML += `
        <div class="skill-card reveal">
          <h3>${skillCat.categoria}</h3>
          <div class="skill-list">
            ${chipsHtml}
          </div>
        </div>`;
    });
  }

  // --- Experiencia ---
  const expContainer = document.getElementById('experience-timeline');
  if (expContainer && data.experiencia) {
    expContainer.innerHTML = '';
    data.experiencia.forEach(exp => {
      expContainer.innerHTML += `
        <div class="tl-item reveal">
          <div class="tl-title">
            <strong>${exp.titulo}</strong>
            <span>${exp.fecha}</span>
          </div>
          <p class="tl-desc">${exp.descripcion}</p>
        </div>`;
    });
  }

  // --- Re-trigger Observer for dynamically injected .reveal elements ---
  setupObserver();

  // --- Contact Links ---
  const contactLinksContainer = document.getElementById('contact-links');
  if (contactLinksContainer) {
    const contactItems = [
      { label: 'Email', value: data.contacto.email, url: `mailto:${data.contacto.email}`, external: false },
      { label: 'LinkedIn', value: data.contacto.linkedin_path, url: data.links.linkedin.url, external: true },
      { label: 'GitHub', value: data.links.github.url.replace('https://', ''), url: data.links.github.url, external: true },
    ];
    contactLinksContainer.innerHTML = contactItems.map((item, i) => `
      <a class="contact-link-card reveal" style="--i:${i}" href="${item.url}"${item.external ? ' target="_blank" rel="noopener"' : ''}>
        <span class="cl-label">${item.label}</span>
        <span class="cl-value">${item.value}</span>
        <span class="cl-arrow">&rarr;</span>
      </a>`).join('');
  }
}
