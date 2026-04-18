import { useEffect, useRef } from "react";

/* ─── Helpers ───────────────────────────────────────────── */
const lerp = (a, b, t) => a + (b - a) * t;

// Layered sin/cos noise
const sn = (x, y, t) =>
    Math.sin(x * 2.9 + t * 0.8) * Math.cos(y * 2.2 + t * 0.55) +
    Math.sin(x * 1.4 - t * 1.15) * Math.cos(y * 3.3 + t * 0.38) * 0.55 +
    Math.sin((x + y) * 1.8 + t * 0.95) * 0.38;

/* ─── Config ────────────────────────────────────────────── */
const BRAND = {
    lime: [167, 201, 87],
    green: [106, 153, 78],
    dark: [56, 102, 65],
    pale: [221, 229, 182],
    cream: [242, 232, 207],
};

const RINGS = [
    { r: 0.310, tilt: 0.38, az: 0.0, speed: 0.0028, count: 100, pSize: 1.6, baseA: 0.80, col: BRAND.lime },
    { r: 0.245, tilt: -0.62, az: Math.PI / 3, speed: -0.0048, count: 65, pSize: 1.3, baseA: 0.55, col: BRAND.green },
    { r: 0.380, tilt: 1.05, az: Math.PI * 0.55, speed: 0.0019, count: 52, pSize: 1.0, baseA: 0.38, col: BRAND.pale },
];

const BG_DOTS = Array.from({ length: 65 }, () => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.00018,
    vy: -(Math.random() * 0.00028 + 0.00008),
    sz: 0.4 + Math.random() * 2.2,
    a: 0.08 + Math.random() * 0.38,
    col: [BRAND.lime, BRAND.green, BRAND.dark][Math.floor(Math.random() * 3)],
    phase: Math.random() * Math.PI * 2,
}));

/* ═══════════════════════════════════════════════════════════
   AuroraOrb — magnetic plasma sphere with orbiting rings
   ═══════════════════════════════════════════════════════════ */
