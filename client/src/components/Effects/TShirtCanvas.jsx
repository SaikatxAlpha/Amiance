import { useEffect, useRef } from "react";

/* ─── Bezier / Line Point Samplers ─────────────────────────── */
function cubicPts(p0, cp1, cp2, p1, n = 28) {
    const a = [];
    for (let i = 0; i <= n; i++) {
        const t = i / n, m = 1 - t;
        a.push({
            x: m ** 3 * p0[0] + 3 * m ** 2 * t * cp1[0] + 3 * m * t ** 2 * cp2[0] + t ** 3 * p1[0],
            y: m ** 3 * p0[1] + 3 * m ** 2 * t * cp1[1] + 3 * m * t ** 2 * cp2[1] + t ** 3 * p1[1],
        });
    }
    return a;
}

function quadPts(p0, cp, p1, n = 20) {
    const a = [];
    for (let i = 0; i <= n; i++) {
        const t = i / n, m = 1 - t;
        a.push({
            x: m ** 2 * p0[0] + 2 * m * t * cp[0] + t ** 2 * p1[0],
            y: m ** 2 * p0[1] + 2 * m * t * cp[1] + t ** 2 * p1[1],
        });
    }
    return a;
}

function linePts(p0, p1, n = 8) {
    const a = [];
    for (let i = 0; i <= n; i++) {
        const t = i / n;
        a.push({ x: p0[0] + t * (p1[0] - p0[0]), y: p0[1] + t * (p1[1] - p0[1]) });
    }
    return a;
}

/* ─── Shirt outline as discrete point array ─────────────────── */
function buildOutline(W, H) {
    const x = nx => W * nx;
    const y = ny => H * ny;

    return [
        // ─ Collar left start
        { x: x(0.375), y: y(0.135) },
        // Left half collar → neck dip
        ...quadPts([x(0.375), y(0.135)], [x(0.435), y(0.268)], [x(0.500), y(0.268)]),
        // Right half collar → right shoulder start
        ...quadPts([x(0.500), y(0.268)], [x(0.565), y(0.268)], [x(0.625), y(0.135)]),
        // Right shoulder bezier
        ...cubicPts([x(0.625), y(0.135)], [x(0.705), y(0.122)], [x(0.762), y(0.132)], [x(0.785), y(0.155)]),
        // Right sleeve — top edge
        ...linePts([x(0.785), y(0.155)], [x(0.990), y(0.308)]),
        // Right sleeve cuff
        ...linePts([x(0.990), y(0.308)], [x(0.928), y(0.362)]),
        // Right sleeve — inner edge back toward body
        ...linePts([x(0.928), y(0.362)], [x(0.752), y(0.245)]),
        // Right armhole curve
        ...cubicPts([x(0.752), y(0.245)], [x(0.822), y(0.316)], [x(0.802), y(0.390)], [x(0.791), y(0.430)]),
        // Right body down
        ...linePts([x(0.791), y(0.430)], [x(0.791), y(0.878)]),
        // Hem
        ...linePts([x(0.791), y(0.878)], [x(0.209), y(0.878)]),
        // Left body up
        ...linePts([x(0.209), y(0.878)], [x(0.209), y(0.430)]),
        // Left armhole curve
        ...cubicPts([x(0.209), y(0.430)], [x(0.198), y(0.390)], [x(0.178), y(0.316)], [x(0.248), y(0.245)]),
        // Left sleeve inner
        ...linePts([x(0.248), y(0.245)], [x(0.072), y(0.362)]),
        // Left sleeve cuff
        ...linePts([x(0.072), y(0.362)], [x(0.010), y(0.308)]),
        // Left sleeve — top edge
        ...linePts([x(0.010), y(0.308)], [x(0.215), y(0.155)]),
        // Left shoulder bezier back to collar left
        ...cubicPts([x(0.215), y(0.155)], [x(0.238), y(0.132)], [x(0.295), y(0.122)], [x(0.375), y(0.135)]),
    ];
}

