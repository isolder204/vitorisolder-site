// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Mobile menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const menuIcon = document.getElementById('menuIcon');
hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuIcon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  document.body.style.overflow = open ? 'hidden' : '';
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuIcon.className = 'fa-solid fa-bars';
    document.body.style.overflow = '';
  });
});

// Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + tab).classList.add('active');
  });
});

// WhatsApp float
const waBtn = document.getElementById('waBtn');
const waMenu = document.getElementById('waMenu');
const waIco = document.getElementById('waIco');
const waX = document.getElementById('waX');
if (waBtn) {
  waBtn.addEventListener('click', () => {
    const open = waMenu.classList.toggle('open');
    waIco.style.display = open ? 'none' : '';
    waX.style.display = open ? '' : 'none';
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.wa-wrap')) {
      waMenu.classList.remove('open');
      waIco.style.display = '';
      waX.style.display = 'none';
    }
  });
}

// Scroll reveal — elementos ficam visíveis por padrão,
// só recebem animação se o browser suportar IntersectionObserver
if ('IntersectionObserver' in window) {
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach(el => el.classList.add('hidden'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.remove('hidden');
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  reveals.forEach(el => observer.observe(el));
}

// Reviews carousel
(function() {
  const track = document.getElementById('reviewsTrack');
  const prevBtn = document.getElementById('prevReview');
  const nextBtn = document.getElementById('nextReview');
  const dotsWrap = document.getElementById('reviewDots');
  if (!track) return;

  const cards = track.querySelectorAll('.review-card');
  const total = cards.length;
  let current = 0;
  let autoTimer;

  // Build dots
  cards.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Avaliação ' + (i + 1));
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  });

  function getCardWidth() {
    return cards[0].getBoundingClientRect().width + 20; // card + gap
  }

  function updateDots() {
    dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(idx) {
    current = ((idx % total) + total) % total;
    track.scrollTo({ left: current * getCardWidth(), behavior: 'smooth' });
    updateDots();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  nextBtn.addEventListener('click', () => { next(); resetAuto(); });
  prevBtn.addEventListener('click', () => { prev(); resetAuto(); });

  // Auto-advance every 4s
  function startAuto() { autoTimer = setInterval(next, 4000); }
  function resetAuto() { clearInterval(autoTimer); startAuto(); }
  startAuto();

  // Sync dot when user manually drags/scrolls
  track.addEventListener('scroll', () => {
    const idx = Math.round(track.scrollLeft / getCardWidth());
    if (idx !== current) { current = idx; updateDots(); }
  }, { passive: true });

  // Drag support
  let startX, startScroll, dragging = false;
  track.addEventListener('mousedown', e => {
    dragging = true; startX = e.pageX; startScroll = track.scrollLeft;
    clearInterval(autoTimer);
  });
  track.addEventListener('mousemove', e => {
    if (!dragging) return;
    track.scrollLeft = startScroll - (e.pageX - startX);
  });
  track.addEventListener('mouseup', () => { dragging = false; resetAuto(); });
  track.addEventListener('mouseleave', () => { if (dragging) { dragging = false; resetAuto(); } });
})();

// Photo carousel — drag + dots
(function() {
  const track = document.getElementById('photoTrack');
  const dotsWrap = document.getElementById('photoDots');
  if (!track || !dotsWrap) return;

  const slides = track.querySelectorAll('.photo-slide');
  const total = slides.length;

  // Build dots
  slides.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'photo-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => {
      track.scrollTo({ left: slides[i].offsetLeft, behavior: 'smooth' });
    });
    dotsWrap.appendChild(d);
  });

  function updateDots() {
    const slideW = slides[0] ? slides[0].offsetWidth + 16 : 1;
    const idx = Math.min(Math.round(track.scrollLeft / slideW), total - 1);
    dotsWrap.querySelectorAll('.photo-dot').forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });
  }

  track.addEventListener('scroll', updateDots, { passive: true });

  // Drag support
  let startX, startScroll, dragging = false;
  track.addEventListener('mousedown', e => { dragging = true; startX = e.pageX; startScroll = track.scrollLeft; track.style.scrollSnapType = 'none'; });
  track.addEventListener('mousemove', e => { if (!dragging) return; track.scrollLeft = startScroll - (e.pageX - startX); });
  track.addEventListener('mouseup', () => { dragging = false; track.style.scrollSnapType = 'x mandatory'; updateDots(); });
  track.addEventListener('mouseleave', () => { if (dragging) { dragging = false; track.style.scrollSnapType = 'x mandatory'; } });
})();

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});
