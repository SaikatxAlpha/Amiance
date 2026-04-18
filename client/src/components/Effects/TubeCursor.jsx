import { useEffect } from "react";

const SEGMENTS = 28;

const PALETTE = [
    { h: 280, s: 85, l: 65 },
    { h: 310, s: 90, l: 60 },
    { h: 340, s: 85, l: 65 },
    { h: 10, s: 90, l: 62 },
    { h: 35, s: 95, l: 58 },
    { h: 52, s: 95, l: 55 },
    { h: 85, s: 75, l: 52 },
    { h: 155, s: 80, l: 48 },
    { h: 190, s: 85, l: 52 },
    { h: 215, s: 85, l: 62 },
];

function lerpColor(a, b, t) {
    return {
        h: a.h + (b.h - a.h) * t,
        s: a.s + (b.s - a.s) * t,
        l: a.l + (b.l - a.l) * t,
    };
}

function getColor(progress, timeOffset) {
    const totalColors = PALETTE.length;
    const shifted = ((progress + timeOffset) % 1 + 1) % 1;
    const idx = shifted * (totalColors - 1);
    const i = Math.floor(idx);
    const t = idx - i;
    return lerpColor(PALETTE[i % totalColors], PALETTE[(i + 1) % totalColors], t);
}

function TubeCursor() {
    useEffect(() => {
        /* ── Detect touch device ── */
        const isTouchDevice = () =>
            window.matchMedia("(pointer: coarse)").matches ||
            ("ontouchstart" in window);

        /* ── Styles ── */
        const style = document.createElement("style");
        style.textContent = `
            * { cursor: none !important; }
            .tube-seg {
                position: fixed;
                border-radius: 50%;
                pointer-events: none;
                transform: translate(-50%, -50%);
                will-change: transform, left, top;
                mix-blend-mode: screen;
                z-index: 999999;
                transition: width 0.1s, height 0.1s;
            }
            .tube-head {
                position: fixed;
                width: 9px;
                height: 9px;
                border-radius: 50%;
                pointer-events: none;
                transform: translate(-50%, -50%);
                z-index: 999999;
                will-change: left, top;
                transition: width 0.2s, height 0.2s, background 0.1s, box-shadow 0.1s;
            }
            body:has(a:hover) .tube-head,
            body:has(button:hover) .tube-head { width: 16px; height: 16px; }
        `;

        /* On touch devices, don't hide the system cursor — only hide on desktop */
        if (!isTouchDevice()) {
            document.head.appendChild(style);
            document.body.style.cursor = "none";
        } else {
            /* Still add the tube segments but don't hide native scroll cursor */
            const touchStyle = document.createElement("style");
            touchStyle.textContent = `
                .tube-seg {
                    position: fixed;
                    border-radius: 50%;
                    pointer-events: none;
                    transform: translate(-50%, -50%);
                    will-change: left, top;
                    mix-blend-mode: screen;
                    z-index: 999999;
                }
                .tube-head {
                    position: fixed;
                    border-radius: 50%;
                    pointer-events: none;
                    transform: translate(-50%, -50%);
                    z-index: 999999;
                    will-change: left, top;
                }
            `;
            document.head.appendChild(touchStyle);
        }

        const container = document.createElement("div");
        container.id = "__tube_cursor__";
        container.style.cssText =
            "position:fixed;inset:0;pointer-events:none;z-index:999997;overflow:hidden;";
        document.body.appendChild(container);

        const head = document.createElement("div");
        head.className = "tube-head";
        /* Slightly larger head on touch so it's visible over the finger */
        if (isTouchDevice()) {
            head.style.width = "14px";
            head.style.height = "14px";
        }
        document.body.appendChild(head);

        const segs = Array.from({ length: SEGMENTS }, (_, i) => {
            const progress = 1 - i / SEGMENTS;
            const size = Math.max(3, progress * (isTouchDevice() ? 22 : 18));
            const el = document.createElement("div");
            el.className = "tube-seg";
            el.style.width = size + "px";
            el.style.height = size + "px";
            container.appendChild(el);
            return { el, x: -300, y: -300, size };
        });

        /* ── Shared pointer position ── */
        const mouse = { x: -300, y: -300 };
        let active = false; // track whether finger is on screen

        /* ── Mouse events (desktop) ── */
        const onMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            active = true;
        };
        document.addEventListener("mousemove", onMouseMove);

        /* ── Touch events (mobile) ── */
        const onTouchStart = (e) => {
            const t = e.touches[0];
            mouse.x = t.clientX;
            mouse.y = t.clientY;
            active = true;
        };

        const onTouchMove = (e) => {
            /* Don't prevent default — we want normal page scroll to still work.
               We just READ the finger position and mirror it to the tube. */
            const t = e.touches[0];
            mouse.x = t.clientX;
            mouse.y = t.clientY;
            active = true;
        };

        const onTouchEnd = () => {
            /* Slowly fade out: keep last position, let RAF handle it */
            active = false;
        };

        document.addEventListener("touchstart", onTouchStart, { passive: true });
        document.addEventListener("touchmove", onTouchMove, { passive: true });
        document.addEventListener("touchend", onTouchEnd, { passive: true });
        document.addEventListener("touchcancel", onTouchEnd, { passive: true });

        /* ── Animation loop ── */
        let colorOffset = 0;
        let raf;

        const animate = () => {
            colorOffset = (colorOffset + 0.004) % 1;

            /* Fade out when finger lifts — drift segments to off-screen */
            if (!active && isTouchDevice()) {
                mouse.x += (window.innerWidth * 1.5 - mouse.x) * 0.04;
                mouse.y += (window.innerHeight * 1.5 - mouse.y) * 0.04;
            }

            const headColor = getColor(0, colorOffset);
            const headStr = `hsl(${headColor.h}, ${headColor.s}%, ${headColor.l}%)`;
            head.style.left = mouse.x + "px";
            head.style.top = mouse.y + "px";
            head.style.background = headStr;
            head.style.boxShadow = `0 0 14px ${headStr}, 0 0 30px ${headStr}55`;

            segs.forEach((seg, i) => {
                const target = i === 0 ? mouse : segs[i - 1];
                const ease = Math.max(0.07, 0.38 - i * 0.012);
                seg.x += (target.x - seg.x) * ease;
                seg.y += (target.y - seg.y) * ease;

                const progress = 1 - i / SEGMENTS;
                const alpha = 0.1 + progress * 0.72;
                const posFrac = i / SEGMENTS;
                const c = getColor(posFrac, colorOffset);

                const el = seg.el;
                el.style.left = seg.x + "px";
                el.style.top = seg.y + "px";
                el.style.background = `hsla(${c.h}, ${c.s}%, ${c.l}%, ${alpha})`;
                el.style.boxShadow = `0 0 ${seg.size * 2}px hsla(${c.h}, ${c.s}%, ${c.l + 15}%, ${alpha * 0.6})`;
            });

            raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(raf);
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("touchstart", onTouchStart);
            document.removeEventListener("touchmove", onTouchMove);
            document.removeEventListener("touchend", onTouchEnd);
            document.removeEventListener("touchcancel", onTouchEnd);
            document.body.style.cursor = "";
            style.remove();
            head.remove();
            container.remove();
        };
    }, []);

    return null;
}

export default TubeCursor;