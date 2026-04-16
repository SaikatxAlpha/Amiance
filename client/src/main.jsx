import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// ✅ Correct CSS imports (IMPORTANT)
import './styles/index.css'
import './styles/components.css'
import './styles/pages.css'

// ✅ Mount React app
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
/* =====================================================
   main.js  –  All JavaScript for index.html
   ===================================================== */

/* ── CUSTOM CURSOR ── */
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top = my + 'px';
});
(function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
})();

/* ── MORPHING ORB CANVAS ── */
const canvas = document.getElementById('orb-canvas');
const ctx = canvas.getContext('2d');
let t = 0;

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function noise(x, y, z) {
    return (
        Math.sin(x * 1.7 + z) * 0.30 +
        Math.sin(y * 1.3 + z * 0.8) * 0.25 +
        Math.sin((x + y) * 0.9 + z * 1.2) * 0.20 +
        Math.sin(x * 2.4 - y * 1.8 + z * 0.6) * 0.15 +
        Math.sin(y * 2.1 + z * 1.4) * 0.10
    );
}

function drawOrb() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    t += 0.008;
    const cx = W / 2, cy = H / 2;
    const baseR = Math.min(W, H) * 0.28;
    const pts = 180, layers = 4;

    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseR * 1.4);
    grd.addColorStop(0, 'rgba(56,102,65,0.15)');
    grd.addColorStop(0.5, 'rgba(106,153,78,0.05)');
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);

    for (let l = layers; l >= 1; l--) {
        const layerT = t + l * 0.5;
        const alpha = l === layers ? 0.7 : 0.15 + l * 0.07;
        const rScale = 0.85 + l * 0.05;
        const deform = 0.12 + l * 0.04;
        ctx.beginPath();
        for (let i = 0; i <= pts; i++) {
            const angle = (i / pts) * Math.PI * 2;
            const n = noise(Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, layerT);
            const r = baseR * rScale * (1 + deform * n);
            const px = cx + Math.cos(angle) * r;
            const py = cy + Math.sin(angle) * r;
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        if (l === layers) {
            const fg = ctx.createRadialGradient(cx - baseR * 0.2, cy - baseR * 0.2, 0, cx, cy, baseR * 1.2);
            fg.addColorStop(0, `rgba(167,201,87,${alpha})`);
            fg.addColorStop(0.4, `rgba(106,153,78,${alpha * 0.7})`);
            fg.addColorStop(0.7, `rgba(56,102,65,${alpha * 0.4})`);
            fg.addColorStop(1, `rgba(20,30,20,${alpha * 0.1})`);
            ctx.fillStyle = fg; ctx.fill();
            ctx.strokeStyle = 'rgba(167,201,87,0.3)'; ctx.lineWidth = 0.5; ctx.stroke();
        } else {
            ctx.strokeStyle = `rgba(167,201,87,${alpha})`; ctx.lineWidth = 0.5; ctx.stroke();
        }
    }

    const ig = ctx.createRadialGradient(cx - baseR * 0.25, cy - baseR * 0.3, 0, cx, cy, baseR * 0.8);
    ig.addColorStop(0, 'rgba(242,232,207,0.18)');
    ig.addColorStop(0.5, 'rgba(167,201,87,0.06)');
    ig.addColorStop(1, 'transparent');
    ctx.fillStyle = ig;
    ctx.beginPath(); ctx.arc(cx, cy, baseR, 0, Math.PI * 2); ctx.fill();

    for (let p = 0; p < 8; p++) {
        const pa = (p / 8) * Math.PI * 2 + t * (0.3 + p * 0.04);
        const pr = baseR * (1.1 + 0.15 * Math.sin(t * 2 + p));
        ctx.beginPath();
        ctx.arc(cx + Math.cos(pa) * pr, cy + Math.sin(pa) * pr, 1.5 + Math.sin(t * 3 + p) * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167,201,87,${0.3 + 0.3 * Math.sin(t * 2 + p)})`; ctx.fill();
    }

    ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 0.05);
    for (let g = 0; g < 6; g++) {
        const ga = (g / 6) * Math.PI;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ga) * baseR * 1.3, Math.sin(ga) * baseR * 1.3);
        ctx.lineTo(-Math.cos(ga) * baseR * 1.3, -Math.sin(ga) * baseR * 1.3);
        ctx.strokeStyle = 'rgba(106,153,78,0.06)'; ctx.lineWidth = 0.5; ctx.stroke();
    }
    ctx.restore();
    requestAnimationFrame(drawOrb);
}
drawOrb();

/* ── ORB PARALLAX ── */
document.addEventListener('mousemove', e => {
    const dx = (e.clientX / window.innerWidth - 0.5) * 20;
    const dy = (e.clientY / window.innerHeight - 0.5) * 20;
    canvas.style.transform = `translate(${dx}px, ${dy}px)`;
});

/* ── MARQUEE ── */
const marqItems = [
    { text: 'Premium Quality', accent: false },
    { text: 'SS 2025', accent: true },
    { text: 'Limited Drops', accent: false },
    { text: 'Organic Cotton', accent: false },
    { text: 'Wear The Streets', accent: true },
    { text: 'Fast Dispatch', accent: false },
    { text: 'Zero Waste', accent: false },
    { text: 'New Collection', accent: true },
    { text: 'Streetwear Redefined', accent: false },
    { text: 'URBN', accent: true },
];
const track = document.getElementById('marqueeTrack');
const allItems = [...marqItems, ...marqItems, ...marqItems, ...marqItems];
track.innerHTML = allItems.map(item => `
  <div class="marquee-item${item.accent ? ' accent' : ''}">
    <span class="marquee-dot"></span>${item.text}
  </div>`).join('');

/* ── PRODUCTS ── */
const products = [
    { tag: 'Drop 01', name: 'Oversized Utility Tee', price: '₹1,899', hue: '120,40%,12%', accent: '88,47%,50%' },
    { tag: 'Drop 02', name: 'Cargo Wide-Leg Pant', price: '₹3,299', hue: '100,35%,10%', accent: '85,50%,45%' },
    { tag: 'Drop 03', name: 'Hooded Fleece Jacket', price: '₹4,899', hue: '110,30%,11%', accent: '90,45%,55%' },
    { tag: 'Drop 04', name: 'Structured Coach Jacket', price: '₹5,499', hue: '105,38%,13%', accent: '87,48%,48%' },
    { tag: 'Drop 05', name: 'Relaxed Linen Shirt', price: '₹2,199', hue: '115,33%,12%', accent: '86,44%,52%' },
];
const productScroll = document.getElementById('productScroll');
productScroll.innerHTML = products.map((p, i) => `
  <div class="product-card">
    <div class="product-img">
      <svg width="100%" height="100%" viewBox="0 0 320 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg${i}" cx="50%" cy="40%" r="60%">
            <stop offset="0%"   stop-color="hsl(${p.hue})"  stop-opacity="1"/>
            <stop offset="100%" stop-color="hsl(110,25%,7%)" stop-opacity="1"/>
          </radialGradient>
          <radialGradient id="gl${i}" cx="50%" cy="30%" r="50%">
            <stop offset="0%"   stop-color="hsl(${p.accent})" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="transparent"       stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="320" height="400" fill="url(#bg${i})"/>
        <rect width="320" height="400" fill="url(#gl${i})"/>
        <g opacity="0.15" fill="none" stroke="hsl(${p.accent})" stroke-width="0.5">
          <line x1="60"  y1="0"   x2="60"  y2="400"/>
          <line x1="120" y1="0"   x2="120" y2="400"/>
          <line x1="180" y1="0"   x2="180" y2="400"/>
          <line x1="240" y1="0"   x2="240" y2="400"/>
          <line x1="0"   y1="80"  x2="320" y2="80"/>
          <line x1="0"   y1="160" x2="320" y2="160"/>
          <line x1="0"   y1="240" x2="320" y2="240"/>
          <line x1="0"   y1="320" x2="320" y2="320"/>
        </g>
        <path d="M100,60 L220,60 L240,110 L260,300 L200,310 L160,320 L120,310 L60,300 L80,110 Z"
          fill="hsl(${p.accent})" fill-opacity="0.12"
          stroke="hsl(${p.accent})" stroke-opacity="0.5" stroke-width="0.8" opacity="0.7"/>
        <path d="M100,60 Q80,50 60,80 L80,110"   fill="none" stroke="hsl(${p.accent})" stroke-opacity="0.5" stroke-width="0.8" opacity="0.7"/>
        <path d="M220,60 Q240,50 260,80 L240,110" fill="none" stroke="hsl(${p.accent})" stroke-opacity="0.5" stroke-width="0.8" opacity="0.7"/>
        <text x="50%" y="388" text-anchor="middle" font-size="8"
          font-family="'Space Grotesk',sans-serif" letter-spacing="4"
          fill="hsl(${p.accent})" fill-opacity="0.4" font-weight="600">SS 2025</text>
      </svg>
      <div class="product-overlay">
        <button class="quick-add" onclick="addToCart('${p.name}','${p.price}',event)">Quick Add</button>
      </div>
    </div>
    <div class="product-info">
      <div class="product-tag">${p.tag}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-price">${p.price}</div>
    </div>
  </div>`).join('');

/* ── CART (localStorage) ── */
function getCart() { return JSON.parse(localStorage.getItem('urbn_cart') || '[]'); }
function saveCart(c) { localStorage.setItem('urbn_cart', JSON.stringify(c)); }
function updateBadge() {
    const count = getCart().reduce((s, i) => s + i.qty, 0);
    const el = document.getElementById('cartCount');
    if (el) el.textContent = count;
}
function addToCart(name, price, e) {
    const cart = getCart();
    const existing = cart.find(i => i.name === name);
    if (existing) existing.qty++; else cart.push({ name, price, qty: 1 });
    saveCart(cart);
    updateBadge();
    const btn = e.target;
    btn.textContent = 'Added ✓';
    setTimeout(() => { btn.textContent = 'Quick Add'; }, 1200);
}
updateBadge();

/* ── SCROLL REVEAL ── */
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── STAT COUNTERS ── */
function animCount(el, target) {
    const dur = 1800, start = performance.now();
    (function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target) + '+';
        if (p < 1) requestAnimationFrame(tick);
    })(performance.now());
}
const statObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const el = e.target.querySelector('.stat-num-wrap[data-count]');
            if (el) animCount(el, +el.dataset.count);
            statObs.unobserve(e.target);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-cell').forEach(el => statObs.observe(el));

/* ── MAGNETIC BUTTONS ── */
document.querySelectorAll('.btn-primary, .cta-btn, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px,${(e.clientY - r.top - r.height / 2) * 0.35}px) translateY(-3px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});