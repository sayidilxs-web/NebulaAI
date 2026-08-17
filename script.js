// ======================================
// Nebula AI - Interactions & Animations
// ======================================

// --- Header scroll effect ---
const header = document.getElementById('header');

function handleHeaderScroll() {
  if (window.scrollY > 30) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleHeaderScroll);
handleHeaderScroll();

// --- Mobile navigation toggle ---
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');

mobileToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile menu when a link is clicked
navLinks.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    navLinks.classList.remove('open');
  }
});

// --- Reveal on scroll ---
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach((el) => revealObserver.observe(el));

// --- Animated counters ---
const counters = document.querySelectorAll('.stat-number');

const runCounter = (counter) => {
  const target = Number(counter.dataset.target);
  const duration = 2000;
  const startTime = performance.now();

  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    const current = Math.floor(eased * target);

    // Format with commas for large numbers
    counter.textContent = current.toLocaleString('en-US');

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      counter.textContent = target.toLocaleString('en-US');
    }
  };

  requestAnimationFrame(update);
};

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);

counters.forEach((counter) => counterObserver.observe(counter));

// --- Dashboard chart bars animate on load ---
const bars = document.querySelectorAll('.chart-bars span');
window.addEventListener('load', () => {
  bars.forEach((bar, index) => {
    setTimeout(() => {
      bar.style.opacity = '1';
      bar.style.transform = 'translateY(0)';
    }, index * 80);
  });
});

// Set initial state for bars
bars.forEach((bar) => {
  bar.style.opacity = '0.2';
  bar.style.transform = 'translateY(20px)';
  bar.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

// --- Add hover glow to logo ---
document.querySelectorAll('.logo').forEach((logo) => {
  logo.addEventListener('mouseenter', () => {
    logo.querySelector('.logo-icon').style.animation = 'logoGlow 0.6s ease';
  });
  logo.addEventListener('animationend', (e) => {
    if (e.target.classList.contains('logo-icon')) {
      e.target.style.animation = '';
    }
  });
});

// Inject logo glow keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes logoGlow {
    0% { box-shadow: 0 4px 16px rgba(109, 94, 240, 0.4); }
    50% { box-shadow: 0 4px 32px rgba(34, 211, 238, 0.7); }
    100% { box-shadow: 0 4px 16px rgba(109, 94, 240, 0.4); }
  }
`;
document.head.appendChild(style);

// --- Smooth scroll for all anchor links ---
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// --- Simple 3D tilt effect for dashboard mockup (desktop only) ---
const dashboard = document.querySelector('.dashboard-mockup');
if (dashboard && window.matchMedia('(hover: hover)').matches) {
  dashboard.addEventListener('mousemove', (e) => {
    const rect = dashboard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    dashboard.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${y * -6}deg) translateY(-4px)`;
  });

  dashboard.addEventListener('mouseleave', () => {
    dashboard.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateY(0)';
    dashboard.style.transition = 'transform 0.4s ease';
  });

  dashboard.addEventListener('mouseenter', () => {
    dashboard.style.transition = 'transform 0.1s ease';
  });
}
