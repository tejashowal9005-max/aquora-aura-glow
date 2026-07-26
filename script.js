// ============================================================
//  SPOTLIGHT REVEAL (cursor-following mask)
// ============================================================
const SPOTLIGHT_R = 260;

const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
const revealLayer = document.getElementById('heroRevealLayer');

let mouse = { x: -999, y: -999 };
let smooth = { x: -999, y: -999 };
let rafId = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

document.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function updateSpotlight() {
  smooth.x += (mouse.x - smooth.x) * 0.1;
  smooth.y += (mouse.y - smooth.y) * 0.1;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw radial gradient
  const gradient = ctx.createRadialGradient(
    smooth.x, smooth.y, 0,
    smooth.x, smooth.y, SPOTLIGHT_R
  );
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.4, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.6, 'rgba(255,255,255,0.75)');
  gradient.addColorStop(0.75, 'rgba(255,255,255,0.4)');
  gradient.addColorStop(0.88, 'rgba(255,255,255,0.12)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(smooth.x, smooth.y, SPOTLIGHT_R, 0, Math.PI * 2);
  ctx.fill();

  // Apply as mask
  const dataUrl = canvas.toDataURL();
  revealLayer.style.maskImage = `url(${dataUrl})`;
  revealLayer.style.webkitMaskImage = `url(${dataUrl})`;

  rafId = requestAnimationFrame(updateSpotlight);
}

// Start spotlight loop (only after mouse moves)
let started = false;
document.addEventListener('mousemove', () => {
  if (!started) {
    started = true;
    updateSpotlight();
  }
});

// Fallback: start after 500ms if no mouse move
setTimeout(() => {
  if (!started) {
    started = true;
    updateSpotlight();
  }
}, 500);

// Cleanup
window.addEventListener('beforeunload', () => {
  if (rafId) cancelAnimationFrame(rafId);
});

// ============================================================
//  NAVIGATION – HAMBURGER TOGGLE (mobile)
// ============================================================
const hamburger = document.getElementById('navHamburger');
const navCenter = document.getElementById('navCenter');

hamburger.addEventListener('click', () => {
  navCenter.classList.toggle('nav-open');
});

// Close on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navCenter.classList.remove('nav-open');
  });
});

// ============================================================
//  PRODUCTS DATA & RENDER
// ============================================================
const products = [
  {
    name: 'Vanilla Bliss',
    desc: 'Smooth vanilla with a hint of caramel.',
    image: 'assets/products/vanilla-bliss.png'
  },
  {
    name: 'Chocolate Nut Blend',
    desc: 'Rich chocolate with roasted hazelnuts.',
    image: 'assets/products/chocolate-nut-blend.png'
  },
  {
    name: 'Italian Dryfruits',
    desc: 'A medley of premium dried fruits.',
    image: 'assets/products/italian-dryfruits.png'
  },
  {
    name: 'Rose Gold Falooda',
    desc: 'Rose essence with saffron and nuts.',
    image: 'assets/products/rose-gold-falooda.png'
  },
  {
    name: 'American Hazelnut',
    desc: 'Toasted hazelnut with a creamy finish.',
    image: 'assets/products/american-hazelnut.png'
  },
  {
    name: 'Berry Matcha',
    desc: 'Matcha green tea with berry twist.',
    image: 'assets/products/berry-matcha.png'
  },
  {
    name: 'Matcha Masti',
    desc: 'Pure matcha delight with a zing.',
    image: 'assets/products/matcha-masti.png'
  },
  {
    name: 'Orange Basil',
    desc: 'Citrus orange with fresh basil.',
    image: 'assets/products/orange-basil.png'
  },
  {
    name: 'Lychee Lemongrass',
    desc: 'Exotic lychee with lemongrass.',
    image: 'assets/products/lychee-lemongrass.png'
  },
  {
    name: 'Pineapple Breeze',
    desc: 'Tropical pineapple with mint.',
    image: 'assets/products/pineapple-breeze.png'
  },
  {
    name: 'Coconut Guava',
    desc: 'Creamy coconut with guava.',
    image: 'assets/products/coconut-guava.png'
  },
  {
    name: 'Spark Water',
    desc: 'Sparkling water with a hint of lime.',
    image: 'assets/products/spark-water.png'
  }
];

