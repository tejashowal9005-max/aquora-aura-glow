/* ============================================
   AQUORA SHAKE · script.js
   Premium interactions · Three.js viewer
   GSAP animations · Smooth scroll
   ============================================ */

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
    const increment = Math.random() * 8 + 4;
    progress = Math.min(progress + increment, 100);
    bar.style.width = progress + '%';
    pct.textContent = Math.floor(progress) + '%';

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hide');
        initAnimations();
        initParticles();
      }, 500);
    }
  }, 180);
})();

// --------------------------------------------
// 2. NAVIGATION
// --------------------------------------------
(function initNavigation() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks = document.querySelectorAll('.mobile-menu a, .nav-links a');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (mobileMenu) {
        mobileMenu.classList.remove('open');
        if (hamburger) hamburger.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
})();

// --------------------------------------------
// 3. SMOOTH SCROLL
// --------------------------------------------
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        const navHeight = document.querySelector('nav')?.offsetHeight || 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });
})();

// --------------------------------------------
// 4. THREE.JS 3D PRODUCT VIEWER
// --------------------------------------------
(function initThreeViewer() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;

  // --- Setup ---
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x081321);

  const width = canvas.clientWidth;
  const height = canvas.clientHeight || 400;

  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
  camera.position.set(2.5, 1.2, 4.5);
  camera.lookAt(0, 0.2, 0);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
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

  const ringMat = new THREE.MeshPhysicalMaterial({
    color: 0xd4af37,
    roughness: 0.2,
    metalness: 0.8,
  });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.04, 16, 32), ringMat);
  ring.position.y = 0.92;
  ring.rotation.x = Math.PI / 2;
  productGroup.add(ring);

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

  // --- 3D Particles ---
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
    productGroup.position.y = Math.sin(time * 0.6) * 0.04;
    productGroup.rotation.z = Math.sin(time * 0.3) * 0.005;
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

  window.__threeControls = controls;
  window.__threeScene = scene;
  window.__threeProduct = productGroup;
})();

// --------------------------------------------
// 5. GSAP ANIMATIONS
// --------------------------------------------
function initAnimations() {
  if (typeof gsap === 'undefined') return;

  let hasScrollTrigger = false;
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    hasScrollTrigger = true;
  }

  const titles = document.querySelectorAll('.section-title, .section-sub');
  titles.forEach((el, i) => {
    gsap.from(el, {
      duration: 1.0,
      opacity: 0,
      y: 30,
      ease: 'power2.out',
      delay: i * 0.1,
      scrollTrigger: hasScrollTrigger ? { trigger: el, start: 'top 85%' } : null,
    });
  });

  const flavourCards = document.querySelectorAll('.flavour-card');
  flavourCards.forEach((card, i) => {
    gsap.from(card, {
      duration: 0.9,
      opacity: 0,
      y: 50,
      scale: 0.95,
      ease: 'power3.out',
      delay: i * 0.12,
      scrollTrigger: hasScrollTrigger ? { trigger: card, start: 'top 88%' } : null,
    });
  });

  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach((item, i) => {
    gsap.from(item, {
      duration: 0.7,
      opacity: 0,
      scale: 0.92,
      ease: 'power2.out',
      delay: i * 0.06,
      scrollTrigger: hasScrollTrigger ? { trigger: item, start: 'top 90%' } : null,
    });
  });

  gsap.from('.hero-badge', { duration: 1.0, opacity: 0, y: 20, delay: 0.2 });
  gsap.from('.hero-title', { duration: 1.2, opacity: 0, y: 40, delay: 0.3 });
  gsap.from('.hero-sub', { duration: 1.0, opacity: 0, y: 30, delay: 0.5 });
  gsap.from('.hero-cta', { duration: 0.9, opacity: 0, y: 20, delay: 0.7 });
  gsap.from('#three-canvas', { duration: 1.4, opacity: 0, scale: 0.9, delay: 0.4 });

  gsap.from('.contact-form-wrap', {
    duration: 1.0,
    opacity: 0,
    y: 40,
    ease: 'power2.out',
    scrollTrigger: hasScrollTrigger ? { trigger: '.contact-form-wrap', start: 'top 85%' } : null,
  });

  const footerCols = document.querySelectorAll('.footer-col');
  footerCols.forEach((col, i) => {
    gsap.from(col, {
      duration: 0.8,
      opacity: 0,
      y: 30,
      ease: 'power2.out',
      delay: i * 0.08,
      scrollTrigger: hasScrollTrigger ? { trigger: col, start: 'top 90%' } : null,
    });
  });

  gsap.to('#hero', {
    backgroundPosition: '50% 30%',
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 },
  });
}

