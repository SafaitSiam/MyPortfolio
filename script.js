/**
 * Portfolio Website — Premium Interactive Script
 * ================================================
 * Production-ready vanilla JS with modern syntax,
 * performant patterns (rAF, passive listeners, IntersectionObserver),
 * and rich micro-interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ──────────────────────────────────────────────
  // 1. PAGE LOAD ANIMATION
  // ──────────────────────────────────────────────
  const initPageLoad = () => {
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 100);
  };

  // ──────────────────────────────────────────────
  // 2. NAVIGATION SCROLL EFFECT
  // ──────────────────────────────────────────────
  const initNavScroll = () => {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    const onScroll = () => {
      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  };

  // ──────────────────────────────────────────────
  // 3. SMOOTH SCROLL FOR ANCHOR LINKS
  // ──────────────────────────────────────────────
  const initSmoothScroll = () => {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    const nav = document.querySelector('.nav');

    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;

        const targetEl = document.querySelector(targetId);
        if (!targetEl) return;

        e.preventDefault();

        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });

        // Close mobile menu on click
        nav?.classList.remove('nav-open');
      });
    });
  };

  // ──────────────────────────────────────────────
  // 4. INTERSECTION OBSERVER FOR REVEAL ANIMATIONS
  // ──────────────────────────────────────────────
  const initRevealObserver = () => {
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length === 0) return;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  };

  // ──────────────────────────────────────────────
  // 5. STAGGERED ANIMATIONS FOR CARDS
  // ──────────────────────────────────────────────
  const initStaggeredCards = () => {
    const projectCards = document.querySelectorAll('.project-card');
    const serviceCards = document.querySelectorAll('.service-card');

    const applyStagger = (cards) => {
      cards.forEach((card, index) => {
        card.classList.add('reveal');
        card.classList.add(`reveal-delay-${index}`);
      });
    };

    applyStagger(projectCards);
    applyStagger(serviceCards);
  };

  // ──────────────────────────────────────────────
  // 6. STATISTICS COUNTER ANIMATION
  // ──────────────────────────────────────────────
  const initStatsCounter = () => {
    const statsSection = document.querySelector('.stats');
    if (!statsSection) return;

    let hasAnimated = false;

    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 2000;
      let startTime = null;

      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutExpo(progress);
        const current = Math.round(easedProgress * target);

        el.textContent = `${current}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    };

    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            const statNumbers = statsSection.querySelectorAll('.stat-number');
            statNumbers.forEach((el) => animateCounter(el));
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    statsObserver.observe(statsSection);
  };

  // ──────────────────────────────────────────────
  // 7. CURSOR GLOW EFFECT
  // ──────────────────────────────────────────────
  const initCursorGlow = () => {
    // Detect touch devices and skip
    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;

    if (isTouchDevice) return;

    const cursorGlow = document.createElement('div');
    cursorGlow.classList.add('cursor-glow');
    document.body.appendChild(cursorGlow);

    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;
    let rafId = null;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const updateGlowPosition = () => {
      glowX = lerp(glowX, mouseX, 0.12);
      glowY = lerp(glowY, mouseY, 0.12);

      cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px)`;

      rafId = requestAnimationFrame(updateGlowPosition);
    };

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!rafId) {
        rafId = requestAnimationFrame(updateGlowPosition);
      }
    }, { passive: true });

    // Start the animation loop
    rafId = requestAnimationFrame(updateGlowPosition);
  };

  // ──────────────────────────────────────────────
  // 8. MAGNETIC BUTTON EFFECT
  // ──────────────────────────────────────────────
  const initMagneticButtons = () => {
    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;

    if (isTouchDevice) return;

    const magneticElements = document.querySelectorAll('.btn-primary, .nav-cta');
    const magneticRadius = 120;
    const maxShift = 6;

    magneticElements.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < magneticRadius) {
          const intensity = 1 - distance / magneticRadius;
          const shiftX = (distX / magneticRadius) * maxShift * intensity;
          const shiftY = (distY / magneticRadius) * maxShift * intensity;

          btn.style.transform = `translate(${shiftX}px, ${shiftY}px)`;
          btn.style.transition = 'transform 0.15s ease-out';
        }
      }, { passive: true });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });
    });
  };

  // ──────────────────────────────────────────────
  // 9. PARALLAX ON HERO IMAGE
  // ──────────────────────────────────────────────
  const initParallax = () => {
    const heroImage = document.querySelector('.hero-image');
    if (!heroImage) return;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;

      ticking = true;
      requestAnimationFrame(() => {
        if (window.innerWidth > 1024) {
          const scrolled = window.scrollY;
          const parallaxOffset = scrolled * 0.08;
          heroImage.style.transform = `translateY(${parallaxOffset}px)`;
        } else {
          heroImage.style.transform = 'translateY(0)';
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  };

  // ──────────────────────────────────────────────
  // 10. ACTIVE NAV LINK HIGHLIGHTING
  // ──────────────────────────────────────────────
  const initActiveNavHighlight = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');

    if (sections.length === 0 || navLinks.length === 0) return;

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('id');

            navLinks.forEach((link) => {
              link.classList.remove('active');
              if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
              }
            });
          }
        });
      },
      {
        rootMargin: '-80px 0px -50% 0px',
        threshold: 0,
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  };

  // ──────────────────────────────────────────────
  // 11. MOBILE HAMBURGER TOGGLE
  // ──────────────────────────────────────────────
  const initMobileMenu = () => {
    const hamburger = document.querySelector('.nav-hamburger');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav a');

    if (!hamburger || !nav) return;

    hamburger.addEventListener('click', () => {
      nav.classList.toggle('nav-open');
    });

    // Close menu when any nav link is clicked
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('nav-open');
      });
    });

    // Close menu on scroll
    window.addEventListener(
      'scroll',
      () => {
        if (nav.classList.contains('nav-open')) {
          nav.classList.remove('nav-open');
        }
      },
      { passive: true }
    );
  };

  // ──────────────────────────────────────────────
  // 12. FORM HANDLING (WEB3FORMS AJAX)
  // ──────────────────────────────────────────────
  const initFormHandling = () => {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      if (!submitBtn) return;

      const originalText = submitBtn.textContent;

      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
      submitBtn.style.pointerEvents = 'none';

      try {
        const formData = new FormData(form);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          form.innerHTML = `
            <style>
              @keyframes smoothScaleUp {
                0% { opacity: 0; transform: scale(0.92) translateY(12px); }
                100% { opacity: 1; transform: scale(1) translateY(0); }
              }
              @keyframes checkmarkPop {
                0% { transform: scale(0); opacity: 0; }
                50% { transform: scale(1.15); opacity: 1; }
                100% { transform: scale(1); opacity: 1; }
              }
            </style>
            <div class="booking-success-ui" style="text-align: center; padding: 4rem 2rem; background: #f9f9f9; border-radius: 24px; border: 1px solid #eaeaea; animation: smoothScaleUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;">
              <svg viewBox="0 0 24 24" style="width: 64px; height: 64px; margin: 0 auto 1.5rem; color: #10b981; animation: checkmarkPop 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <h3 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.75rem; color: #111;">Booked!</h3>
              <p style="color: #666; font-size: 1.1rem; line-height: 1.6; margin: 0;">Your video project request has been successfully sent. I will get back to you shortly.</p>
            </div>
          `;
        } else {
          submitBtn.textContent = 'Error! Try Again.';
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.pointerEvents = 'auto';
          }, 3000);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        submitBtn.textContent = 'Error! Try Again.';
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
          submitBtn.style.pointerEvents = 'auto';
        }, 3000);
      }
    });
  };

  // ──────────────────────────────────────────────
  // 13. IMAGE LAZY LOADING ENHANCEMENT
  // ──────────────────────────────────────────────
  const initLazyLoading = () => {
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach((img) => {
      img.setAttribute('loading', 'lazy');
    });
  };

  // ──────────────────────────────────────────────
  // 14. GOOGLE SHEETS YOUTUBE INTEGRATION
  // ──────────────────────────────────────────────
  const initProjectsSheets = async () => {
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/1WXwj-5CwmX9sAQpPfbvpi0iJgyrvFRtLyOP07_I1Wrw/gviz/tq?tqx=out:json';
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    const getYouTubeVideoId = (url) => {
      if (!url) return null;
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
      return match ? match[1] : null;
    };

    try {
      const response = await fetch(sheetUrl);
      const text = await response.text();
      
      // Parse gviz JSON response
      const jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
      const data = JSON.parse(jsonString);

      const rows = data?.table?.rows;
      if (!rows || rows.length === 0) return;

      // Identify column indices by header labels, defaulting to standard 0,1,2,3
      let catIdx = 0, titleIdx = 1, descIdx = 2, urlIdx = 3;
      data.table.cols.forEach((col, idx) => {
        if (!col || !col.label) return;
        const label = col.label.toLowerCase().replace(/\s+/g, '');
        if (label.includes('category') || label.includes('type')) catIdx = idx;
        else if (label.includes('title') || label.includes('name')) titleIdx = idx;
        else if (label.includes('description') || label.includes('desc')) descIdx = idx;
        else if (label.includes('youtube') || label.includes('url') || label.includes('video') || label.includes('link')) urlIdx = idx;
      });

      const projects = [];
      rows.forEach(row => {
        if (!row || !row.c) return;
        const category = row.c[catIdx]?.v || '';
        const title = row.c[titleIdx]?.v || '';
        const desc = row.c[descIdx]?.v || '';
        const url = row.c[urlIdx]?.v || '';
        
        // Skip header row if Google Sheets included it in rows
        if (title.toLowerCase() === 'title' || category.toLowerCase() === 'category') return;

        if (title || url) {
          projects.push({ category, title, desc, url });
        }
      });

      if (projects.length > 0) {
        projectsGrid.innerHTML = '';
        projects.forEach((proj, index) => {
          const videoId = getYouTubeVideoId(proj.url);
          let mediaHtml = '';
          if (videoId) {
            mediaHtml = `<iframe id="yt-player-${index}" src="https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&controls=1&enablejsapi=1" title="${proj.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
          } else {
            mediaHtml = `<img src="images/project-branding.jpg" alt="${proj.title}" loading="lazy">`;
          }

          const card = document.createElement('div');
          card.className = `project-card reveal reveal-delay-${index % 4} active`;
          card.innerHTML = `
            <div class="project-card-image">
              ${mediaHtml}
            </div>
            <div class="project-card-content">
              <span class="project-category">${proj.category || 'Video Project'}</span>
              <h3 class="project-title">${proj.title || 'Untitled Video'}</h3>
              <p class="project-desc">${proj.desc || ''}</p>
            </div>
          `;
          projectsGrid.appendChild(card);
        });

        // Initialize YouTube Iframe API for auto-pausing other videos
        const ytPlayers = [];
        const initYTPlayers = () => {
          const iframes = projectsGrid.querySelectorAll('iframe[id^="yt-player-"]');
          iframes.forEach((iframe) => {
            const player = new YT.Player(iframe.id, {
              events: {
                'onStateChange': (event) => {
                  if (event.data === YT.PlayerState.PLAYING) {
                    ytPlayers.forEach((otherPlayer) => {
                      if (otherPlayer !== player && typeof otherPlayer.pauseVideo === 'function') {
                        otherPlayer.pauseVideo();
                      }
                    });
                  }
                }
              }
            });
            ytPlayers.push(player);
          });
        };

        if (window.YT && window.YT.Player) {
          initYTPlayers();
        } else {
          window.onYouTubeIframeAPIReady = initYTPlayers;
          const tag = document.createElement('script');
          tag.src = 'https://www.youtube.com/iframe_api';
          const firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
      }
    } catch (err) {
      console.log('Google Sheets load error (using fallback static projects):', err);
    }
  };

  // ──────────────────────────────────────────────
  // INITIALIZE ALL MODULES
  // ──────────────────────────────────────────────
  initPageLoad();
  initNavScroll();
  initSmoothScroll();
  initStaggeredCards();     // Must run before reveal observer
  initRevealObserver();
  initStatsCounter();
  initCursorGlow();
  initMagneticButtons();
  initParallax();
  initActiveNavHighlight();
  initMobileMenu();
  initFormHandling();
  initLazyLoading();
  initProjectsSheets();
});