const productsGrid = document.getElementById('productsGrid');
products.forEach(p => {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <img src="${p.image}" alt="${p.name}" loading="lazy" />
    <div class="product-card-body">
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <a href="#products">Explore</a>
    </div>
  `;
  productsGrid.appendChild(card);
});

// ============================================================
//  INGREDIENTS DATA & RENDER
// ============================================================
const ingredients = [
  { name: 'Vanilla', desc: 'Natural vanilla extract from Madagascar.', image: 'assets/ingredients/vanilla.png' },
  { name: 'Chocolate', desc: 'Premium cocoa from Ecuador.', image: 'assets/ingredients/chocolate.png' },
  { name: 'Milk', desc: 'Fresh organic whole milk.', image: 'assets/ingredients/milk.png' },
  { name: 'Rose', desc: 'Damask rose petals infused.', image: 'assets/ingredients/rose.png' },
  { name: 'Dry Fruits', desc: 'Almonds, pistachios, cashews.', image: 'assets/ingredients/dryfruits.png' },
  { name: 'Hazelnut', desc: 'Roasted hazelnuts from Italy.', image: 'assets/ingredients/hazelnut.png' },
  { name: 'Matcha', desc: 'Ceremonial grade matcha from Japan.', image: 'assets/ingredients/matcha.png' },
  { name: 'Lychee', desc: 'Fresh lychee puree.', image: 'assets/ingredients/lychee.png' },
  { name: 'Basil', desc: 'Sweet basil leaves.', image: 'assets/ingredients/basil.png' },
  { name: 'Lemon', desc: 'Organic lemon zest.', image: 'assets/ingredients/lemon.png' }
];

const ingredientsGrid = document.getElementById('ingredientsGrid');
ingredients.forEach(i => {
  const card = document.createElement('div');
  card.className = 'ingredient-card';
  card.innerHTML = `
    <img src="${i.image}" alt="${i.name}" loading="lazy" />
    <h4>${i.name}</h4>
    <p>${i.desc}</p>
  `;
  ingredientsGrid.appendChild(card);
});

// ============================================================
//  BENEFITS DATA & RENDER
// ============================================================
const benefits = [
  { title: '100% Premium', desc: 'Only the finest ingredients selected.' },
  { title: 'Natural Ingredients', desc: 'No artificial flavors or preservatives.' },
  { title: 'No Artificial Colors', desc: 'Colors derived from nature.' },
  { title: 'Freshly Crafted', desc: 'Small batches for optimal freshness.' },
  { title: 'Luxury Packaging', desc: 'Elegant bottles, perfect for gifting.' },
  { title: 'High Protein', desc: 'Supports an active, healthy lifestyle.' }
];

const benefitsGrid = document.getElementById('benefitsGrid');
benefits.forEach(b => {
  const card = document.createElement('div');
  card.className = 'benefit-card';
  card.innerHTML = `
    <h4>${b.title}</h4>
    <p>${b.desc}</p>
  `;
  benefitsGrid.appendChild(card);
});

// ============================================================
//  TESTIMONIALS DATA & SLIDER
// ============================================================
const testimonials = [
  {
    name: 'Sophia Laurent',
    review: 'AQUORA redefines luxury. Every sip is an experience, pure elegance.',
    rating: 5,
    image: 'assets/testimonials/customer1.jpg'
  },
  {
    name: 'James Whitfield',
    review: 'The Vanilla Bliss is my daily indulgence. Absolutely exquisite.',
    rating: 5,
    image: 'assets/testimonials/customer2.jpg'
  },
  {
    name: 'Elena Rossi',
    review: 'I love the Italian Dryfruits blend – it’s a taste of paradise.',
    rating: 5,
    image: 'assets/testimonials/customer3.jpg'
  },
  {
    name: 'Marcus Chen',
    review: 'Matcha Masti gives me the perfect energy boost. Highly recommend.',
    rating: 4,
    image: 'assets/testimonials/customer4.jpg'
  }
];

const slider = document.getElementById('testimonialsSlider');
const dotsContainer = document.getElementById('testimonialsDots');

testimonials.forEach((t, index) => {
  const card = document.createElement('div');
  card.className = 'testimonial-card';
  const stars = '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating);
  card.innerHTML = `
    <img src="${t.image}" alt="${t.name}" loading="lazy" />
    <div class="stars">${stars}</div>
    <blockquote>“${t.review}”</blockquote>
    <cite>— ${t.name}</cite>
  `;
  slider.appendChild(card);

  // Dot
  const dot = document.createElement('button');
  dot.className = 'dot' + (index === 0 ? ' active' : '');
  dot.setAttribute('data-index', index);
  dotsContainer.appendChild(dot);
});

// Dots click to scroll
dotsContainer.querySelectorAll('.dot').forEach(dot => {
  dot.addEventListener('click', () => {
    const index = parseInt(dot.getAttribute('data-index'));
    const cards = slider.querySelectorAll('.testimonial-card');
    if (cards[index]) {
      cards[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  });
});

// Update active dot on scroll
slider.addEventListener('scroll', () => {
  const cards = slider.querySelectorAll('.testimonial-card');
  const dots = dotsContainer.querySelectorAll('.dot');
  let activeIndex = 0;
  const scrollLeft = slider.scrollLeft;
  let minDist = Infinity;
  cards.forEach((card, i) => {
    const rect = card.getBoundingClientRect();
    const containerRect = slider.getBoundingClientRect();
    const dist = Math.abs(rect.left - containerRect.left);
    if (dist < minDist) {
      minDist = dist;
      activeIndex = i;
    }
  });
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === activeIndex);
  });
});

// ============================================================
//  FAQ ACCORDION
// ============================================================
const faqData = [
  { q: 'What makes AQUORA different from other beverages?', a: 'AQUORA is crafted with only the finest natural ingredients, without artificial colors or preservatives, and packaged in premium bottles that reflect the luxury experience.' },
  { q: 'Are AQUORA beverages suitable for all diets?', a: 'Most of our beverages are vegetarian and gluten-free. Please check individual product labels for specific dietary information.' },
  { q: 'Where can I purchase AQUORA products?', a: 'You can order directly from our website or find us at select luxury retailers and gourmet stores worldwide.' },
  { q: 'Do you offer international shipping?', a: 'Yes, we ship to over 50 countries. Shipping times and costs vary by destination.' },
  { q: 'How should I store AQUORA beverages?', a: 'Store in a cool, dry place away from direct sunlight. Once opened, refrigerate and consume within 3 days.' }
];

const faqList = document.getElementById('faqList');
faqData.forEach((item) => {
  const faqItem = document.createElement('div');
  faqItem.className = 'faq-item';
  faqItem.innerHTML = `
    <button class="faq-question">
      ${item.q}
      <span class="icon">+</span>
    </button>
    <div class="faq-answer">${item.a}</div>
  `;
  faqList.appendChild(faqItem);

  const questionBtn = faqItem.querySelector('.faq-question');
  questionBtn.addEventListener('click', () => {
    faqItem.classList.toggle('open');
  });
});

// ============================================================
//  CONTACT FORM & NEWSLETTER
// ============================================================
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Thank you for your message! We will get back to you soon.');
  e.target.reset();
});

document.getElementById('newsletterForm').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('You have been subscribed to our newsletter!');
  e.target.reset();
});

// ============================================================
//  MOBILE NAV – CLOSE ON ESCAPE
// ============================================================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    navCenter.classList.remove('nav-open');
  }
});

// ============================================================
//  SMOOTH SCROLL FOR NAV LINKS (all anchor links)
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ============================================================
//  INITIAL LOAD – ensure hero animations are applied
// ============================================================
console.log('AQUORA – Fully loaded');