// --------------------------------------------
// 6. FLOATING 2D PARTICLES
// --------------------------------------------
function initParticles() {
  const container = document.body;
  const count = 25;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle-gold';
    const size = 2 + Math.random() * 6;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = 5 + Math.random() * 10;
    const delay = Math.random() * 8;
    const tx = (Math.random() - 0.5) * 80;
    const ty = (Math.random() - 0.5) * 80 - 30;

    particle.style.cssText = `
      left: ${x}%;
      top: ${y}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      --tx: ${tx}px;
      --ty: ${ty}px;
      opacity: ${0.1 + Math.random() * 0.25};
      filter: blur(${1 + Math.random() * 2}px);
    `;
    container.appendChild(particle);
  }
}

// --------------------------------------------
// 7. FLAVOUR BUTTONS
// --------------------------------------------
(function initFlavourButtons() {
  const buttons = document.querySelectorAll('.flavour-card .btn-primary');
  buttons.forEach((btn) => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const card = this.closest('.flavour-card');
      const name = card?.querySelector('h3')?.textContent || 'Flavour';
      const hero = document.getElementById('hero');
      if (hero) {
        hero.scrollIntoView({ behavior: 'smooth' });
        const canvas = document.getElementById('three-canvas');
        if (canvas) {
          canvas.style.transition = 'box-shadow 0.6s ease';
          canvas.style.boxShadow = '0 0 60px rgba(212, 175, 55, 0.3)';
          setTimeout(() => { canvas.style.boxShadow = ''; }, 800);
        }
      }
      showNotification(`Viewing: ${name} in 3D`);
    });
  });
})();

// --------------------------------------------
// 8. NOTIFICATION TOAST
// --------------------------------------------
function showNotification(message) {
  const existing = document.querySelector('.luxury-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'luxury-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(8, 19, 33, 0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(212, 175, 55, 0.2);
    padding: 0.8rem 2rem;
    border-radius: 60px;
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 0.85rem;
    letter-spacing: 0.05em;
    z-index: 9999;
    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    opacity: 0;
    transition: opacity 0.5s ease, transform 0.5s ease;
    transform: translateX(-50%) translateY(20px);
  `;
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
// 9. INTERSECTION OBSERVER (fallback)
// --------------------------------------------
(function initIntersectionObserver() {
  if (typeof ScrollTrigger !== 'undefined') return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.flavour-card, .gallery-item, .section-title, .contact-form-wrap').forEach((el) => {
    el.classList.add('observe-me');
    observer.observe(el);
  });

  const style = document.createElement('style');
  style.textContent = `
    .observe-me {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.8s ease, transform 0.8s ease;
    }
    .observe-me.is-visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);
})();

// --------------------------------------------
// 10. KEYBOARD ACCESSIBILITY
// --------------------------------------------
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const menu = document.getElementById('mobileMenu');
    const hamburger = document.getElementById('hamburger');
    if (menu?.classList.contains('open')) {
      menu.classList.remove('open');
      if (hamburger) hamburger.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
});

// --------------------------------------------
// 11. FLAVOUR SWITCHING (global)
// --------------------------------------------
window.switchFlavour = function (flavourName) {
  const canvas = document.getElementById('three-canvas');
  if (canvas) {
    canvas.style.transition = 'all 0.6s ease';
    canvas.style.boxShadow = '0 0 80px rgba(212, 175, 55, 0.4)';
    setTimeout(() => { canvas.style.boxShadow = ''; }, 800);
  }
  showNotification(`Switched to: ${flavourName}`);
};

// --------------------------------------------
// 12. EXPOSE API
// --------------------------------------------
window.__aquora = {
  version: '1.0.0',
  showNotification,
  switchFlavour: window.switchFlavour,
};

document.addEventListener('DOMContentLoaded', () => {
  console.log('AQUORA SHAKE · Luxury experience loaded');
});
