/* ============================================================
   INSIGHT LEARNING — main.js
   Place this file in the SAME folder as your HTML files
   ============================================================ */

/* ── 1. NAVBAR scroll + hamburger ─────────────────────────── */
(function () {
  const navbar     = document.querySelector('.navbar');
  const hamburger  = document.querySelector('.nav-hamburger');
  const mobileNav  = document.querySelector('.nav-mobile');

  /* Scroll shadow */
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  /* Mobile toggle */
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      const [s1, , s3] = hamburger.querySelectorAll('span');
      hamburger.querySelectorAll('span')[1].style.opacity = open ? '0' : '1';
      s1.style.transform = open ? 'rotate(45deg) translate(5px, 5px)' : '';
      s3.style.transform = open ? 'rotate(-45deg) translate(5px, -5px)' : '';
    });

    /* Close on link click */
    mobileNav.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
      })
    );
  }

  /* Active link highlight */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === page) link.classList.add('active');
  });
})();


/* ── 2. SCROLL ANIMATIONS ─────────────────────────────────── */
(function () {
  const io = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
    { threshold: 0.1 }
  );
  document.querySelectorAll('.fade-up').forEach(el => io.observe(el));
})();


/* ── 3. COUNTER ANIMATION ─────────────────────────────────── */
(function () {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => io.observe(el));

  function animateCount(el) {
    const target   = parseInt(el.dataset.count, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 1800;
    const t0       = performance.now();

    (function tick(now) {
      const p = Math.min((now - t0) / duration, 1);
      const v = Math.floor((1 - Math.pow(1 - p, 3)) * target);
      el.textContent = v.toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
})();


/* ── 4. PROGRESS BARS ─────────────────────────────────────── */
(function () {
  const bars = document.querySelectorAll('.prog-bar[data-w]');
  if (!bars.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.w + '%';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(b => io.observe(b));
})();


/* ── 5. CONTACT FORM ──────────────────────────────────────── */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    /* Basic validation */
    const name  = form.querySelector('#name').value.trim();
    const phone = form.querySelector('#phone').value.trim();
    if (!name || !phone) {
      showToast('⚠️ Please fill in your name and phone number.', 'warn');
      return;
    }

    const btn  = form.querySelector('.btn-submit');
    const orig = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    /* Replace setTimeout with your real API (EmailJS, Formspree, etc.) */
    setTimeout(() => {
      showToast('✅ Message sent! We\'ll contact you within 24 hours.');
      form.reset();
      btn.textContent = orig;
      btn.disabled = false;
    }, 1400);
  });
})();


/* ── 6. TOAST NOTIFICATION ────────────────────────────────── */
function showToast(msg, type) {
  document.querySelector('.il-toast')?.remove();

  const t = document.createElement('div');
  t.className = 'il-toast';
  t.textContent = msg;
  Object.assign(t.style, {
    position: 'fixed',
    bottom: '100px',
    left: '50%',
    transform: 'translateX(-50%) translateY(16px)',
    background: type === 'warn' ? '#92400e' : '#0f2636',
    color: '#fff',
    padding: '13px 26px',
    borderRadius: '10px',
    fontFamily: "'Nunito', sans-serif",
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 8px 28px rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.1)',
    zIndex: '9999',
    opacity: '0',
    transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
    pointerEvents: 'none',
  });
  document.body.appendChild(t);

  requestAnimationFrame(() => {
    t.style.opacity = '1';
    t.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(16px)';
    setTimeout(() => t.remove(), 350);
  }, 4000);
}
