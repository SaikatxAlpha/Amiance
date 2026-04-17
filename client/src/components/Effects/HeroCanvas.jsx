import { useEffect, useRef } from "react";

/**
 * HeroCanvas — Animated fabric weave / flowing cloth visual
 * Replaces TShirtCanvas. Fits perfectly into the hero-right div.
 * Calls onComplete after 2 seconds (no scrolling needed).
 */
export default function HeroCanvas({ onComplete }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        let rafId;
        let startTime = performance.now();
        const INTRO_DURATION = 2200; // ms before calling onComplete

        /* ── Resize ───────────────────────────────────────────── */
        const resize = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };
        resize();
        window.addEventListener("resize", resize);

        /* ── Mouse ────────────────────────────────────────────── */
        const mouse = { x: -999, y: -999 };
        const onMove = (e) => {
            const r = canvas.getBoundingClientRect();
            mouse.x = e.clientX - r.left;
            mouse.y = e.clientY - r.top;
        };
        canvas.addEventListener("mousemove", onMove);

        /* ── Thread system ────────────────────────────────────── */
        const W = () => canvas.offsetWidth;
        const H = () => canvas.offsetHeight;

        // Warp threads — vertical
        const NUM_WARP = 42;
        const NUM_WEFT = 38;

        let doneCalled = false;

        /* ── Render ───────────────────────────────────────────── */
        const render = (now) => {
            const elapsed = now - startTime;
            const w = W(), h = H();
            ctx.clearRect(0, 0, w, h);

            const t = elapsed * 0.001; // seconds
            const introP = Math.min(1, elapsed / INTRO_DURATION);

            // Background gradient
            const bg = ctx.createLinearGradient(0, 0, w, h);
            bg.addColorStop(0, "#0a0f0a");
            bg.addColorStop(0.5, "#0d1a0d");
            bg.addColorStop(1, "#0a0f0a");
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            // ── WARP THREADS (vertical, flowing) ──
            for (let i = 0; i < NUM_WARP; i++) {
                const frac = i / (NUM_WARP - 1);
                const baseX = frac * w;
                // Entry animation: threads slide down from top
                const entryDelay = frac * 0.4;
                const entryP = Math.max(0, Math.min(1, (introP - entryDelay) / 0.6));
                if (entryP <= 0) continue;

                const threadH = h * entryP;

                // Color palette cycling across warp
                const hue = 85 + Math.sin(frac * Math.PI * 2 + t * 0.4) * 25;
                const lit = 28 + Math.sin(frac * Math.PI + t * 0.6) * 14;
                const alpha = 0.55 + Math.sin(frac * Math.PI * 3 + t) * 0.2;

                ctx.beginPath();
                ctx.moveTo(baseX, 0);

                // Wave each thread with mouse influence
                const steps = 80;
                for (let s = 0; s <= steps; s++) {
                    const yy = (s / steps) * threadH;
                    const dy = mouse.y - yy;
                    const dx = mouse.x - baseX;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const influence = Math.max(0, 1 - dist / 180) * 18;
                    const push = dx > 0 ? influence : -influence;

                    const wave1 = Math.sin(yy * 0.018 + t * 1.2 + frac * Math.PI * 2) * 6;
                    const wave2 = Math.sin(yy * 0.009 + t * 0.7 + frac) * 10;
                    const x = baseX + wave1 + wave2 + push;
                    if (s === 0) ctx.moveTo(x, yy);
                    else ctx.lineTo(x, yy);
                }

                ctx.strokeStyle = `hsla(${hue}, 60%, ${lit}%, ${alpha * entryP})`;
                ctx.lineWidth = 1.4 + Math.sin(frac * 7 + t) * 0.4;
                ctx.stroke();
            }

            // ── WEFT THREADS (horizontal, weaving) ──
            const weftDelay = 0.3;
            const weftP = Math.max(0, Math.min(1, (introP - weftDelay) / 0.7));

            for (let j = 0; j < NUM_WEFT; j++) {
                const frac = j / (NUM_WEFT - 1);
                const baseY = frac * h;

                // Entry: weft weaves in from left
                const entryDelay2 = frac * 0.3;
                const entryP2 = Math.max(0, Math.min(1, (weftP - entryDelay2) / 0.7));
                if (entryP2 <= 0) continue;

                const threadW = w * entryP2;

                const hue = 72 + Math.sin(frac * Math.PI * 1.5 + t * 0.5) * 30;
                const alpha = 0.35 + Math.sin(frac * Math.PI * 4 + t * 1.1) * 0.15;

                ctx.beginPath();

                const steps = 120;
                for (let s = 0; s <= steps; s++) {
                    const xx = (s / steps) * threadW;
                    const dy2 = mouse.y - baseY;
                    const dx2 = mouse.x - xx;
                    const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                    const influence2 = Math.max(0, 1 - dist2 / 160) * 14;
                    const push2 = dy2 > 0 ? influence2 : -influence2;

                    const over = (Math.floor(s * NUM_WARP / steps) & 1) === 0;
                    const offset = over ? 2 : -2;
                    const wave = Math.sin(xx * 0.022 + t * 0.9 + frac * Math.PI) * 4;
                    const y = baseY + wave + offset + push2;
                    if (s === 0) ctx.moveTo(xx, y);
                    else ctx.lineTo(xx, y);
                }

                ctx.strokeStyle = `hsla(${hue}, 55%, 32%, ${alpha * entryP2})`;
                ctx.lineWidth = 1.1;
                ctx.stroke();
            }

            // ── SHEEN OVERLAY (fabric iridescence) ──
            if (introP > 0.5) {
                const sheenP = (introP - 0.5) / 0.5;
                const sheenX = (Math.sin(t * 0.4) * 0.5 + 0.5) * w;
                const sheen = ctx.createRadialGradient(sheenX, h * 0.35, 0, sheenX, h * 0.35, w * 0.5);
                sheen.addColorStop(0, `rgba(167, 201, 87, ${0.07 * sheenP})`);
                sheen.addColorStop(0.4, `rgba(106, 153, 78, ${0.04 * sheenP})`);
                sheen.addColorStop(1, "transparent");
                ctx.fillStyle = sheen;
                ctx.fillRect(0, 0, w, h);
            }

            // ── FLOATING LABEL PARTICLES ──
            if (introP > 0.85) {
                const labelP = (introP - 0.85) / 0.15;
                ctx.save();
                ctx.globalAlpha = labelP * 0.18;
                ctx.font = `700 ${w * 0.048}px 'Bebas Neue', sans-serif`;
                ctx.fillStyle = "#a7c957";
                ctx.textAlign = "center";
                ctx.letterSpacing = "0.3em";
                ctx.fillText("AMIANCE", w * 0.5, h * 0.56);
                ctx.restore();

                ctx.save();
                ctx.globalAlpha = labelP * 0.1;
                ctx.font = `600 ${w * 0.014}px 'Space Grotesk', sans-serif`;
                ctx.fillStyle = "#dde5b6";
                ctx.textAlign = "center";
                ctx.fillText("S S  2 0 2 6  —  W E A R  T H E  S T R E E T S", w * 0.5, h * 0.64);
                ctx.restore();
            }

            // ── SCROLL HINT ──
            const hintAlpha = Math.max(0, 1 - introP * 3 + 1.5);
            if (hintAlpha > 0.01 && introP > 0.7) {
                const bob = Math.sin(t * 2.2) * 0.5 + 0.5;
                ctx.save();
                ctx.globalAlpha = Math.min(hintAlpha, introP - 0.7) * 2 * (0.4 + 0.3 * bob);
                ctx.font = `600 10px 'Space Grotesk', sans-serif`;
                ctx.textAlign = "center";
                ctx.fillStyle = "#a7c957";
                ctx.fillText("SCROLL  TO  EXPLORE", w / 2, h * 0.92);
                const ax = w / 2, ay = h * 0.945 + bob * 5;
                ctx.beginPath();
                ctx.moveTo(ax - 7, ay - 3);
                ctx.lineTo(ax, ay + 4);
                ctx.lineTo(ax + 7, ay - 3);
                ctx.strokeStyle = "#a7c957";
                ctx.lineWidth = 1.6;
                ctx.lineCap = "round";
                ctx.stroke();
                ctx.restore();
            }

            // Call onComplete after intro finishes
            if (!doneCalled && elapsed > INTRO_DURATION + 400) {
                doneCalled = true;
                onComplete?.();
            }

            rafId = requestAnimationFrame(render);
        };

        rafId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", resize);
            canvas.removeEventListener("mousemove", onMove);
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