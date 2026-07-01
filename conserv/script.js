// ============================================
// Conserv — Scroll animations & stepping stones
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- Elements ---
  const glassCases = document.querySelectorAll('.glass-case');
  const stones = document.querySelectorAll('.stone');
  const stoneNav = document.querySelector('.stones');

  // --- IntersectionObserver for glass cases ---
  if ('IntersectionObserver' in window) {
    const caseObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Don't unobserve — we want them to stay visible
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    glassCases.forEach((el) => caseObserver.observe(el));
  } else {
    // Fallback: show all cases immediately
    glassCases.forEach((el) => el.classList.add('visible'));
  }

  // --- Active section tracking for stepping stones ---
  const sectionIds = ['entry', 'restore', 'breathe', 'calm', 'immune', 'sleep', 'exit'];

  function updateStones() {
    let currentSection = 'entry';
    const viewportH = window.innerHeight;

    // Track elements by ID — works for both .section containers and
    // nested product cards (restore/breathe/calm/immune/sleep)
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;

      // Active when element's midpoint is in the upper 70% of the viewport
      if (midY < viewportH * 0.7 && midY > -viewportH * 0.3) {
        currentSection = id;
      }
    });

    stones.forEach((stone) => {
      const sectionId = stone.getAttribute('data-section');
      stone.classList.toggle('active', sectionId === currentSection);
    });
  }

  // --- Throttled scroll handler ---
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateStones();
        ticking = false;
      });
      ticking = true;
    }
  });

  // --- Stone click navigation ---
  stones.forEach((stone) => {
    stone.addEventListener('click', () => {
      const sectionId = stone.getAttribute('data-section');
      const target = document.getElementById(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // --- Scroll-hint auto-hide when past entry ---
  const scrollHint = document.querySelector('.scroll-hint');
  const entrySection = document.getElementById('entry');

  if (scrollHint && entrySection && 'IntersectionObserver' in window) {
    const hintObserver = new IntersectionObserver(
      ([entry]) => {
        scrollHint.classList.toggle('hint-hidden', !entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
    );
    hintObserver.observe(entrySection);
  }

  // --- Initial state ---
  updateStones();

  // --- Update on resize ---
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateStones, 100);
  });
});

// --- Demo badge: hide when embedded in iframe ---
(function() {
  'use strict';
  var params = new URLSearchParams(window.location.search);
  var inIframe = params.has('embed');
  if (!inIframe) {
    try { inIframe = window.self !== window.top; }
    catch(e) { inIframe = true; }
  }
  if (inIframe) {
    var badge = document.getElementById('demo-badge');
    if (badge) badge.remove();
  } else {
    // Reveal badge with a 1s delay
    setTimeout(function() {
      var badge = document.getElementById('demo-badge');
      if (badge) badge.classList.add('visible');
    }, 1000);
  }
})();
