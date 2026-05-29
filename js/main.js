// Navbar scroll effect
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (nav) {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }
});

// Hamburger menu with animation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });
  
  // Handle dropdown in mobile
  document.querySelectorAll('.nav-links > li > a').forEach(link => {
    if (link.nextElementSibling && link.nextElementSibling.classList.contains('dropdown')) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 900) {
          e.preventDefault();
          const parent = link.parentElement;
          parent.classList.toggle('dropdown-open');
        }
      });
    }
  });
  
  // Close menu when clicking on a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      // Only close if it's not a dropdown parent or if clicking dropdown item
      if (!link.nextElementSibling || link.parentElement.parentElement.classList.contains('dropdown')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  });
}

// Active nav link based on current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const linkPage = link.getAttribute('href').split('/').pop();
  if (linkPage === currentPage) link.classList.add('active');
});

// Scroll animation (Intersection Observer)
const observerOpts = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOpts);

document.querySelectorAll('.highlight-card, .place-card, .hotel-card, .season-card, .reach-card, .tip-card, .lp-card, .ls-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Snowflakes for hero (only on home page)
const snowContainer = document.querySelector('.snowflakes');
if (snowContainer) {
  const flakes = ['❄', '❅', '❆', '*', '·'];
  for (let i = 0; i < 18; i++) {
    const f = document.createElement('div');
    f.className = 'snowflake';
    f.textContent = flakes[Math.floor(Math.random() * flakes.length)];
    f.style.left = Math.random() * 100 + 'vw';
    f.style.fontSize = (Math.random() * 14 + 8) + 'px';
    f.style.animationDuration = (Math.random() * 8 + 6) + 's';
    f.style.animationDelay = (Math.random() * 5) + 's';
    f.style.opacity = (Math.random() * 0.5 + 0.2);
    snowContainer.appendChild(f);
  }
}

// Contact form
const form = document.querySelector('.contact-form form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    btn.textContent = '✓ Message Sent!';
    btn.style.background = '#27ae60';
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
}
