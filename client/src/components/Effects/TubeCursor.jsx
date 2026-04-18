import { useEffect } from "react";

const SEGMENTS = 28;

// Vibrant palette for the rainbow tube
const PALETTE = [
    { h: 280, s: 85, l: 65 },  // violet
    { h: 310, s: 90, l: 60 },  // magenta
    { h: 340, s: 85, l: 65 },  // rose
    { h: 10, s: 90, l: 62 },  // orange-red
    { h: 35, s: 95, l: 58 },  // orange
    { h: 52, s: 95, l: 55 },  // amber
    { h: 85, s: 75, l: 52 },  // lime
    { h: 155, s: 80, l: 48 },  // emerald
    { h: 190, s: 85, l: 52 },  // cyan
    { h: 215, s: 85, l: 62 },  // sky blue
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
    const a = PALETTE[i % totalColors];
    const b = PALETTE[(i + 1) % totalColors];
    return lerpColor(a, b, t);
}

function TubeCursor() {
    useEffect(() => {
        document.body.style.cursor = "none";

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
        document.head.appendChild(style);

        const container = document.createElement("div");
        container.id = "__tube_cursor__";
        container.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:999997;overflow:hidden;";
        document.body.appendChild(container);

        const head = document.createElement("div");
        head.className = "tube-head";
        document.body.appendChild(head);

        const segs = Array.from({ length: SEGMENTS }, (_, i) => {
            const progress = 1 - i / SEGMENTS;
            const size = Math.max(3, progress * 18);
            const el = document.createElement("div");
            el.className = "tube-seg";
            el.style.width = size + "px";
            el.style.height = size + "px";
            container.appendChild(el);
            return { el, x: -200, y: -200, size };
        });

        const mouse = { x: -200, y: -200 };
        let colorOffset = 0;

        const onMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };
        document.addEventListener("mousemove", onMove);

        let raf;
        const animate = () => {
            colorOffset = (colorOffset + 0.004) % 1;

            // Animate head color
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
                const positionFrac = i / SEGMENTS;
                const c = getColor(positionFrac, colorOffset);

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
            document.removeEventListener("mousemove", onMove);
            document.body.style.cursor = "";
            style.remove();
            head.remove();
            container.remove();
        };
    }, []);

    return null;
}

export default TubeCursor;