/* ─── Shirt clip path (canvas path) ────────────────────────── */
function applyShirtPath(ctx, W, H) {
    const x = nx => W * nx;
    const y = ny => H * ny;
    ctx.beginPath();
    ctx.moveTo(x(0.375), y(0.135));
    ctx.quadraticCurveTo(x(0.435), y(0.268), x(0.500), y(0.268));
    ctx.quadraticCurveTo(x(0.565), y(0.268), x(0.625), y(0.135));
    ctx.bezierCurveTo(x(0.705), y(0.122), x(0.762), y(0.132), x(0.785), y(0.155));
    ctx.lineTo(x(0.990), y(0.308));
    ctx.lineTo(x(0.928), y(0.362));
    ctx.lineTo(x(0.752), y(0.245));
    ctx.bezierCurveTo(x(0.822), y(0.316), x(0.802), y(0.390), x(0.791), y(0.430));
    ctx.lineTo(x(0.791), y(0.878));
    ctx.lineTo(x(0.209), y(0.878));
    ctx.lineTo(x(0.209), y(0.430));
    ctx.bezierCurveTo(x(0.198), y(0.390), x(0.178), y(0.316), x(0.248), y(0.245));
    ctx.lineTo(x(0.072), y(0.362));
    ctx.lineTo(x(0.010), y(0.308));
    ctx.lineTo(x(0.215), y(0.155));
    ctx.bezierCurveTo(x(0.238), y(0.132), x(0.295), y(0.122), x(0.375), y(0.135));
    ctx.closePath();
}

/* ─── Collar inner (ribbed ring detail) ────────────────────── */
function applyInnerCollar(ctx, W, H, offsetY = 0.018) {
    const x = nx => W * nx;
    const y = (ny, off = 0) => H * (ny + off);
    ctx.beginPath();
    ctx.moveTo(x(0.390), y(0.135, offsetY));
    ctx.quadraticCurveTo(x(0.445), y(0.268, offsetY * 0.6), x(0.500), y(0.268, offsetY * 0.6));
    ctx.quadraticCurveTo(x(0.555), y(0.268, offsetY * 0.6), x(0.610), y(0.135, offsetY));
}

