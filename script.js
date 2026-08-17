/* ============================================================
   NEXUSAI — Interactive behavior
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initTypingEffect();
  initReveal();
  initPricingToggle();
  initFAQ();
  initFooterYear();
  initActiveNav();
});

/* ---------- Navbar scroll state ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- Mobile menu ---------- */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (!menuToggle || !navLinks) return;

  const closeMenu = () => {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };

  const toggleMenu = () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('no-scroll', isOpen);
  };

  menuToggle.addEventListener('click', toggleMenu);

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });
}

/* ---------- Hero terminal typing effect ---------- */
function initTypingEffect() {
  const typeElement = document.getElementById('typeEffect');
  if (!typeElement) return;

  const lines = [
    '✓ Analyzing 1.2M events…',
    '✓ Insight extracted: Churn risk ↓ 18%',
    '✓ Recommendation: Re-engage segment B',
    '✓ Pipeline complete in 0.42s',
  ];

  let lineIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const baseSpeed = 30;

  // Start after page load
  setTimeout(type, 1200);

  function type() {
    const currentLine = lines[lineIndex];
    const visibleLine = currentLine.slice(0, charIndex);
    typeElement.textContent = visibleLine;

    // If not deleting, type a character; otherwise wait and delete
    if (!isDeleting) {
      charIndex++;
      if (charIndex > currentLine.length) {
        isDeleting = true;
        setTimeout(type, 1800); // pause at end
        return;
      }
    } else {
      charIndex--;
      if (charIndex < 0) {
        isDeleting = false;
        lineIndex = (lineIndex + 1) % lines.length;
        charIndex = 0;
        setTimeout(type, 400); // small pause before next line
        return;
      }
    }

    setTimeout(type, baseSpeed + Math.random() * 20);
  }
}

/* ---------- Scroll reveal animation ---------- */
function initReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* ---------- Pricing monthly/yearly toggle ---------- */
function initPricingToggle() {
  const toggle = document.getElementById('billingToggle');
  const monthlyLabel = document.getElementById('monthlyLabel');
  const yearlyLabel = document.getElementById('yearlyLabel');
  const amounts = document.querySelectorAll('.price-card__amount');

  if (!toggle || !amounts.length) return;

  const updatePricing = () => {
    const isYearly = toggle.checked;

    // Update toggle label states
    monthlyLabel.classList.toggle('pricing__toggle-label--active', !isYearly);
    yearlyLabel.classList.toggle('pricing__toggle-label--active', isYearly);

    // Animate amount change
    amounts.forEach((amount) => {
      const monthly = parseFloat(amount.dataset.monthly);
      const yearly = parseFloat(amount.dataset.yearly);
      const target = isYearly ? yearly : monthly;

      // Only animate if values actually differ (not both zero)
      if (target !== parseFloat(amount.textContent)) {
        animateNumber(amount, target, 350);
      }
    });
  };

  toggle.addEventListener('change', updatePricing);
}

function animateNumber(element, target, duration) {
  const start = parseFloat(element.textContent) || 0;
  const startTime = performance.now();

  function frame(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    const current = start + (target - start) * eased;
    element.textContent = Math.round(current);
    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      element.textContent = target;
    }
  }

  requestAnimationFrame(frame);
}

/* ---------- FAQ accordion ---------- */
function initFAQ() {
  const items = document.querySelectorAll('.faq__item');

  items.forEach((item) => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all items
      items.forEach((other) => {
        other.classList.remove('open');
        other.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      });

      // Toggle the clicked one
      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ---------- Footer year ---------- */
function initFooterYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/* ---------- Active nav link on scroll ---------- */
function initActiveNav() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-links__link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    {
      rootMargin: '-40% 0px -50% 0px',
    }
  );

  sections.forEach((section) => observer.observe(section));
}
