/**
 * Minimal client-side JavaScript for Attirer Grandeur
 * Only used for enhanced interactions - site works without JS
 */

(function() {
  'use strict';

  /**
   * Enhanced smooth scrolling for anchor links
   * (Respects prefers-reduced-motion)
   */
  function initSmoothScroll() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          // Update URL without jumping
          if (history.pushState) {
            history.pushState(null, null, href);
          }
        }
      });
    });
  }

  /**
   * Pause artist strip animation on hover
   * (Respects prefers-reduced-motion)
   */
  function initArtistStripControls() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const artistStrip = document.querySelector('.artist-strip-track');
    if (!artistStrip) return;

    artistStrip.addEventListener('mouseenter', function() {
      this.style.animationPlayState = 'paused';
    });

    artistStrip.addEventListener('mouseleave', function() {
      this.style.animationPlayState = 'running';
    });
  }

  /**
   * Add visual feedback for external links
   */
  function initExternalLinks() {
    const externalLinks = document.querySelectorAll('a[target="_blank"]');

    externalLinks.forEach(link => {
      // Add aria-label if not present
      if (!link.getAttribute('aria-label')) {
        const text = link.textContent.trim();
        link.setAttribute('aria-label', `${text} (opens in new tab)`);
      }
    });
  }

  /**
   * Add loading state to buttons
   */
  function initButtonFeedback() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
      button.addEventListener('click', function() {
        this.style.opacity = '0.7';
        setTimeout(() => {
          this.style.opacity = '1';
        }, 300);
      });
    });
  }

  /**
   * Lazy load images with Intersection Observer
   */
  function initLazyLoading() {
    if (!('IntersectionObserver' in window)) return;

    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  /**
   * Hide scroll arrow when user scrolls
   */
  function initScrollArrow() {
    const scrollArrow = document.getElementById('scrollArrow');
    if (!scrollArrow) return; // Only run on pages with scroll arrow

    let hasScrolled = false;

    function hideArrow() {
      if (!hasScrolled && window.scrollY > 50) {
        hasScrolled = true;
        scrollArrow.classList.add('hidden');
        // Remove listener after first scroll
        window.removeEventListener('scroll', hideArrow);
      }
    }

    window.addEventListener('scroll', hideArrow, { passive: true });
  }

  /**
   * Initialize all enhancements when DOM is ready
   */
  function init() {
    initSmoothScroll();
    initArtistStripControls();
    initExternalLinks();
    initButtonFeedback();
    initLazyLoading();
    initScrollArrow();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Log for debugging (remove in production)
  console.log('✨ Attirer Grandeur — Site initialized');
})();
