/* ============================================================
   CONFIG — cambia esta URL cuando despliegues el backend
   ============================================================ */
const API_URL = 'http://localhost:3001';

/* ============================================================
   NAVBAR — scroll + hamburger
   ============================================================ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

hamburger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   SCROLL ANIMATIONS — IntersectionObserver
   ============================================================ */
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      animObserver.unobserve(entry.target); // animate once
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

const animSelectors = [
  '.service-card',
  '.benefit-item',
  '.process-step',
  '.testimonial-card',
  '.about__content',
  '.about__image',
  '.appointment__info',
  '.appointment__form-wrapper',
  '.contact__info',
  '.contact__map',
  '.section-header',
];

animSelectors.forEach(sel => {
  document.querySelectorAll(sel).forEach(el => {
    el.classList.add('fade-up');
    animObserver.observe(el);
  });
});

/* ============================================================
   ACTIVE NAV LINK on scroll
   ============================================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.navbar__nav a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.35, rootMargin: '-80px 0px 0px 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ============================================================
   APPOINTMENT FORM
   ============================================================ */
const form       = document.getElementById('appointmentForm');
const submitBtn  = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');
const formError   = document.getElementById('formError');
const btnText     = submitBtn.querySelector('.btn-text');
const btnLoading  = submitBtn.querySelector('.btn-loading');

// Set min date to today
const dateInput = document.getElementById('fecha');
if (dateInput) {
  dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Show loading state
  btnText.style.display    = 'none';
  btnLoading.style.display = 'inline';
  submitBtn.disabled       = true;
  formSuccess.style.display = 'none';
  formError.style.display   = 'none';

  const data = Object.fromEntries(new FormData(form).entries());

  try {
    const res = await fetch(`${API_URL}/api/appointment`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    });

    if (res.ok) {
      formSuccess.style.display = 'flex';
      form.reset();
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      throw new Error('server_error');
    }
  } catch {
    formError.style.display = 'block';
  } finally {
    btnText.style.display    = 'inline';
    btnLoading.style.display = 'none';
    submitBtn.disabled       = false;
  }
});

/* ============================================================
   SERVICE CARDS — z-index on hover
   ============================================================ */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mouseenter', () => { card.style.zIndex = '10'; });
  card.addEventListener('mouseleave', () => { card.style.zIndex = ''; });
});
