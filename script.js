/* ============================================
   AQUORA SHAKE · script.js
   Premium interactions · Three.js · GSAP · Lenis
   Fully working with all animations and effects
   ============================================ */

// Wait for DOM and all libraries to load
document.addEventListener('DOMContentLoaded', () => {
  // Ensure GSAP, ScrollTrigger, Lenis are available
  if (typeof gsap === 'undefined') {
    console.error('GSAP not loaded');
    return;
  }
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // --------------------------------------------
  // 1. LOADING SCREEN
  // --------------------------------------------
  (function initLoader() {
    let progress = 0;
    const bar = document.getElementById('loaderBar');
    const pct = document.getElementById('loaderPercent');
    const loader = document.getElementById('loader');
    if (!bar || !pct || !loader) return;

    const interval = setInterval(() => {
      progress += Math.random() * 8 + 4;
      progress = Math.min(progress, 100);
      bar.style.width = progress + '%';
      pct.textContent = Math.floor(progress) + '%';
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          loader.classList.add('hide');
          // Initialize everything after loader
          initAll();
        }, 400);
      }
    }, 180);
  })();

  // --------------------------------------------
  // 2. GLOBAL INIT
  // --------------------------------------------
  function initAll() {
    initLenis();
    initNavigation();
    initSmoothScroll();
    initThreeViewer();
    initGSAPAnimations();
    initParticles();
    initCounters();
    initFAQ();
    initFlavourButtons();
    initReviewSlider();
    initCursor();
    initScrollProgress();
    initBackgroundAnimation();
  }

  // --------------------------------------------
  // 3. LENIS SMOOTH SCROLL
  // --------------------------------------------
  function initLenis() {
    if (typeof Lenis !== 'undefined') {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
      });
      lenis.on('scroll', () => {
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
      });
      window.lenis = lenis;
      window.addEventListener('resize', () => lenis.resize());
      requestAnimationFrame(function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      });
      // Integrate with ScrollTrigger
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.scrollerProxy(document.body, {
          scrollTop(value) { return lenis ? lenis.scroll : 0; },
          scrollTo(value, duration) { if (lenis) lenis.scrollTo(value, { duration }); },
          getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
          },
        });
      }
    } else {
      console.warn('Lenis not loaded, using native scroll');
    }
  }

  // --------------------------------------------
  // 4. NAVIGATION
  // --------------------------------------------
  function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
      });
    }
    document.querySelectorAll('.mobile-menu a, .nav-links a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu?.classList.remove('open');
        hamburger?.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
    // Navbar scroll effect
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // --------------------------------------------
  // 5. SMOOTH ANCHOR SCROLL
  // --------------------------------------------
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
          const navHeight = document.querySelector('nav')?.offsetHeight || 80;
          const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
          if (window.lenis) {
            window.lenis.scrollTo(top, { duration: 1.2 });
          } else {
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }
      });
    });
  }

  // --------------------------------------------
  // 6. THREE.JS 3D VIEWER (using global THREE)
  // --------------------------------------------
  function initThreeViewer() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;
    if (typeof THREE === 'undefined') {
      console.error('Three.js not loaded');
      return;
    }

    // --- Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x081321);

    const width = canvas.clientWidth;
    const height = canvas.clientHeight || 400;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(2.5, 1.2, 4.5);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping || THREE.LinearToneMapping;
    renderer.toneMappingExposure = 1.2;
    canvas.appendChild(renderer.domElement);

    // --- Controls ---
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.8;
    controls.enableZoom = true;
    controls.zoomSpeed = 0.8;
    controls.enablePan = false;
    controls.target.set(0, 0.3, 0);
    controls.maxPolarAngle = Math.PI / 2.2;
    controls.minDistance = 2;
    controls.maxDistance = 8;

    // --- Lighting ---
    const ambient = new THREE.AmbientLight(0x334466, 0.6);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffeedd, 1.2);
    keyLight.position.set(3, 4, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x6688ff, 0.5);
    fillLight.position.set(-3, 1, -4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xd4af37, 0.4);
    rimLight.position.set(-2, 3, -3);
    scene.add(rimLight);

    const goldLight = new THREE.PointLight(0xd4af37, 0.8, 6);
    goldLight.position.set(0, 1.5, 2.5);
    scene.add(goldLight);

    // --- Floor ---
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(2.8, 32),
      new THREE.MeshStandardMaterial({
        color: 0x0b1638,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
        roughness: 0.9,
        metalness: 0.1,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.0;
    floor.receiveShadow = true;
    scene.add(floor);

    // --- Product ---
    const productGroup = new THREE.Group();

    // Main body
    const bodyGeo = new THREE.CylinderGeometry(0.85, 0.9, 1.8, 48, 1, true);
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: 0x1a2a44,
      roughness: 0.2,
      metalness: 0.6,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2,
      emissive: new THREE.Color(0x0a1530),
      emissiveIntensity: 0.1,
      envMapIntensity: 1.0,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    body.receiveShadow = true;
    productGroup.add(body);

    // Gold cap
    const capMat = new THREE.MeshPhysicalMaterial({
      color: 0xd4af37,
      roughness: 0.15,
      metalness: 0.85,
      emissive: new THREE.Color(0x553311),
      emissiveIntensity: 0.05,
      envMapIntensity: 1.2,
    });
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.68, 0.3, 32), capMat);
    cap.position.y = 1.05;
    cap.castShadow = true;
    productGroup.add(cap);

    // Gold ring
    const ringMat = new THREE.MeshPhysicalMaterial({
      color: 0xd4af37,
      roughness: 0.2,
      metalness: 0.8,
    });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.04, 16, 32), ringMat);
    ring.position.y = 0.92;
    ring.rotation.x = Math.PI / 2;
    productGroup.add(ring);

    // Label band
    const labelMat = new THREE.MeshPhysicalMaterial({
      color: 0xc49b3f,
      roughness: 0.3,
      metalness: 0.4,
      emissive: new THREE.Color(0x442200),
      emissiveIntensity: 0.05,
      transparent: true,
      opacity: 0.9,
    });
    const label = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.78, 0.45, 32), labelMat);
    label.position.y = 0.15;
    productGroup.add(label);

    // Gold stripes
    const stripeMat = new THREE.MeshPhysicalMaterial({
      color: 0xd4af37,
      roughness: 0.1,
      metalness: 0.9,
      emissive: new THREE.Color(0xd4af37),
      emissiveIntensity: 0.08,
    });
    const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.82, 0.04, 48), stripeMat);
    stripe.position.y = -0.3;
    productGroup.add(stripe);
    const stripe2 = stripe.clone();
    stripe2.position.y = 0.5;
    productGroup.add(stripe2);

    scene.add(productGroup);

    // --- 3D Background Particles ---
    const bgParticlesGeo = new THREE.BufferGeometry();
    const count = 400;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      const r = 3 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 2;
      positions[i] = Math.sin(theta) * Math.cos(phi) * r;
      positions[i + 1] = Math.sin(theta) * Math.sin(phi) * r * 0.5 + 0.5;
      positions[i + 2] = Math.cos(theta) * r;
    }
    bgParticlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const bgParticlesMat = new THREE.PointsMaterial({
      color: 0xd4af37,
      size: 0.025,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const bgParticles = new THREE.Points(bgParticlesGeo, bgParticlesMat);
    scene.add(bgParticles);

    // --- Floating Gold Particles (around product) ---
    const floatParticlesGeo = new THREE.BufferGeometry();
    const fCount = 60;
    const fPos = new Float32Array(fCount * 3);
    for (let i = 0; i < fCount * 3; i += 3) {
      const radius = 1.5 + Math.random() * 3;
      const angle = Math.random() * Math.PI * 2;
      fPos[i] = Math.cos(angle) * radius;
      fPos[i + 1] = (Math.random() - 0.5) * 3 + 0.5;
      fPos[i + 2] = Math.sin(angle) * radius;
    }
    floatParticlesGeo.setAttribute('position', new THREE.BufferAttribute(fPos, 3));
    const floatParticlesMat = new THREE.PointsMaterial({
      color: 0xd4af37,
      size: 0.035,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const floatParticles = new THREE.Points(floatParticlesGeo, floatParticlesMat);
    scene.add(floatParticles);

    // --- Animation ---
    function animate() {
      requestAnimationFrame(animate);
      const time = Date.now() * 0.001;
      controls.update();
      // Floating product
      productGroup.position.y = Math.sin(time * 0.6) * 0.04;
      productGroup.rotation.z = Math.sin(time * 0.3) * 0.005;
      // Rotate particles
      bgParticles.rotation.y += 0.0003;
      floatParticles.rotation.y += 0.0008;
      renderer.render(scene, camera);
    }
    animate();

    // --- Resize ---
    function resizeRenderer() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight || 400;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resizeRenderer);

    // --- Mouse parallax ---
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      productGroup.rotation.y += (x * 0.005 - productGroup.rotation.y) * 0.02;
      productGroup.rotation.x += (-y * 0.003 - productGroup.rotation.x) * 0.02;
    });

    // Expose for flavour switching
    window.__threeControls = controls;
    window.__threeScene = scene;
    window.__threeProduct = productGroup;
  }

  // --------------------------------------------
  // 7. GSAP + SCROLLTRIGGER ANIMATIONS
  // --------------------------------------------
  function initGSAPAnimations() {
    const hasST = typeof ScrollTrigger !== 'undefined';

    // Titles
    document.querySelectorAll('.section-title, .section-sub').forEach((el) => {
      gsap.from(el, {
        duration: 1.0,
        opacity: 0,
        y: 30,
        ease: 'power2.out',
        scrollTrigger: hasST ? { trigger: el, start: 'top 85%' } : null,
      });
    });

    // Hero elements
    gsap.from('.hero-badge', { duration: 1.0, opacity: 0, y: 20, delay: 0.2 });
    gsap.from('.hero-title', { duration: 1.2, opacity: 0, y: 40, delay: 0.3 });
    gsap.from('.hero-sub', { duration: 1.0, opacity: 0, y: 30, delay: 0.5 });
    gsap.from('.hero-cta', { duration: 0.9, opacity: 0, y: 20, delay: 0.7 });
    gsap.from('#three-canvas', { duration: 1.4, opacity: 0, scale: 0.9, delay: 0.4 });

    // About
    gsap.from('.about-grid', {
      duration: 1.0,
      opacity: 0,
      y: 40,
      ease: 'power2.out',
      scrollTrigger: hasST ? { trigger: '.about-grid', start: 'top 85%' } : null,
    });

    // Timeline items
    document.querySelectorAll('.timeline-item').forEach((item, i) => {
      gsap.from(item, {
        duration: 0.8,
        opacity: 0,
        x: i % 2 === 0 ? -30 : 30,
        ease: 'power2.out',
        delay: i * 0.15,
        scrollTrigger: hasST ? { trigger: item, start: 'top 85%' } : null,
      });
    });

    // Flavour cards
    document.querySelectorAll('.flavour-card').forEach((card, i) => {
      gsap.from(card, {
        duration: 0.9,
        opacity: 0,
        y: 50,
        scale: 0.95,
        ease: 'power3.out',
        delay: i * 0.12,
        scrollTrigger: hasST ? { trigger: card, start: 'top 88%' } : null,
      });
    });

    // Ingredients
    document.querySelectorAll('.ingredient-card').forEach((card, i) => {
      gsap.from(card, {
        duration: 0.7,
        opacity: 0,
        y: 30,
        ease: 'power2.out',
        delay: i * 0.08,
        scrollTrigger: hasST ? { trigger: card, start: 'top 90%' } : null,
      });
    });

    // Nutrition bars
    document.querySelectorAll('.nutrition-bar div').forEach((bar) => {
      gsap.from(bar, {
        width: '0%',
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: hasST ? { trigger: bar, start: 'top 85%' } : null,
      });
    });

    // Manufacturing cards
    document.querySelectorAll('.manufacturing-card').forEach((card, i) => {
      gsap.from(card, {
        duration: 0.8,
        opacity: 0,
        y: 30,
        ease: 'power2.out',
        delay: i * 0.1,
        scrollTrigger: hasST ? { trigger: card, start: 'top 88%' } : null,
      });
    });

    // Stat cards
    document.querySelectorAll('.stat-card').forEach((card, i) => {
      gsap.from(card, {
        duration: 0.8,
        opacity: 0,
        y: 40,
        ease: 'power2.out',
        delay: i * 0.1,
        scrollTrigger: hasST ? { trigger: card, start: 'top 88%' } : null,
      });
    });

    // Gallery items
    document.querySelectorAll('.gallery-item').forEach((item, i) => {
      gsap.from(item, {
        duration: 0.7,
        opacity: 0,
        scale: 0.92,
        ease: 'power2.out',
        delay: i * 0.06,
        scrollTrigger: hasST ? { trigger: item, start: 'top 90%' } : null,
      });
    });

    // Review cards
    document.querySelectorAll('.review-card').forEach((card, i) => {
      gsap.from(card, {
        duration: 0.8,
        opacity: 0,
        scale: 0.9,
        ease: 'power2.out',
        delay: i * 0.1,
        scrollTrigger: hasST ? { trigger: card, start: 'top 88%' } : null,
      });
    });

    // Awards
    document.querySelectorAll('.award-card').forEach((card, i) => {
      gsap.from(card, {
        duration: 0.7,
        opacity: 0,
        y: 30,
        ease: 'power2.out',
        delay: i * 0.08,
        scrollTrigger: hasST ? { trigger: card, start: 'top 90%' } : null,
      });
    });

    // FAQ items
    document.querySelectorAll('.faq-item').forEach((item, i) => {
      gsap.from(item, {
        duration: 0.7,
        opacity: 0,
        y: 20,
        ease: 'power2.out',
        delay: i * 0.1,
        scrollTrigger: hasST ? { trigger: item, start: 'top 90%' } : null,
      });
    });

    // Vision cards
    document.querySelectorAll('.vision-card').forEach((card, i) => {
      gsap.from(card, {
        duration: 0.8,
        opacity: 0,
        y: 30,
        ease: 'power2.out',
        delay: i * 0.1,
        scrollTrigger: hasST ? { trigger: card, start: 'top 88%' } : null,
      });
    });

    // CTA
    gsap.from('#cta .section-title, #cta .section-sub, #cta .btn-primary', {
      duration: 0.9,
      opacity: 0,
      y: 30,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: hasST ? { trigger: '#cta', start: 'top 85%' } : null,
    });

    // Contact form
    gsap.from('.contact-form-wrap', {
      duration: 1.0,
      opacity: 0,
      y: 40,
      ease: 'power2.out',
      scrollTrigger: hasST ? { trigger: '.contact-form-wrap', start: 'top 85%' } : null,
    });

    // Footer columns
    document.querySelectorAll('.footer-col').forEach((col, i) => {
      gsap.from(col, {
        duration: 0.8,
        opacity: 0,
        y: 30,
        ease: 'power2.out',
        delay: i * 0.08,
        scrollTrigger: hasST ? { trigger: col, start: 'top 90%' } : null,
      });
    });
  }

  // --------------------------------------------
  // 8. 2D FLOATING PARTICLES
  // --------------------------------------------
  function initParticles() {
    const container = document.body;
    const count = 35;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle-gold';
      const size = 2 + Math.random() * 6;
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        width: ${size}px; height: ${size}px;
        animation-duration: ${5 + Math.random() * 10}s;
        animation-delay: ${Math.random() * 8}s;
        --tx: ${(Math.random() - 0.5) * 80}px;
        --ty: ${(Math.random() - 0.5) * 80 - 30}px;
        opacity: ${0.1 + Math.random() * 0.25};
        filter: blur(${1 + Math.random() * 2}px);
      `;
      container.appendChild(p);
    }
  }

  // --------------------------------------------
  // 9. COUNTER ANIMATION
  // --------------------------------------------
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-count'));
            if (isNaN(target)) return;
            let current = 0;
            const increment = Math.ceil(target / 40);
            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              entry.target.textContent = current + (target === 0 ? 'g' : '');
            }, 30);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => observer.observe(c));
  }

  // --------------------------------------------
  // 10. FAQ ACCORDION
  // --------------------------------------------
  function initFAQ() {
    document.querySelectorAll('.faq-question').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach((el) => el.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    });
  }

  // --------------------------------------------
  // 11. FLAVOUR BUTTONS
  // --------------------------------------------
  function initFlavourButtons() {
    document.querySelectorAll('.flavour-card .btn-primary').forEach((btn) => {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const name = this.closest('.flavour-card')?.querySelector('h3')?.textContent || 'Flavour';
        switchFlavour(name);
      });
    });
  }

  window.switchFlavour = function (flavourName) {
    const canvas = document.getElementById('three-canvas');
    if (canvas) {
      canvas.style.transition = 'box-shadow 0.6s ease';
      canvas.style.boxShadow = '0 0 80px rgba(212, 175, 55, 0.4)';
      setTimeout(() => {
        canvas.style.boxShadow = '';
      }, 800);
    }
    showNotification(`Viewing: ${flavourName} in 3D`);
  };

  // --------------------------------------------
  // 12. REVIEW SLIDER (auto-scroll)
  // --------------------------------------------
  function initReviewSlider() {
    const slider = document.querySelector('.review-slider');
    if (!slider) return;
    let scrollAmount = 0;
    const step = 320;
    setInterval(() => {
      if (slider.scrollWidth > slider.clientWidth) {
        scrollAmount += step;
        if (scrollAmount >= slider.scrollWidth - slider.clientWidth) {
          scrollAmount = 0;
        }
        slider.scrollTo({ left: scrollAmount, behavior: 'smooth' });
      }
    }, 4000);
  }

  // --------------------------------------------
  // 13. TOAST NOTIFICATION
  // --------------------------------------------
  function showNotification(message) {
    const existing = document.querySelector('.luxury-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'luxury-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => toast.remove(), 500);
    }, 2500);
  }

  // --------------------------------------------
  // 14. CUSTOM CURSOR
  // --------------------------------------------
  function initCursor() {
    const dot = document.createElement('div');
    dot.id = 'cursor-dot';
    const ring = document.createElement('div');
    ring.id = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = 0,
      mouseY = 0;
    let ringX = 0,
      ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    // Smooth ring follow
    function animateCursor() {
      ringX += (mouseX - ringX) * 0.1;
      ringY += (mouseY - ringY) * 0.1;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects on interactive elements
    const interactive = document.querySelectorAll('a, button, .flavour-card, .gallery-item, .review-card, .award-card, .vision-card, .manufacturing-card, .ingredient-card');
    interactive.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        ring.classList.add('cursor-hover');
        dot.style.width = '12px';
        dot.style.height = '12px';
      });
      el.addEventListener('mouseleave', () => {
        ring.classList.remove('cursor-hover');
        dot.style.width = '8px';
        dot.style.height = '8px';
      });
    });
  }

  // --------------------------------------------
  // 15. SCROLL PROGRESS INDICATOR
  // --------------------------------------------
  function initScrollProgress() {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    document.body.appendChild(bar);
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / height) * 100;
      bar.style.width = progress + '%';
    });
  }

  // --------------------------------------------
  // 16. BACKGROUND ANIMATION (Aurora effect)
  // --------------------------------------------
  function initBackgroundAnimation() {
    // Add animated gradient overlay to sections with a class
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
      if (index % 2 === 0) {
        section.style.position = 'relative';
        section.style.overflow = 'hidden';
        const overlay = document.createElement('div');
        overlay.style.cssText = `
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at ${20 + index * 10}% ${30 + index * 5}%, rgba(212,175,55,0.02), transparent 60%);
          pointer-events: none;
          animation: auroraShift ${8 + index % 4}s ease-in-out infinite alternate;
          z-index: 0;
        `;
        section.appendChild(overlay);
        // Move content above overlay
        section.querySelectorAll(':scope > *:not(style)').forEach(child => {
          if (child !== overlay) child.style.position = 'relative';
          child.style.zIndex = '1';
        });
      }
    });
    // Inject keyframes if not already present
    if (!document.getElementById('aurora-keyframes')) {
      const style = document.createElement('style');
      style.id = 'aurora-keyframes';
      style.textContent = `
        @keyframes auroraShift {
          0% { transform: translate(0,0) scale(1); opacity: 0.5; }
          100% { transform: translate(30px, -20px) scale(1.2); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // --------------------------------------------
  // 17. KEYBOARD ACCESSIBILITY
  // --------------------------------------------
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const menu = document.getElementById('mobileMenu');
      const hamburger = document.getElementById('hamburger');
      if (menu?.classList.contains('open')) {
        menu.classList.remove('open');
        hamburger?.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });

  // --------------------------------------------
  // 18. EXPOSE API
  // --------------------------------------------
  window.__aquora = {
    version: '2.0.0',
    showNotification,
    switchFlavour: window.switchFlavour,
  };

  console.log('✦ AQUORA SHAKE · Premium experience loaded');
});
