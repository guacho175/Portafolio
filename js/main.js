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
  
  if (document.getElementById('hero-disponibilidad')) document.getElementById('hero-disponibilidad').textContent = data.perfil.disponibilidad;
  if (document.getElementById('hero-rol-1')) document.getElementById('hero-rol-1').textContent = data.perfil.rol.split('·')[0].trim();
  if (document.getElementById('hero-rol-sidebar')) document.getElementById('hero-rol-sidebar').textContent = data.perfil.rol;
  
  // Format short description using a trick to replace \n with <br/> or keeping as a block
  if (document.getElementById('hero-desc')) {
      document.getElementById('hero-desc').innerHTML = data.perfil.descripcion_corta.replace(/\n/g, "<br/>");
  }

  if (document.getElementById('meta-ubicacion')) document.getElementById('meta-ubicacion').textContent = data.perfil.ubicacion;
  if (document.getElementById('meta-stack')) document.getElementById('meta-stack').textContent = data.perfil.stack;
  if (document.getElementById('meta-intereses')) document.getElementById('meta-intereses').textContent = data.perfil.intereses;

  if (document.getElementById('btn-cv')) document.getElementById('btn-cv').href = data.perfil.cv_url;

  // --- Sidebar Stats & Status ---
  const statsContainer = document.getElementById('sidebar-stats');
  if (statsContainer && data.stats) {
    statsContainer.innerHTML = '';
    data.stats.forEach(stat => {
      statsContainer.innerHTML += `
        <div class="stat">
          <div class="k">${stat.k}</div>
          <div class="t">${stat.t}</div>
        </div>`;
    });
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
    data.proyectos.forEach(p => {
      const tagsHtml = p.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
      projContainer.innerHTML += `
        <article class="project reveal">
          <div class="top">
            <h3>${p.titulo}</h3>
            <span class="badge">${p.badge}</span>
          </div>
          <p>${p.descripcion}</p>
          <div class="tags">
            ${tagsHtml}
          </div>
        </article>`;
    });
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

  // --- Setup Contact Form Action ---
  const forms = document.getElementById("contactForm");
  const finalEmail = data.contacto.email;
  
  if (document.getElementById('contact-email-tag')) {
      document.getElementById('contact-email-tag').textContent = `📧 ${finalEmail}`;
  }
  if (document.getElementById('contact-linkedin-tag')) {
      document.getElementById('contact-linkedin-tag').textContent = `🔗 LinkedIn: ${data.contacto.linkedin_path}`;
  }

  if (forms) {
    forms.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const name = encodeURIComponent(document.getElementById("name").value.trim());
      const email = encodeURIComponent(document.getElementById("email").value.trim());
      const subject = encodeURIComponent(document.getElementById("subject").value.trim());
      const message = encodeURIComponent(document.getElementById("message").value.trim());

      const body = `Nombre: ${name}%0AEmail: ${email}%0A%0A${message}`;
      window.location.href = `mailto:${finalEmail}?subject=${subject}&body=${body}`;
    });
  }
}