export default function AuroraOrb() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        let W, H, rafId;
        let time = 0;
        const tm = { x: 0, y: 0 };
        const sm = { x: 0, y: 0 };

        /* Comets ─────────────────────────────────────────── */
        const comets = [];
        const spawnComet = (cx, cy, R) => {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1.8 + Math.random() * 2.2;
            comets.push({
                x: cx + Math.cos(angle) * R * (0.6 + Math.random() * 0.3),
                y: cy + Math.sin(angle) * R * (0.6 + Math.random() * 0.3),
                vx: Math.cos(angle + Math.PI / 2 + (Math.random() - 0.5) * 0.8) * speed,
                vy: Math.sin(angle + Math.PI / 2 + (Math.random() - 0.5) * 0.8) * speed,
                life: 1.0,
                decay: 0.012 + Math.random() * 0.018,
                col: Math.random() > 0.5 ? BRAND.lime : BRAND.pale,
            });
        };

        /* Resize ─────────────────────────────────────────── */
        const resize = () => {
            W = canvas.width = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        /* Mouse ──────────────────────────────────────────── */
        const onMove = (e) => {
            tm.x = e.clientX / window.innerWidth - 0.5;
            tm.y = e.clientY / window.innerHeight - 0.5;
        };
        window.addEventListener("mousemove", onMove);

        let cometTimer = 0;

        const render = () => {
            time += 0.011;
            cometTimer += 0.011;

            sm.x = lerp(sm.x, tm.x, 0.055);
            sm.y = lerp(sm.y, tm.y, 0.055);

            ctx.clearRect(0, 0, W, H);

            const R = Math.min(W, H) * 0.335;
            const cx = W * 0.5 + sm.x * 55;
            const cy = H * 0.5 + sm.y * 32;

            /* ── 1. Background floating dust ──────────────── */
            BG_DOTS.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.y < -0.02) p.y = 1.02;
                if (p.x < -0.02 || p.x > 1.02) p.x = Math.random();
                const pulse = 0.65 + Math.sin(time * 1.3 + p.phase) * 0.35;
                const [r, g, b] = p.col;
                ctx.beginPath();
                ctx.arc(p.x * W, p.y * H, p.sz, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r},${g},${b},${p.a * pulse})`;
                ctx.fill();
            });

            /* ── 2. Far halo ──────────────────────────────── */
            const halo = ctx.createRadialGradient(cx, cy, R * 0.4, cx, cy, R * 2.1);
            halo.addColorStop(0, 'rgba(56,102,65,0.18)');
            halo.addColorStop(0.5, 'rgba(56,102,65,0.06)');
            halo.addColorStop(1, 'transparent');
            ctx.fillStyle = halo;
            ctx.fillRect(0, 0, W, H);

            /* ── 3. Plasma tendrils — clipped to orb area ── */
            ctx.save();
            /* Clip to a circle so plasma never bleeds outside the orb */
            ctx.beginPath();
            ctx.arc(cx, cy, R * 1.08, 0, Math.PI * 2);
            ctx.clip();
            ctx.globalCompositeOperation = 'screen';

            const SEG = 128;
            for (let i = 0; i < SEG; i++) {
                const ang = (i / SEG) * Math.PI * 2;
                const n = sn(Math.cos(ang) * 0.6, Math.sin(ang) * 0.6, time);

                const inner = R * (0.74 + n * 0.13);
                const outer = R * (0.92 + n * 0.22);
                const ix = cx + Math.cos(ang) * inner;
                const iy = cy + Math.sin(ang) * inner;
                const ox = cx + Math.cos(ang) * outer;
                const oy = cy + Math.sin(ang) * outer;

                const flicker = 0.5 + 0.5 * Math.sin(time * 2.6 + i * 0.14);
                const a = (0.025 + Math.abs(n) * 0.055) * flicker;
                const hue = 85 + n * 22;

                ctx.beginPath();
                ctx.moveTo(ix, iy);
                ctx.lineTo(ox, oy);
                ctx.strokeStyle = `hsla(${hue},58%,56%,${a})`;
                ctx.lineWidth = 1.8 + Math.abs(n) * 3.5;
                ctx.stroke();
            }
            ctx.restore();

            /* ── 4. Core orb (multi-layer glow) ───────────── */
            const pulse = 1 + Math.sin(time * 0.75) * 0.038;
            const cR = R * 0.80 * pulse;

            [[2.0, 0.04], [1.55, 0.08], [1.22, 0.18], [1.0, 0.55]].forEach(([scale, peakA]) => {
                const gr = ctx.createRadialGradient(
                    cx - R * 0.08, cy - R * 0.12, 0,
                    cx, cy, cR * scale
                );
                if (scale === 1.0) {
                    gr.addColorStop(0, `rgba(220,240,160,${peakA})`);
                    gr.addColorStop(0.30, `rgba(167,201,87,${peakA * 0.75})`);
                    gr.addColorStop(0.65, `rgba(56,102,65,${peakA * 0.30})`);
                    gr.addColorStop(1, 'transparent');
                } else {
                    gr.addColorStop(0, `rgba(167,201,87,${peakA})`);
                    gr.addColorStop(0.55, `rgba(56,102,65,${peakA * 0.35})`);
                    gr.addColorStop(1, 'transparent');
                }
                ctx.beginPath();
                ctx.arc(cx, cy, cR * scale, 0, Math.PI * 2);
                ctx.fillStyle = gr;
                ctx.fill();
            });

            /* ── 5. Orbiting rings (3-D projection) ───────── */
            RINGS.forEach(ring => {
                ring.az += ring.speed;
                const rR = R * ring.r;
                const [rr, gg, bb] = ring.col;

                for (let i = 0; i < ring.count; i++) {
                    const theta = (i / ring.count) * Math.PI * 2 + ring.az;
                    const x3 = rR * Math.cos(theta);
                    const yRaw = rR * Math.sin(theta);
                    const y3 = yRaw * Math.cos(ring.tilt);
                    const z3 = yRaw * Math.sin(ring.tilt);

                    const px = cx + x3 + sm.x * 28;
                    const py = cy + y3 + sm.y * 18;

                    const depth = (z3 / rR + 1) * 0.5;
                    const a = ring.baseA * (0.08 + depth * 0.92);
                    const sz = ring.pSize * (0.35 + depth * 0.85);

                    ctx.beginPath();
                    ctx.arc(px, py, sz, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${rr},${gg},${bb},${a})`;
                    ctx.fill();
                }
            });

            /* ── 6. Comets ────────────────────────────────── */
            if (cometTimer > 2.8 + Math.random() * 1.5) {
                spawnComet(cx, cy, R);
                cometTimer = 0;
            }

            for (let i = comets.length - 1; i >= 0; i--) {
                const c = comets[i];
                c.x += c.vx; c.y += c.vy;
                c.life -= c.decay;
                if (c.life <= 0) { comets.splice(i, 1); continue; }

                const [cr, cg, cb] = c.col;
                ctx.save();
                const tr = ctx.createLinearGradient(
                    c.x - c.vx * 12, c.y - c.vy * 12,
                    c.x, c.y
                );
                tr.addColorStop(0, `rgba(${cr},${cg},${cb},0)`);
                tr.addColorStop(1, `rgba(${cr},${cg},${cb},${c.life * 0.7})`);
                ctx.beginPath();
                ctx.moveTo(c.x - c.vx * 12, c.y - c.vy * 12);
                ctx.lineTo(c.x, c.y);
                ctx.strokeStyle = tr;
                ctx.lineWidth = 1.5 * c.life;
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(c.x, c.y, 1.8 * c.life, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${cr},${cg},${cb},${c.life * 0.9})`;
                ctx.shadowColor = `rgba(${cr},${cg},${cb},0.8)`;
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.restore();
            }

            /* ── 7. Subtle brand watermark ────────────────── */
            const wa = 0.07 + (Math.sin(time * 0.35) + 1) * 0.5 * 0.06;
            ctx.save();
            ctx.globalAlpha = wa;
            ctx.font = `700 ${R * 0.245}px 'Bebas Neue', sans-serif`;
            ctx.fillStyle = '#f2e8cf';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('AMIANCE', cx, cy);
            ctx.restore();

            /* ── 8. Inner shimmer ring on orb surface ─────── */
            ctx.save();
            ctx.globalCompositeOperation = 'overlay';
            const shimmerArc = ctx.createRadialGradient(
                cx - R * 0.22, cy - R * 0.28, R * 0.1,
                cx, cy, cR
            );
            shimmerArc.addColorStop(0, 'rgba(255,255,255,0.22)');
            shimmerArc.addColorStop(0.45, 'rgba(255,255,255,0.04)');
            shimmerArc.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(cx, cy, cR, 0, Math.PI * 2);
            ctx.fillStyle = shimmerArc;
            ctx.fill();
            ctx.restore();

            rafId = requestAnimationFrame(render);
        };

        rafId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", onMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                display: "block",
                cursor: "none",
            }}
        />
    );
}