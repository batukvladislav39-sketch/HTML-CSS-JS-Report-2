"use strict";
 
const header = document.querySelector('#header');
const goTop  = document.querySelector('#goTop');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
  const heroHeight = document.querySelector('#home').offsetHeight;
  goTop.classList.toggle('visible', window.scrollY > heroHeight);
});

goTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const burger       = document.querySelector('#burger');
const drawer       = document.querySelector('#drawer');
const drawerOverlay = document.querySelector('#drawerOverlay');

function openDrawer() {
  drawer.classList.add('open');
  drawerOverlay.classList.add('open');
  burger.classList.add('open');
  burger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  drawer.classList.remove('open');
  drawerOverlay.classList.remove('open');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

burger.addEventListener('click', () => {
  drawer.classList.contains('open') ? closeDrawer() : openDrawer();
});
document.querySelector('#drawerOverlay').addEventListener('click', closeDrawer);
document.querySelector('#drawerClose').addEventListener('click', closeDrawer);
document.querySelectorAll('#drawer a').forEach(link => link.addEventListener('click', closeDrawer));

const modalOverlay = document.querySelector('#modalOverlay');

function openModal() {
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-modal-open]').forEach(btn => btn.addEventListener('click', openModal));
document.querySelector('#closeModal').addEventListener('click', closeModal);
document.querySelector('#modalOverlay').addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

const form = document.querySelector('#contactForm');
form.addEventListener('submit', e => {
  e.preventDefault();
  const nameEl   = document.querySelector('#name');
  const emailEl  = document.querySelector('#email');
  const nameErr  = document.querySelector('#nameError');
  const emailErr = document.querySelector('#emailError');
  let valid = true;

  [nameEl, emailEl].forEach(el => el.classList.remove('error'));
  [nameErr, emailErr].forEach(el => el.classList.remove('show'));

  if (!nameEl.value.trim()) {
    nameEl.classList.add('error');
    nameErr.classList.add('show');
    valid = false;
  }

  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(emailEl.value.trim())) {
    emailEl.classList.add('error');
    emailErr.classList.add('show');
    valid = false;
  }

  if (valid) {
    form.innerHTML = `
      <div style="text-align:center;padding:20px 0;">
        <div style="font-size:2.5rem;margin-bottom:16px;">🚀</div>
        <p style="font-family:var(--ff-display);font-size:1rem;margin-bottom:8px;">Дякуємо!</p>
        <p style="color:var(--clr-text-muted);font-size:.85rem;">Ми зв'яжемося з вами найближчим часом.</p>
      </div>`;
    setTimeout(closeModal, 2800);
  }
});

const cookieBar = document.querySelector('#cookieBar');
if (!localStorage.getItem('cookie_accepted')) {
  setTimeout(() => cookieBar.classList.add('visible'), 1500);
}
document.querySelector('#cookieAccept').addEventListener('click', () => {
  localStorage.setItem('cookie_accepted', 'true');
  cookieBar.classList.remove('visible');
});
document.querySelector('#cookieDecline').addEventListener('click', () => {
  localStorage.setItem('cookie_accepted', 'declined');
  cookieBar.classList.remove('visible');
});

const eventDate = new Date('2026-03-20T00:00:00');
function updateTimer() {
  const diff = eventDate - new Date();
  if (diff <= 0) return;
  document.querySelector('#timerDays').textContent  = String(Math.floor(diff / 86400000)).padStart(2, '0');
  document.querySelector('#timerHours').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
  document.querySelector('#timerMins').textContent  = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
  document.querySelector('#timerSecs').textContent  = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
}
updateTimer();
setInterval(updateTimer, 1000);

const track       = document.querySelector('#sliderTrack');
const slides      = document.querySelectorAll('.slide');
const dotsContainer = document.querySelector('#sliderDots');
let currentSlide  = 0;
const totalSlides = slides.length;

slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'slider__dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', 'Слайд ' + (i + 1));
  dot.setAttribute('role', 'tab');
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});

function goToSlide(n) {
  currentSlide = (n + totalSlides) % totalSlides;
  track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
  document.querySelectorAll('.slider__dot').forEach((d, i) =>
    d.classList.toggle('active', i === currentSlide)
  );
}

document.querySelector('#sliderPrev').addEventListener('click', () => goToSlide(currentSlide - 1));
document.querySelector('#sliderNext').addEventListener('click', () => goToSlide(currentSlide + 1));

let autoSlide = setInterval(() => goToSlide(currentSlide + 1), 4500);
track.parentElement.addEventListener('mouseenter', () => clearInterval(autoSlide));
track.parentElement.addEventListener('mouseleave', () => {
  autoSlide = setInterval(() => goToSlide(currentSlide + 1), 4500);
});

let touchStartX = 0;
track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
});

const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 100);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObserver.observe(el));