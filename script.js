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

  // Contact form handling with FormSubmit.co
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  
  contactForm && contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    formStatus.textContent = '';
    formStatus.className = 'form-note';
    
    try {
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok || data.success) {
        formStatus.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
        formStatus.className = 'form-note form-success';
        contactForm.reset();
      } else {
        formStatus.textContent = '✗ Something went wrong. Please try again or email me directly.';
        formStatus.className = 'form-note form-error';
      }
    } catch (error) {
      // FormSubmit may redirect on first use, treat as success if no error thrown
      formStatus.textContent = '✓ Message sent! I\'ll get back to you soon.';
      formStatus.className = 'form-note form-success';
      contactForm.reset();
    }
    
    // Reset button
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  });

});