/* ═══════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════ */
export default function TShirtCanvas({ onComplete }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        // Always start at the very top
        window.scrollTo(0, 0);

        let rafId;
        let rawProg = 0;   // 0–1 driven by user scroll
        let smoothProg = 0;   // 0–1 eased
        let totalDelta = 0;   // accumulated virtual scroll px
        let isDone = false;

        let outlineCache = null;
        let cacheW = 0, cacheH = 0;

        const SCROLL_NEEDED = 1300; // virtual px of scrolling to fill shirt

        /* ── Canvas sizing ─────────────────────────────────────── */
        const onResize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            outlineCache = null; // rebuild on next frame
        };
        onResize();
        window.addEventListener("resize", onResize);

        /* ── Completion ─────────────────────────────────────────── */
        const finish = () => {
            if (isDone) return;
            isDone = true;
            rawProg = 1;
            detach();
            setTimeout(() => onComplete?.(), 500);
        };

        /* ── Input handlers ─────────────────────────────────────── */
        const onWheel = (e) => {
            e.preventDefault();
            totalDelta = Math.max(0, Math.min(SCROLL_NEEDED, totalDelta + e.deltaY));
            rawProg = totalDelta / SCROLL_NEEDED;
            if (rawProg >= 1) finish();
        };

        let touchY = 0;
        const onTouchStart = (e) => { touchY = e.touches[0].clientY; };
        const onTouchMove = (e) => {
            e.preventDefault();
            const dy = touchY - e.touches[0].clientY;
            touchY = e.touches[0].clientY;
            totalDelta = Math.max(0, Math.min(SCROLL_NEEDED, totalDelta + dy * 2));
            rawProg = totalDelta / SCROLL_NEEDED;
            if (rawProg >= 1) finish();
        };

        const onKeyDown = (e) => {
            if ([" ", "ArrowDown", "PageDown"].includes(e.key)) {
                e.preventDefault();
                totalDelta = Math.min(SCROLL_NEEDED, totalDelta + 65);
                rawProg = totalDelta / SCROLL_NEEDED;
                if (rawProg >= 1) finish();
            }
        };

        const attach = () => {
            window.addEventListener("wheel", onWheel, { passive: false });
            window.addEventListener("touchstart", onTouchStart, { passive: true });
            window.addEventListener("touchmove", onTouchMove, { passive: false });
            window.addEventListener("keydown", onKeyDown);
        };
        const detach = () => {
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("keydown", onKeyDown);
        };
        attach();

        /* ── Render loop ────────────────────────────────────────── */
        const render = () => {
            smoothProg += (rawProg - smoothProg) * 0.085;
            const p = smoothProg;

            const W = canvas.width;
            const H = canvas.height;
            ctx.clearRect(0, 0, W, H);

            // Rebuild outline point array on canvas resize
            if (!outlineCache || cacheW !== W || cacheH !== H) {
                outlineCache = buildOutline(W, H);
                cacheW = W; cacheH = H;
            }

            // Phase timing:
            // 0.00 → 0.28  outline draws in
            // 0.07 → 1.00  threads weave in
            const outlineP = Math.min(1, p / 0.28);
            const threadP = Math.max(0, Math.min(1, (p - 0.07) / 0.93));

            /* ════ THREADS (horizontal weft lines) ════════════════ */
            if (threadP > 0) {
                ctx.save();
                applyShirtPath(ctx, W, H);
                ctx.clip();

                const topY = H * 0.125;
                const botY = H * 0.885;
                const spacing = 2.3;                         // px between rows
                const totalRows = Math.ceil((botY - topY) / spacing);
                const showRows = Math.floor(threadP * totalRows);

                for (let i = 0; i < showRows; i++) {
                    const yy = topY + i * spacing;
                    const even = (i & 1) === 0;

                    // Wavy weft thread
                    ctx.beginPath();
                    ctx.moveTo(0, yy);
                    for (let xi = 3; xi <= W; xi += 3) {
                        // Two overlaid frequencies for organic look
                        const wave = Math.sin(xi * 0.042 + i * 0.52) * 1.3
                            + Math.sin(xi * 0.018 + i * 0.29) * 0.5;
                        ctx.lineTo(xi, yy + wave);
                    }

                    // Leading edge fade
                    const edgeDist = showRows - i;
                    const baseAlpha = even ? 0.91 : 0.73;
                    const alpha = edgeDist < 5
                        ? (edgeDist / 5) * baseAlpha * 0.7 + 0.04
                        : baseAlpha;

                    // Slight hue variation — weave feels like real cloth
                    ctx.strokeStyle = even
                        ? `rgba(255,253,249,${alpha})`        // warm white (warp)
                        : `rgba(228,224,215,${alpha})`;         // cool off-white (weft)
                    ctx.lineWidth = 1.65;
                    ctx.stroke();
                }

                /* Volumetric shading — makes shirt feel 3-D */
                // Left / right edge darken
                const shadeX = ctx.createLinearGradient(0, 0, W, 0);
                shadeX.addColorStop(0, 'rgba(0,0,0,0.30)');
                shadeX.addColorStop(0.07, 'rgba(0,0,0,0.07)');
                shadeX.addColorStop(0.50, 'rgba(255,255,255,0.02)');
                shadeX.addColorStop(0.93, 'rgba(0,0,0,0.07)');
                shadeX.addColorStop(1, 'rgba(0,0,0,0.30)');
                ctx.fillStyle = shadeX;
                ctx.fillRect(0, 0, W, H);

                // Top/bottom vertical gradient
                const shadeY = ctx.createLinearGradient(0, topY, 0, botY);
                shadeY.addColorStop(0, 'rgba(0,0,0,0.10)');
                shadeY.addColorStop(0.45, 'rgba(255,255,255,0.04)');
                shadeY.addColorStop(1, 'rgba(0,0,0,0.18)');
                ctx.fillStyle = shadeY;
                ctx.fillRect(0, 0, W, H);

                ctx.restore();
            }

            /* ════ SHIRT OUTLINE — draws progressively ════════════ */
            if (outlineP > 0) {
                const total = outlineCache.length;
                const count = Math.min(total, Math.floor(outlineP * total));

                if (count > 1) {
                    // Glow colour transitions green → cream as outline completes
                    const greenAlpha = Math.max(0, 1 - outlineP * 1.5);

                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(outlineCache[0].x, outlineCache[0].y);
                    for (let i = 1; i < count; i++) ctx.lineTo(outlineCache[i].x, outlineCache[i].y);

                    ctx.strokeStyle = 'rgba(212,220,200,0.96)';
                    ctx.lineWidth = 2.2;
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.shadowColor = `rgba(167,201,87,${0.75 * greenAlpha + 0.25})`;
                    ctx.shadowBlur = 14;
                    ctx.stroke();

                    // ── Leading bright stitch dot ──
                    const last = outlineCache[count - 1];
                    ctx.beginPath();
                    ctx.arc(last.x, last.y, 3.8, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(167,201,87,${0.7 + greenAlpha * 0.25})`;
                    ctx.shadowColor = 'rgba(167,201,87,1)';
                    ctx.shadowBlur = 22;
                    ctx.fill();

                    ctx.restore();
                }

                // ── Inner collar ribbing detail ──
                if (outlineP > 0.12) {
                    const collarFade = Math.min(1, (outlineP - 0.12) / 0.3);
                    ctx.save();
                    applyInnerCollar(ctx, W, H, 0.018);
                    ctx.strokeStyle = `rgba(180,188,168,${collarFade * 0.55})`;
                    ctx.lineWidth = 1;
                    ctx.setLineDash([3, 4]);
                    ctx.stroke();
                    ctx.setLineDash([]);
                    ctx.restore();
                }
            }

            /* ════ FULL OUTLINE + COMPLETION GLOW ════════════════ */
            if (p > 0.82) {
                const cp = (p - 0.82) / 0.18;
                ctx.save();
                applyShirtPath(ctx, W, H);
                ctx.strokeStyle = `rgba(205,218,190,${0.55 + cp * 0.45})`;
                ctx.lineWidth = 2;
                ctx.shadowColor = `rgba(167,201,87,${cp * 0.6})`;
                ctx.shadowBlur = 22 * cp;
                ctx.stroke();
                ctx.restore();

                // Subtle brand mark on the shirt when complete
                if (cp > 0.7) {
                    const markAlpha = (cp - 0.7) / 0.3;
                    ctx.save();
                    ctx.globalAlpha = markAlpha * 0.18;
                    ctx.font = `700 ${W * 0.045}px 'Bebas Neue', sans-serif`;
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign = 'center';
                    ctx.letterSpacing = '0.3em';
                    ctx.fillText('AMIANCE', W * 0.5, H * 0.62);
                    ctx.restore();
                }
            }

            /* ════ SCROLL HINT (fades out after first scroll) ════ */
            const hintAlpha = Math.max(0, 1 - p * 18);
            if (hintAlpha > 0.005) {
                const t = Date.now() * 0.0022;
                const bob = Math.sin(t) * 0.5 + 0.5;
                const ha = hintAlpha * (0.45 + 0.28 * bob);

                ctx.save();
                ctx.globalAlpha = ha;

                // Label
                ctx.font = `600 10px 'Space Grotesk', sans-serif`;
                ctx.textAlign = 'center';
                ctx.fillStyle = '#a7c957';
                ctx.fillText('SCROLL  TO  WEAVE', W / 2, H * 0.928);

                // Animated chevron
                const ax = W / 2;
                const ay = H * 0.950 + bob * 5;
                ctx.beginPath();
                ctx.moveTo(ax - 7, ay - 3);
                ctx.lineTo(ax, ay + 4);
                ctx.lineTo(ax + 7, ay - 3);
                ctx.strokeStyle = '#a7c957';
                ctx.lineWidth = 1.6;
                ctx.lineCap = 'round';
                ctx.stroke();

                ctx.restore();
            }

            rafId = requestAnimationFrame(render);
        };

        rafId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", onResize);
            if (!isDone) detach();
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