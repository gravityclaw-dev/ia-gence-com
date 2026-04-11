/* ============================================
   IAGENCE FLUX v2 — INTERACTIONS
   Awwwards-Level • Industrial Flow
   ============================================ */

(function() {
  'use strict';

  // ===== CALCULATOR =====
  function updateCalc() {
    var nb = parseFloat(document.getElementById('nb-slider').value);
    var h = parseFloat(document.getElementById('h-slider').value);
    var taux = parseFloat(document.getElementById('taux-slider').value);

    var heuresAn = nb * h * 5 * 48;
    var perteAn = heuresAn * taux;
    var caPotentiel = Math.round(perteAn * 0.5);

    var perteFormatted = Math.round(perteAn).toLocaleString('fr-FR') + ' €';
    var heuresFormatted = heuresAn.toLocaleString('fr-FR') + ' h';
    var caFormatted = '+' + caPotentiel.toLocaleString('fr-FR') + ' €';

    document.getElementById('nb-display').textContent = nb;
    document.getElementById('h-display').textContent = h + 'h';
    document.getElementById('taux-display').textContent = taux + '€';

    document.getElementById('total-display').textContent = perteFormatted;
    document.getElementById('bd-heures').textContent = heuresFormatted;
    document.getElementById('bd-taux').textContent = taux + ' €/h';
    document.getElementById('bd-ca').textContent = caFormatted;
    document.getElementById('perte-span').textContent = perteFormatted;
  }

  document.getElementById('nb-slider').addEventListener('input', updateCalc);
  document.getElementById('h-slider').addEventListener('input', updateCalc);
  document.getElementById('taux-slider').addEventListener('input', updateCalc);
  updateCalc();

  // ===== EMAIL CAPTURE =====
  window.submitCalcEmail = function() {
    var email = document.getElementById('calc-email').value;
    if (!email || !email.includes('@')) {
      document.getElementById('calc-email').classList.add('error');
      return;
    }
    document.getElementById('calc-email').classList.remove('error');
    document.getElementById('calc-capture-form').style.display = 'none';
    document.getElementById('calc-thanks').style.display = 'block';

    // Trigger Cal.com
    if (window.Cal) {
      window.Cal('open', { calLink: 'pierre-andrieux-iagence/diagnostic-15-min' });
    }
  };

  // ===== SOLUTIONS TABS =====
  var tabs = document.querySelectorAll('.tab-glow');
  var panels = document.querySelectorAll('.axes-panel');
  var indicator = document.getElementById('tabIndicator');

  function updateTabIndicator() {
    var active = document.querySelector('.tab-glow[aria-selected="true"]');
    if (active && indicator) {
      indicator.style.left = active.offsetLeft + 'px';
      indicator.style.width = active.offsetWidth + 'px';
    }
  }

  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      var panelId = this.getAttribute('data-panel');

      tabs.forEach(function(t) { t.setAttribute('aria-selected', 'false'); });
      this.setAttribute('aria-selected', 'true');

      panels.forEach(function(p) { p.classList.remove('active'); p.style.display = 'none'; });
      var targetPanel = document.getElementById('panel-' + panelId);
      if (targetPanel) {
        targetPanel.classList.add('active');
        targetPanel.style.display = 'block';
      }

      updateTabIndicator();
    });
  });

  // Initial indicator
  requestAnimationFrame(updateTabIndicator);
  window.addEventListener('resize', updateTabIndicator);

  // ===== NAV SCROLL =====
  var topNav = document.getElementById('topNav');
  var lastScrollY = 0;
  window.addEventListener('scroll', function() {
    if (Math.abs(window.scrollY - lastScrollY) < 2) return;
    lastScrollY = window.scrollY;
    if (topNav) {
      topNav.classList.toggle('scrolled', window.scrollY > 100);
    }
  }, { passive: true });

  // ===== MOBILE NAV =====
  window.openMobileNav = function() {
    document.getElementById('mobile-nav').classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  window.closeMobileNav = function() {
    document.getElementById('mobile-nav').classList.remove('open');
    document.body.style.overflow = '';
  };

  // ===== SCROLL REVEAL =====
  var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(function(el) {
    revealObserver.observe(el);
  });

  // ===== SECTION DOTS =====
  var sections = document.querySelectorAll('.full-section');
  var dots = document.querySelectorAll('.section-dot');

  var sectionObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
        var index = Array.from(sections).indexOf(entry.target);
        dots.forEach(function(d) { d.classList.remove('active'); });
        if (dots[index]) dots[index].classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(function(s) { sectionObserver.observe(s); });

  dots.forEach(function(dot) {
    dot.addEventListener('click', function() {
      var index = parseInt(this.getAttribute('data-section'));
      if (sections[index]) {
        sections[index].scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ===== CURSOR SPOTLIGHT =====
  var spotlight = document.getElementById('cursorSpotlight');
  if (spotlight) {
    var mouseX = 0, mouseY = 0, spotX = 0, spotY = 0;
    var lastBrightnessCheck = 0;

    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function animateSpotlight() {
      spotX += (mouseX - spotX) * 0.1;
      spotY += (mouseY - spotY) * 0.1;
      spotlight.style.left = spotX + 'px';
      spotlight.style.top = spotY + 'px';

      var now = performance.now();
      if (now - lastBrightnessCheck > 100) {
        lastBrightnessCheck = now;
        var checkX = mouseX + 20;
        var checkY = mouseY + 20;
        var el = document.elementFromPoint(checkX, checkY);
        if (el) {
          var bg = window.getComputedStyle(el).backgroundColor;
          var match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          if (match) {
            var r = parseInt(match[1]), g = parseInt(match[2]), b = parseInt(match[3]);
            var brightness = (r * 299 + g * 587 + b * 114) / 1000;
            spotlight.className = brightness < 128
              ? 'cursor-spotlight cursor-spotlight-dark'
              : 'cursor-spotlight cursor-spotlight-light';
          }
        }
      }
      requestAnimationFrame(animateSpotlight);
    }
    animateSpotlight();
  }

  // ===== CANVAS MESH GRADIENT (shared) =====
  function initMeshGradient(canvasId, blobs) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    var ctx = canvas.getContext('2d');
    var animId = null;
    var isVisible = false;

    function resize() {
      var dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', resize);

    function draw() {
      if (!isVisible) return;
      var w = canvas.offsetWidth;
      var h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      blobs.forEach(function(b) {
        b.x += b.vx; b.y += b.vy;
        if (b.x < -0.2 || b.x > 1.2) b.vx *= -1;
        if (b.y < -0.2 || b.y > 1.2) b.vy *= -1;
        var g = ctx.createRadialGradient(b.x * w, b.y * h, 0, b.x * w, b.y * h, b.r);
        g.addColorStop(0, b.color);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      });
      animId = requestAnimationFrame(draw);
    }

    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        isVisible = entry.isIntersecting;
        if (isVisible && !animId) { draw(); }
        else if (!isVisible && animId) { cancelAnimationFrame(animId); animId = null; }
      });
    }, { threshold: 0.05 });
    obs.observe(canvas);

    var rect = canvas.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      isVisible = true; draw();
    }

    return { canvas: canvas, ctx: ctx, observer: obs };
  }

  // Hero canvas
  initMeshGradient('heroCanvas', [
    { x: 0.3, y: 0.4, r: 300, color: 'rgba(255,92,0,0.15)', vx: 0.0003, vy: 0.0002 },
    { x: 0.7, y: 0.6, r: 250, color: 'rgba(255,163,102,0.1)', vx: -0.0002, vy: 0.0003 },
    { x: 0.5, y: 0.3, r: 350, color: 'rgba(26,43,66,0.2)', vx: 0.0001, vy: -0.0002 },
    { x: 0.2, y: 0.7, r: 200, color: 'rgba(255,125,51,0.08)', vx: -0.0003, vy: -0.0001 },
    { x: 0.8, y: 0.2, r: 280, color: 'rgba(51,78,104,0.15)', vx: 0.0002, vy: 0.0001 }
  ]);

  // Garantie canvas
  initMeshGradient('garantieCanvas', [
    { x: 0.3, y: 0.5, r: 250, color: 'rgba(255,92,0,0.08)', vx: 0.0003, vy: 0.0002 },
    { x: 0.7, y: 0.4, r: 200, color: 'rgba(255,163,102,0.06)', vx: -0.0002, vy: 0.0003 },
    { x: 0.5, y: 0.6, r: 180, color: 'rgba(51,78,104,0.08)', vx: 0.0001, vy: -0.0002 }
  ]);

  // Fondateur canvas
  initMeshGradient('fondateurCanvas', [
    { x: 0.4, y: 0.5, r: 200, color: 'rgba(255,92,0,0.06)', vx: 0.0004, vy: 0.0003 },
    { x: 0.6, y: 0.3, r: 180, color: 'rgba(255,163,102,0.05)', vx: -0.0003, vy: 0.0002 },
    { x: 0.3, y: 0.6, r: 150, color: 'rgba(51,78,104,0.06)', vx: 0.0002, vy: -0.0003 }
  ]);

  // CTA canvas
  initMeshGradient('ctaCanvas', [
    { x: 0.3, y: 0.5, r: 300, color: 'rgba(255,92,0,0.1)', vx: 0.0003, vy: 0.0002 },
    { x: 0.7, y: 0.4, r: 250, color: 'rgba(255,163,102,0.06)', vx: -0.0002, vy: 0.0003 },
    { x: 0.5, y: 0.6, r: 200, color: 'rgba(51,78,104,0.08)', vx: 0.0001, vy: -0.0002 }
  ]);

  // ===== CAL.COM INTEGRATION =====
  var calLoaded = false;
  var calReady = false;

  function loadCal() {
    if (calLoaded) return;
    calLoaded = true;
    var s = document.createElement('script');
    s.src = 'https://app.cal.com/embed/embed.js';
    s.async = true;
    s.onload = function() {
      if (window.Cal) {
        window.Cal('init', 'diagnostic-15-min', { origin: 'https://app.cal.com' });
        calReady = true;

        // Inline calendar in CTA section
        var calConfigDiv = document.querySelector('[data-cal-config]');
        if (calConfigDiv && !calConfigDiv.hasAttribute('data-cal-wired')) {
          calConfigDiv.setAttribute('data-cal-wired', 'true');
          try {
            var config = JSON.parse(calConfigDiv.getAttribute('data-cal-config'));
            window.Cal('inline', {
              elementOrSelector: '[data-cal-config]',
              calLink: 'pierre-andrieux-iagence/diagnostic-15-min',
              config: config
            });
          } catch(e) {
            console.warn('Cal config parse error', e);
          }
        }

        // Wire up all [data-cal-link] buttons/links (not the inline calendar div)
        document.querySelectorAll('a[data-cal-link], button[data-cal-link]').forEach(function(el) {
          if (el.hasAttribute('data-cal-wired')) return;
          el.setAttribute('data-cal-wired', 'true');
          el.addEventListener('click', function(e) {
            e.preventDefault();
            var calLink = el.getAttribute('data-cal-link');
            window.Cal('ui', 'modal', {
              calLink: calLink,
              config: { layout: 'week_view' }
            });
          });
        });
      }
    };
    document.head.appendChild(s);
  }

  function openCalModal() {
    if (!calLoaded) {
      loadCal();
      setTimeout(function() {
        if (calReady && window.Cal) {
          window.Cal('ui', 'modal', {
            calLink: 'pierre-andrieux-iagence/diagnostic-15-min',
            config: { layout: 'week_view' }
          });
        }
      }, 1000);
      return;
    }
    if (calReady && window.Cal) {
      window.Cal('ui', 'modal', {
        calLink: 'pierre-andrieux-iagence/diagnostic-15-min',
        config: { layout: 'week_view' }
      });
    }
  }

  // Floating phone button — visible on all scroll, desktop only
  var calFloatBtn = document.getElementById('calFloatBtn');
  if (calFloatBtn) {
    calFloatBtn.addEventListener('click', function(e) {
      e.preventDefault();
      openCalModal();
    });

    function updateFloatBtn() {
      if (window.innerWidth > 900) {
        calFloatBtn.classList.add('visible');
      } else {
        calFloatBtn.classList.remove('visible');
      }
    }
    window.addEventListener('resize', updateFloatBtn, { passive: true });
    updateFloatBtn();
  }

  // Load Cal.com on first interaction or after 3s
  var calTimeout = setTimeout(loadCal, 3000);
  ['click', 'touchstart', 'scroll'].forEach(function(evt) {
    document.addEventListener(evt, function handler() {
      clearTimeout(calTimeout);
      loadCal();
      document.removeEventListener(evt, handler);
    }, { once: true, passive: true });
  });

})();
