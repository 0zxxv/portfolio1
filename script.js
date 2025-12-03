// Basic interactive behaviors: mobile nav, active nav on scroll, reveal on scroll, simple form action
document.addEventListener('DOMContentLoaded', () => {
  // set year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  navToggle && navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    navToggle.classList.toggle('open');
  });

  // Smooth active link highlight
  const links = document.querySelectorAll('.nav-link');
  const sections = Array.from(document.querySelectorAll('main section'));

  function updateActiveLink(){
    const y = window.scrollY + 120;
    let current = sections[0];
    sections.forEach(sec => {
      if (sec.offsetTop <= y) current = sec;
    });
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${current.id}`));
  }

  // IntersectionObserver for reveal animations
  const revealElems = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('active');
        // optional: unobserve if you only want reveal once
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});

  revealElems.forEach(el => observer.observe(el));

  // Update active nav on scroll (throttle)
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  }, {passive: true});
  // run once
  updateActiveLink();

  // Simple contact form handling (demo)
  const contactForm = document.getElementById('contactForm');
  contactForm && contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactForm.name.value.trim();
    // show a simple confirmation
    alert(`Thanks ${name || 'there'}! This demo form doesn't send an email. Replace with your own backend or a form service (Formspree, Netlify Forms, etc.).`);
    contactForm.reset();
  });

});
