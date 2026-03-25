/* =============================================
   KEUMAR SOLUÇÕES — JavaScript Principal
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ── AOS INIT ── */
  AOS.init({
    duration: 700,
    once: true,
    offset: 60,
    easing: 'ease-out-cubic'
  });

  /* ── NAVBAR: scroll state ── */
  const navbar = document.getElementById('navbar');

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load

  /* ── NAVBAR: active link ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a:not(.btn-nav)');

  const observerOptions = {
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  /* ── MOBILE MENU ── */
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  const openMenu = () => {
    navLinksContainer.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
    animateHamburger(true);
  };

  const closeMenu = () => {
    navLinksContainer.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
    animateHamburger(false);
  };

  const animateHamburger = (open) => {
    const spans = hamburger.querySelectorAll('span');
    if (open) {
      spans[0].style.cssText = 'transform: rotate(45deg) translate(5px, 5px)';
      spans[1].style.cssText = 'opacity: 0; transform: translateX(-8px)';
      spans[2].style.cssText = 'transform: rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => s.style.cssText = '');
    }
  };

  hamburger.addEventListener('click', () => {
    if (navLinksContainer.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', closeMenu);

  // Close menu when nav link is clicked
  navLinksContainer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ── SMOOTH SCROLL (fallback) ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 16;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── CONTACT FORM ── */
  const form = document.getElementById('contatoForm');
  const successMsg = document.getElementById('formSuccess');

  if (form) {
    // Phone mask
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
      telefoneInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 11) val = val.slice(0, 11);
        if (val.length > 10) {
          val = val.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        } else if (val.length > 6) {
          val = val.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
        } else if (val.length > 2) {
          val = val.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
        } else if (val.length > 0) {
          val = val.replace(/^(\d{0,2})$/, '($1');
        }
        e.target.value = val;
      });
    }

    // Form submission (frontend simulation)
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Loading state
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
      submitBtn.disabled = true;

      // Simulate submission delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Collect form data for WhatsApp redirect
      const nome = document.getElementById('nome').value;
      const empresa = document.getElementById('empresa').value;
      const email = document.getElementById('email').value;
      const telefone = document.getElementById('telefone').value;
      const servico = document.getElementById('servico').value;
      const mensagem = document.getElementById('mensagem').value;

      // Build WhatsApp message
      const servicoLabels = {
        'paineis-industriais': 'Painéis para Obras Industriais',
        'obras-comerciais': 'Obras Comerciais',
        'galpoes': 'Galpões Logísticos',
        'retrofit': 'Projetos de Retrofit',
        'consultoria': 'Projetos e Consultoria',
        'manutencao': 'Manutenção Preventiva',
        'automacao': 'Automação Industrial'
      };

      let waMsg = `*Novo contato pelo site — Keumar Soluções*\n\n`;
      waMsg += `*Nome:* ${nome}\n`;
      if (empresa) waMsg += `*Empresa:* ${empresa}\n`;
      waMsg += `*E-mail:* ${email}\n`;
      if (telefone) waMsg += `*Telefone:* ${telefone}\n`;
      if (servico) waMsg += `*Serviço:* ${servicoLabels[servico] || servico}\n`;
      waMsg += `\n*Mensagem:*\n${mensagem}`;

      // Show success
      submitBtn.innerHTML = '<i class="fas fa-check"></i> Mensagem Enviada!';
      submitBtn.style.background = '#22C55E';
      successMsg.classList.add('show');

      form.reset();

      // Reset button after 4s
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
        successMsg.classList.remove('show');
      }, 5000);
    });
  }

  /* ── COUNTERS ANIMATION ── */
  const counters = document.querySelectorAll('.stat-num');

  const animateCounter = (el) => {
    const text = el.textContent.trim();
    const match = text.match(/^(\d+)(.*)$/);
    if (!match) return;

    const target = parseInt(match[1]);
    const suffix = match[2];
    const duration = 1800;
    const start = performance.now();

    const update = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  /* ── ACTIVE NAV STYLE ── */
  const style = document.createElement('style');
  style.textContent = `
    .nav-links a.active:not(.btn-nav) {
      color: var(--navy) !important;
      font-weight: 700;
    }
    .nav-links a.active:not(.btn-nav)::after {
      transform: scaleX(1) !important;
    }
    .navbar:not(.scrolled) .nav-links a.active:not(.btn-nav) {
      color: #fff !important;
    }
  `;
  document.head.appendChild(style);

  /* ── SCROLL PROGRESS BAR ── */
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 3px;
    background: linear-gradient(90deg, #F5C84A, #1B2D5B);
    z-index: 9999;
    width: 0%;
    transition: width 0.1s linear;
  `;
  document.body.prepend(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
  }, { passive: true });

});
